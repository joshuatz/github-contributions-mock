import React, { useState, useCallback } from 'react';
import fontUtils from '../utils/font-utils';
import { IntensityInput } from './IntensityInput';
import { GhIntensityInput } from './GhIntensityInput';
import { defaultGraphColors } from '../constants';
import { scaleArr } from '../utils/general';

/** @param {{setGraph: SetGraphParams}} props */
export const ControlForm = ({ setGraph }) => {
	const defaultFormState = {
		toUpper: true,
		textInput: 'Hello! ⚡',
		shouldScroll: true,
		useTextIntensity: false,
		fixedIntensity: 4
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

	const generateFromForm = useCallback(() => {
		/** @type {ColorScales} */
		let colorScale = 'greyscale';
		let colors = defaultGraphColors;
		// make sure to invert from greyscale (since 255 should become low, and 0 should become high)
		let range = { min: 4, max: 0 };
		if (!formState.useTextIntensity) {
			colorScale = 'blackandwhite';
			colors = {
				0: '#ebedf0',
				1: `${defaultGraphColors[formState.fixedIntensity]}`
			};
			console.log(colors);
			range = { min: 0, max: 1 };
		}
		const text = formState.toUpper ? formState.textInput.toUpperCase() : formState.textInput;
		const chars = fontUtils.textToDataArr(text, colorScale, { w: 20, h: 9 }, '10px monospace');
		const lastChar = chars[chars.length - 1];

		const scaledPoints = lastChar ? scaleArr(lastChar, range.min, range.max, true) : [];
		setGraph({
			points: scaledPoints,
			colors
		});
	}, [formState, setGraph]);

	React.useEffect(() => {
		generateFromForm();
	}, [formState, generateFromForm]);

	return (
		<div className="controlForm">
			<form>
				<label htmlFor="textInput">Text to Display</label>
				<input
					type="text"
					id="textInput"
					value={formState.textInput}
					onChange={mapFormChange}
					onKeyUp={generateFromForm}
				/>

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

				<GhIntensityInput
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
						generateFromForm();
					}}
				>
					Generate
				</button>
				<canvas width={500} height={200}></canvas>
			</form>
		</div>
	);
};
