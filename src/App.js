// import logo from './logo.svg';
import './App.css';
import React from 'react';

class Video extends React.Component {

  componentDidMount() {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = this.loadPlayer;
    } else {
      this.loadPlayer();
    }
  };

  loadPlayer() {
    let player = new window.YT.Player('player');
  };

  render() {
    return (
      <div id="player"></div>
    )
  }
}

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <Video />
  );
}

export default App;
