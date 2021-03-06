import React, { useState, useEffect } from 'react';
import { useInterval } from '../../utils/helpers';

export default function Video(props) {
	const [videoPlayer, setVideoPlayer] = useState(null);

	useEffect(() => {
		if (window.localStorage["youtube-consent"] === "true") {
			loadYTIframeAPI();
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

	const enableYTConsent = (event) => {
		event.preventDefault();
		window.localStorage["youtube-consent"] = "true";
		loadYTIframeAPI();
	}

	const loadYTIframeAPI = () => {
		if (!window.YT) {
			const tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			window.onYouTubeIframeAPIReady = loadYTPlayer;
			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		} else {
			loadYTPlayer();
		}
	};

	const loadYTPlayer = () => {
		new window.YT.Player('video', {
			videoId: props.videoId,
			host: 'https://www.youtube-nocookie.com',
			playerVars: {
				start: getTimestamp().start,
				end: getTimestamp().end,
				enablejsapi: 1,
				controls: 0,
				modestbranding: 1,
				rel: 0,
				playsinline: 1,
				autoplay: props.tourEnabled ? 0 : 1,
			},
			events: {
				onReady: event => setVideoPlayer(event.target),
				onStateChange: onPlayerStateChange,
			}
		});
		props.setPlaying(props.tourEnabled ? false : true);
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
		let params = {
			'videoId': props.videoId,
			'startSeconds': getTimestamp().start,
			'endSeconds': getTimestamp().end
		}
		videoPlayer.loadVideoById(params);
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
		<div id="video-container" data-intro="hello world!">
			<div id="video">
				{ window.localStorage["youtube-consent"] !== "true" && 
					<form id="video-notice" className="text-center" onSubmit={enableYTConsent}>
						<p>
							Content from YouTube is embedded here. As YouTube may collect 
							personal data and track your viewing behaviour, the video will only 
							load after you consent to their use of cookies and similar 
							technologies as described in their <a href="https://www.youtube.com/t/privacy">privacy policy</a>.
						</p>
						<button type="submit" autoFocus>Allow content from Youtube</button>
					</form>
				}
			</div>
		</div>
	)
};
