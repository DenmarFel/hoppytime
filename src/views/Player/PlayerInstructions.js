import React from 'react';
import { Link } from "react-router-dom";
export default function PlayerInstructions(props) {

	return (
    <div id="player-instructions">
			<h1>Instructions</h1>
			<p>Hello friends! I have no idea how I am gonna draft these instructions yet. For now just copy link to a Youtube video (preferably one with timestamps) and paste it in the field above.</p>
			<p>If no video comes to mind, check out the Ideas page and just click on any of the videos there. </p>
			<p>This project is currently called: Timestamp Player</p>
			<p>I honestly hate the name so please suggest some better ones. Bonus points if that domain name is available :)</p>
			<Link to="player/lIsT3fQfwdU?tourEnabled=true"> Start tour </Link>
			<h2>Known Bugs</h2>
			<ul>
				<li>Unpredictable behavior when all timestamps are disabled</li>
				<li>Playlist loading is delayed when app is first accessed by someone in awhile. This is because I am freely hosting part of the app on Heroku and it has to launch a server when it is accessed for 
						first time in awhile. This should not be a problem on official release.</li>
				<li>Some playlists data are inaccurate. I am probably parsing some video descriptions incorrectly still. Please send me the links you used so I can fix it accordingly.</li>
			</ul>
    </div>
	)
}
