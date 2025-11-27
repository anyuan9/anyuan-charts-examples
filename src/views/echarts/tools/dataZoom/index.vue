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
  const dataZoomEnd
    = xAxisData.length > 12 ? Math.floor((12 / xAxisData.length) * 100) : 100;

  return {
    // 背景颜色，默认无背景
    backgroundColor: "rgba(8, 25, 66, 1)",
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
    // 标题
    title: {
      text: title || "",
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 20
      },
      top: "5%",
      left: "2%"
    },
    // 提示框
    tooltip: {
      trigger: "axis"
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    // 直角坐标系的 x 轴
    xAxis: [
      {
        type: "category",
        data: xAxisData || []
      }
    ],
    // 直角坐标系的 y 轴
    yAxis: {
      type: "value"
    },
    // 数据区域缩放组件
    dataZoom: [
      {
        // 内部的数据缩放，默认控制x轴
        type: "inside",
        start: 0, // 数据窗口范围的起始百分比。范围是：0 ~ 100。表示 0% ~ 100%
        end: dataZoomEnd
        // minSpan: 10, // 用于限制窗口大小的最小值（百分比值），取值范围是 0 ~ 100
        // maxSpan: 50,
        // xAxisIndex: [0], // 设置 dataZoom 组件控制的 x轴，一般不用设置
        // yAxisIndex: [0], // 设置 dataZoom 组件控制的 y轴，一般不用设置；如果在y轴纵向排列，需要控制y轴时使用；
      },
      {
        // 底部的一根线，固定不变，用作背景
        type: "slider",
        start: 0, // 数据窗口范围的起始百分比。范围是：0 ~ 100。表示 0% ~ 100%
        end: dataZoomEnd,
        height: 1, // dataZoom-slider 组件的高度。水平布局默认 30，竖直布局默认自适应
        bottom: 6, // dataZoom-slider组件离容器下侧的距离。可取值 '20%' 20
        fillerColor: "transparent",
        borderColor: chartColor[0],
        handleSize: 0, // 控制手柄的尺寸，默认跟 dataZoom 宽度相同。
        brushSelect: false // 是否开启刷选功能。开启后可在滑块顶部拖动
      },
      {
        // 底部的滑块，默认控制x轴
        type: "slider",
        start: 0,
        end: dataZoomEnd,
        height: 10, // dataZoom-slider 组件的高度。水平布局默认 30，竖直布局默认自适应
        bottom: 0, // dataZoom-slider组件离容器下侧的距离。可取值 '20%' 20
        backgroundColor: "transparent", // 如果要开启showDataShadow，建议chartColor[0] + '4d',
        fillerColor: chartColor[0], // 如果要开启showDataShadow，建议chartColor[0] + '4d',
        borderColor: "transparent",
        showDataShadow: false, // 是否在 dataZoom-silder 组件中显示数据阴影
        // 数据阴影的样式
        dataBackground: {
          // 阴影的线条样式
          lineStyle: {
            color: "rgba(255, 255, 255, 1)"
          },
          // 阴影的填充样式
          areaStyle: {
            color: "rgba(255, 255, 255, 1)"
          }
        },
        // 选中部分数据阴影的样式，从 v5.0.0 开始支持
        selectedDataBackground: {
          lineStyle: {
            color: "#845cff"
          },
          areaStyle: {
            color: "#845cff"
          }
        },
        // 文字样式
        textStyle: {
          color: "rgba(255, 255, 255, 0.6)"
        },
        // 两侧缩放手柄的 icon 形状
        handleIcon:
          "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
        handleSize: "110%", // 控制手柄的尺寸, 例如 '110%' 20
        // 两侧缩放手柄的样式
        handleStyle: {
          color: "rgba(255, 255, 255, 0.6)"
        },
        brushSelect: false // 是否开启刷选功能。开启后可在滑块顶部拖动
      }
    ],
    series: [
      {
        type: "bar",
        barWidth: 20,
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || []
      },
      {
        type: "line",
        smooth: true, // 是否平滑曲线
        // 线条样式
        lineStyle: {
          width: 2
        },
        name: (seriesData?.length && seriesData[1].name) || "",
        data: (seriesData?.length && seriesData[1].data) || []
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
        title: "测试数据",
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`
        ),
        seriesData: [
          {
            name: "测试数据1",
            data: Array.from({ length: 24 }, (_, i) =>
              Math.floor(Math.random() * 500 + 100))
          },
          {
            name: "测试数据2",
            data: Array.from({ length: 24 }, (_, i) =>
              Math.floor(Math.random() * 500 + 100))
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
  height: 480px;
}
</style>
