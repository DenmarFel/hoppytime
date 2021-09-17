import React, { useState } from 'react';
import Toggle from '../../components/Toggle';
import { getFormattedDuration } from '../../utils/helpers'

export default function Timestamp(props) {
	const [enabled, setEnabled] = useState(true);

	const handleTimestampClick = (event) => {
		if (!event.target.closest('.toggle'))  {
			props.onTimestampClick(props.indx);
			setEnabled(true);
		}
	}

	const handleTimestampToggle = () => {
		props.onTimestampToggle(props.indx, !enabled);
		setEnabled(!enabled);
	}
	
	return (
		<li 
			className={`
				playlist-item
				list-item 
				${props.indx === props.currentTimestampIndx ? 'playing' : ''}
				${enabled ? '' : 'disabled'}
			`} 
			onClick={handleTimestampClick} >
			<div className="title text-left">{props.title}</div>
			<div className="duration text-right">{getFormattedDuration(props.duration)}</div>
			<div className="enable">
				<Toggle title="Disable timestamp" checked={enabled} onChange={handleTimestampToggle} />
			</div>
		</li>
	)
}
