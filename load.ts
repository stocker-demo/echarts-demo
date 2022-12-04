import { reset } from "./fetch";

export const load = (datas: {
	category: string[];
	times: string[];
	series: number[][];
}) => {
	const series = reset(datas.series);
	const times = datas.times;
	const category = datas.category;

	const series2 = series.map((it) =>
		it.map((value, index) => {
			if (index < 5) return value;
			return value - it[index - 5];
		})
	);
	return {
		series: reset(series2),
		times,
		category,
	};
};
