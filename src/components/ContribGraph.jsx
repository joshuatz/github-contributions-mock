import React, { useState, useRef, useEffect } from 'react';
import { monthsAbbr } from '../constants';
import { shiftArr } from '../utils/general';
import { useElemSize } from '../utils/hooks';

const COLS_PER_MONTH = 4;
const MIN_MONTHS = 6;

/** @type {Record<string, React.CSSProperties>} */
const styles = {
	contribGraph: {
		border: '1px solid #d1d5da',
		padding: 4
	},
	monthsWrapper: {
		paddingLeft: 4,
		overflowX: 'hidden',
		width: '100%',
		display: 'flex'
	},
	month: {
		fontSize: 10,
		fill: '#767676',
		margin: 'auto'
	}
};

/**
 * @param {ContribGraphProps} props
 */
export const ContribGraph = ({
	points,
	colors,
	emptyVal = 0,
	margin = 2,
	animate = false,
	scrollDirection = 'rtl',
	scrollDelayMs = 200
}) => {
	let animationTimerRef = React.useRef(null);
	let shouldAnimateRef = React.useRef(animate);
	let animationFuncRef = React.useRef(null);
	let lastAnimationPaintMs = new Date().getTime();
	const rectSize = { w: 10, h: 10 };
	const [finPoints, setFinPoints] = useState(points);
	/** @type {React.MutableRefObject<SVGSVGElement>} */
	const containerRef = useRef(null);
	const containerSize = useElemSize(containerRef);

	// Responsive SVG calculations
	const pointsColCount = finPoints[0] ? finPoints[0].length : 0;
	const minCols = MIN_MONTHS * COLS_PER_MONTH;
	const maxCols = Math.round(containerSize.width / (rectSize.w + margin));
	const displayColCount = Math.min(Math.max(pointsColCount, minCols), maxCols);
	const numMonths = Math.round(displayColCount / COLS_PER_MONTH);

	/** @param {Array<Array<number>>} inputPoints */
	const pointsToRects = (inputPoints) => {
		let rowCounter = 0;
		return inputPoints.map((row) => {
			rowCounter++;
			const rowCells = [];
			for (let colCounter = 0; colCounter < displayColCount; colCounter++) {
				const currX = colCounter * (rectSize.w + margin);
				const currY = (rowCounter - 1) * (rectSize.h + margin);
				let pointVal = row[colCounter];
				pointVal = typeof pointVal === 'undefined' ? emptyVal : pointVal;
				rowCells.push(
					<rect
						key={`r${rowCounter}c${colCounter}`}
						width={rectSize.w}
						height={rectSize.h}
						fill={colors[pointVal]}
						y={currY}
						x={currX}
					/>
				);
			}
			return rowCells;
		});
	};

	useEffect(() => {
		setFinPoints(points);
	}, [points]);

	const performAnimation = () => {
		if (shouldAnimateRef.current) {
			console.log('animate = true, running');
			console.log(shouldAnimateRef.current);
			setTimeout(() => {
				console.log('requesting new frame');
				animationTimerRef.current = requestAnimationFrame(performAnimation);
			}, scrollDelayMs);

			// const nowMs = new Date().getTime();
			// const elapsedMsSinceLastPaint = nowMs - lastAnimationPaintMs;
			// if (elapsedMsSinceLastPaint >= scrollDelayMs) {
			const shiftDir = scrollDirection === 'ltr' ? 'right' : 'left';
			const updatedPoints = shiftArr(finPoints, true, shiftDir);
			setFinPoints([...updatedPoints]);
			// lastAnimationPaintMs = nowMs;
			// }
			// animationTimer = requestAnimationFrame(performAnimation);
		} else if (animationTimerRef.current) {
			cancelAnimationFrame(animationTimerRef.current);
			animationTimerRef.current = null;
		}
	};

	// const performAnimationCb = React.useCallback(() => {
	// 	performAnimation();
	// }, []);

	// useEffect(() => {
	// 	console.log(`Animate changed. animate = ${animate}`);
	// 	shouldAnimateRef.current = animate;

	// 	return function cleanup() {
	// 		if (animationTimerRef.current) {
	// 			cancelAnimationFrame(animationTimerRef.current);
	// 		}
	// 	};
	// }, [animate]);

	// React.useLayoutEffect(() => {
	// 	animationTimerRef.current = requestAnimationFrame(performAnimation);

	// 	return function cleanup() {
	// 		if (animationTimerRef.current) {
	// 			cancelAnimationFrame(animationTimerRef.current);
	// 		}
	// 	};
	// }, []);

	React.useEffect(() => {
		shouldAnimateRef.current = animate;
		animationFuncRef.current = () => {
			if (shouldAnimateRef.current) {
				console.log('animate = true, running');
				console.log(shouldAnimateRef.current);
				setTimeout(() => {
					console.log('requesting new frame');
					animationTimerRef.current = requestAnimationFrame(animationFuncRef.current);
				}, scrollDelayMs);

				const shiftDir = scrollDirection === 'ltr' ? 'right' : 'left';
				const updatedPoints = shiftArr(finPoints, true, shiftDir);
				setFinPoints([...updatedPoints]);
			} else if (animationTimerRef.current) {
				cancelAnimationFrame(animationTimerRef.current);
				animationTimerRef.current = null;
			}
		};
		animationFuncRef.current();
	}, [animate, finPoints, scrollDelayMs, scrollDirection]);

	return (
		<div style={{ padding: 10 }}>
			<div className="contribGraph" style={styles.contribGraph}>
				<div className="monthsWrapper" style={styles.monthsWrapper}>
					{(function () {
						const output = [];
						let abbrevPointer = 0;
						for (let x = 0; x < numMonths; x++) {
							const abbrev = monthsAbbr[abbrevPointer];
							output.push(
								<div key={`${abbrev}_${x}`} style={styles.month} className="month">
									{abbrev}
								</div>
							);
							abbrevPointer = abbrevPointer < monthsAbbr.length - 1 ? abbrevPointer + 1 : 0;
						}
						return output;
					})()}
				</div>
				<svg
					ref={containerRef}
					style={{
						width: '100%',
						overflow: 'hidden'
					}}
					viewBox={`0 0 ${displayColCount * (rectSize.w + margin)} ${
						finPoints.length * (rectSize.h + margin)
					}`}
				>
					{pointsToRects(finPoints)}
				</svg>
			</div>
		</div>
	);
};
