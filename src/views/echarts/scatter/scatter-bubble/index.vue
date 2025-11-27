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

const maxXAxisVal = 50
const maxYAxisVal = 200
function getOption(data) {
  const { title = "", seriesData = [] } = data;

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
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderColor: "transparent",
      borderWidth: 1,
      padding: [12, 20],
      position: 'top',
      textStyle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 1)",
      },
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
      // 坐标轴的分隔线
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
    // 直角坐标系的 y 轴
    yAxis: {
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
        type: 'scatter',
        symbol: 'circle',
        symbolSize: (data) => {
          return Math.sqrt(data[2]) * 4;
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(120, 36, 50, 0.5)',
          shadowOffsetY: 5,
          color: {
            type: 'radial',
            x: 0.4,
            y: 0.3,
            r: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgb(251, 118, 123)'
              },
              {
                offset: 1,
                color: 'rgb(204, 46, 72)'
              }
            ],
            global: false, // 缺省为 false
          },
        },
        emphasis: {
          focus: 'series',
          label: {
            show: true,
            position: 'top',
            formatter: (param) => {
              return param.data[3];
            },
          }
        },
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || [],
      },
      {
        type: 'scatter',
        symbolSize: (data) => {
          return Math.sqrt(data[2]) * 4;
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(25, 100, 150, 0.5)',
          shadowOffsetY: 5,
          color: {
            type: 'radial',
            x: 0.4,
            y: 0.3,
            r: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgb(129, 227, 238)'
              },
              {
                offset: 1,
                color: 'rgb(25, 183, 207)'
              }
            ],
            global: false, // 缺省为 false
          },
        },
        // label: {
        //   show: true,
        //   position: 'right',
        //   formatter: '{b}：{c}', // {a}：系列名; {b}：数据名; {c}：数据值; {@xxx}：数据中名为 'xxx' 的维度的值；{@[n]}：数据中维度 n 的值
        // },
        emphasis: {
          focus: 'series',
          label: {
            show: true,
            position: 'top',
            formatter: (param) => {
              return param.data[3];
            },
          }
        },
        name: (seriesData?.length && seriesData[1].name) || "",
        data: (seriesData?.length && seriesData[1].data) || [],
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
        seriesData: [
          {
            name: '测试数据1',
            data: Array.from({ length: 20 }, (_, i) => {
              const xValue = Math.floor(Math.random() * maxXAxisVal)
              const yValue = Math.floor(Math.random() * maxYAxisVal)
              const symbolSize = Math.floor(Math.random() * 100)
              const groupName = '测试数据1'
              return [xValue, yValue, symbolSize, '散点a' + i, groupName]
            }),
          },
          {
            name: '测试数据2',
            data: Array.from({ length: 10 }, (_, i) => {
              const xValue = Math.floor(Math.random() * maxXAxisVal)
              const yValue = Math.floor(Math.random() * maxYAxisVal)
              const symbolSize = Math.floor(Math.random() * 100)
              const groupName = '测试数据2'
              return [xValue, yValue, symbolSize, '散点b' + i, groupName]
            }),
          },
        ]
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
