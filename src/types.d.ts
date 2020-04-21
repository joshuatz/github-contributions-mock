type SetGraphParams = React.Dispatch<React.SetStateAction<ContribGraphProps>>;

interface ContribGraphProps {
	points: number[][];
	colors: ColorValMap;
	emptyVal?: number;
	margin?: number;
	animate?: boolean;
	scrollDirection?: 'ltr' | 'rtl';
	scrollDelayMs?: number;
}

type ColorValMap = Record<number, string>;

type ColorScales = 'rgba' | 'greyscale' | 'blackandwhite';
