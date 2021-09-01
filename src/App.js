// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function useInterval(callback, delay) {
  // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const getFormattedDuration = (total) => {
  // Converts seconds to HH:MM:SS or MM:SS
  let hours = String(Math.floor(total / 3600));
  let minutes = String(Math.floor((total - (Number(hours) * 3600)) / 60));
  let seconds = String(total - (Number(hours) * 3600) - (Number(minutes) * 60));
  return hours > 0 ? `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}` : `${minutes}:${seconds.padStart(2, '0')}`
}

function PlayerForm(props) {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    props.onVideoChange(value);
    setValue('');
    event.preventDefault();
  }

  return (
    <form onSubmit={event => handleSubmit(event)}>
      <label>
        Video Link:
        <input type="text" value={value} onChange={event => setValue(event.target.value)} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
}

function Player(props) { 
  const [videoPlayer, setVideoPlayer] = useState(null);
  const [videoStatus, setVideoStatus] = useState('play');
  const [videoTimestampData, setVideoTimestampData] = useState({
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

  useEffect(() => {
    // Enables Youtube iFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = loadPlayer;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      loadPlayer();
    }
  }, []);

  useEffect(() => {
    if (videoPlayer) {
      loadPlaylist();
    }
  }, [props.videoId]);


  const getTimestamp = (indx = currentTimestampIndx) => {
    return videoTimestampData.timestamps[indx];
  }

  const updateTimer = () => {
    if (!videoPlayer) return;
    if (videoPlayer.getPlayerState() === window.YT.PlayerState.ENDED) {
      handleTimestampSelection(currentTimestampIndx + 1);
    };
    setCurrentTime(Math.floor(videoPlayer.getCurrentTime()) - getTimestamp().start);
  }

  useInterval(updateTimer, 100);

  const loadPlayer = () => {
    axios.get(`https://mysterious-lake-28010.herokuapp.com/api/v1/video?link=https://www.youtube.com/watch?v=${props.videoId}`)
    .then(response => {
      setVideoTimestampData(response.data);
      let timestamp = response.data.timestamps[0];
      setCurrentTimestampIndx(0);
      new window.YT.Player('video', {
        videoId: props.videoId,
        playerVars: {
          start: timestamp.start,
          end: timestamp.end,
          enablejsapi: 1,
          controls: 0,
          autoplay: 0,
        },
        events: {
          onReady: onPlayerReady,
        }
      })
    });
  };

  const onPlayerReady = (event) => {
    setVideoPlayer(event.target);
  };

  const loadPlaylist = () => {
    axios.get(`https://mysterious-lake-28010.herokuapp.com/api/v1/video?link=https://www.youtube.com/watch?v=${props.videoId}`)
      .then(response => {
        setVideoTimestampData(response.data);
        let timestamp = response.data.timestamps[0];
        setCurrentTimestampIndx(0);
        videoPlayer.cueVideoById({
          'videoId': props.videoId,
          'startSeconds': timestamp.start,
          'endSeconds': timestamp.end
        });
      });
  };

  const toggleVideo = () => {
    if (videoStatus === 'play') {
      videoPlayer.playVideo();
      setVideoStatus('pause');
    } else {
      videoPlayer.pauseVideo();
      setVideoStatus('play');
    }
  };

  const prevTimestamp = () => {
    let indx = videoTimestampData.timestamps.length - 1;
    if (currentTimestampIndx !== 0) {
      indx = currentTimestampIndx - 1;
    }
    handleTimestampSelection(indx);
  };

  const nextTimestamp = () => {
    let indx = 0;
    if (currentTimestampIndx !== videoTimestampData.timestamps.length - 1) {
      indx = currentTimestampIndx + 1;
    }
    handleTimestampSelection(indx);
  };

  const handleTimestampSelection = (indx) => {
    setCurrentTimestampIndx(indx);
    videoPlayer.loadVideoById({
      'videoId': props.videoId,
      'startSeconds': getTimestamp(indx).start,
      'endSeconds': getTimestamp(indx).end
    });
  };

  return (
    <div id="player">
      <div id="video"></div>
      <div id="status">
        Now Playing: {getTimestamp().title} Time: {getFormattedDuration(currentTime)} 
      </div>
      <div id="controls">
        <MediaButton 
          text='prev'
          onClick={prevTimestamp} />
        <MediaButton 
          text={videoStatus}
          onClick={toggleVideo} />
        <MediaButton 
          text='next'
          onClick={nextTimestamp} />
        <Playlist 
          videoTimestampData={videoTimestampData}
          onTimestampClick={(indx) => handleTimestampSelection(indx)} />
      </div>
    </div>
  )
}

function MediaButton(props) {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

function Playlist(props) {
  const handleTimeStampClick = (indx) => {
    props.onTimestampClick(indx);
  };

  let timestamps = '';
  if (props.videoTimestampData !== null) {
    timestamps = props.videoTimestampData.timestamps.map((timestamp, indx) => 
      <tr key={timestamp.title} onClick={() => handleTimeStampClick(indx)}>
        <td>{timestamp.title}</td>
        <td>{getFormattedDuration(timestamp.end - timestamp.start)}</td>
      </tr>
    );
  }

  return (
    <div id="playlist">
      <table>
        <tr>
          <th>Title</th>
          <th>Duration</th>
        </tr>
        {timestamps}
      </table>
    </div>
  )
}

function App() {
  const [videoId, setVideoId] = useState('3jWRrafhO7M');

  const handleVideoChange = (link) => {
    setVideoId(new URL(link).searchParams.get('v'));
  };

  return (
    <div id="app">
      <PlayerForm 
        onVideoChange={(link) => handleVideoChange(link)}/>
      <Player 
        videoId={videoId}/>
    </div>
  )
}

export default App;
