import React from 'react';
import { Link } from "react-router-dom";

export default function NavLinks(props) {
  return (
		<nav className={`${props.isNavOpened ? 'open' : ''}`} ref={props.navLinksRef}>
			<ul onClick={props.onClick}>
				<Link to="/"><li><i class="bi bi-house"></i> Home</li></Link>
				<Link to="/ideas"><li><i class="bi bi-lightbulb" /> Ideas</li></Link>
				<Link to="/history"><li><i class="bi bi-archive" /> History</li></Link>
				<a href="https://github.com/DenmarFel/video-timestamp-player" target="_blank" rel="noopener noreferrer"><li><i class="bi bi-github" /> Github</li></a>
				<a href="https://www.buymeacoffee.com/denmar" target="_blank" rel="noopener noreferrer"><li><i class="bi bi-cup" /> Buy Me Coffee</li></a>
			</ul>
		</nav>
	)
}
