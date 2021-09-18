import './Css/App.css';
import React, { useEffect, useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import NavLinks from './views/Navigation/NavLinks';
import NavMenuBtn from './views/Navigation/NavMenuBtn';
import PlayerForm from './views/Navigation/PlayerForm';
import Player from './views/Player/Player';
import Ideas from './views/Ideas/Ideas';
import History from './views/History/History';
import PlayerInstructions from './views/Player/PlayerInstructions';

export default function App() {
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

  return (
    <div id="app">
      {isNavOpened && <div id="overlay"></div>}
      <Router>
        <NavLinks onClick={() => setNavOpened(false)} isNavOpened={isNavOpened} navLinksRef={navLinksRef}/>
        <NavMenuBtn onClick={() => setNavOpened(!isNavOpened)} />
        <PlayerForm />
        <main>
          <Switch>
            <Route path="/ideas"><Ideas /></Route>
            <Route path="/history"><History /></Route>
            <Route path="/player/:videoId" render={props => <Player videoId={props.match.params.videoId} tourEnabled={new URLSearchParams(window.location.search).get("tourEnabled")} />} />
            <Route path="/"><PlayerInstructions /></Route>
          </Switch>
        </main>
        <footer>
          Made with love by Denmar Feliciano
        </footer>
      </Router>
    </div>
  )
}
