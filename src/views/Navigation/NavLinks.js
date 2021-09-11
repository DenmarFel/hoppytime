import React from 'react';
import { Link } from "react-router-dom";

export default function NavLinks(props) {
  return (
		<nav className={`${props.isNavOpened ? 'open' : ''}`} ref={props.navLinksRef}>
			<ul onClick={props.onClick}>
				<Link to="/"><li><i class="bi bi-house"></i> Home</li></Link>
				<Link to="/ideas"><li><i class="bi bi-lightbulb" /> Ideas</li></Link>
				<Link to="/ideas"><li><i class="bi bi-github" /> Github</li></Link>
				<Link to="/coffee"><li><i class="bi bi-cup" /> Buy Me Coffee</li></Link>
			</ul>
		</nav>
	)
}
