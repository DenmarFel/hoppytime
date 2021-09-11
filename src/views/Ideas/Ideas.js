import React from 'react';
import { useHistory } from "react-router-dom";

export default function Ideas(props) {
	const history = useHistory();

	const useSuggestedVideo = (link) => {
		history.push('/');
		props.onVideoChange(link);
	}

	return (
		<div id="ideas">
			<h1>Ideas</h1>
			<div onClick={() => useSuggestedVideo('https://www.youtube.com/watch?v=W5AZeNGB6Ds&t=1406s')}>
				Zelda Music To Relax/Study/Work/Game
			</div>
			<div onClick={() => useSuggestedVideo('https://www.youtube.com/watch?v=rfscVS0vtbw')}>
				Learn Python - Full Course for Beginners [Tutorial]
			</div>
			<div onClick={() => useSuggestedVideo('https://www.youtube.com/watch?v=nf0llz_Rfd0&t=935s')}>
				MIXED: Blade Runner 2049 Original Motion Picture Soundtrack
			</div>
		</div>
	)
}
