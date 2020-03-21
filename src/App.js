import React, { useState } from 'react';
import './App.css';
import { ControlForm } from './components/ControlForm';
import { ContribGraph } from './components/ContribGraph';
import { generateDemoPattern } from './utils/general';
import { defaultGraphColors } from './constants';

function App() {
	const dummyPoints = generateDemoPattern(0, 4, 300, 10);
	const [graphParams, setGraphParams] = useState({
		points: dummyPoints,
		colors: defaultGraphColors
	});

	return (
		<div className="app">
			<ControlForm setGraph={setGraphParams} />
			<ContribGraph {...graphParams} />
		</div>
	);
}

export default App;
