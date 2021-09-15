import React, { useState } from 'react';
import { Steps } from "intro.js-react";
import 'intro.js/introjs.css';

export default function Tour(props) {
	const [stepsEnabled, setStepsEnabled] = useState(props.tourEnabled);
	const [steps] = useState([
		{
			element: "#player-form",
			intro: "Paste a Youtube link here to create a timestamp player for that video."
		},
		{
			element: "#video-container",
			intro: "Your video choice will be embedded here.",
		}, 
		{
			element: "#playlist",
			intro: 
				<div>
					Timestamps will be displayed like songs in a playlist.
					<ul>
						<li>Click on any timestamp to play it.</li>
						<li>Disable a timestamp by using the toggle on the right.</li>
					</ul>
				</div>
		}, 
		{
			element: "#controls",
			intro: "Control the timestamp player like any other music player."
		}
	]);

	return (
		<Steps 
			enabled={stepsEnabled}
			steps={steps}
			initialStep={0}
			onExit={() => {
					setStepsEnabled(false);
			}}
			options={{
				tooltipClass: "customTour",
				scrollToElement: true
			}} />
	)
}
