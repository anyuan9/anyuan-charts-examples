<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor, chartColors } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
  autoTooltipLoop: false, // 是否自动循环 tooltip，默认间隔时间1500ms
  autoChartResize: true
  // animation: {
  //   enable: true,
  //   styles: {
  //     transition: "all 2s",
  //   },
  // },
});

function getOption(data) {
  const { title = "", seriesData } = data;

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
          type: ["line", "bar", "stack"]
        }
      }
    },
    // 标题
    title: [
      {
        text: title || "",
        textStyle: {
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: 32
        },
        x: "center",
        top: "55%"
      },
      {
        text: `${seriesData.value}%`,
        textStyle: {
          color: "rgba(255, 255, 255, 0.85)",
          fontSize: 60
        },
        x: "center",
        top: "35%"
      }
    ],
    // 提示框
    tooltip: {
    },
    polar: {
      center: ["50%", "50%"],
      radius: ["70%", "80%"]
    },
    angleAxis: {
      show: false,
      max: 100,
      startAngle: 75
    },
    radiusAxis: {
      type: "category",
      axisLabel: false,
      axisLine: false,
      axisTick: false
    },
    series: [
      {
        type: "bar",
        coordinateSystem: "polar",
        roundCap: true, // 圆角
        showBackground: true,
        backgroundStyle: {
          color: "rgba(66, 66, 66, .3)"
        },
        itemStyle: {
          // 背景颜色渐变
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: chartColors[0][0] // 0% 处的颜色
              },
              {
                offset: 1,
                color: chartColors[0][1] // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        label: {
          show: false,
          position: "middle",
          formatter: "{b}: {c}"
        },
        emphasis: {},
        name: seriesData.name || "",
        data: [seriesData || 0]
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
        seriesData: {
          name: "测试数据1",
          value: Math.floor(Math.random() * 90 + 10) // 百分比
        }
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
