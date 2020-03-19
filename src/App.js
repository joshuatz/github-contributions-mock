import React, { useState } from 'react';
import './App.css';
import { ControlForm } from './components/ControlForm';
import { ContribGraph } from './components/ContribGraph';
import { generateDemoPattern } from './utils/general';

function App() {
	const dummyPoints = generateDemoPattern(0, 4, 500, 10);
	console.log(dummyPoints);
	const [graphParams, setGraphParams] = useState({
		// points: [
		// 	[1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0],
		// 	[0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5],
		// 	[5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4],
		// 	[4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3],
		// 	[3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2],
		// 	[2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1],
		// 	[1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0]
		// ],
		points: dummyPoints,
		colors: {
			0: '#ebedf0',
			1: '#c6e48b',
			2: '#7bc96f',
			3: '#239a3b',
			4: '#196127'
		}
	});

	return (
		<div className="App">
			<ControlForm setGraph={setGraphParams} />
			<ContribGraph {...graphParams} />
		</div>
	);
}

export default App;
