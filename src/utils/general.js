/**
 * Split array into specific sized chunks
 * @param {Array<any>} arr
 * @param {number} chunkLength
 */
export const chunkArr = (arr, chunkLength) => {
	const chunks = [];
	let i = 0;
	while (i < arr.length) {
		chunks.push(arr.slice(i, (i += chunkLength)));
	}
	return chunks;
};

/**
 * @param {Date} startDate
 * @param {Array<Array<number>>} pixelMdArr
 * @param {'greyscale' | 'blackandwhite'} pixelType
 */
export const pixelArrToContribCal = (startDate, pixelMdArr, pixelType = 'greyscale') => {
	const contribsByDate = {};
	//
};

const dateToYMD = date => {
	return /([^T]*)/.exec(date.toISOString())[0];
};

/**
 * @param {number} min
 * @param {number} max
 * @param {number} width
 * @param {number} height
 */
export const generateDemoPattern = (min, max, width, height) => {
	const output = [];
	let prevRow;
	for (let y = 0; y < height; y++) {
		/** @type {Array<number>} */
		let currRow = [];
		if (y > 0) {
			prevRow = output[y - 1];
			// We can optimize by using the last row and shifting
			// e.g. -> [1, 2, 3, 0] --> [0, 1, 2, 3] --> [3, 0, 1, 2]
			const currFirst = prevRow[0] === min ? max : prevRow[0] - 1;
			currRow = [currFirst, ...prevRow.slice(0, prevRow.length - 1)];
		} else {
			// Build very first row
			let currVal = min;
			for (let x = 0; x < width; x++) {
				currVal = currVal <= max ? currVal : min;
				currRow.push(currVal);
				currVal++;
			}
		}

		output.push(currRow);
	}

	return output;
};
