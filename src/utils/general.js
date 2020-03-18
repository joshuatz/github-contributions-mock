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
