import './Css/App.css';
import React, { useEffect, useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import axios from 'axios';
import { useInterval, shuffleArray } from './utils/helpers';
import NavLinks from './views/Navigation/NavLinks';
import NavMenuBtn from './views/Navigation/NavMenuBtn';
import PlayerForm from './views/Navigation/PlayerForm';
import Playlist from './views/Player/Playlist';
import Status from './views/Player/Controls/Status';
import MediaButton from './views/Player/Controls/MediaButton';

function Player(props) { 
  const [timestampData, setTimestampData] = useState({
    videoId: '',
    title: '',
    duration: 0,
    timestamps: [
      {
        title: '',
        start: 0,
        end: 0
      },
    ]
  });
  const [currentTimestampIndx, setCurrentTimestampIndx] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [newTime, setNewTime] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [isShuffle, setShuffle] = useState(false);
  const [isRepeat, setRepeat] = useState(false);
  const [shuffledIndexes, setShuffledIndexes] = useState([]);
  const [disabledIndexes, setDisabledIndexes] = useState([]);

  useEffect(() => {
    return () => {
      props.onVideoChange(null);
    }
  }, []);

  useEffect(() => {
    if (!props.videoId) return;
    axios.get(`https://mysterious-lake-28010.herokuapp.com/api/v1/video?link=https://www.youtube.com/watch?v=${props.videoId}`)
      .then(response => {
        setCurrentTimestampIndx(0);
        setTimestampData(response.data);
      });
  }, [props.videoId])

  const getTimestamp = (indx = currentTimestampIndx) => {
    return timestampData.timestamps[indx];
  }

  const toggleShuffle = () => {
    if (!isShuffle) {
      let shuffledIndexes = [...Array(timestampData.timestamps.length).keys()];
      shuffleArray(shuffledIndexes);
      setShuffledIndexes(shuffledIndexes);
    }
    setShuffle(!isShuffle);
  };

  const handleTimestampSelection = (indx, reason = null) => {
    if (indx === -1) {
      indx = timestampData.timestamps.length - 1;
    } else if (indx === timestampData.timestamps.length) {
      indx = 0;
    }

    // Reasons: ended, chosen, next, prev
    if (reason === 'ended' && isRepeat) {
      indx = currentTimestampIndx;
    } else if (reason !== 'chosen' && isShuffle) {
      indx = shuffledIndexes[indx];
    }

    if (disabledIndexes.length === timestampData.timestamps.length) {
      setPlaying(false);
      return;
    }

    if (reason !== 'chosen' && disabledIndexes.includes(indx)) {
      if (isShuffle) {
        let shuffledIndexes = [...Array(timestampData.timestamps.length).keys()];
        shuffleArray(shuffledIndexes);
        setShuffledIndexes(shuffledIndexes);
      }
      if (reason === 'next' || reason === 'ended') {
        handleTimestampSelection(indx + 1, reason);
        return;
      } else {
        handleTimestampSelection(indx - 1, reason);
        return;
      }
    }

    setCurrentTimestampIndx(indx);
    setPlaying(true);
  };

  const handleSliderUpdate = (value) => {
    setNewTime(Number(value) + Number(getTimestamp().start));
    setPlaying(true);
  }

  const handleTimestampToggle = (indx, enabled) => {
    let disabledIndexesCopy = disabledIndexes;
    if (enabled) {
      disabledIndexesCopy.splice(disabledIndexesCopy.indexOf(indx), 1);
    } else {
      disabledIndexesCopy.push(indx);
    }
    setDisabledIndexes(disabledIndexesCopy);
  };

  return (
    <div id="player" className={`${props.videoId ? '' : 'display-none'}`}>
      <Video 
        videoId={props.videoId}
        timestampData={timestampData}
        newTime={newTime}
        setTimestampData={setTimestampData}
        setCurrentTime={setCurrentTime}
        setCurrentTimestampIndx={setCurrentTimestampIndx}
        handleTimestampSelection={handleTimestampSelection}
        currentTimestampIndx={currentTimestampIndx}
        isPlaying={isPlaying}
        setPlaying={setPlaying}
        isRepeat={isRepeat} />
      <div id="controls">
        <Status
          timestamp={getTimestamp()}
          currentTime={currentTime}
          sliderUpdate={handleSliderUpdate} />
        <div id="media-buttons">
          <MediaButton
            purpose='shuffle'
            status={isShuffle}
            onClick={toggleShuffle} />
          <MediaButton 
            purpose='prev'
            onClick={() => handleTimestampSelection(currentTimestampIndx - 1, 'prev')} />
          <MediaButton 
            purpose='play'
            status={isPlaying}
            onClick={() => setPlaying(!isPlaying)} />
          <MediaButton 
            purpose='next'
            onClick={() => handleTimestampSelection(currentTimestampIndx + 1, 'next')} />
          <MediaButton
            purpose='repeat'
            status={isRepeat}
            onClick={() => setRepeat(!isRepeat)} />
        </div>
      </div>
      <Playlist 
          currentTimestampIndx={currentTimestampIndx}
          timestampData={timestampData}
          onTimestampClick={(indx) => handleTimestampSelection(indx, 'chosen')} 
          onTimestampToggle={(indx, reason) => handleTimestampToggle(indx, reason)} />
    </div>
  )
}

function Video(props) {
  const [videoPlayer, setVideoPlayer] = useState(null);

  useEffect(() => {
    // Enables Youtube iFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = loadYTPlayer;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      loadYTPlayer();
    }
  }, []);

  useEffect(() => {
    if (videoPlayer) {
      loadPlaylist();
    }
  }, [props.timestampData]);

  useEffect(() => {
    if (videoPlayer) props.isPlaying ? videoPlayer.playVideo() : videoPlayer.pauseVideo();
  }, [props.isPlaying]);

  useEffect(() => {
    if (videoPlayer) {
      videoPlayer.loadVideoById({
        'videoId': props.videoId,
        'startSeconds': getTimestamp().start,
        'endSeconds': getTimestamp().end
      });
    }
  }, [props.currentTimestampIndx]);

  useEffect(() => {
    if (videoPlayer) videoPlayer.seekTo(props.newTime);
  }, [props.newTime]);

  const loadYTPlayer = () => {
    new window.YT.Player('video', {
      videoId: props.videoId ? props.videoId : '',
      playerVars: {
        enablejsapi: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        autoplay: 1,
      },
      events: {
        onReady: event => setVideoPlayer(event.target)
      }
    });
    if (props.videoId) props.setPlaying(true);
  };

  const loadPlaylist = () => {
    videoPlayer.loadVideoById({
      'videoId': props.videoId,
      'startSeconds': getTimestamp().start,
      'endSeconds': getTimestamp().end
    });
    props.setPlaying(true);
  };

  const getTimestamp = (indx = props.currentTimestampIndx) => {
    return props.timestampData.timestamps[indx];
  }

  const updateTimer = () => {
    if (!videoPlayer) return;
    if (videoPlayer.getPlayerState() === window.YT.PlayerState.ENDED) {
      if (props.isRepeat) {
        videoPlayer.loadVideoById({
          'videoId': props.videoId,
          'startSeconds': getTimestamp().start,
          'endSeconds': getTimestamp().end
        });
      } else {
        props.handleTimestampSelection(props.currentTimestampIndx + 1, 'ended');
      }
    };
    props.setCurrentTime(Math.floor(videoPlayer.getCurrentTime()) - getTimestamp().start);
  }
  useInterval(updateTimer, 100);

  return (
    <div id="videoContainer">
      <div id="video"></div>
    </div>
  )
};

