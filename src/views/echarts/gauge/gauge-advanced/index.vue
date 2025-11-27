<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s",
    },
  },
});

function getOption(data) {
  const { title = "", range, seriesData } = data;

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
    // 图例(series内容需要配置name属性)
    legend: {
      icon: 'circle',
      left: 'center',
      bottom: '10%',
      itemGap: 5,
      width: 10,
      selectedMode: false,
      textStyle: {
        rich: {
          name: {
            padding: 5,
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.8)',
          },
          value: {
            width: 20,
            height: 25,
            fontSize: 14,
            align: 'center',
            lineHeight: 25,
            color: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 7,
            backgroundColor: chartColor[0],
          },
        },
      },
      formatter: name => {
        const value = seriesData.find(item => item.name === name)?.value || 0
        const html = (value + '')
          .padStart(6, '0')
          .split('')
          .map(item => {
            return '   {value|' + item + '}'
          })
        return '{name|' + name + '} ' + html.join('')
      },
      data: seriesData.map(item => item.name),
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    series: [
      {
        type: 'gauge',
        z: 2,
        min: range[0],
        max: range[1],
        center: ['50%', '60%'],
        radius: '80%',
        startAngle: 200, // 起始角度
        endAngle: -20, // 结束角度
        clockwise: true, // 是否顺时针
        splitNumber: 10, // 刻度的间隔数量
        // 当前进度(从 v5.0 开始支持)
        progress: {
          show: true,
          width: 6,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: chartColor[0] }, // 0% 处的颜色
                { offset: 1, color: chartColor[1] }, // 100% 处的颜色
              ],
              global: false,
            },
          },
        },
        // 仪表盘轴线
        axisLine: {
          lineStyle: {
            color: [[1, chartColor[1] + '4d']],
            width: 6,
            shadowColor: chartColor[0] + '80',
            shadowBlur: 6,
            shadowOffsetX: 0,
          },
        },
        // 刻度
        axisTick: {
          show: true,
          length: 4,
          splitNumber: 5,
          lineStyle: {
            width: 1,
            color: 'rgba(255, 255, 255, .3)', // 用颜色渐变函数不起作用
          },
        },
        // 刻度标签
        axisLabel: {
          show: true,
          distance: 15,
          fontSize: 12,
          color: 'rgba(255, 255, 255, .3)',
          formatter: '{value}次',
        },
        // 分隔线
        splitLine: {
          show: true,
          length: 12, // 刻度节点线长度
          lineStyle: {
            width: 2,
            color: 'rgba(255, 255, 255, .4)', // 用颜色渐变函数不起作用
          },
        },
        // 指针
        pointer: {
          show: true,
          length: '80%',
          radius: '20%',
          width: 3,
        },
        // 仪表盘指针样式
        itemStyle: {
          color: 'rgba(255, 255, 255, 0.85)',
        },
        // 表盘中指针的固定点
        anchor: {
          show: false,
          showAbove: false,
          size: 25,
          itemStyle: {
            borderWidth: 10,
          },
        },
        // 仪表盘标题
        title: {
          show: true,
          offsetCenter: [0, 24], // x, y，单位px
          color: 'rgba(255, 255, 255, .6)',
          fontSize: 20,
        },
        // 仪表盘详情，用于显示数据
        detail: {
          offsetCenter: [0, 60],
          padding: [0, 0, 0, 0],
          fontSize: 32,
          color: 'rgba(255, 255, 255, .85)',
          formatter: value => {
            return value
          },
        },
        tooltip: {
          show: false,
        },
        animationDuration: 2 * 1000,
        name: seriesData?.length && seriesData[0].name || '',
        data: seriesData,
      },
      {
        name: '外环装饰',
        type: 'gauge',
        min: range[0],
        max: range[1],
        center: ['50%', '60%'],
        radius: '85%',
        z: 4,
        splitNumber: 10,
        startAngle: 200,
        endAngle: -20,
        axisLine: {
          show: true,
          lineStyle: {
            color: [[1, chartColor[0]]],
            width: 2,
            opacity: 1,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        pointer: {
          show: false,
        },
        detail: {
          show: false,
        },
        data: [
          {
            value: range[1],
          },
        ],
      },
      {
        name: '内部阴影',
        type: 'gauge',
        center: ['50%', '60%'],
        radius: '80%',
        z: 4,
        splitNumber: 10,
        startAngle: 200,
        endAngle: -20,
        progress: {
          show: true,
          width: 80,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: 'rgba(255, 255, 255, 0.05)' }, // 0% 处的颜色
                { offset: 0.5, color: 'rgba(255, 255, 255, 0.1)' }, // 50% 处的颜色
                { offset: 1, color: 'rgba(255, 255, 255, 0.15)' }, // 100% 处的颜色
              ],
              global: false,
            },
          },
        },
        axisLine: {
          lineStyle: {
            color: [[1, 'rgba(255, 255, 255, .0)']],
            width: 80,
          },
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        itemStyle: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          show: false,
        },
        pointer: {
          show: false,
        },
        data: seriesData,
      },
      // 内圆
      {
        type: 'pie',
        radius: '35%',
        center: ['50%', '60%'],
        z: 1,
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(0, 0, 0, 0.8)',
              },
              {
                offset: 1,
                color: chartColor[0],
              },
            ],
            globalCoord: false, // 缺省为 false
          },
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
        },
        label: {
          show: false,
        },
        tooltip: {
          show: false,
        },
        emphasis: {
          scale: false,
        },
        animationType: 'scale',
        data: [100],
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
        range: [0, 100],
        seriesData: [
          {
            name: '测试数据',
            value: Math.floor(Math.random() * 80 + 10),
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
