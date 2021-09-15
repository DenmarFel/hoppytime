import React from 'react';
import { useHistory } from "react-router-dom";

export default function Ideas(props) {
	const history = useHistory();

	const useSuggestedVideo = (link) => {
		let url = new URL(link);
		let videoId = '';

    if (url.hostname === 'www.youtube.com') {
      videoId = url.searchParams.get('v');
    } else if (url.hostname === 'youtu.be') {
      videoId = url.pathname.replace('/','');
    }

		history.push('/player/' + videoId);
	}

	return (
		<div id="ideas">
			<h1>Ideas</h1>
			<div onClick={() => useSuggestedVideo('https://www.youtube.com/watch?v=lIsT3fQfwdU')}>
			Tibeauthetraveler x Lawrence Walther - Scenery [lofi hip hop/relaxing beats]
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

			{/* 
			Test Data:
			Lofi:
			https://www.youtube.com/watch?v=EIm4HvDgQCM
			https://www.youtube.com/watch?v=_ITiwPMUzho

			Lectures: 
			https://www.youtube.com/watch?v=oBt53YbR9Kk
			https://www.youtube.com/watch?v=LwCRRUa8yTU

			Videos where timestamps are from comments:
			// Check if video has comments
			https://www.youtube.com/watch?v=YF1eYbfbH5k&t=7s (Interstellar Soundtrack)
			https://www.youtube.com/watch?v=huC_e9EkN8U (Dune Soundtrack)
			https://www.youtube.com/watch?v=rJdHvKWvk3Q (Lofi programming)
			https://www.youtube.com/watch?v=nPn_q0J9pds (Star wars soundtrack)

			Videos with weird content in comments
			https://www.youtube.com/watch?v=Nhqc0kHBLSs

			Videos with normal timestamps but better option is in comments:
			https://www.youtube.com/watch?v=W_rtrTM3-CI
			*/}
		</div>
	)
}
