// import logo from './logo.svg';
import './App.css';
import React from 'react';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.loadVideo = this.loadVideo.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.state = {
      videoPlayer: null,
      videoStatus: 'play'
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
  };

  componentDidUpdate(prevProps) {
    // Load New Video if new videoId
    if (prevProps.videoId !== this.props.videoId) {
      this.state.videoPlayer.loadVideoById(this.props.videoId);
      this.setState({
        videoStatus: 'pause'
      })
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

  render() {
    return (
      <div id="player">
        {this.props.videoId}
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
    console.log(1);
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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleVideoChange = this.handleVideoChange.bind(this);
    this.state = {
      videoId: 'dZ47VLoL514'
    }
  }

  handleVideoChange(videoId) {
    this.setState({
      videoId: videoId,
    })
  }

  render() {
    const videoId = this.state.videoId;
    console.log(3);
    console.log(videoId);
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
