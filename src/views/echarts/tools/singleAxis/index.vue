<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
  autoTooltipLoop: false, // 是否自动循环 tooltip，默认间隔时间1500ms
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s"
    }
  }
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
      text: title || "",
      top: "5%",
      left: "2%"
    },
    // 提示框
    tooltip: {
      show: true
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "5%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    // 单轴
    singleAxis: [
      {
        type: "category", // 坐标轴类型，可选值：'value' 数值轴，'category' 类目轴，'time' 时间轴，'log' 对数轴
        boundaryGap: false, // 坐标轴两边留白策略，true为留白，false为不留白
        left: "5%", // single组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
        // right: "5%", // single组件离容器右侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
        top: "5%", // single组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
        // bottom: "2%", // single组件离容器下侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
        width: "80%", // single组件的宽度，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
        height: "80%", // single组件的高度，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
        // min: "dataMin", // 坐标轴刻度最小值，可选值：'dataMin'、'dataMax'、'min'、'max'、数值
        // max: "dataMax", // 坐标轴刻度最大值，可选值：'dataMin'、'dataMax'、'min'、'max'、数值
        // minInterval : 1, // 坐标轴最小间隔，可选值：数值。只在数值轴或时间轴中（type: 'value' 或 'time'）有效
        // maxInterval : 1, // 坐标轴最大间隔，可选值：数值。只在数值轴或时间轴中（type: 'value' 或 'time'）有效
        // interval: 1, // 强制设置坐标轴分割间隔，可选值：数值。只在数值轴或时间轴中（type: 'value' 或 'time'）有效
        splitNumber: 12, // 坐标轴的分割段数，可选值：数值，默认为5。在类目轴中无效。
        // 坐标轴轴线
        axisLine: {
          show: true
        },
        // 坐标轴刻度
        axisTick: {
          show: true
        },
        // 坐标轴次刻度
        minorTick: {},
        // 坐标轴刻度标签
        axisLabel: {
          interval: 0,
          fontSize: 18
        },
        // 坐标轴在 grid 区域中的分隔线
        splitLine: {
          show: true
        },
        // 坐标轴在 grid 区域中的次分隔线
        minorSplitLine: {},
        // 坐标轴在 grid 区域中的分隔区域，默认不显示
        splitArea: {
          show: false
        },
        // 坐标轴指示器
        axisPointer: {
          show: false
        },
        nameGap: 20, // 坐标轴名称与轴线之间的距离，默认为15
        nameRotate: 0, // 坐标轴名字旋转，默认为0，不旋转
        nameLocation: "end", // 坐标轴名称显示位置，可选值：'start'、'middle'、'end'
        // 坐标轴名称的文字样式。
        nameTextStyle: {
          fontSize: 18
        },
        // 坐标轴名字的截断
        nameTruncate: {
          maxWidth: 80, // 截断文本的最大长度，超过此长度会被截断
          ellipsis: "..." // 超过最大长度时显示的文本，默认为...
        },
        name: (seriesData?.length && seriesData[0].name) || "", // 坐标轴名称，默认为空
        data: xAxisData
      }
    ],
    series: [
      {
        singleAxisIndex: 0,
        coordinateSystem: "singleAxis",
        type: "scatter",
        // 标记的大小，可选值：数值、数组、回调函数
        symbolSize: (val) => {
          return val[1] * 4;
        },
        data: (seriesData?.length && seriesData[0].data) || []
      }
    ]
  };
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "单轴散点图",
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`
        ), // ['00:00', '01:00']
        seriesData: [
          {
            name: "测试数据1",
            data: Array.from({ length: 24 }, (_, i) => [
              i,
              Math.floor(Math.random() * 9 + 1)
            ]) // [[0, 7],[1, 4]]
          },
          {
            name: "测试数据2",
            data: Array.from({ length: 24 }, (_, i) => [
              i,
              Math.floor(Math.random() * 9 + 1)
            ])
          }
        ]
      }
    };

    const option = getOption(res.data);
    setOption(option);
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
          color: "rgba(255, 255, 255, 0.6)"
        }
      }
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
  height: 150px;
}
</style>
