import { chunkArr } from './general';

/**
 *
 * @param {string} text Input text
 * @param {'rgba' | 'greyscale' | 'blackandwhite'} [returnType]
 * @param {object} [resolution] Resolution per character
 * @param {number} resolution.w
 * @param {number} resolution.h
 * @param {string} [fontStr] CSS font string
 * @param {boolean} [useCache] Cache bitmaps
 * @param {boolean} [splitByChar] Split the output by character
 */
export const textToDataArr = (
	text,
	returnType = 'greyscale',
	resolution = { w: 10, h: 10 },
	fontStr = '10px sans-serif',
	useCache = true,
	splitByChar = false
) => {
	const output = [];
	// Get around .split() UTF16 limitation
	const chars = [...text];

	// Edge case - empty text
	if (!chars.length) {
		return output;
	}

	if (splitByChar) {
		// Hold data for returning
		const dataByChar = [];
		for (const char of chars) {
			const cacheKey = `${fontStr}_${char}`;
			if (useCache && typeof window[cacheKey]) {
				dataByChar.push(window[cacheKey]);
			} else {
				dataByChar.push(textToDataArr(char, returnType, resolution, fontStr, useCache, false));
			}
		}
		return dataByChar;
	}

	// Setup a canvas element
	let canvas = document.querySelector('canvas');
	if (!canvas) {
		canvas = document.createElement('canvas');
	}
	canvas.width = resolution.w * chars.length;
	canvas.height = resolution.h;

	// Setup canvas context
	const canvContext = canvas.getContext('2d');
	canvContext.font = fontStr;
	canvContext.textBaseline = 'hanging';
	// canvContext.textBaseline = 'middle';

	// Clear - sets all pixels to rgba(0,0,0,0) (black)
	canvContext.clearRect(0, 0, canvas.width, canvas.height);
	// Set white background
	canvContext.fillStyle = 'white';
	canvContext.fillRect(0, 0, canvas.width, canvas.height);
	// Fill text
	canvContext.fillStyle = 'black';
	canvContext.fillText(text, 1, 1, canvas.width);
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

	if (returnType === 'blackandwhite') {
		dataArr = rgbaArrToBitArr(dataArr);
	} else if (returnType === 'greyscale') {
		dataArr = rgbaArrToGrayscale(dataArr);
	}

	// Chunk array by width
	// canvas returns single array (10 x 10 grid returns 1x100 array), but I'd like data by row (10 x (1 x 10))
	dataArr = chunkArr(dataArr, canvas.width);

	output.push(dataArr);

	return output;
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

/**
 * Returns array where each pixel is 0-255
 * @param {Array<Array<number>>} rgbaArr
 * @returns {Array<number>}
 */
export const rgbaArrToGrayscale = rgbaArr => {
	const out = [];
	for (const subArr of rgbaArr) {
		let y = 0.299 * subArr[0] + 0.587 * subArr[1] + 0.114 * subArr[2];
		y = y * (subArr[3] / 255);
		out.push(y);
	}
	return out;
};

export const fontUtils = {
	textToDataArr
};

export default fontUtils;
