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
			<div onClick={() => useSuggestedVideo('https://www.youtube.com/watch?v=TURbeWK2wwg')}>
				Mixup a memorized lofi-playlist: 4 A.M Study Session 📚 - [lofi hip hop/chill beats]
			</div>
			<div onClick={() => useSuggestedVideo('https://www.youtube.com/watch?v=W5AZeNGB6Ds&t=1406s')}>
				Listen to music from your favorite video game: Zelda Music To Relax/Study/Work/Game
			</div>
			<div onClick={() => useSuggestedVideo('https://www.youtube.com/watch?v=rfscVS0vtbw')}>
				Breakdown a long lecture video: Learn Python - Full Course for Beginners [Tutorial]
			</div>
			<div onClick={() => useSuggestedVideo('https://www.youtube.com/watch?v=nf0llz_Rfd0&t=935s')}>
				Play your favorite movie soundtrack: MIXED: Blade Runner 2049 Original Motion Picture Soundtrack
			</div>
		</div>
	)
}
