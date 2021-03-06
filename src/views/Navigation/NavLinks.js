import React from 'react';
import { Link } from "react-router-dom";
import logo from '../../logo.png';

export default function NavLinks(props) {
  return (
		<nav className={`${props.isNavOpened ? 'open' : ''}`} ref={props.navLinksRef}>
			<Link to="/" className="nav-logo" onClick={props.onClick}>
				<img src={logo} width="50" height="50" alt="HoppyTime Logo"/>
				<h3>HoppyTime</h3>
			</Link>
			<ul onClick={props.onClick}>
				<Link to="/"><li><i className="bi bi-house"></i> Home</li></Link>
				<Link to="/ideas"><li><i className="bi bi-lightbulb" /> Ideas</li></Link>
				<Link to="/history"><li><i className="bi bi-archive" /> History</li></Link>
				<a href="https://github.com/DenmarFel/video-timestamp-player" target="_blank" rel="noopener noreferrer"><li><i className="bi bi-github" /> Github</li></a>
				<a href="https://www.buymeacoffee.com/denmar" target="_blank" rel="noopener noreferrer"><li><i className="bi bi-cup" /> Buy me a coffee</li></a>
			</ul>
		</nav>
	)
}
