import React from 'react';
import { useHistory } from "react-router-dom";

function Idea(props) {
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
		<li className="list-item" onClick={() => useSuggestedVideo(props.link)}>
			{props.videoTitle}
		</li>
	)
} 

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

	const lofiIdeas = [
		{
			link: 'https://www.youtube.com/watch?v=lIsT3fQfwdU',
			videoTitle: 'Tibeauthetraveler x Lawrence Walther - Scenery [lofi hip hop/relaxing beats]'
		},
		{
			link: 'https://www.youtube.com/watch?v=f02mOEt11OQ&t=2028s',
			videoTitle: 'code-fi / lofi beats to code/relax to'
		},
		{
			link: 'https://www.youtube.com/watch?v=EIm4HvDgQCM',
			videoTitle: 'Chill Drive - Lofi hip hop mix ~ Stress Relief, Relaxing Music'
		},
		{
			link: 'https://www.youtube.com/watch?v=QltODNFwp20',
			videoTitle: 'Night lullaby ~ lofi hip hop mix'
		}
	]

	const soundtrackIdeas = [
		{
			link: 'https://www.youtube.com/watch?v=YF1eYbfbH5k',
			videoTitle: 'Interstellar Official Soundtrack | Full Album – Hans Zimmer | WaterTower'
		},
		{
			link: 'https://www.youtube.com/watch?v=bficwxH7c1w',
			videoTitle: 'Full Hour of Avatar the Last Airbender and Korra Amazing Soundtracks!'
		},
		{
			link: 'https://www.youtube.com/watch?v=nf0llz_Rfd0',
			videoTitle: 'MIXED: Blade Runner 2049 Original Motion Picture Soundtrack'
		},
		{
			link: 'https://www.youtube.com/watch?v=8C2MAUeNFz4',
			videoTitle: 'La La Land - Full OST / Soundtrack (HQ)'
		},
		{
			link: 'https://www.youtube.com/watch?v=nPn_q0J9pds',
			videoTitle: 'Best Star Wars Music By John Williams 10 hours'
		},
		{
			link: 'https://www.youtube.com/watch?v=hoFUOOiiC6k',
			videoTitle: 'Spider-Man: Miles Morales (Original Game Soundtrack) | Full Album'
		},
		{
			link: 'https://www.youtube.com/watch?v=RbbwaWPJcCs',
			videoTitle: 'The Legend of Zelda: Breath of the Wild - FULL OST (OFFICIAL SOUNDTRACK)'
		},
	]

	return (
		<div id="ideas">
			<h1>Ideas</h1>
			<h3>Enjoy some Lofi</h3>
			<ul className="list">
				{lofiIdeas.map(idea => 
					<Idea key={idea.link} link={idea.link} videoTitle={idea.videoTitle} />
				)}
			</ul>
			<h3>Shuffle a soundtrack</h3>
			<ul className="list">
				{soundtrackIdeas.map(idea => 
					<Idea key={idea.link} link={idea.link} videoTitle={idea.videoTitle} />
				)}
			</ul>
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
