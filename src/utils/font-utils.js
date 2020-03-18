import { chunkArr } from './general';

/**
 *
 * @param {string} text Input text
 * @param {string} fontStr CSS font string
 * @param {object} resolution Resolution per character
 * @param {number} resolution.w
 * @param {number} resolution.h
 * @param {boolean} useCache Cache bitmaps
 */
export const textToDataArr = (
	text,
	fontStr = '10px sans-serif',
	resolution = { w: 10, h: 10 },
	useCache = true,
	asBits = true
) => {
	// Hold data for returning
	const dataByChar = [];
	// Get around .split() UTF16 limitation
	const chars = [...text];
	let canvas = document.querySelector('canvas');
	if (!canvas) {
		canvas = document.createElement('canvas');
	}
	canvas.width = resolution.w;
	canvas.height = resolution.h;
	const canvContext = canvas.getContext('2d');
	canvContext.font = fontStr;
	canvContext.textBaseline = 'top';
	for (const char of chars) {
		const cacheKey = `${fontStr}_${char}`;
		if (useCache && typeof window[cacheKey]) {
			// Return cached value
		}

		// Clear - sets all pixels to rgba(0,0,0,0) (black)
		canvContext.clearRect(0, 0, canvas.width, canvas.height);
		// Set white background
		canvContext.fillStyle = 'white';
		canvContext.fillRect(0, 0, canvas.width, canvas.height);
		// Fill text
		canvContext.fillStyle = 'black';
		canvContext.fillText(char, 0, 0, canvas.width);
		// clamped to 255, 4 values (rgba) per pixel
		const uint8ClampedArr = canvContext.getImageData(0, 0, canvas.width, canvas.height).data;

		// Group by pixel
		let dataArr = [];
		for (let b = 0; b < uint8ClampedArr.length; b += 4) {
			const pixelArr = [
				uint8ClampedArr[b + 0],
				uint8ClampedArr[b + 1],
				uint8ClampedArr[b + 2],
				uint8ClampedArr[b + 3]
			];
			dataArr.push(pixelArr);
		}

		if (asBits) {
			dataArr = rgbaArrToBitArr(dataArr);
		}

		// Chunk array by width
		// canvas returns single array (10 x 10 grid returns 1x100 array), but I'd like data by row (10 x (1 x 10))
		dataArr = chunkArr(dataArr, resolution.w);

		dataByChar.push(dataArr);
	}

	debugger;
	return dataByChar;
};

/**
 *
 * @param {Array<Array<number>>} rgbaArr
 */
export const rgbaArrToBitArr = rgbaArr => {
	const threshold = 172;
	const out = [];
	for (const subArr of rgbaArr) {
		let y = 0.299 * subArr[0] + 0.587 * subArr[1] + 0.114 * subArr[2];
		y = y * (subArr[3] / 255);
		out.push(y < threshold ? 1 : 0);
	}
	return out;
};

export const fontUtils = {
	textToDataArr
};

export default fontUtils;
