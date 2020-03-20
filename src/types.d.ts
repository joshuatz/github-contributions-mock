type SetGraphParams = Dispatch<
	SetStateAction<{
		points: number[][];
		colors: { [key: number]: string };
	}>
>;

type ColorValMap = Record<number, string>;

type ColorScales = 'rgba' | 'greyscale' | 'blackandwhite';
