import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { pushHistory, shuffleArray } from '../../utils/helpers';

import Tour from './Tour';
import Video from './Video';
import Status from './Controls/Status';
import MediaButton from './Controls/MediaButton';
import Playlist from './Playlist';

export default function Player(props) { 
	const [timestampsLoaded, setTimestampsLoaded] = useState(false);
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
	const [currentTimestampIndx, setCurrentTimestampIndx] = useState(-1);
	const [currentTime, setCurrentTime] = useState(0);
	const [newTime, setNewTime] = useState(0);
	const [isPlaying, setPlaying] = useState(false);
	const [isShuffle, setShuffle] = useState(false);
	const [isRepeat, setRepeat] = useState(false);
	const [shuffledIndexes, setShuffledIndexes] = useState([]);
	const [disabledIndexes, setDisabledIndexes] = useState([]);

	useEffect(() => {
		if (!props.videoId) return;
		axios.get(`https://mysterious-lake-28010.herokuapp.com/api/v1/video?link=https://www.youtube.com/watch?v=${props.videoId}`)
			.then(response => {
				setCurrentTimestampIndx(0);
				setTimestampData(response.data);
				pushHistory([response.data.videoId, response.data.title]);
				setTimestampsLoaded(true);
			});
	}, [props.videoId])

	const getTimestamp = (indx = currentTimestampIndx) => {
		return timestampData.timestamps[indx];
	}

	const toggleShuffle = () => {
		if (!isShuffle) {
			setShuffledIndexes(generateShuffledIndexes());
		}
		setShuffle(!isShuffle);
	};

	const generateShuffledIndexes = () => {
		let shuffledIndexes = [...Array(timestampData.timestamps.length).keys()];
		shuffleArray(shuffledIndexes);
		return shuffledIndexes;
	};

	const handleTimestampSelection = (indx, reason = null) => {
		if (reason === 'chosen') {
			setCurrentTimestampIndx(indx);
		}

		if (indx === -1) {
			indx = timestampData.timestamps.length - 1;
		} else if (indx === timestampData.timestamps.length) {
			indx = 0;
		}

		if (reason === 'ended') {
			if (isRepeat) {
				setCurrentTimestampIndx(currentTimestampIndx);
			} else if (!isRepeat && isShuffle) {
				let tempShuffledIndexes = shuffledIndexes;
				while (disabledIndexes.includes(tempShuffledIndexes[0])) {
					tempShuffledIndexes.shift();
					if (tempShuffledIndexes.length === 0) {
						tempShuffledIndexes = generateShuffledIndexes();
					}
				}
				setCurrentTimestampIndx(tempShuffledIndexes[0]);
				tempShuffledIndexes.shift();
				if (tempShuffledIndexes.length === 0) {
					tempShuffledIndexes = generateShuffledIndexes();
				}
				setShuffledIndexes(tempShuffledIndexes);
			} else {
				setCurrentTimestampIndx(indx);
			}
		}

		if (reason === 'prev' || reason === 'next') {
			if (isShuffle) {
				let tempShuffledIndexes = shuffledIndexes;
				while (disabledIndexes.includes(tempShuffledIndexes[0])) {
					tempShuffledIndexes.shift();
					if (tempShuffledIndexes.length === 0) {
						tempShuffledIndexes = generateShuffledIndexes();
					}
				}
				setCurrentTimestampIndx(tempShuffledIndexes[0]);
				tempShuffledIndexes.shift();
				if (tempShuffledIndexes.length === 0) {
					tempShuffledIndexes = generateShuffledIndexes();
				}
				setShuffledIndexes(tempShuffledIndexes);
			} else {
				while (disabledIndexes.includes(indx)) {
					if (reason === 'prev') {
						indx--
					} else {
						indx++
					}
				}
				setCurrentTimestampIndx(indx);
			}

		}

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

	if (timestampsLoaded) {
		return (
			<div id="player">
				<Tour tourEnabled={props.tourEnabled} />
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
					isRepeat={isRepeat} 
					tourEnabled={props.tourEnabled}/>
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
		return <div>Loading...</div>
	}
}
