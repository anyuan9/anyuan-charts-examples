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
  const { title, xAxisData, seriesData=[] } = data
  const max = seriesData.reduce((acc, cur) => {
    return Math.max(acc, Math.max(...cur.data));
  }, 0)

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
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "rgba(0, 0, 0, 0.6)",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: "rgba(255, 255, 255, 1)",
      },
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
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
      type: "category",
      data: xAxisData || [],
    },
    // 直角坐标系的 y 轴
    yAxis: {
      type: "value",
      // 坐标轴的分隔线
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      }
    },
    series: [
      {
        // 渐变的柱状图，作为象形柱状图的背景底色（如果不实现渐变背景，可去除此bar）
        type: 'bar',
        stack: '象形柱状图',
        barWidth: 16,
        z: 1,
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
                color: chartColor[0], // 0% 处的颜色
              },
              {
                offset: 1,
                color: chartColor[1], // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        tooltip: {
          show: false,
        },
        name: (seriesData?.length && seriesData[0].name) || [],
        data: (seriesData?.length && seriesData[0].data) || [],
      },
      {
        // 顶部白色方块
        type: 'bar',
        stack: '象形柱状图',
        barWidth: 20,
        barGap: '-200%',
        itemStyle: {
          color: 'rgba(255, 255, 255, 0.85)',
        },
        tooltip: {
          show: false,
        },
        // 这里按照数据最大值，自适应小方块的大小，调整 倍数可以调整小方块的大小
        data: new Array(xAxisData.length).fill(max * 0.02),
      },
      {
        type: 'pictorialBar',
        stack: '象形柱状图',
        symbol: 'rect',
        symbolMargin: 2,
        symbolSize: [16, 2],
        symbolClip: true, // 是否裁剪图形
        symbolRepeat: true,
        symbolPosition: 'start',
        itemStyle: {
          color: 'rgba(8, 25, 66, 1)', // 数据的间隔颜色，与背景色一致
        },
        label: {
          show: true,
          position: 'top',
          distance: 0,
          offset: [0, 0],
          color: '#fff',
          fontSize: 12,
          rich: {
            name: {
              color: chartColor[1],
              align: 'center',
              borderWidth: 0.5,
              padding: [5, 0],
            },
            icon: {
              fontSize: 8,
              color: '#fff',
              align: 'center',
              padding: [3, 0, 10, 0],
            },
          },
          formatter: params => {
            return `{name|${params.value}}\n{icon|▼}`
          },
        },
        data: (seriesData?.length && seriesData[0].data) || [],
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
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`,
        ),
        seriesData: [
          {
            name: "测试数据1",
            data: Array.from({ length: 24 }, (_, i) =>
              Math.floor(Math.random() * 500 + 100),
            ),
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
