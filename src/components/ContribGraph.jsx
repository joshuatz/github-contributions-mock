import React, { useState, useRef, useEffect } from 'react';
import { monthsAbbr } from '../constants';
import { shiftArr } from '../utils/general';
import { useElemSize } from '../utils/hooks';

const ANIMATION_STEP_DELAY_MS = 200;
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
export const ContribGraph = ({ points, colors, emptyVal = 0, margin = 2, animate = true, scrollDirection = 'rtl' }) => {
	let animationTimer;
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
	console.log({
		pointsColCount,
		minCols,
		maxCols,
		displayColCount,
		numMonths
	});

	/** @param {Array<Array<number>>} inputPoints */
	const pointsToRects = (inputPoints) => {
		console.log('pointsToRects called - ', inputPoints);
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

	if (animate) {
		const timerId = setInterval(() => {
			const shiftDir = scrollDirection === 'ltr' ? 'right' : 'left';
			const updatedPoints = shiftArr(finPoints, true, shiftDir);
			setFinPoints([...updatedPoints]);
		}, ANIMATION_STEP_DELAY_MS);
		animationTimer = timerId;
	} else if (animationTimer) {
		clearInterval(animationTimer);
	}

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
