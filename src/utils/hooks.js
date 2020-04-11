import { useLayoutEffect, useEffect, useState } from 'react';
export const useWindowSize = () => {
	const [size, setSize] = useState([0, 0]);
	useLayoutEffect(() => {
		// Need to hold function reference so we can use it for cleanup
		const updateSize = () => {
			setSize([window.innerWidth, window.innerHeight]);
		};
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);
	return size;
};

export const useElemSize = (elementRef) => {
	const [size, setSize] = useState({ width: 0, height: 0 });

	// Use windowSize hook as trigger to re-evaluate
	const windowSize = useWindowSize();

	useEffect(() => {
		try {
			const elem = elementRef.current;
			/** @type {DOMRect} */
			const domRect = elem.getBoundingClientRect();
			setSize({
				width: domRect.width,
				height: domRect.height
			});
		} catch (e) {
			setSize({ width: 0, height: 0 });
		}
	}, [windowSize, elementRef]);

	return size;
};

export default {
	useWindowSize
};
