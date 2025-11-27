<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";
import 'echarts-gl';
// https://www.makeapie.cn/echarts_content/x5SoR94Y75.html
// https://www.makeapie.cn/echarts_content/xSJUxZ-c6x.html

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
  const { title = "", xAxisData = [], yAxisData = [], seriesData } = data;

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
    tooltip: {
      trigger: 'axis'
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    xAxis3D: {
      type: 'category',
      // 坐标轴的轴线
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      // 坐标轴的刻度
      axisTick: {
        show: true,
        length: 1, // 坐标轴刻度的长度，默认5
        inside: false, // 刻度标签是否朝内，默认false(朝外)
        alignWithLabel: true, // 刻度与标签对齐
        lineStyle: {
          fontSize: 12,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.4)',
        },
      },
      // 坐标轴的刻度标签
      axisLabel: {
        fontSize: 12,
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.4)',
      },
      // 坐标轴的分隔线
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.4)',
        },
      },
      data: xAxisData
    },
    yAxis3D: {
      type: 'category',
      // 坐标轴的轴线
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      // 坐标轴的刻度
      axisTick: {
        show: true,
        length: 1, // 坐标轴刻度的长度，默认5
        inside: false, // 刻度标签是否朝内，默认false(朝外)
        alignWithLabel: true, // 刻度与标签对齐
        lineStyle: {
          fontSize: 12,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.4)',
        },
      },
      // 坐标轴的刻度标签
      axisLabel: {
        fontSize: 12,
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.4)',
      },
      // 坐标轴的分隔线
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.4)',
        },
      },
      inverse: true, // 重要属性，倒序
      data: yAxisData
    },
    zAxis3D: {
      type: 'value',
      splitNumber: 5, // 坐标轴的分割段数，默认值：5。需要注意的是这个分割段数只是个预估值，最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整。
      // 坐标轴的轴线
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      // 坐标轴的刻度
      axisTick: {
        show: false,
      },
      // 坐标轴的刻度标签
      axisLabel: {
        show: true,
        color: 'rgba(255, 255, 255, 0.4)',
      },
      // 坐标轴的分隔线
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.4)',
        },
      },
    },
    grid3D: {
      boxWidth: 200,
      boxDepth: 80,
      viewControl: {},
    },
    series: barSeriesInit(seriesData.data, 100, '#FFF', '#33FF00'),
  };
}
function barSeriesInit(barData, step, color0, color1) {
  const ret = [];
  const startR = color0.length === 7 ? parseInt(color0.substr(1, 2), 16) : parseInt(color0.substr(1, 1) + color0.substr(1, 1), 16);
  const startG = color0.length === 7 ? parseInt(color0.substr(3, 2), 16) : parseInt(color0.substr(2, 1) + color0.substr(2, 1), 16);
  const startB = color0.length === 7 ? parseInt(color0.substr(3, 2), 16) : parseInt(color0.substr(2, 1) + color0.substr(2, 1), 16);
  const endR = color1.length === 7 ? parseInt(color1.substr(1, 2), 16) : parseInt(color1.substr(1, 1) + color1.substr(1, 1), 16);
  const endG = color1.length === 7 ? parseInt(color1.substr(3, 2), 16) : parseInt(color1.substr(2, 1) + color1.substr(2, 1), 16);
  const endB = color1.length === 7 ? parseInt(color1.substr(3, 2), 16) : parseInt(color1.substr(2, 1) + color1.substr(2, 1), 16);
  const distanceR = endR - startR;
  const distanceG = endG - startG;
  const distanceB = endB - startB;

  const stepData = barData.map(function (item) {
    return {
      value: [item[1], item[0], item[2] / step],
    };
  });

  for (var i = 0; i <= step; i++) {
    ret.push({
      type: 'bar3D',
      data: stepData,
      stack: 'stack',
      color: '#' + Math.round(startR + i * distanceR / step).toString(16) + Math.round(startG + i * distanceG / step).toString(16) + Math.round(startB + i * distanceG / step).toString(16),

      label: {
        textStyle: {
          fontSize: 16,
          borderWidth: 1
        }
      },
      silent: true,
      shading: 'lambert',
    });
  }
  return ret;
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const xAxisData = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
    const yAxisData = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const res = {
      code: "0",
      data: {
        title: "测试数据",
        xAxisData: xAxisData,
        yAxisData: yAxisData,
        seriesData: {
          name: "测试数据1",
          data: yAxisData.reduce((acc, item, index) => {
            xAxisData.forEach((_item, _index) => {
              acc.push([index, _index, Math.random() > 0.7 ? Math.floor(Math.random() * 100) : 0]); //  [y, x, value]
            })
            return acc;
          }, [])
        }
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
