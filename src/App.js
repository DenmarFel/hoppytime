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

function shuffleArray(array) {
  //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
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

function Video(props) {
  const [videoPlayer, setVideoPlayer] = useState(null);
  // Should get videoTimestampData from props
  
  return (
    <div id="video"></div>
  )
};

function Player(props) { 
  const [videoPlayer, setVideoPlayer] = useState(null);
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
  const [isPlaying, setPlaying] = useState(false);
  const [isShuffle, setShuffle] = useState(false);
  const [isRepeat, setRepeat] = useState(false);
  const [shuffledIndexes, setShuffledIndexes] = useState([]);

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
            onReady: (event) => setVideoPlayer(event.target),
          }
        })
      });
  };

  const loadPlaylist = () => {
    axios.get(`https://mysterious-lake-28010.herokuapp.com/api/v1/video?link=https://www.youtube.com/watch?v=${props.videoId}`)
      .then(response => {
        setVideoTimestampData(response.data);
        let timestamp = response.data.timestamps[0];
        setCurrentTimestampIndx(0);
        videoPlayer.loadVideoById({
          'videoId': props.videoId,
          'startSeconds': timestamp.start,
          'endSeconds': timestamp.end
        });
        setPlaying(true);
      });
  };

  const toggleVideo = () => {
    isPlaying ? videoPlayer.pauseVideo() : videoPlayer.playVideo();
    setPlaying(!isPlaying);
  };

  const toggleShuffle = () => {
    if (!isShuffle) {
      let shuffledIndexes = [...Array(videoTimestampData.timestamps.length).keys()];
      shuffleArray(shuffledIndexes);
      setShuffledIndexes(shuffledIndexes);
    }
    setShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    setRepeat(!isRepeat);
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
    if (isRepeat) {
      indx = currentTimestampIndx;
    } else if (!isRepeat && isShuffle) {
      indx = shuffledIndexes[indx];
    }
    setCurrentTimestampIndx(indx);
    videoPlayer.loadVideoById({
      'videoId': props.videoId,
      'startSeconds': getTimestamp(indx).start,
      'endSeconds': getTimestamp(indx).end
    });
    setPlaying(true);
  };

  return (
    <div id="player">
      <div id="video"></div>
      <div id="status">
        Now Playing: {getTimestamp().title} Time: {getFormattedDuration(currentTime)} 
      </div>
      <div id="controls">
        <MediaButton 
          purpose='prev'
          onClick={prevTimestamp} />
        <MediaButton 
          purpose='play'
          status={isPlaying}
          onClick={toggleVideo} />
        <MediaButton 
          purpose='next'
          onClick={nextTimestamp} />
        <MediaButton
          purpose='shuffle'
          status={isShuffle}
          onClick={toggleShuffle} />
        <MediaButton
          purpose='repeat'
          status={isRepeat}
          onClick={toggleRepeat} />
        <Playlist 
          videoTimestampData={videoTimestampData}
          onTimestampClick={(indx) => handleTimestampSelection(indx)} />
      </div>
    </div>
  )
}

function MediaButton(props) {
  let text = '';
  switch (props.purpose) {
    case 'play':
      text = props.status ? 'pause' : 'play';
      break;
    case 'shuffle':
      text = props.status ? 'shuffling' : 'shuffle';
      break;
    case 'repeat':
      text = props.status ? 'repeating' : 'repeat';
      break;
    default:
      text = props.purpose;
      break;
  }
  return (
    <button onClick={props.onClick}>{text}</button>
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

function Modal() {
  return (
    <div className="modal">
      <div className="header"></div>
      <div className="body"></div>
      <div className="footer"></div>
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
      <Modal />
    </div>
  )
}

export default App;
