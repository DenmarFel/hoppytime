import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

export default function PlayerForm(props) {
	const [value, setValue] = useState('');
	const history = useHistory();
	
	const handleSubmit = (event) => {
		let url = new URL(value);
		let videoId = '';

    if (url.hostname === 'www.youtube.com') {
      videoId = url.searchParams.get('v');
    } else if (url.hostname === 'youtu.be') {
      videoId = url.pathname.replace('/','');
    }

		history.push('/player/' + videoId);
		setValue('');
		event.preventDefault();
	}

	return (
		<form id="player-form" onSubmit={event => handleSubmit(event)}>
			<label>
				<input 
					type="text" 
					value={value} 
					onChange={event => setValue(event.target.value)} 
					placeholder="Enter Youtube Link" />
				<button 
					type="submit" 
					aria-label="Submit"
					title="Submit">
					<i className="bi bi-arrow-right"/>
				</button>
			</label>
		</form>
	)
}
