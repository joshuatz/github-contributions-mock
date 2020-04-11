type SetGraphParams = React.Dispatch<
	React.SetStateAction<{
		points: number[][];
		colors: { [key: number]: string };
		margin?: number;
		animate?: boolean;
	}>
>;

type ColorValMap = Record<number, string>;

type ColorScales = 'rgba' | 'greyscale' | 'blackandwhite';
