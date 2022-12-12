import * as echarts from "echarts";
import { dealData, sleep } from "./fetch";
import { load } from "./load";

type EChartsOption = echarts.EChartsOption;

var chartDom = document.getElementById("main")!;
var chartDom2 = document.getElementById("main2")!;
var time = document.getElementById("time")!;
var myChart = echarts.init(chartDom);
var myChart2 = echarts.init(chartDom2);
var option: EChartsOption;

const animationDuration = 2000;

async function run(datas:{
    category: string[];
    times: string[];
    series: number[][];
}) {
    let {category,times,series} = datas;
	let data: number[] = [];
	option = {
		xAxis: {
			max: "dataMax",
		},
		yAxis: {
			type: "category",
			data: category,
			inverse: true,
			animationDuration: 300,
			animationDurationUpdate: 300,
			max: 20, // only the largest 3 bars will be displayed
		},
		series: [
			{
				realtimeSort: true,
				name: "对比",
				type: "bar",
				data: data,
				label: {
					show: true,
					position: "right",
					valueAnimation: true,
				},
			},
		],
		legend: {
			show: true,
		},
		animationDuration: animationDuration,
		animationDurationUpdate: animationDuration,
		animationEasing: "linear",
		animationEasingUpdate: "linear",
	};

	option && myChart.setOption(option);

	for (let i = 0; i < series.length; i++) {
		const data = series[i];
		console.log("set new data");
		myChart.setOption<echarts.EChartsOption>({
			series: [
				{
					type: "bar",
					data,
				},
			],
		});
		time.innerHTML = times[i];
		await sleep(animationDuration);
		await isStop();
	}
}

async function run2(datas:{
    category: string[];
    times: string[];
    series: number[][];
}) {
    let {category,times,series} = datas;
	let data: number[] = [];
	option = {
		xAxis: {
			max: "dataMax",
		},
		yAxis: {
			type: "category",
			data: category,
			inverse: true,
			animationDuration: 300,
			animationDurationUpdate: 300,
			max: 20, // only the largest 3 bars will be displayed
		},
		series: [
			{
				realtimeSort: true,
				name: "五分钟内排名",
				type: "bar",
				data: data,
				label: {
					show: true,
					position: "right",
					valueAnimation: true,
				},
			},
		],
		legend: {
			show: true,
		},
		animationDuration: animationDuration,
		animationDurationUpdate: animationDuration,
		animationEasing: "linear",
		animationEasingUpdate: "linear",
	};

	option && myChart2.setOption(option);

	for (let i = 0; i < series.length; i++) {
		const data = series[i];
		console.log("set new data");
		myChart2.setOption<echarts.EChartsOption>({
			series: [
				{
					type: "bar",
					data,
				},
			],
		});
		await sleep(animationDuration);
		await isStop();
	}
}

async function main() {
    let datas = await dealData();
    run(datas);
    run2(load(datas));
}

let stop = false;
let stopCallback:Function[] = [];
const stopFn = ()=>{
	stop = !stop;
	if (!stop) {
		stopCallback.forEach((callback) => {
			callback(true);
		});
		stopCallback = [];
	}
}
document.getElementById("stop")!.addEventListener("click",stopFn);
document.onkeydown=function(event){
	console.log(event.code);
	if(event.code === "Space"){
		stopFn();
	}
}
async function isStop() {
	return new Promise((resolve) => {
		if(!stop){
			resolve(true);
		}else{
			stopCallback.push(resolve);
		}
	});
}

main();
