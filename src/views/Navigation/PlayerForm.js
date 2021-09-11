import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

export default function PlayerForm(props) {
	const [value, setValue] = useState('');
	const history = useHistory();
	
	const handleSubmit = (event) => {
		history.push('/');
		props.onVideoChange(value);
		setValue('');
		event.preventDefault();
	}

	return (
		<form id="player-form" onSubmit={event => handleSubmit(event)}>
			<input 
				type="text" 
				value={value} 
				onChange={event => setValue(event.target.value)} 
				placeholder="Enter Youtube Link" />
		</form>
	)
}
