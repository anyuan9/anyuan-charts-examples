<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
  autoTooltipLoop: true, // 是否自动循环 tooltip，默认间隔时间1500ms
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
    backgroundColor: "rgba(8, 25, 66, 1)",
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
    // 工具栏
    toolbox: {
      show: true,
      right: "5%",
      top: "7%",
      feature: {
        // 保存为图片
        saveAsImage: {},
        // 动态类型切换
        magicType: {
          type: ["line", "bar", "stack"],
        },
      },
    },
    // 标题
    title: {
      text: title || "",
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 20,
      },
      top: "5%",
      left: "2%",
    },
    // 提示框
    tooltip: {
      trigger: "axis",
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderColor: 'rgba(0, 0, 0, 0.6)',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: '#ffffff',
      },
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    // 直角坐标系的 x 轴
    xAxis: {
      show: true,
      type: "category",
      data: xAxisData || [],
    },
    // 直角坐标系的 y 轴
    yAxis: {
      show: true,
      type: "value",
      // inverse: true, // 是否是反向坐标轴，水平方向时使用
      // 坐标轴的分隔线
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
    series: [
      {
        type: 'pictorialBar',
        barWidth: 10,
        barCategoryGap: '5%',
        symbol: 'path://d="M150 130 L130 50 L170 50 Z"', // 倒三角形
        // symbol: 'path://d="M70 90 L130 100 L130 80 Z"', // 水平方向的倒三角形
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: chartColors[0][0],
              },
              {
                offset: 1,
                color: chartColors[0][1],
              },
            ],
            global: false, //  缺省为  false
          },
        },
        emphasis: {
          itemStyle: {
            opacity: 1,
          },
        },
        data: seriesData.data || [],
      },
      {
        type: "pictorialBar",
        barWidth: 10,
        barCategoryGap: '5%',
        symbol: 'circle',
        symbolSize: 16,
        symbolOffset: [0, '-50%'],
        // symbolOffset: ['50%', 0], // 水平方向时使用
        symbolPosition: 'end',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: chartColors[1][0],
              },
              {
                offset: 1,
                color: chartColors[1][1],
              },
            ],
            global: false, //  缺省为  false
          },
        },
        label: {
          show: true,
          position: 'top',
          distance: 2,
          offset: [0, 0],
          padding: [4, 4, 2, 4],
          textStyle: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 12,
          },
        },
        data: seriesData.data || [],
      }
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
        xAxisData: Array.from(
          { length: 12 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`,
        ),
        seriesData: {
            name: "测试数据1",
            data: Array.from({ length: 12 }, (_, i) =>
              Math.floor(Math.random() * 500 + 100),
            ),
          },
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
