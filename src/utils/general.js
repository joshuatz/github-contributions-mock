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

/**
 * @param {Array<Array<number>>} mdArr
 * @param {number} [emptyVal]
 */
export const trimMdArr = (mdArr, emptyVal = 0) => {
	// @TODO optimize?

	if (!mdArr.length) {
		return mdArr;
	}

	/** @param {Array<number>} arr */
	const isEmpty = arr => {
		if (emptyVal === 0) {
			return Math.max(...arr) === 0;
		} else {
			for (const val of arr) {
				if (val !== emptyVal) {
					return false;
				}
			}
			return true;
		}
	};

	// Trim rows, starting at top
	for (let y = 0; y < mdArr.length; y++) {
		const row = mdArr[y];
		if (isEmpty(row)) {
			mdArr.splice(y, 1);
			--y;
		} else {
			break;
		}
	}
	// Trim rows, starting at bottom
	for (let y = mdArr.length - 1; y >= 0; y--) {
		const row = mdArr[y];
		if (isEmpty(row)) {
			mdArr.splice(y, 1);
		} else {
			break;
		}
	}

	// Assume equal length rows, where mdArr[0].length = mdArr[any].length
	// Trim cols, starting at left
	for (let x = 0; x < mdArr[0].length; x++) {
		const colVals = mdArr.map(row => row[x]);
		if (isEmpty(colVals)) {
			mdArr.forEach(row => {
				row.shift();
			});
			// Move pointer back
			--x;
		} else {
			break;
		}
	}
	// Trim cols, starting at right
	for (let x = mdArr[0].length - 1; x >= 0; x--) {
		const colVals = mdArr.map(row => row[x]);
		if (isEmpty(colVals)) {
			mdArr.forEach(row => {
				row.pop();
			});
		} else {
			break;
		}
	}

	return mdArr;
};

/**
 * @param {Array<Array<number>>} mdArr
 * @param {any} [padThing]
 */
export const padArr = (mdArr, padX, padY, padThing = 0) => {
	if (padX) {
		mdArr.forEach(row => {
			let iter = 0;
			while (iter < padX) {
				row.unshift(padThing);
				row.push(padThing);
				iter++;
			}
		});
	}

	if (padY) {
		let iter = 0;
		// Assume equal length rows
		const emptyArr = Array(mdArr[0].length).fill(padThing);
		while (iter < padY) {
			mdArr.unshift(emptyArr);
			mdArr.push(emptyArr);
			iter++;
		}
	}

	return mdArr;
};
