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

/**
 * Scale down (or up) an array
 * @param {Array<any>} arr Input array to scale. Can be multi-dimensional
 * @param {number} minAllowed Min of range to scale to
 * @param {number} maxAllowed Max of range to scale to
 * @param {boolean} [round] Should output only be integers?
 * @param {number} [min] Smallest value that appears anywhere in arr data
 * @param {number} [max] Largest value that appears anywhere in arr data
 * @example
 * scaled = scaleArr([0, 2, 4], 0, 10);
 * console.log(scaled);
 * // > [0, 5, 10]
 * @example
 * // You can also invert the mapping
 * scaled = scaleArr([0, 2, 4], 10, 0);
 * console.log(scaled);
 * // > [10, 5, 0]
 */
export const scaleArr = (arr, minAllowed, maxAllowed, round, min, max) => {
	const getNums = arr => {
		const singleDimArr = [];
		arr.forEach(val => {
			singleDimArr.push(...(Array.isArray(val) ? getNums(val) : [val]));
		});
		return singleDimArr;
	};

	if (typeof min !== 'number' || typeof max !== 'number') {
		const allNums = getNums(arr);
		max = Math.max(...allNums);
		min = Math.min(...allNums);
	}

	return arr.map(val => {
		if (Array.isArray(val)) {
			return scaleArr(val, minAllowed, maxAllowed, round, min, max);
		}

		const scaled = ((maxAllowed - minAllowed) * (val - min)) / (max - min) + minAllowed;

		if (Number.isNaN(scaled)) {
			return minAllowed;
		}

		return !!round ? Math.round(scaled) : scaled;
	});
};

/**
 *
 * @param {Array<any>} arr
 * @param {boolean} [isMdArr]
 * @param {'left' | 'right'} [direction]
 */
export const shiftArr = (arr, isMdArr = false, direction = 'right') => {
	if (isMdArr) {
		return arr.map(subArr => {
			return shiftArr(subArr, false, direction);
		});
	}

	if (direction === 'right') {
		return [arr[arr.length - 1], ...arr.slice(0, arr.length - 1)];
	} else {
		return [...arr.slice(1), arr[0]];
	}
};
