// @ts-check
import React, { useState, useCallback } from 'react';
import fontUtils from '../utils/font-utils';
import { GhIntensityInput } from './GhIntensityInput';
import { defaultGraphColors } from '../constants';
import { scaleArr, padArr, padMdArrToMinHeight } from '../utils/general';

/** @param {{setGraph: SetGraphParams}} props */
export const ControlForm = ({ setGraph }) => {
	const defaultFormState = {
		toUpper: true,
		textInput: 'Welcome! ⚡💎',
		shouldScroll: false,
		// prettier-ignore
		/** @type {'rtl' | 'ltr'} */
		scrollDirection: ('rtl'),
		useTextIntensity: true,
		fixedIntensity: 4,
		processByChar: true,
		processInstantly: true,
		showCanvas: false
	};
	const [formState, setFormState] = useState(defaultFormState);

	/** @param {React.ChangeEvent<HTMLInputElement>} evt */
	const mapFormChange = (evt) => {
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
		console.log({ formState });
		/** @type {ColorScales} */
		let colorScale = 'greyscale';
		let colors = defaultGraphColors;
		const text = formState.toUpper ? formState.textInput.toUpperCase() : formState.textInput;
		const emptyVal = formState.useTextIntensity ? 255 : 0;

		// make sure to invert from greyscale (since 255 should become low, and 0 should become high)
		let range = { min: 4, max: 0 };

		// Binary color state (aka black and white)
		if (!formState.useTextIntensity) {
			colorScale = 'blackandwhite';
			colors = {
				0: '#ebedf0',
				1: `${defaultGraphColors[formState.fixedIntensity]}`
			};
			range = { min: 0, max: 1 };
		}

		// Get data arr based on text input
		let dataArr = fontUtils.textToDataArr(
			text.trim(),
			colorScale,
			{ w: 12, h: 13 },
			'11px "Lucida Console", Monaco, monospace',
			false,
			formState.processByChar
		);

		console.log({ dataArr });

		if (formState.processByChar && formState.textInput.length) {
			// Join characters together
			// First need to find tallest character to determine padding
			const maxHeight = [...dataArr].sort((a, b) => b.length - a.length)[0].length;

			let tempArr = [];
			for (let charBlock of dataArr) {
				if (charBlock.length < maxHeight) {
					charBlock = padMdArrToMinHeight(charBlock, maxHeight, emptyVal);
				}
				if (!tempArr.length) {
					tempArr = charBlock;
					// console.log(tempArr);
				} else {
					for (let x = 0; x < charBlock.length; x++) {
						// const row = charBlock[x];
						// console.log(charBlock);
						tempArr[x] = tempArr[x].concat(charBlock[x]);
					}
				}
			}
			console.log(tempArr);
			dataArr = tempArr;
		}

		const scaledPoints = dataArr ? scaleArr(dataArr, range.min, range.max, true) : [];
		console.log({ dataArr, scaledPoints });
		setGraph({
			points: scaledPoints,
			colors,
			animate: formState.shouldScroll,
			scrollDirection: formState.scrollDirection
		});
	}, [formState, setGraph]);

	React.useEffect(() => {
		if (formState.processInstantly) {
			generateFromForm();
		}
	}, [formState, generateFromForm]);

	return (
		<div className="controlForm">
			<form className="row">
				<div className="row">
					<div className="col s12 m9">
						<label htmlFor="textInput">Text to Display</label>
						<input type="text" id="textInput" value={formState.textInput} onChange={mapFormChange} />
					</div>
					{!formState.processInstantly && (
						<div className="col s6 offset-s3 m3 center-align">
							{/* Testing */}
							<button
								className="btn-large"
								onClick={(evt) => {
									evt.preventDefault();
									generateFromForm();
								}}
							>
								Generate
							</button>
						</div>
					)}
				</div>

				{/* Settings Wrapper */}
				<div className="row" style={{ minHeight: 134, marginBottom: 0 }}>
					<div className="col s12 m6">
						<div className="col s12 m6">
							<label htmlFor="shouldScroll">
								<input
									type="checkbox"
									id="shouldScroll"
									checked={formState.shouldScroll}
									onChange={mapFormChange}
								/>
								<span>Should text scroll / animate?</span>
							</label>
						</div>

						{formState.shouldScroll && (
							<div className="col s12 m6">
								<div className="switch">
									<label>
										LTR
										<input
											type="checkbox"
											checked={formState.scrollDirection === 'rtl'}
											onChange={() => {
												const scrollDirection =
													formState.scrollDirection === 'rtl' ? 'ltr' : 'rtl';
												setFormState({
													...formState,
													scrollDirection
												});
											}}
										/>
										<span className="lever"></span>
										RTL
									</label>
								</div>
							</div>
						)}

						<div className="col s12 m6">
							<label>
								<input
									type="checkbox"
									id="toUpper"
									checked={formState.toUpper}
									onChange={mapFormChange}
								/>
								<span>Uppercase Text</span>
							</label>
						</div>

						<div className="col s12 m6">
							<label>
								<input
									type="checkbox"
									id="processInstantly"
									checked={formState.processInstantly}
									onChange={mapFormChange}
								/>
								<span>Process Instantly</span>
							</label>
						</div>

						<div className="col s12 m6">
							<label>
								<input
									type="checkbox"
									id="processByChar"
									checked={formState.processByChar}
									onChange={mapFormChange}
								/>
								<span>Process by Character</span>
							</label>
						</div>

						<div className="col s12 m6">
							<label>
								<input
									type="checkbox"
									id="showCanvas"
									checked={formState.showCanvas}
									onChange={mapFormChange}
								/>
								<span>Show Canvas</span>
							</label>
						</div>

						<div className="col s12 m6">
							<label>
								<input
									type="checkbox"
									id="useTextIntensity"
									checked={formState.useTextIntensity}
									onChange={mapFormChange}
								/>
								<span>Use intensity of Text</span>
							</label>
						</div>
					</div>
					{!formState.useTextIntensity && (
						<div className="col s12 m6">
							<GhIntensityInput
								intensity={formState.fixedIntensity}
								disabled={formState.useTextIntensity}
								setIntensity={(evt) => {
									setFormState({
										...formState,
										fixedIntensity: evt.target.value
									});
								}}
							/>
						</div>
					)}
				</div>

				<div className="col s12 m6" style={{ display: formState.showCanvas ? 'block' : 'none' }}>
					<div className="card" style={{ minHeight: 160, padding: 10 }}>
						<canvas width={500} height={200}></canvas>
					</div>
				</div>
			</form>
		</div>
	);
};
