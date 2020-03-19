import React from 'react';

export const IntensityInput = ({ intensity, setIntensity, disabled = false }) => {
	return (
		<div className="intensityInput">
			<div
				style={{
					backgroundColor: `rgba(25, 97, 39, ${intensity / 255})`,
					width: 12,
					height: 12
				}}
			></div>
			<p className="range-field">
				<input type="range" min="0" max="255" value={intensity} onChange={setIntensity} disabled={disabled} />
			</p>
		</div>
	);
};
