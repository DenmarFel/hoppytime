import './Css/App.css';
import React, { useEffect, useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import NavLinks from './views/Navigation/NavLinks';
import NavMenuBtn from './views/Navigation/NavMenuBtn';
import PlayerForm from './views/Navigation/PlayerForm';
import Player from './views/Player/Player';
import Ideas from './views/Ideas/Ideas';

export default function App() {
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
              <Ideas onVideoChange={handleVideoChange} />
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
