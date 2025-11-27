<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor, chartColors } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s"
    }
  }
});

function getOption(data) {
  const { title = "", seriesData } = data;
  const [valInt, valDecimal] = seriesData[0].value.toFixed(2).split(".");

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
      text: `{a|${valInt}}{b|.${valDecimal}}\n{c|${title}}`,
      x: "center",
      y: "center",
      textStyle: {
        rich: {
          a: {
            fontSize: 32,
            color: "#fff",
            fontWeight: "600"
          },
          b: {
            fontSize: 16,
            color: "#fff",
            padding: [0, 0, 14, 0]
          },
          c: {
            fontSize: 16,
            color: "#fff",
            padding: [5, 0]
          }
        }
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
    series: [
      // 内部圆
      {
        type: "pie",
        radius: [0, "30%"],
        clockwise: false,
        itemStyle: {
          shadowBlur: 20,
          shadowColor: "#000",
          color: {
            type: "radial",
            x: 0.4,
            y: 0.3,
            r: 1,
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
          show: false
        },
        emphasis: {
          scale: false
        },
        data: [100]
      },
      // 空心链圆环
      {
        type: "pie",
        radius: ["44%", "45%"],
        clockwise: false,
        itemStyle: {
          color: chartColor[0]
        },
        label: {
          show: false
        },
        emphasis: {
          scale: false
        },
        data: _dashed()
      },
      // 仪表盘
      {
        type: "gauge",
        radius: "60%",
        splitNumber: 30,
        startAngle: 90,
        endAngle: 90 - 0.0001,
        clockwise: false,
        // 仪表盘轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, "#2CFAFC"],
              [seriesData[0].value / 100, chartColor[0]],
              [1, "#0f232e"]
            ],
            width: 20
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        // 分隔线
        splitLine: {
          show: true,
          length: 100,
          lineStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 255, 255, 1)",
            shadowOffsetY: "0",
            color: "#020f18",
            width: 2
          }
        },
        // 指针
        pointer: {
          show: false
        },
        // 仪表盘详情，用于显示数据
        detail: {
          offsetCenter: [0, -20],
          formatter: " "
        }
      },
      // 圆环背景1
      {
        type: "pie",
        radius: ["64%", "65.5%"],
        clockwise: false,
        itemStyle: {
          shadowBlur: 20,
          shadowColor: chartColor[0],
          color: `${chartColor[0]}1a`
        },
        label: {
          show: false
        },
        emphasis: {
          scale: false
        },
        data: [100]
      },
      // 圆环背景2
      {
        type: "pie",
        radius: ["68%", "69.5%"],
        clockwise: false,
        itemStyle: {
          shadowBlur: 20,
          shadowColor: chartColor[0],
          color: `${chartColor[0]}1a`
        },
        label: {
          show: false
        },
        emphasis: {
          scale: false
        },
        data: [100]
      }
    ]
  };
}
function _dashed() {
  const dataArr = [];
  for (let i = 0; i < 100; i++) {
    if (i % 2 === 0) {
      dataArr.push({
        name: (i + 1).toString(),
        value: 20,
        itemStyle: {
          color: `${chartColor[0]}3d`
        }
      });
    } else {
      dataArr.push({
        name: (i + 1).toString(),
        value: 20,
        itemStyle: {
          color: "rgb(0,0,0,0)",
          borderWidth: 1,
          borderColor: chartColor[0]
        }
      });
    }
  }
  return dataArr;
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
            name: "测试数据",
            value: Math.random() * 90 + 10
          }
        ]
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
