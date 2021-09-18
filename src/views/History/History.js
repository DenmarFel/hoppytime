import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { loadHistory, clearHistory } from '../../utils/helpers';

export default function History() {
	const [history, setHistory] = useState(loadHistory());

	const items = history.reverse().map(item => 
		<Link to={"player/" + item[0]}><li className="list-item">{item[1]}</li></Link>
	);

	const handleClearHistory = () => {
		clearHistory();
		setHistory([])
	}

	return (
		<div id="history" className="text-center">
			<h1>History</h1>
			<ul className="list">
				<li className="list-item red-list-item" onClick={handleClearHistory}>Clear History</li>
				{items}
			</ul>
		</div>
	)
}
