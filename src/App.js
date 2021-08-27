// import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from 'axios';

class PlayerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {    
    this.setState({value: event.target.value});  
  }

  handleSubmit(event) {
    this.props.onVideoChange(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Video Link:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.loadVideo = this.loadVideo.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.loadTimestamp = this.loadTimestamp.bind(this);
    this.state = {
      videoPlayer: null,
      videoStatus: 'play',
      videoTimestampData: null
    };
  }

  componentDidMount() {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = this.loadVideo;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      this.loadVideo();
    }

    this.loadPlaylist();
  };

  componentDidUpdate(prevProps) {
    // Load New Video if new videoId
    if (prevProps.videoId !== this.props.videoId) {
      this.state.videoPlayer.loadVideoById(this.props.videoId);
      this.state.videoPlayer.pauseVideo();
      this.setState({
        videoStatus: 'play'
      })

      this.loadPlaylist();
    }
  }

  loadVideo() {
    let videoPlayer = new window.YT.Player('video', {
      videoId: this.props.videoId
    });
    this.setState({
      videoPlayer: videoPlayer
    })
  }

  loadPlaylist() {
    let temp = this;
    axios.get(`http://localhost:8080/api/v1/video?link=https://www.youtube.com/watch?v=${this.props.videoId}`)
      .then(response => {
        temp.setState({
          videoTimestampData: response.data,
        });
      });
  }

  toggleVideo() {
    let videoPlayer = this.state.videoPlayer;
    let videoStatus = this.state.videoStatus;
    if (videoStatus === 'play') {
      videoPlayer.playVideo();
      this.setState({
        videoStatus: 'pause'
      })
    } else {
      videoPlayer.pauseVideo();
      this.setState({
        videoStatus: 'play'
      })
    }
  }

  loadTimestamp(start) {
    let videoPlayer = this.state.videoPlayer;
    videoPlayer.seekTo(start);
  }

  render() {
    return (
      <div id="player">
        <div id="video"></div>
        <div id="controls">
          <MediaButton 
            text='prev'
            onClick={() => this.toggleVideo()} />
          <MediaButton 
            text={this.state.videoStatus}
            onClick={() => this.toggleVideo()} />
          <MediaButton 
            text='next'
            onClick={() => this.toggleVideo()} />
          <Playlist 
            videoTimestampData={this.state.videoTimestampData}
            onTimestampClick={this.loadTimestamp} />
        </div>
      </div>
    )
  }
}

function MediaButton(props) {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleTimeStampClick = this.handleTimeStampClick.bind(this);
  }

  handleTimeStampClick(start) {
    this.props.onTimestampClick(start);
  }
  
  render() {
    let timestamps = '';
    if (this.props.videoTimestampData !== null) {
      timestamps = this.props.videoTimestampData.timestamps.map(timestamp => 
        <tr key={timestamp.title} onClick={() => this.handleTimeStampClick(timestamp.start)}>
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
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleVideoChange = this.handleVideoChange.bind(this);
    this.state = {
      videoId: '3jWRrafhO7M'
    }
  }

  handleVideoChange(link) {
    const url = new URL(link);
    this.setState({
      videoId: url.searchParams.get('v'),
    })
  }

  render() {
    const videoId = this.state.videoId;
    return (
      <div id="app">
        <PlayerForm 
          onVideoChange={this.handleVideoChange}/>
        <Player 
          videoId={videoId}/>
      </div>
    );
  }
}
