import React from 'react';
import { Link } from "react-router-dom";
export default function PlayerInstructions(props) {

	return (
    <div id="player-instructions">
			<div className="intro">
				<h1>**name placeholder**</h1>
				<p>
					Breakdown Youtube videos with timestamps into playable sections. For 
					lo-fi playlists, movie soundtracks, lecture videos, and more, use 
					**name placeholder** to shuffle, skip, and repeat content of your
					choice! 
				</p>
			</div>

			<div className="get-started">
				<h3>
					Enter a Youtube link above or take a tour!
				</h3>
				<Link to="player/lIsT3fQfwdU?tourEnabled=true"> Start tour </Link>
			</div>
    </div>
	)
}
