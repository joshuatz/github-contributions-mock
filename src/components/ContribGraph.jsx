import React, { useState, useRef, useEffect } from 'react';
import { monthsAbbr } from '../constants';
import { shiftArr } from '../utils/general';

const ANIMATION_STEP_DELAY_MS = 200;

/**
 *
 * @param {object} props
 * @param {Array<Array<number>>} props.points
 * @param {ColorValMap} props.colors
 * @param {number} [props.margin]
 * @param {boolean} [props.animate]
 */
export const ContribGraph = ({ points, colors, margin = 2, animate = true }) => {
	let animationTimer;
	const rectSize = { w: 10, h: 10 };
	const [finPoints, setFinPoints] = useState(points);
	const [animateTimer, setAnimateTimer] = useState(null);
	const colCount = points[0] ? points[0].length : 0;
	/** @type {React.MutableRefObject<SVGSVGElement>} */
	const containerRef = useRef(null);

	const getDisplayColCount = () => {
		const pixelWidth = containerRef.current.getBoundingClientRect().width;
		return Math.round(pixelWidth / (rectSize.w + margin));
	};

	/** @param {Array<Array<number>>} inputPoints */
	const pointsToRects = inputPoints => {
		console.log('pointsToRects called - ', inputPoints);
		let colCounter = 0;
		let rowCounter = 0;
		return inputPoints.map(row => {
			rowCounter++;
			colCounter = 0;
			return row.map(pointVal => {
				const currX = colCounter * (rectSize.w + margin);
				const currY = (rowCounter - 1) * (rectSize.h + margin);
				colCounter++;
				return (
					<rect
						key={`r${rowCounter}c${colCounter}`}
						width={rectSize.w}
						height={rectSize.h}
						fill={colors[pointVal]}
						y={currY}
						x={currX}
					/>
				);
			});
		});
	};

	if (animate) {
		const timerId = setInterval(() => {
			const updatedPoints = shiftArr(finPoints, true, 'right');
			setFinPoints([...updatedPoints]);
		}, ANIMATION_STEP_DELAY_MS);
		animationTimer = timerId;
		// setAnimateTimer(timerId);
	} else if (animationTimer) {
		clearInterval(animationTimer);
		// setAnimateTimer(null);
	}

	// useEffect(() => {
	// 	if (!animate) {
	// 		clearInterval(animateTimer);
	// 	}
	// }, [animate, animateTimer]);

	// useEffect(() => {
	// 	return function cleanup() {
	// 		if (animateTimer) {
	// 			clearInterval(animateTimer);
	// 		}
	// 	};
	// });

	useEffect(() => {
		return function cleanup() {
			if (animationTimer) {
				clearInterval(animationTimer);
			}
		};
	});

	useEffect(() => {
		setFinPoints(points);
	}, [points]);

	return (
		<div style={{ padding: 10 }}>
			<div className="contribGraph">
				<div className="monthsWrapper">
					{monthsAbbr.map(abbrev => (
						<div key={abbrev} className="month">
							{abbrev}
						</div>
					))}
				</div>
				<svg
					ref={containerRef}
					style={{
						width: '100%',
						// height: '150px,'
						overflow: 'hidden'
					}}
					viewBox={`0 0 ${finPoints[0] ? finPoints[0].length * (rectSize.w + margin) : 0} ${finPoints.length *
						(rectSize.h + margin)}`}
				>
					{pointsToRects(finPoints)}
				</svg>
			</div>
		</div>
	);
};
