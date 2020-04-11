import React from 'react';
import { defaultGraphColors } from '../constants';

export const GhIntensityInput = ({ intensity, setIntensity, disabled = false }) => {
	return (
		<div
			className="intensityInput row"
			style={{
				border: '1px solid var(--lightBorder)'
			}}
		>
			<div className="row">
				<div className="col s10 offset-s1 center-align">
					<p className="flow-text">Manual Color Override</p>
				</div>
			</div>
			<div
				className="col s1 center-align"
				style={{
					fontSize: 30
				}}
			>
				{intensity}
			</div>
			<div className="col s2 center-align">
				<div
					style={{
						backgroundColor: `${defaultGraphColors[intensity]}`,
						width: 30,
						height: 30,
						margin: 'auto'
					}}
				/>
			</div>
			<div className="range-field col s9 valign-wrapper">
				<input
					type="range"
					min="0"
					max="4"
					step={1}
					value={intensity}
					onChange={setIntensity}
					disabled={disabled}
				/>
			</div>
		</div>
	);
};
