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
    backgroundColor: "rgba(8, 25, 66, 1)",
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
    // 工具栏
    toolbox: {
      show: true
    },
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
    // 区域选择组件
    brush: {
      toolbox: ["rect", "polygon", "lineX", "lineY", "keep", "clear"], // 使用在 toolbox 中的按钮
      xAxisIndex: "all", // 指定哪些 xAxisIndex 可以被刷选，默认为 'all'; 可取值为：'all'，表示所有。number，如 0，表示这个 index 所对应的坐标系。Array，如 [0, 4, 2]，表示指定这些 index 所对应的坐标系。'none' 或 null 或 undefined，表示不指定。
      yAxisIndex: "all", // 指定哪些 yAxisIndex 可以被刷选，默认为 'all'; 可取值为：'all'，表示所有。number，如 0，表示这个 index 所对应的坐标系。Array，如 [0, 4, 2]，表示指定这些 index 所对应的坐标系。'none' 或 null 或 undefined，表示不指定。
      seriesIndex: "all", // 指定哪些系列可以刷选，默认为 'all'; 可取值为：'all': 所有 series；'Array': series index 列表;'number': 某个 series index
      geoIndex: "all", // 指定哪些 geo 可以被刷选，默认为 'all'; 可取值为：'all': 所有 geo；'Array': geo index 列表;'number': 某个 geo index
      brushType: "rect", // 刷选模式，可选值为：'rect'：矩形；'polygon'：多边形；'lineX'：X 轴上的线；'lineY'：Y 轴上的线；'keep'：保持已有刷选区域；'clear'：清空刷选区域
      brushMode: "single", // 刷选模式，可选值为：'single'：单选；'multiple'：多选
      brushStyle: {
        borderWidth: 1,
        color: "rgba(255, 255, 255, 0.2)",
        borderColor: "rgba(255, 255, 255, 0.5)"
      },
      removeOnClick: true, // 在 brush.brushMode 为 'single' 的情况下，是否支持『单击清除所有选框』。
      transformable: true, // 是否开启刷选区域缩放和平移
      throttleType: "debounce", // 刷选操作节流类型，可选值为：'debounce'：防抖；'fixRate'：固定频率
      throttleDelay: 300 // 刷选操作节流时间间隔，单位为毫秒
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
