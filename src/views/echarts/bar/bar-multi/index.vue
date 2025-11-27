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
    title: {
      text: title || "",
      subtext: "",
      top: "2%",
      left: "center",
      textStyle: {
        align: "center",
        color: "#fff",
        fontSize: 20,
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
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "rgba(0, 0, 0, 0.4)",
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
    xAxis: [
      {
        type: "category",
        offset: 5,
        // 坐标轴的轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)",
          },
        },
        // 坐标轴的刻度
        axisTick: {
          show: true,
          interval: 0, // 刻度显示间隔，此时显示所有刻度
          length: 4, // 坐标轴刻度的长度，默认5
          inside: true, // 刻度标签是否朝内，默认false(朝外)
          alignWithLabel: true, // 刻度与标签对齐
          lineStyle: {
            fontSize: 12,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.4)",
          },
        },
        // 坐标轴的刻度标签
        axisLabel: {
          interval: 0,
          inside: false, // 刻度标签是否朝内，默认false(朝外)
          fontSize: 12,
          fontWeight: 400,
          color: "rgba(255, 255, 255, 0.4)",
        },
        // 坐标轴的分隔线
        splitLine: {
          show: false,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        data: xAxisData || [],
      },
    ],
    yAxis: [
      {
        type: "value",
        // 坐标轴的轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)",
          },
        },
        // 坐标轴的刻度
        axisTick: {
          show: false,
        },
        // 坐标轴的刻度标签
        axisLabel: {
          show: true,
          color: "rgba(255, 255, 255, 0.4)",
        },
        // 坐标轴的分隔线
        splitLine: {
          show: false,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    ],
    // 全局动画配置
    animation: true,
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
      return idx * 5;
    },
    series: [
      {
        type: "bar",
        barWidth: 16,
        barMaxWidth: 16,
        itemStyle: {
          color: {
            type: "linear",
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
            global: false, // 缺省为 false
          },
          borderRadius: [30, 30, 30, 30],
          shadowColor: chartColors[0][0],
          shadowBlur: 4,
        },
        label: {
          show: true,
          width: 60,
          height: 20,
          lineHeight: 20,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          borderRadius: 200,
          position: [-22, -50], // 水平方向的偏移量=(barWidth - width) / 2
          distance: 1,
          formatter: "{icon|●}{value|{c}}\n{line|}",
          rich: {
            icon: {
              color: chartColors[0][0],
              align: "center",
              padding: [0, 4, 0, 0],
            },
            value: {
              color: "#fff",
              align: "center",
            },
            line: {
              width: 1,
              height: 30,
              borderWidth: 1,
              borderColor: chartColors[0][0],
              align: "center",
            },
          },
        },
        // 设置动画延迟
        animationDelay: (idx) => {
          // 每个柱子延迟100ms
          return idx * 20;
        },
        name: seriesData?.length ? seriesData[0].name : "",
        data: seriesData?.length ? seriesData[0].data : [],
      },
      {
        type: "bar",
        barWidth: "15%",
        barMaxWidth: 20,
        itemStyle: {
          color: {
            type: "linear",
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
            global: false, // 缺省为 false
          },
          borderRadius: 11,
        },
        animationDelay: (idx) => {
          return idx * 20 + 100;
        },
        name: seriesData?.length ? seriesData[1].name : "",
        data: seriesData?.length ? seriesData[1].data : [],
      },
      {
        type: "bar",
        barWidth: "15%",
        barMaxWidth: 20,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: chartColors[2][0],
              },
              {
                offset: 1,
                color: chartColors[2][0],
              },
            ],
            global: false, // 缺省为 false
          },
          borderRadius: 11,
        },
        label: {
          show: true,
          position: "top",
          padding: 10,
          color: chartColors[2][0],
          fontSize: 14,
          formatter: "{c}",
        },
        animationDelay: (idx) => {
          return idx * 20 + 200;
        },
        name: seriesData?.length ? seriesData[2].name : "",
        data: seriesData?.length ? seriesData[2].data : [],
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
          { length: 6 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`,
        ),
        seriesData: [
          {
            name: "测试数据",
            data: Array.from({ length: 6 }, () =>
              Math.floor(Math.random() * 200 + 50),
            ),
          },
          {
            name: "测试数据2",
            data: Array.from({ length: 6 }, () =>
              Math.floor(Math.random() * 200 + 50),
            ),
          },
          {
            name: "测试数据3",
            data: Array.from({ length: 6 }, () =>
              Math.floor(Math.random() * 200 + 50),
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
