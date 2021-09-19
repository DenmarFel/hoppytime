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
	const lofiIdeas = [
		{
			link: 'https://www.youtube.com/watch?v=lIsT3fQfwdU',
			videoTitle: 'Tibeauthetraveler x Lawrence Walther - Scenery [lofi hip hop/relaxing beats]'
		},
		{
			link: 'https://www.youtube.com/watch?v=_ITiwPMUzho',
			videoTitle: '3 AM Coding Session - Lofi Hip Hop Mix [Study & Coding Beats]'
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
		{
			link: 'https://www.youtube.com/watch?v=I22AqV9zV50',
			videoTitle: 'Tron: Legacy Ultimate Cut'
		}
	]

	const lectureIdeas = [
		{
			link: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
			videoTitle: 'Learn Python - Full Course for Beginners [Tutorial]'
		},
		{
			link: 'https://www.youtube.com/watch?v=EH6vE97qIP4',
			videoTitle: '1. Introduction for 15.S12 Blockchain and Money, Fall 2018'
		},
		{
			link: 'https://www.youtube.com/watch?v=WmBzmHru78w',
			videoTitle: 'Calculus 1 Final Exam Review'
		}
	]

	return (
		<div id="ideas">
			<h1>Ideas</h1>
			<h3>Enjoy some lofi</h3>
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
			<h3>Watch the important parts of a lecture video</h3>
			<ul className="list">
				{lectureIdeas.map(idea => 
					<Idea key={idea.link} link={idea.link} videoTitle={idea.videoTitle} />
				)}
			</ul>
		</div>
	)
}
