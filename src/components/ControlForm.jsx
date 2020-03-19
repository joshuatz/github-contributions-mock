import React, { useState } from 'react';
import fontUtils from '../utils/font-utils';
import { IntensityInput } from './IntensityInput';

export const ControlForm = ({ setGraph }) => {
	const defaultFormState = {
		toUpper: true,
		textInput: 'Hello! 🎉',
		shouldScroll: true,
		useTextIntensity: false,
		fixedIntensity: 255
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

				<label>
					<input
						type="checkbox"
						id="useTextIntensity"
						checked={formState.useTextIntensity}
						onChange={mapFormChange}
					/>
					<span>Use intensity of Text</span>
				</label>

				<IntensityInput
					intensity={formState.fixedIntensity}
					disabled={formState.useTextIntensity}
					setIntensity={evt => {
						setFormState({
							...formState,
							fixedIntensity: evt.target.value
						});
					}}
				/>

				{/* Testing */}
				<button
					onClick={evt => {
						evt.preventDefault();
						fontUtils.textToDataArr(formState.textInput, 'greyscale');
					}}
				>
					Generate
				</button>
				<canvas width={500} height={200}></canvas>
			</form>
		</div>
	);
};
