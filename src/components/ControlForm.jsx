import React, { useState } from 'react';
import fontUtils from '../utils/font-utils';

export const ControlForm = props => {
	const defaultFormState = {
		toUpper: true,
		textInput: 'Hello! 🎉',
		shouldScroll: true
	};
	const [formState, setFormState] = useState(defaultFormState);

	/** @param {React.ChangeEvent<HTMLInputElement>} evt */
	const mapFormChange = evt => {
		/** @type {string | boolean} */
		let value = evt.target.value;

		if (evt.target.type === 'checkbox') {
			value = evt.target.checked;
		}
		setFormState({
			...formState,
			[evt.target.id]: value
		});
	};

	return (
		<div className="controlForm">
			<form>
				<label htmlFor="textInput">Text to Display</label>
				<input type="text" id="textInput" value={formState.textInput} onChange={mapFormChange} />

				<label htmlFor="shouldScroll">
					<input
						type="checkbox"
						id="shouldScroll"
						checked={formState.shouldScroll}
						onChange={mapFormChange}
					/>
					<span>Should text scroll / animate?</span>
				</label>

				<label>
					<input type="checkbox" id="toUpper" checked={formState.toUpper} onChange={mapFormChange} />
					<span>Uppercase Text</span>
				</label>

				{/* Testing */}
				<button
					onClick={evt => {
						evt.preventDefault();
						fontUtils.textToDataArr(formState.textInput, 'asdf');
					}}
				>
					Generate
				</button>
				<canvas width={500} height={200}></canvas>
			</form>
		</div>
	);
};
