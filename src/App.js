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

  loadVideo() {
    let videoPlayer = new window.YT.Player('video', {
      videoId: 'dZ47VLoL514',
    });
    this.setState({
      videoPlayer: videoPlayer
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

export default class App extends React.Component {
  render() {
    return (
      <Player />
    );
  }
}
