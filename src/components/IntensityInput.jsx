import React from 'react';

export const IntensityInput = ({ intensity, setIntensity, disabled = false, rangeMax = 255 }) => {
	return (
		<div className="intensityInput">
			<div
				style={{
					backgroundColor: `rgba(25, 97, 39, ${intensity / rangeMax})`,
					width: 12,
					height: 12
				}}
			></div>
			<p className="range-field">
				<input
					type="range"
					min="0"
					max={rangeMax}
					step={1}
					value={intensity}
					onChange={setIntensity}
					disabled={disabled}
				/>
			</p>
		</div>
	);
};
