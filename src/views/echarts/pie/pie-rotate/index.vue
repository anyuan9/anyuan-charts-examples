<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, getInstance, showLoading } = useECharts(chartRef, {
  autoTooltipLoop: false, // 是否自动循环 tooltip，默认间隔时间1500ms
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s"
    }
  }
});

// 图表数据
const defaultChartData = {
  title: "",
  seriesData: [
    // { name: "", data: 0}
  ]
};
const chartData = ref(defaultChartData);

const angle = ref(0); // 初始角度

function getOption() {
  const { title = "", seriesData } = chartData.value;

  return {
    // 背景颜色，默认无背景
    backgroundColor: "rgba(8, 25, 66, 1)",
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    series: [
      {
        type: "pie",
        silent: true, // 静默模式，不响应鼠标事件
        radius: ["98%", "97%"],
        color: "rgba(88,142,197,0.5)",
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        emphasis: {
          scale: false
        },
        data: [1]
      },
      {
        type: "pie",
        silent: true,
        radius: ["90%", "91%"],
        startAngle: 50,
        padAngle: 10, // 方案1：饼图扇区之间的间隔角度（0 ~ 360），从 v5.5.0 开始支持
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        emphasis: {
          scale: false
        },
        data: _ringData(4)
      },
      {
        type: "pie",
        silent: true,
        radius: ["88%", "87%"],
        startAngle: 0,
        padAngle: 10, // 方案1：饼图扇区之间的间隔角度（0 ~ 360），从 v5.5.0 开始支持
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: _ringData(4)
      },
      {
        type: "pie",
        silent: true,
        radius: ["84%", "83%"],
        padAngle: 1, // 方案1：饼图扇区之间的间隔角度（0 ~ 360），从 v5.5.0 开始支持
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: _ringData(50)
      },
      {
        type: "pie",
        silent: true,
        radius: ["80%", "78%"],
        color: ["#fc8d89", "#46d3f3", "rgba(203,203,203,.2)"],
        startAngle: 50,
        label: {
          show: false
        },
        emphasis: {
          scale: false
        },
        data: [50, 20, 30]
      },
      {
        name: "",
        type: "gauge",
        radius: "77%", // 图表尺寸
        center: ["50%", "50%"],
        splitNumber: 30, // 刻度数量
        min: 0,
        max: 100,
        startAngle: 90,
        endAngle: -269.9999,
        axisLine: {
          show: false,
          lineStyle: {
            width: 0,
            shadowBlur: 0,
            color: [
              [1, "#0dc2fe"]
            ]
          }
        },
        axisTick: {
          show: false,
          lineStyle: {
            color: "auto",
            width: 2
          },
          length: 20,
          splitNumber: 5
        },
        splitLine: {
          show: true,
          length: 32,
          lineStyle: {
            color: "auto"
          }
        },
        axisLabel: {
          show: false
        },
        pointer: {
          show: 0
        },
        detail: {
          show: 0
        }
      },
      {
        name: "",
        type: "gauge",
        radius: "73%", // 图表尺寸
        center: ["50%", "50%"],
        splitNumber: 30, // 刻度数量
        min: 0,
        max: 100,
        startAngle: 90,
        endAngle: -269.9999,
        axisLine: {
          show: true,
          lineStyle: {
            width: 0,
            shadowBlur: 0,
            color: [
              [0, "#0dc2fe"],
              [1, "#0dc2fe"]
            ]
          }
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: "#0dc2fe",
            width: 2
          },
          length: 20,
          splitNumber: 5
        },
        splitLine: {
          show: true,
          length: 20,
          lineStyle: {
            color: "#0dc2fe"
          }
        },
        axisLabel: {
          show: false
        },
        pointer: { // 仪表盘指针
          show: 0
        },
        detail: {
          borderColor: "#fff",
          shadowColor: "#fff", // 默认透明
          shadowBlur: 2,
          offsetCenter: [0, "0%"], // x, y，单位px
          color: "#fff",
          fontSize: 50,
          formatter: "{value}"
        },
        data: seriesData.data || []
      },
      {
        type: "pie",
        silent: true,
        radius: ["60%", "59%"],
        color: "#2dc0c9",
        labelLine: {
          show: false
        },
        emphasis: {
          scale: false
        },
        data: [1]
      },
      {
        type: "pie",
        radius: ["35%", "55%"],
        avoidLabelOverlap: false,
        itemStyle: {
          color: "#80ADD2",
          borderColor: "#3D4268"
        },
        label: {
          show: false,
          position: "center"
        },
        labelLine: {
          show: false
        },
        emphasis: {
          scale: false,
          label: {
            show: true,
            fontSize: "30",
            fontWeight: "bold"
          }
        },
        name: "中间环形图",
        data: [25, 25, 25, 25, 25, 25]
      }
    ]
  };
}

function _ringData(length = 5) {
  return Array.from({ length }, (_, i) => ({
    name: (i + 1).toString(),
    value: 25,
    itemStyle: {
      color: "rgba(88,142,197,0.5)",
      borderWidth: 0,
      borderColor: "rgba(0,0,0,0)"
    }
  }));
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "测试数据",
        seriesData: {
          name: "测试数据",
          data: [
            {
              name: "A类",
              value: 2025
            }
          ]
        }
      }
    };
    chartData.value = res.data;
    const option = getOption();
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

let timer;
function doing() {
  const echartsInstance = getInstance();
  if (!echartsInstance) return;
  const option = echartsInstance.getOption();
  option.series[3].startAngle = option.series[3].startAngle - 1;
  option.series[6].data[0].value = option.series[6].data[0].value + 1;
  setOption(option);
}
function startTimer() {
  timer = setInterval(doing, 100);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

onMounted(() => {
  nextTick(() => {
    showLoading();
    getData().then(() => {
      const echartsInstance = getInstance();

      // 鼠标事件：'click'，'dblclick'，'mousedown'，'mouseup'，'mouseover'，'mouseout'，'globalout'。
      echartsInstance.on("mouseover", (params) => {
        stopTimer();
      });

      echartsInstance.on("mouseout", (params) => {
        startTimer();
      });

      setTimeout(startTimer, 500);
    });
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
