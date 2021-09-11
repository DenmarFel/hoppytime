import React, { useEffect, useState } from 'react';
import { getFormattedDuration } from '../../../utils/helpers';

export default function Status(props) {
	const [currentTime, setCurrentTime] = useState(props.currentTime)
	const [autoUpdate, setAutoUpdate] = useState(true);

	useEffect(() => {
		if (autoUpdate) setCurrentTime(props.currentTime);
	}, [props.currentTime]);

	const finishManualUpdate = () => {
		setAutoUpdate(true);
		props.sliderUpdate(currentTime);
	};

	return (
		<div id="status">
			<h2>{props.timestamp.title}</h2>
			<div id="progress">
				<div className="left">{getFormattedDuration(currentTime)}</div>
				<div className="right">{getFormattedDuration(props.timestamp.end - props.timestamp.start)}</div>
				<input 
					className="slider"
					type="range" 
					min="0"
					max={props.timestamp.end - props.timestamp.start}
					value={currentTime || 0}
					onMouseDown={() => setAutoUpdate(false)}
					onTouchStart={() => setAutoUpdate(false)}
					onChange={event => setCurrentTime(event.target.value)} 
					onMouseUp={finishManualUpdate}
					onTouchEnd={finishManualUpdate}/>
			</div>
		</div>
	)
}
