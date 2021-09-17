import React from 'react';
import Timestamp from './Timestamp';

export default function Playlist(props) {
	return (
		<ul id="playlist" className="list">
			<li className="playlist-item header">
					<div className="title text-left">Title</div>
					<div className="duration text-right"><i className="bi bi-clock" title="Duration"/></div>
			</li>
			{props.timestampData.timestamps.map((timestamp, indx) => 
				<Timestamp 
					key={timestamp.title}
					onTimestampClick={() => props.onTimestampClick(indx)} 
					indx={indx}
					title={timestamp.title}
					duration={timestamp.end - timestamp.start}
					onTimestampToggle={props.onTimestampToggle}
					currentTimestampIndx={props.currentTimestampIndx}/>
			)}
		</ul>
	)
}