function App() {
  const [videoId, setVideoId] = useState(null);
  const [isNavOpened, setNavOpened] = useState(false);
  const navLinksRef = useRef();

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (isNavOpened && navLinksRef.current && !navLinksRef.current.contains(e.target)) {
        setNavOpened(false);
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside)
    return () => document.removeEventListener("mousedown", checkIfClickedOutside);
  }, [isNavOpened]);

  const handleVideoChange = (link) => {
    let videoId = link ? new URL(link).searchParams.get('v') : null;
    setVideoId(videoId);
  };

  return (
    <div id="app">
      {isNavOpened && <div id="overlay"></div>}
      <Router>
        <NavLinks onClick={() => setNavOpened(false)} isNavOpened={isNavOpened} navLinksRef={navLinksRef}/>
        <NavMenuBtn onClick={() => setNavOpened(!isNavOpened)} />
        <PlayerForm onVideoChange={handleVideoChange} />
        <main>
          <Switch>
            <Route path="/ideas">
              <h1>Ideas</h1>
            </Route>
            <Route path="/coffee">
              <h1>Buy me coffee</h1>
            </Route>
            <Route path="/">
              <Player videoId={videoId} onVideoChange={handleVideoChange} />
            </Route>
          </Switch>
        </main>
      </Router>
    </div>
  )
}

export default App;
