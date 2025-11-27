<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor, chartColors } from "@/views/echarts/constant";

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
  const seriesDataMax = Math.max(...seriesData.data) || 0;
  const seriesMaxBarData = xAxisData?.map(item => seriesDataMax) || [];
  const seriesMinBarData = xAxisData?.map(item => 1) || [];

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
    title: {
      text: title || "",
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 20
      },
      top: "5%",
      left: "2%"
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
        fontSize: 14
      }
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "rgba(0, 0, 0, 0.6)",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: "#ffffff"
      },
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    xAxis: [
      {
        type: "category",
        // 坐标轴的分隔线
        splitLine: {
          show: false,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)"
          }
        },
        // 坐标轴的轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)"
          }
        },
        // 坐标轴的刻度
        axisTick: {
          show: false
        },
        // 坐标轴的刻度标签
        axisLabel: {
          interval: 0,
          // rotate: -30, // 刻度标签旋转的角度，从 -90 度到 90 度，默认0
          inside: false, // 刻度标签是否朝内，默认false(朝外)
          fontSize: 12,
          fontWeight: 400,
          color: "#ffffff",
          opacity: 0.4
        },
        offset: 5,
        data: xAxisData || []
      }
    ],
    yAxis: [
      {
        type: "value",
        splitNumber: 5, // 坐标轴的分割段数
        // 坐标轴的分隔线
        splitLine: {
          show: false,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)"
          }
        },
        // 坐标轴的轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)"
          }
        },
        // 坐标轴的刻度
        axisTick: {
          show: false
        },
        // 坐标轴的刻度标签
        axisLabel: {
          show: true,
          color: "rgba(255, 255, 255, 0.4)"
        }
      }
    ],
    series: [
      // 内部柱状图
      {
        type: "bar",
        barWidth: "30",
        barMaxWidth: "auto",
        itemStyle: {
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
              { offset: 0.5, color: chartColors[0][0] },
              { offset: 0.5, color: chartColors[0][1] },
              {
                offset: 1,
                color: chartColors[0][1] // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        label: {
          show: true,
          position: "top",
          color: "rgba(255, 255, 255, 0.8)",
          fontWeight: 700,
          fontSize: 14
        },
        name: seriesData.name,
        data: seriesData.data || []
      },
      // 内部柱顶部面
      {
        type: "pictorialBar",
        barMaxWidth: "20",
        symbol: "diamond",
        symbolPosition: "end",
        symbolOffset: [0, "-50%"],
        symbolSize: [30, 12],
        z: 3,
        itemStyle: {
          color: chartColors[0][0]
        },
        tooltip: {
          show: false
        },
        data: seriesData.data || []
      },
      // 内部柱底部面
      {
        type: "pictorialBar",
        barMaxWidth: "20",
        symbol: "diamond",
        symbolOffset: [0, "50%"],
        symbolSize: [30, 15],
        z: 3,
        itemStyle: {
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
              { offset: 0.5, color: chartColors[0][0] },
              { offset: 0.5, color: chartColors[0][1] },
              {
                offset: 1,
                color: chartColors[0][1] // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        tooltip: {
          show: false
        },
        data: seriesData.data || []
      },
      // 外部柱(背景阴影)
      {
        type: "bar",
        barMaxWidth: "auto",
        barWidth: 30,
        barGap: "-100%",
        z: -1,
        itemStyle: {
          color: `${chartColors[0][1]}4d`
        },
        tooltip: {
          show: false
        },
        data: seriesMaxBarData
      },
      // 外部柱顶部面
      {
        type: "pictorialBar",
        barMaxWidth: "20",
        symbolPosition: "end",
        symbol: "diamond",
        symbolOffset: [0, "-50%"],
        symbolSize: [30, 12],
        z: -1,
        itemStyle: {
          color: `${chartColors[0][1]}4d`
        },
        tooltip: {
          show: false
        },
        data: seriesMaxBarData
      },
      // 外部柱底部面
      {
        type: "pictorialBar",
        barMaxWidth: "20",
        symbol: "diamond",
        symbolOffset: [0, "50%"],
        symbolSize: [30, 15],
        z: -2,
        itemStyle: {
          color: `${chartColors[0][1]}4d`
        },
        tooltip: {
          show: false
        },
        data: seriesMinBarData
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
        xAxisData: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`),
        seriesData: {
          name: "测试数据",
          data: Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 500 + 100))
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
