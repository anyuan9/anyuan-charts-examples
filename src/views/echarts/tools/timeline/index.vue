<!--
 * @Description: 时间轴（timeline）组件是一个强大的工具，它允许用户在多个 ECharts 配置选项（options）之间进行切换和播放操作。
 *               这个组件特别适合展示非动态数据，即当坐标轴的数据已经确定时，可以通过时间轴来展示数据的变化。
 *               时间轴组件需要操作多个配置选项，包括 baseOption 和 options，其中 baseOption 包含所有默认设置，而 options 数组中的每一项都代表一个特定时间点的配置。
 *               当时间轴播放时，会将 options 数组中的相应配置与 baseOption 合并，形成最终的配置选项。
 * @Author: gonglianghui
 * @Date: 2025-06-16 08:50:19
 -->
<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

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
  const { title = "", time, xAxisData, seriesData } = data;

  return {
    // 基础配置
    baseOption: {
      // 背景颜色，默认无背景
      // backgroundColor: "rgba(8, 25, 66, 1)",
      // 调色盘颜色列表，依次循环取颜色作为series的颜色
      color: chartColor,
      // 标题
      title: {
        text: title || "",
        top: "5%",
        left: "2%",
      },
      // 时间轴（timeline）组件
      timeline: {
        axisType: "category", // 轴的类型。可选值为：'value'数值轴，适用于连续数据、'time'时间轴，适用于连续的时序数据，时间轴带有时间的格式化、'category'类目轴，适用于离散的类目数据
        currentIndex: 0, // 当前选中项是哪项，从0开始，默认0
        playInterval: 1000, // 播放的速度（跳动的间隔），单位毫秒（ms），默认2000
        autoPlay: true, // 是否自动播放，默认false
        // loop: false, // 是否循环播放，默认true
        // realtime: false, // 拖动圆点的时候，是否实时更新视图，默认true
        // controlPosition : 'left', // 『播放』按钮的位置，可选值为：'left'、'right'、'none'，默认'left'
        symbol: "circle", // timeline标记的图形，默认为'emptyCircle'
        symbolSize: 10, // timeline标记的大小，默认为10
        symbolRotate: 0, // timeline标记的旋转角度（而非弧度）。正值表示逆时针旋转，默认为0
        // 『控制按钮』的样式。『控制按钮』包括：『播放按钮』、『前进按钮』、『后退按钮』。
        controlStyle: {
          position: "left",
        },
        // 进度条中的线条，拐点，标签的样式。
        progress: {
          lineStyle: {},
          itemStyle: {},
          label: {},
        },
        // 轴线样式
        lineStyle: {
          color: "rgba(0, 0, 0, 0.2)", // timeline线的颜色
          width: 2, // timeline线的宽度，默认为2
        },
        // timeline 图形样式
        itemStyle: {
          borderColor: "rgba(255, 255, 255, 0.2)", // timeline图形的边框颜色
          borderWidth: 2, // timeline图形的边框宽度，默认为2
        },
        // 『当前项』（checkpoint）的图形样式
        checkpointStyle: {
          // borderColor: "rgba(255, 255, 255, 0.2)", // timeline图形的边框颜色
          // borderWidth: 2 // timeline图形的边框宽度，默认为2
        },
        // timeline 数据，可以覆盖 timeline 中的属性配置
        data: [
          "2021",
          "2022",
          {
            value: "2023",
            tooltip: {
              formatter: "{b} GDP达到一个高度",
            },
            symbol: "diamond",
            symbolSize: 16,
          },
          "2024",
          "2025",
          {
            value: "2026",
            tooltip: {
              formatter: (params) => {
                return params.name + "GDP达到又一个高度";
              },
            },
            symbol: "diamond",
            symbolSize: 18,
          },
        ],
        // 轴的文本标签
        label: {
          // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。
          // 方式1：使用字符串模板，模板变量为刻度默认标签 {value}
          // formatter: '{value} 年'
          // 方式2：使用函数模板，函数参数分别为刻度数值（类目），刻度的索引
          formatter: (value, index) => {
            return value + " 年";
          },
        },
      },
      // 提示框
      tooltip: {
        trigger: "axis",
      },
      // 直角坐标系内绘图网格
      grid: {
        top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
        left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
        right: "5%",
        bottom: "100",
        containLabel: true, // grid 区域是否包含坐标轴的刻度标签
      },
      // 直角坐标系的 x 轴
      xAxis: [
        {
          type: "category",
          data: xAxisData || [],
        },
      ],
      // 直角坐标系的 y 轴
      yAxis: {
        type: "value",
      },
      series: [
        {
          type: "bar",
          barWidth: 20,
          name: (seriesData?.length && seriesData[0].name) || "",
        },
        {
          type: "line",
          smooth: true, // 是否平滑曲线
          // 线条样式
          lineStyle: {
            width: 2,
          },
          name: (seriesData?.length && seriesData[1].name) || "",
        },
      ],
    },
    // 特定时间点的配置
    options: [
      // 第一个时间点的配置
      {
        title: { text: `${time[0]}${title}` },
        series: [
          { data: seriesData[0].data[0] },
          { data: seriesData[1].data[0] },
        ],
      },
      // 第二个时间点的配置
      {
        title: { text: `${time[1]}${title}` },
        series: [
          { data: seriesData[0].data[1] },
          { data: seriesData[1].data[1] },
        ],
      },
      // 第三个时间点的配置
      {
        title: { text: `${time[2]}${title}` },
        series: [
          { data: seriesData[0].data[2] },
          { data: seriesData[1].data[2] },
        ],
      },
      // 第四个时间点的配置
      {
        title: { text: `${time[3]}${title}` },
        series: [
          { data: seriesData[0].data[3] },
          { data: seriesData[1].data[3] },
        ],
      },
      // 第五个时间点的配置
      {
        title: { text: `${time[4]}${title}` },
        series: [
          { data: seriesData[0].data[4] },
          { data: seriesData[1].data[4] },
        ],
      },
      // 第六个时间点的配置
      {
        title: { text: `${time[5]}${title}` },
        series: [
          { data: seriesData[0].data[5] },
          { data: seriesData[1].data[5] },
        ],
      },
    ],
  };
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "测试数据",
        time: ["2021", "2022", "2023", "2024", "2025", "2026"],
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`,
        ),
        seriesData: [
          {
            name: "测试数据1",
            data: [
              Array.from({ length: 24 }, (_, i) =>
                Math.floor(Math.random() * 500 + 100),
              ),
              Array.from({ length: 24 }, (_, i) =>
                Math.floor(Math.random() * 500 + 100),
              ),
              Array.from({ length: 24 }, (_, i) =>
                Math.floor(Math.random() * 500 + 100),
              ),
              Array.from({ length: 24 }, (_, i) =>
                Math.floor(Math.random() * 500 + 100),
              ),
              Array.from({ length: 24 }, (_, i) =>
                Math.floor(Math.random() * 500 + 100),
              ),
              Array.from({ length: 24 }, (_, i) =>
                Math.floor(Math.random() * 500 + 100),
              ),
            ],
          },
          {
            name: "测试数据2",
            data: [
              Array.from({ length: 24 }, (_, i) =>
                Math.floor(Math.random() * 500 + 100),
              ),
              Array.from({ length: 24 }, (_, i) =>
                Math.floor(Math.random() * 500 + 100),
              ),
              Array.from({ length: 24 }, (_, i) =>
                Math.floor(Math.random() * 500 + 100),
              ),
              Array.from({ length: 24 }, (_, i) =>
                Math.floor(Math.random() * 500 + 100),
              ),
              Array.from({ length: 24 }, (_, i) =>
                Math.floor(Math.random() * 500 + 100),
              ),
              Array.from({ length: 24 }, (_, i) =>
                Math.floor(Math.random() * 500 + 100),
              ),
            ],
          },
        ],
      },
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
  height: 480px;
}
</style>
