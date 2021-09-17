import React from 'react';

export default function NavMenuBtn(props) {
	return (
		<div id="nav-menu-btn">
			<button className="circular-btn" onClick={props.onClick}><i className="bi bi-list" /></button>
		</div>
	)
}
