<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";
import { staticData } from './data.js'

const countryColor = {
  Australia: '#00008b',
  Canada: '#f00',
  China: '#ffde00',
  Cuba: '#002a8f',
  Finland: '#003580',
  France: '#ed2939',
  Germany: '#000',
  Iceland: '#003897',
  India: '#f93',
  Japan: '#bc002d',
  'North Korea': '#024fa2',
  'South Korea': '#626815',
  'New Zealand': '#00247d',
  Norway: '#ef2b2d',
  Poland: '#dc143c',
  Russia: '#d52b1e',
  Turkey: '#e30a17',
  'United Kingdom': '#00137d',
  'United States': '#b22234'
};

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

let option = {};
const updateFrequency = 2000
function getOption(data, startYear) {
  const { title = "", seriesData } = data;

  option = {
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
    // 图例(series内容需要配置name属性)
    legend: {
      top: "2%",
      right: "5%",
      icon: "rect", // 图例项的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
      itemWidth: 12, // 图例标记的图形宽度，默认25
      itemHeight: 12, // 图例标记的图形高度，默认14
      itemGap: 15, // 图例项之间的间隔，单位px，默认10，可取值：5、[5, 10]、[5, 10, 5, 10]
      // 图例文字的样式
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 14,
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
      bottom: "2%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    // 直角坐标系的 x 轴
    xAxis: {
      max: 'dataMax',
      axisLabel: {
        formatter: (val) => {
          return Math.round(val) + '';
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    // 直角坐标系的 y 轴
    yAxis: {
      type: "category",
      inverse: true,
      axisLabel: {
        show: true,
        fontSize: 14,
        formatter: (value) => {
          return value;
        }
      },
      animationDuration: 300,
      animationDurationUpdate: 300
    },
    dataset: {
      source: seriesData.data.filter((item) => {
        return item[4] === startYear;
      })
    },
    graphic: {
      elements: [
        {
          type: 'text',
          right: 160,
          bottom: 60,
          z: 100,
          style: {
            text: startYear,
            font: 'bolder 80px monospace',
            fill: 'rgba(100, 100, 100, 0.25)'
          },
        }
      ]
    },
    animationDuration: 0,
    animationDurationUpdate: updateFrequency,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
    series: [
      {
        type: "bar",
        barWidth: 12,
        realtimeSort: true,
        seriesLayoutBy: 'column',
        encode: {
          x: 0,
          y: 3
        },
        itemStyle: {
          color: (param) => {
            return countryColor[param.data[3]] || '#5470c6';
          }
        },
        label: {
          show: true,
          precision: 1,
          valueAnimation: true,
          position: 'right',
          fontFamily: 'monospace',
        },
      },
    ],
  };

  return option;
}

function updateOption(data, year) {
  const source = data.seriesData.data.filter((item) => {
    return item[4] === year;
  });
  option.series[0].data = source;
  option.graphic.elements[0].style.text = year;

  setOption(option);
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "测试数据",
        seriesData: {
          name: "测试数据1",
          data: staticData,
        },
      },
    };

    const data = res.data.seriesData.data;
    const startIndex = 1 // dataset数据的第一个元素是
    const yearsSet = new Set();
    data.forEach((item, index) => {
      if (index > 0) {
        yearsSet.add(item[4])
        item.color = chartColor[index % chartColor.length]
      }
    })
    const years = Array.from(yearsSet);
    const option = getOption(res.data, years[startIndex]);
    setOption(option);

    years.forEach((item, index) => {
      (function (i) {
        i > startIndex && setTimeout(() => {
          updateOption(res.data, years[i]);
        }, (i - startIndex) * updateFrequency);
      })(index);
    });

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
  height: 680px;
}
</style>
