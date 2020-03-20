import React from 'react';
import { defaultGraphColors } from '../constants';

export const GhIntensityInput = ({ intensity, setIntensity, disabled = false }) => {
	return (
		<div className="intensityInput">
			<div
				style={{
					backgroundColor: `${defaultGraphColors[intensity]}`,
					width: 12,
					height: 12
				}}
			></div>
			<p className="range-field">
				<input
					type="range"
					min="0"
					max="4"
					step={1}
					value={intensity}
					onChange={setIntensity}
					disabled={disabled}
				/>
			</p>
		</div>
	);
};
