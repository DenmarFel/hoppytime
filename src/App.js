// import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  const [videoTimestampData, setVideoTimestampData] = useState(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = loadVideo;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      loadVideo();
    }
    loadPlaylist();
  }, []);

  useEffect(() => {
    if (videoPlayer) {
      videoPlayer.loadVideoById(props.videoId);
      videoPlayer.pauseVideo();
      setVideoStatus('play');
      loadPlaylist();
    }
  }, [props.videoId]);

  const loadVideo = () => {
    setVideoPlayer(
      new window.YT.Player('video', {
        videoId: props.videoId
      })
    )
  };

  const loadPlaylist = () => {
    axios.get(`http://localhost:1120/api/v1/video?link=https://www.youtube.com/watch?v=${props.videoId}`)
      .then(response => setVideoTimestampData(response.data));
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

  return (
    <div id="player">
      <div id="video"></div>
      <div id="controls">
        <MediaButton 
          text='prev'
          onClick={toggleVideo} />
        <MediaButton 
          text={videoStatus}
          onClick={toggleVideo} />
        <MediaButton 
          text='next'
          onClick={toggleVideo} />
        <Playlist 
          videoTimestampData={videoTimestampData}
          onTimestampClick={(start) => videoPlayer.seekTo(start)} />
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
  const handleTimeStampClick = (start) => {
    props.onTimestampClick(start);
  };

  let timestamps = '';
  if (props.videoTimestampData !== null) {
    timestamps = props.videoTimestampData.timestamps.map(timestamp => 
      <tr key={timestamp.title} onClick={() => handleTimeStampClick(timestamp.start)}>
        <td>{timestamp.title}</td>
        <td>{timestamp.end - timestamp.start}</td>
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
