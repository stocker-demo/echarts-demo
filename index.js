var $jPS5E$echarts = require("echarts");
var $jPS5E$axios = require("axios");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}


const $0925161d3ecdda06$var$fetch = async (url)=>{
    const data = await (0, ($parcel$interopDefault($jPS5E$axios))).get(url);
    const json = data.data;
    return json;
};
// https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=500&po=1&np=1&fields=f12%2Cf13%2Cf14%2Cf62&fid=f62&fs=m%3A90%2Bt%3A2&ut=b2884a393a59ad64002292a3e90d46a5
const $0925161d3ecdda06$var$list = `https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=500&po=1&np=1&fields=f12%2Cf13%2Cf14%2Cf62&fid=f62&fs=m%3A90%2Bt%3A2&ut=b2884a393a59ad64002292a3e90d46a5`;
// fetch<List.RootObject>(list).then(data => console.log(data.data.diff))
const $0925161d3ecdda06$var$codeList = async (url)=>{
    const list = await $0925161d3ecdda06$var$fetch(url);
    const codes = list.data.diff.map((item)=>({
            code: `${item.f13}.${item.f12}`,
            name: item.f14
        }));
    return codes;
};
// codeList(list).then(console.log)
//https://push2.eastmoney.com/api/qt/stock/fflow/kline/get?lmt=0&klt=1&fields1=f1%2Cf2%2Cf3%2Cf7&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61%2Cf62%2Cf63%2Cf64%2Cf65&ut=b2884a393a59ad64002292a3e90d46a5&secid=90.BK1042
const $0925161d3ecdda06$var$flow = (code)=>`https://push2.eastmoney.com/api/qt/stock/fflow/kline/get?lmt=0&klt=1&fields1=f1%2Cf2%2Cf3%2Cf7&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61%2Cf62%2Cf63%2Cf64%2Cf65&ut=b2884a393a59ad64002292a3e90d46a5&secid=${code}`;
const $0925161d3ecdda06$var$deal = (data)=>data.data.klines.map((item)=>{
        const it = item.split(",");
        const time = it[0];
        const price = Number(it[1]);
        return [
            time,
            price
        ];
    });
const $0925161d3ecdda06$var$flowData = (code)=>$0925161d3ecdda06$var$fetch($0925161d3ecdda06$var$flow(code)).then($0925161d3ecdda06$var$deal);
// flowData("90.BK1042").then(console.log);
// codeList(list).then((codes) =>codes.map(flowData))
const $0925161d3ecdda06$var$dealFlow = async ()=>{
    const codes = await $0925161d3ecdda06$var$codeList($0925161d3ecdda06$var$list);
    const data = await Promise.all(codes.map(async (code)=>{
        const data = await $0925161d3ecdda06$var$flowData(code.code);
        return {
            code: code,
            data: data
        };
    }));
    return data;
};
const $0925161d3ecdda06$export$e772c8ff12451969 = async (time)=>{
    return new Promise((resolve)=>{
        setTimeout(()=>{
            console.log("sleep!");
            resolve(null);
        }, time);
    });
};
const $0925161d3ecdda06$export$aad8462122ac592b = (data)=>{
    if (data[0].length !== data[1].length || data[0].length < 1) return [];
    return data[0].map(function(_, i) {
        return data.map(function(row) {
            return row[i];
        });
    });
};
const $0925161d3ecdda06$export$d3ff2bad426dacca = async ()=>{
    const data = await $0925161d3ecdda06$var$dealFlow();
    const category = data.map((it)=>it.code.name);
    const series = $0925161d3ecdda06$export$aad8462122ac592b(data.map((it)=>it.data.map((item)=>item[1])));
    const times = data.map((it)=>it.data.map((item)=>item[0]))[0];
    return {
        category: category,
        times: times,
        series: series
    };
};



const $236f0d32e9a1f703$export$11e63f7b0f3d9900 = (datas)=>{
    const series = (0, $0925161d3ecdda06$export$aad8462122ac592b)(datas.series);
    const times = datas.times;
    const category = datas.category;
    const series2 = series.map((it)=>it.map((value, index)=>{
            if (index < 5) return value;
            return value - it[index - 5];
        }));
    return {
        series: (0, $0925161d3ecdda06$export$aad8462122ac592b)(series2),
        times: times,
        category: category
    };
};


var $80bd448eb6ea085b$var$chartDom = document.getElementById("main");
var $80bd448eb6ea085b$var$chartDom2 = document.getElementById("main2");
var $80bd448eb6ea085b$var$time = document.getElementById("time");
var $80bd448eb6ea085b$var$myChart = $jPS5E$echarts.init($80bd448eb6ea085b$var$chartDom);
var $80bd448eb6ea085b$var$myChart2 = $jPS5E$echarts.init($80bd448eb6ea085b$var$chartDom2);
var $80bd448eb6ea085b$var$option;
async function $80bd448eb6ea085b$var$run(datas) {
    let { category: category , times: times , series: series  } = datas;
    let data = [];
    $80bd448eb6ea085b$var$option = {
        xAxis: {
            max: "dataMax"
        },
        yAxis: {
            type: "category",
            data: category,
            inverse: true,
            animationDuration: 300,
            animationDurationUpdate: 300,
            max: 20
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
                    valueAnimation: true
                }
            }
        ],
        legend: {
            show: true
        },
        animationDuration: 2000,
        animationDurationUpdate: 2000,
        animationEasing: "linear",
        animationEasingUpdate: "linear"
    };
    $80bd448eb6ea085b$var$option && $80bd448eb6ea085b$var$myChart.setOption($80bd448eb6ea085b$var$option);
    for(let i = 0; i < series.length; i++){
        const data1 = series[i];
        console.log("set new data");
        $80bd448eb6ea085b$var$myChart.setOption({
            series: [
                {
                    type: "bar",
                    data: data1
                }
            ]
        });
        $80bd448eb6ea085b$var$time.innerHTML = times[i];
        await (0, $0925161d3ecdda06$export$e772c8ff12451969)(2000);
    }
}
async function $80bd448eb6ea085b$var$run2(datas) {
    let { category: category , times: times , series: series  } = datas;
    let data = [];
    $80bd448eb6ea085b$var$option = {
        xAxis: {
            max: "dataMax"
        },
        yAxis: {
            type: "category",
            data: category,
            inverse: true,
            animationDuration: 300,
            animationDurationUpdate: 300,
            max: 20
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
                    valueAnimation: true
                }
            }
        ],
        legend: {
            show: true
        },
        animationDuration: 2000,
        animationDurationUpdate: 2000,
        animationEasing: "linear",
        animationEasingUpdate: "linear"
    };
    $80bd448eb6ea085b$var$option && $80bd448eb6ea085b$var$myChart2.setOption($80bd448eb6ea085b$var$option);
    for(let i = 0; i < series.length; i++){
        const data1 = series[i];
        console.log("set new data");
        $80bd448eb6ea085b$var$myChart2.setOption({
            series: [
                {
                    type: "bar",
                    data: data1
                }
            ]
        });
        await (0, $0925161d3ecdda06$export$e772c8ff12451969)(2000);
    }
}
async function $80bd448eb6ea085b$var$main() {
    let datas = await (0, $0925161d3ecdda06$export$d3ff2bad426dacca)();
    $80bd448eb6ea085b$var$run(datas);
    $80bd448eb6ea085b$var$run2((0, $236f0d32e9a1f703$export$11e63f7b0f3d9900)(datas));
}
$80bd448eb6ea085b$var$main();


//# sourceMappingURL=index.js.map
