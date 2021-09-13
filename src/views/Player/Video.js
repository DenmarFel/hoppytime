import React, { useState, useEffect } from 'react';
import { useInterval } from '../../utils/helpers';

export default function Video(props) {
	const [videoPlayer, setVideoPlayer] = useState(null);

	useEffect(() => {
		// Enables Youtube iFrame API
		if (!window.YT) {
			const tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			window.onYouTubeIframeAPIReady = loadYTPlayer;
			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		} else {
			loadYTPlayer();
		}
	}, []);

	useEffect(() => {
		loadPlaylist();
	}, [props.timestampData, props.currentTimestampIndx]);

	useEffect(() => {
		if (videoPlayer) props.isPlaying ? videoPlayer.playVideo() : videoPlayer.pauseVideo();
	}, [props.isPlaying]);

	useEffect(() => {
		if (videoPlayer) videoPlayer.seekTo(props.newTime);
	}, [props.newTime]);

	const loadYTPlayer = () => {
		new window.YT.Player('video', {
			videoId: props.videoId,
			playerVars: {
				enablejsapi: 1,
				controls: 0,
				modestbranding: 1,
				rel: 0,
				playsinline: 1,
				autoplay: 1,
			},
			events: {
				onReady: event => setVideoPlayer(event.target),
				onStateChange: onPlayerStateChange,
			}
		});
		props.setPlaying(true);
	};

	const onPlayerStateChange = (event) => {
		if (event.data === window.YT.PlayerState.PAUSED) {
			props.setPlaying(false);
		} else {
			props.setPlaying(true);
		}
	}

	const loadPlaylist = () => {
		if (!videoPlayer) return;
		videoPlayer.loadVideoById({
			'videoId': props.videoId,
			'startSeconds': getTimestamp().start,
			'endSeconds': getTimestamp().end
		});
		props.setPlaying(true);
	};

	const getTimestamp = (indx = props.currentTimestampIndx) => {
		return props.timestampData.timestamps[indx];
	}

	const updateTimer = () => {
		if (!videoPlayer) return;
		if (videoPlayer.getPlayerState() === window.YT.PlayerState.ENDED) {
			if (props.isRepeat) {
				videoPlayer.loadVideoById({
					'videoId': props.videoId,
					'startSeconds': getTimestamp().start,
					'endSeconds': getTimestamp().end
				});
			} else {
				props.handleTimestampSelection(props.currentTimestampIndx + 1, 'ended');
			}
		};
		props.setCurrentTime(Math.floor(videoPlayer.getCurrentTime()) - getTimestamp().start);
	}
	useInterval(updateTimer, 100);

	return (
		<div id="videoContainer">
			<div id="video"></div>
		</div>
	)
};
