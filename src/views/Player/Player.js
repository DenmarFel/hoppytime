import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { shuffleArray } from '../../utils/helpers';

import Video from './Video';
import Status from './Controls/Status';
import MediaButton from './Controls/MediaButton';
import Playlist from './Playlist';

export default function Player(props) { 
	const [timestampData, setTimestampData] = useState({
		videoId: '',
		title: '',
		duration: 0,
		timestamps: [
			{
				title: '',
				start: 0,
				end: 0
			},
		]
	});
	const [currentTimestampIndx, setCurrentTimestampIndx] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [newTime, setNewTime] = useState(0);
	const [isPlaying, setPlaying] = useState(false);
	const [isShuffle, setShuffle] = useState(false);
	const [isRepeat, setRepeat] = useState(false);
	const [shuffledIndexes, setShuffledIndexes] = useState([]);
	const [disabledIndexes, setDisabledIndexes] = useState([]);

	useEffect(() => {
		return () => {
			props.onVideoChange(null);
		}
	}, []);

	useEffect(() => {
		if (!props.videoId) return;
		axios.get(`https://mysterious-lake-28010.herokuapp.com/api/v1/video?link=https://www.youtube.com/watch?v=${props.videoId}`)
			.then(response => {
				setCurrentTimestampIndx(0);
				setTimestampData(response.data);
			});
	}, [props.videoId])

	const getTimestamp = (indx = currentTimestampIndx) => {
		return timestampData.timestamps[indx];
	}

	const toggleShuffle = () => {
		if (!isShuffle) {
			let shuffledIndexes = [...Array(timestampData.timestamps.length).keys()];
			shuffleArray(shuffledIndexes);
			setShuffledIndexes(shuffledIndexes);
		}
		setShuffle(!isShuffle);
	};

	const handleTimestampSelection = (indx, reason = null) => {
		if (indx === -1) {
			indx = timestampData.timestamps.length - 1;
		} else if (indx === timestampData.timestamps.length) {
			indx = 0;
		}

		// Reasons: ended, chosen, next, prev
		if (reason === 'ended' && isRepeat) {
			indx = currentTimestampIndx;
		} else if (reason !== 'chosen' && isShuffle) {
			indx = shuffledIndexes[indx];
		}

		if (disabledIndexes.length === timestampData.timestamps.length) {
			setPlaying(false);
			return;
		}

		if (reason !== 'chosen' && disabledIndexes.includes(indx)) {
			if (isShuffle) {
				let shuffledIndexes = [...Array(timestampData.timestamps.length).keys()];
				shuffleArray(shuffledIndexes);
				setShuffledIndexes(shuffledIndexes);
			}
			if (reason === 'next' || reason === 'ended') {
				handleTimestampSelection(indx + 1, reason);
				return;
			} else {
				handleTimestampSelection(indx - 1, reason);
				return;
			}
		}

		setCurrentTimestampIndx(indx);
		setPlaying(true);
	};

	const handleSliderUpdate = (value) => {
		setNewTime(Number(value) + Number(getTimestamp().start));
		setPlaying(true);
	}

	const handleTimestampToggle = (indx, enabled) => {
		let disabledIndexesCopy = disabledIndexes;
		if (enabled) {
			disabledIndexesCopy.splice(disabledIndexesCopy.indexOf(indx), 1);
		} else {
			disabledIndexesCopy.push(indx);
		}
		setDisabledIndexes(disabledIndexesCopy);
	};

	if (props.videoId) {
		return (
			<div id="player">
				<Video 
					videoId={props.videoId}
					timestampData={timestampData}
					newTime={newTime}
					setTimestampData={setTimestampData}
					setCurrentTime={setCurrentTime}
					setCurrentTimestampIndx={setCurrentTimestampIndx}
					handleTimestampSelection={handleTimestampSelection}
					currentTimestampIndx={currentTimestampIndx}
					isPlaying={isPlaying}
					setPlaying={setPlaying}
					isRepeat={isRepeat} />
				<div id="controls">
					<Status
						timestamp={getTimestamp()}
						currentTime={currentTime}
						sliderUpdate={handleSliderUpdate} />
					<div id="media-buttons">
						<MediaButton
							purpose='shuffle'
							status={isShuffle}
							onClick={toggleShuffle} />
						<MediaButton 
							purpose='prev'
							onClick={() => handleTimestampSelection(currentTimestampIndx - 1, 'prev')} />
						<MediaButton 
							purpose='play'
							status={isPlaying}
							onClick={() => setPlaying(!isPlaying)} />
						<MediaButton 
							purpose='next'
							onClick={() => handleTimestampSelection(currentTimestampIndx + 1, 'next')} />
						<MediaButton
							purpose='repeat'
							status={isRepeat}
							onClick={() => setRepeat(!isRepeat)} />
					</div>
				</div>
				<Playlist 
						currentTimestampIndx={currentTimestampIndx}
						timestampData={timestampData}
						onTimestampClick={(indx) => handleTimestampSelection(indx, 'chosen')} 
						onTimestampToggle={(indx, reason) => handleTimestampToggle(indx, reason)} />
			</div>
		)
	} else {
		return (
			<div id="player-instructions">
				<h1>Instructions</h1>
				<p>Hello friends! I have no idea how I am gonna draft these instructions yet. For now just copy link to a youtube video (preferably one with timestamps) and paste it in the field above.</p>
				<p>If no video comes to mind, check out the Suggestions page and just click on any of the videos there. </p>
				<p>This project is currently called: Timestamp Player</p>
				<p>I honestly hate the name so please suggest some better ones. Bonus points if that domain name is available :)</p>

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
}