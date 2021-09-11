import React from 'react';

export default function NavMenuBtn(props) {
	return (
		<div id="nav-menu-btn">
			<button onClick={props.onClick}><i class="bi bi-list" /></button>
		</div>
	)
}
