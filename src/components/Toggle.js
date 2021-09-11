import React from 'react';

export default function Toggle(props) {
	return (
		<label className="toggle">
		<input type="checkbox" checked={props.checked} onChange={props.onChange} />
		<span className="slider" title={props.title} />
		</label>
	)
}
