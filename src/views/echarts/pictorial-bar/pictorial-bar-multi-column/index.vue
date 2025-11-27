<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";

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
  const { title = "", seriesData = [] } = data;

  const maxVal = seriesData.reduce((maxVal, item) => {
    maxVal = Math.max(maxVal, ...item.data.map(d => d.value));
    return maxVal;
  }, 0);
  const leftLength = seriesData?.length ? seriesData[0].data.length : 0;

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
    // 提示框
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    // 直角坐标系内绘图网格
    grid: [{
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "0%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "50%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    }, {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "50%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "0%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    }],
    // 直角坐标系的 x 轴
    xAxis: [{
      show: false,
      type: "value",
      gridIndex: 0,
      max: maxVal,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    }, {
      show: false,
      type: "value",
      gridIndex: 1,
      max: maxVal,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    }],
    // 直角坐标系的 y 轴
    yAxis: [
      // 左侧柱状图在左侧的 y 轴，标注序号和名称
      {
        type: "category",
        gridIndex: 0,
        axisLine: {
          show: false
        },
        axisLabel: {
          verticalAlign: "bottom",
          align: "left",
          color: "#fff",
          fontSize: "16",
          padding: [0, 0, 15, 10], // 文字偏移
          formatter: (params, index) => {
            return `{index|${index + 1}} ${params}`;
          },
          rich: {
            index: {
              color: "#26BCFF",
              fontSize: "20",
              fontWeight: "bold"
            }
          }
        },
        axisTick: {
          show: false
        },
        inverse: true,
        data: seriesData?.length > 0 ? seriesData[0].data.map(item => item.name) : []
      },
      // 左侧柱状图在右侧的 y 轴，标注值
      {
        type: "category",
        gridIndex: 0,
        axisLine: {
          show: false
        },
        axisLabel: {
          verticalAlign: "bottom",
          align: "right",
          color: "#fff",
          fontSize: "16",
          padding: [0, 0, 15, 10],
          formatter: (params) => {
            return `{num|${params}}%`;
          },
          rich: {
            num: {
              color: "#FF982E",
              fontSize: "20",
              fontWeight: "bold"
            }
          }
        },
        axisTick: {
          show: false
        },
        inverse: true,
        data: seriesData?.length > 1 ? seriesData[0].data.map(item => item.value) : []
      },
      // 右侧柱状图在左侧的 y 轴，标注序号和名称
      {
        type: "category",
        gridIndex: 1,
        axisLine: {
          show: false
        },
        axisLabel: {
          verticalAlign: "bottom",
          align: "left",
          color: "#fff",
          fontSize: "16",
          padding: [0, 0, 15, 10],
          formatter: (params, index) => {
            return `{index|${index + leftLength + 1}} ${params}`;
          },
          rich: {
            index: {
              color: "#26BCFF",
              fontSize: "20",
              fontWeight: "bold"
            }
          }
        },
        axisTick: {
          show: false
        },
        inverse: true,
        data: seriesData?.length > 0 ? seriesData[1].data.map(item => item.name) : []
      },
      // 右侧柱状图在右侧的 y 轴，标注值
      {
        type: "category",
        gridIndex: 1,
        axisLine: {
          show: false
        },
        axisLabel: {
          verticalAlign: "bottom",
          align: "right",
          color: "#fff",
          fontSize: "20",
          padding: [0, 0, 15, 10],
          formatter: (params) => {
            return `{num|${params}}%`;
          },
          rich: {
            num: {
              color: "#FF982E",
              fontSize: "20",
              fontWeight: "bold"
            }
          }
        },
        axisTick: {
          show: false
        },
        inverse: true,
        data: seriesData?.length > 1 ? seriesData[1].data.map(item => item.value) : []
      }
    ],
    series: [
      // 左侧的柱状图
      {
        type: "pictorialBar",
        xAxisIndex: 0,
        yAxisIndex: [0, 1],
        symbol: "rect",
        symbolRepeat: "fixed",
        symbolMargin: "50%",
        symbolClip: true,
        symbolSize: [6, 20],
        symbolBoundingData: maxVal,
        z: 99999999,
        animationEasing: "elasticOut",
        animationDelay: (dataIndex, params) => {
          return params.index * 30;
        },
        itemStyle: {
          barBorderRadius: 5,
          color: chartColor[0]
        },
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || []
      },
      {
        type: "pictorialBar",
        xAxisIndex: 0,
        yAxisIndex: [0, 1],
        symbolRepeat: "fixed",
        symbolMargin: "50%",
        symbol: "rect",
        symbolSize: [6, 20],
        symbolBoundingData: maxVal,
        z: 99999,
        animationDuration: 0,
        animationEasing: "elasticOut",
        itemStyle: {
          color: `${chartColor[0]}4d`
        },
        label: {
          show: true,
          position: "right",
          offset: [110, 0],
          color: "#16fffc",
          fontSize: 32,
          fontWeight: 100,
          align: "right",
          formatter: (params) => {
            return (params.value);
          }
        },
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || []
      },
      // 右侧的柱状图
      {
        type: "pictorialBar",
        xAxisIndex: 1,
        yAxisIndex: [2, 3],
        symbol: "rect",
        symbolRepeat: "fixed",
        symbolMargin: "50%",
        symbolClip: true,
        symbolSize: [6, 20],
        symbolBoundingData: maxVal,
        z: 99999999,
        animationEasing: "elasticOut",
        animationDelay: (dataIndex, params) => {
          return params.index * 30;
        },
        itemStyle: {
          barBorderRadius: 5,
          color: chartColor[1]
        },
        name: (seriesData?.length && seriesData[1].name) || "",
        data: (seriesData?.length && seriesData[1].data) || []
      },
      {
        type: "pictorialBar",
        xAxisIndex: 1,
        yAxisIndex: [2, 3],
        symbolRepeat: "fixed",
        symbolMargin: "50%",
        symbol: "rect",
        symbolSize: [6, 20],
        symbolBoundingData: maxVal,
        z: 99999,
        animationDuration: 0,
        animationEasing: "elasticOut",
        itemStyle: {
          color: `${chartColor[1]}4d`
        },
        label: {
          show: true,
          position: "right",
          offset: [110, 0],
          color: "#16fffc",
          fontSize: 32,
          fontWeight: 100,
          align: "right",
          formatter: (params) => {
            return (params.value);
          }
        },
        name: (seriesData?.length && seriesData[1].name) || "",
        data: (seriesData?.length && seriesData[1].data) || []
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
        seriesData: [
          {
            name: "测试数据1",
            data: Array.from({ length: 4 }, (_, i) => {
              return {
                name: `数据1_${i + 1}`,
                value: Math.floor(Math.random() * 500 + 100)
              };
            })
          },
          {
            name: "测试数据2",
            data: Array.from({ length: 4 }, (_, i) => {
              return {
                name: `数据2_${i + 1}`,
                value: Math.floor(Math.random() * 500 + 100)
              };
            })
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
