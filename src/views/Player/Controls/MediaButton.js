import React from 'react';

export default function MediaButton(props) {
	let title = '';
	let text = '';
	switch (props.purpose) {
		case 'play':
			if (props.status) {
				title = 'Pause';
				text = <i className="bi bi-pause-fill" />;
			} else {
				title = 'Play';
				text = <i className="bi bi-play-fill" />;
			}
			break;
		case 'shuffle':
			if (props.status) {
				title = 'Disable shuffle';
				text = <i className="bi bi-shuffle enabled" />;
			} else {
				title = 'Enable shuffle';
				text = <i className="bi bi-shuffle" />;
			}
			break;
		case 'repeat':
			if (props.status) {
				title = 'Disable repeat';
				text = <i className="bi bi-arrow-repeat enabled" />;
			} else {
				title = 'Enable repeat';
				text = <i className="bi bi-arrow-repeat" />;
			}
			break;
		case 'next':
			title = 'Next';
			text = <i className="bi bi-skip-end-fill" />;
			break;
		case 'prev':
			title = 'Previous';
			text = <i className="bi bi-skip-start-fill" />;
			break;
		default:
			text = props.purpose;
			break;
	}

	return (
		<div className="media-btn-container">
			<button 
				className={`media-btn ${props.purpose}`} 
				onClick={props.onClick} 
				title={title}>{text}</button>
		</div>
	)
}
