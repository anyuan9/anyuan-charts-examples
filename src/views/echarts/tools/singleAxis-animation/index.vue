<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";
import { Bottom } from "@element-plus/icons-vue";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
  autoTooltipLoop: false, // 是否自动循环 tooltip，默认间隔时间1500ms
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s",
    },
  },
});

function getOption(data) {
  const { title = "", xAxisData, seriesData } = data;

  return {
    // 背景颜色，默认无背景
    // backgroundColor: "rgba(8, 25, 66, 1)",
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
    // 标题
    title: {
      text: "",
      top: "5%",
      left: "2%",
    },
    // 提示框
    tooltip: {
      show: true,
      formatter: (params) => {
        const [current, name, pre, next] = params.value;
        return (
          "车牌号: " +
          name +
          "<br/>" +
          "距离上一站: " +
          pre +
          "<br/>" +
          "距离下一站: " +
          next +
          "<br/>"
        );
      },
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "5%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    // 单轴
    singleAxis: [
      {
        type: "value",
        top: "80",
        height: "20",
        interval: 1,
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          margin: 20,
          fontSize: 14,
          formatter: (value, index) => {
            return value + 1;
          },
        },
        min: 0,
        max: xAxisData.length - 1,
      },
      {
        type: "category",
        boundaryGap: false,
        top: "120",
        height: "20",
        interval: 1,
        splitLine: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          fontSize: 18,
          formatter: (value, index) => {
            return value ? value.split("").join("\n") : ""; //竖排文字
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: xAxisData,
      },
    ],
    series: [
      {
        singleAxisIndex: 0,
        coordinateSystem: "singleAxis",
        type: "scatter",
        symbol:
          "path://M1024 476.279467c0 0 0 33.4848 0 41.591467 0 72.362667 0 136.6528 0 136.6528 0 15.479467-12.100267 28.040533-27.016533 28.040533l-41.284267 0c0-56.610133-45.8752-102.5024-102.4512-102.5024s-102.4512 45.8752-102.4512 102.5024L290.304 682.564267c-0.017067-56.610133-45.8752-102.5024-102.468267-102.5024-56.558933 0-102.434133 45.8752-102.4512 102.5024L27.0336 682.564267c-14.916267 0-27.016533-12.544-27.016533-28.040533L0.017067 318.173867C0.017067 290.423467 17.988267 273.066667 44.100267 273.066667c0 0 811.3152 0 844.032 0s98.4576 43.281067 124.125867 101.870933C1025.655467 406.289067 1024 476.279467 1024 476.279467zM170.786133 324.317867 78.574933 324.317867c-15.086933 0-27.323733 12.219733-27.323733 27.306667l0 81.834667c0 15.086933 12.2368 27.2896 27.323733 27.2896l92.2112 0L170.786133 324.317867zM324.471467 324.317867l-119.534933 0 0 136.413867 119.534933 0L324.471467 324.317867zM477.610667 324.317867l-119.005867 0 0 136.413867 119.005867 0L477.610667 324.317867zM631.210667 324.317867l-119.005867 0 0 136.413867 119.005867 0L631.210667 324.317867zM784.896 324.317867l-119.534933 0 0 136.413867 119.534933 0L784.896 324.317867zM784.8448 524.919467c0-7.0144-7.645867-12.6976-17.083733-12.6976s-17.066667 5.6832-17.066667 12.6976l0 25.361067c0 7.0144 7.6288 12.6976 17.066667 12.6976s17.083733-5.6832 17.083733-12.6976L784.8448 524.919467zM966.024533 404.155733c-11.008-46.728533-71.3728-79.837867-88.1152-79.837867-41.0112 0-58.845867 0-58.845867 0l0 136.413867L971.741867 460.8C971.741867 460.8 974.848 441.719467 966.024533 404.155733zM187.835733 614.2464c37.717333 0 68.3008 30.600533 68.3008 68.352 0 37.7344-30.583467 68.334933-68.3008 68.334933-37.7344 0-68.3008-30.600533-68.3008-68.334933C119.534933 644.846933 150.101333 614.2464 187.835733 614.2464zM853.265067 614.2464c37.717333 0 68.3008 30.600533 68.3008 68.352 0 37.7344-30.583467 68.334933-68.3008 68.334933-37.7344 0-68.317867-30.600533-68.317867-68.334933C784.9472 644.846933 815.530667 614.2464 853.265067 614.2464z",
        symbolSize: [40, 20],
        symbolOffset: [0, "-50%"],
        data: (seriesData?.length && seriesData[0].data) || [],
      },
      {
        singleAxisIndex: 1,
        coordinateSystem: "singleAxis",
        type: "scatter",
        symbolSize: 0,
        data: (seriesData?.length && seriesData[1].data) || [],
      },
    ],
  };
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const stationList = [
      "火车站",
      "汽车站",
      "中医院",
      "仁寿寺",
      "祖庙A站",
      "环球国际广场",
      "海关",
      "科技学院",
      "弼唐",
      "茶亭",
      "石湾客运站",
      "中国陶瓷城",
      "石湾公园",
      "陶都",
      "柏林艺术馆",
      "美术陶瓷厂",
      "华榕宫",
      "沙岗",
      "潭清里",
      "家博城南门",
      "澜石大桥西",
      "家博城",
      "澜石一路东",
      "银苑市场",
      "澜石中学",
      "省纺院",
      "石头村",
    ];
    const length = stationList.length;

    const res = {
      code: "0",
      data: {
        title: "单轴散点图",
        xAxisData: stationList,
        seriesData: [
          {
            name: "测试数据1",
            data: Array.from({ length: 2 }, (_, i) => {
              const current = Math.random() * length * 0.2;
              const name = "京ABCDE" + i;
              const pre = (Math.random() * 300).toFixed(2) + "米";
              const next = (Math.random() * 300).toFixed(2) + "米";
              return [current, name, pre, next];
            }),
          },
          {
            name: "测试数据2",
            data: Array.from({ length: length }, (_, i) => [i]), // [[0],[1]]
          },
        ],
      },
    };

    const option = getOption(res.data);
    setOption(option);

    const dataArray = res.data.seriesData[0].data;
    setInterval(() => {
      dataArray.forEach((item) => {
        const [current, name, pre, next] = item;
        item[0] = +current > length - 1 ? 0 : +current + Math.random();
        item[2] = (Math.random() * 300).toFixed(2) + "米";
        item[3] = (Math.random() * 300).toFixed(2) + "米";
      });
      const option = getOption(res.data);
      setOption(option);
    }, 500);
  } catch (err) {
    console.error(err);
    setOption({
      title: {
        show: true,
        text: "获取数据失败",
        left: "center",
        top: "center",
        textStyle: {
          fontSize: 16,
          color: "rgba(255, 255, 255, 0.6)",
        },
      },
    });
  }
}

onMounted(() => {
  nextTick(() => {
    showLoading();
    getData();
  });
});
</script>

<template>
  <div class="chart-container">
    <div ref="chartRef" :style="{ width: '100%', height: '100%' }" />
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 350px;
}
</style>
