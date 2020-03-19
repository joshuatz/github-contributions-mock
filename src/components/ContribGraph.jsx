import React from 'react';

/**
 * @typedef {{0: string, 1: string, 2: string, 3: string, 4: string}} Colors
 */

/**
 *
 * @param {object} props
 * @param {Array<Array<number>>} props.points
 * @param {Colors} props.colors
 * @param {number} [props.margin]
 */
export const ContribGraph = ({ points, colors, margin = 2 }) => {
	/** @param {Array<Array<number>>} points */
	const pointsToRects = points => {
		const rectSize = { w: 10, h: 10 };
		let colCounter = 0;
		let rowCounter = 0;
		return points.map(row => {
			rowCounter++;
			colCounter = 0;
			return row.map(pointVal => {
				const currX = colCounter * (rectSize.w + margin);
				const currY = (rowCounter - 1) * (rectSize.h + margin);
				colCounter++;
				return <rect width={rectSize.w} height={rectSize.h} fill={colors[pointVal]} y={currY} x={currX} />;
			});
		});
	};
	return (
		<div className="contribGraph">
			<svg
				style={{
					width: '100%',
					height: '150px'
				}}
			>
				{pointsToRects(points)}
			</svg>
		</div>
	);
};
