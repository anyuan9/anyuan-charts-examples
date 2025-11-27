<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";

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
  const { title = "", indicatorData, seriesData } = data;

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
    // 提示框
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "rgba(0, 0, 0, 0.6)",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: "rgba(255, 255, 255, 1)"
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
    // 雷达图坐标系组件，只适用于雷达图
    radar: {
      center: ["50%", "50%"],
      radius: "60%",
      startAngle: 90,
      splitNumber: 4,
      shape: "circle", // 雷达图绘制类型，支持 'polygon' 和 'circle'
      triggerEvent: true, // 坐标轴的标签是否响应和触发鼠标事件，默认不响应
      // 坐标轴轴线
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.6)"
        }
      },
      // 坐标轴刻度
      axisTick: {},
      // 坐标轴刻度标签
      axisLabel: {
        show: false,
        fontSize: 18,
        fontStyle: "normal",
        fontWeight: "normal",
        color: "rgba(255, 255, 255, 0.8)"
      },
      // 坐标轴在 grid 区域中的分隔线
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: "rgba(255, 255, 255, 0.6)"
        }
      },
      // 坐标轴在 grid 区域中的分隔区域，默认不显示
      splitArea: {
        // show: true,
        areaStyle: {
          color: ["transparent"],
          shadowColor: "rgba(0, 0, 0, 1)",
          shadowBlur: 30,
          shadowOffsetX: 10,
          shadowOffsetY: 10
        }
      },
      indicator: indicatorData || []
    },
    series: [
      {
        type: "radar",
        symbol: "circle",
        symbolSize: 8,
        zlevel: 2,
        // 折线拐点标志的样式
        itemStyle: {},
        // 线条样式
        lineStyle: {
          width: 2,
          color: chartColor[0]
        },
        // 区域填充样式
        areaStyle: {},
        tooltip: {
          show: true
        },
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || []
      },
      {
        type: "sunburst",
        center: ["50%", "50%"],
        radius: ["80%", "90%"],
        nodeClick: false,
        // 多层配置
        levels: [
          {
            // 留给数据下钻点的空白配置
          },
          {
            // 最靠内测的第一层
            // radius: ['80%', '90%'],
          }
        ],
        // 文本标签的样式
        label: {
          position: "inside",
          rotate: "tangential",
          color: "rgba(255, 255, 255, 0.8)"
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.2)"
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
        indicatorData: Array.from({ length: 6 }, (_, i) => ({ name: `指标${i + 1}`, max: 100 })),
        seriesData: [
          {
            name: "测试组1",
            data: [
              {
                value: [77, 69, 58, 0, 0, 0]
              },
              {
                value: [0, 0, 58, 45, 52, 0]
              },
              {
                value: [77, 0, 0, 0, 52, 80]
              }
            ]
          },
          {
            name: "测试组2",
            data: [
              {
                name: "职场渴望",
                value: 40
              },
              {
                name: "职场潜力",
                value: 40
              },
              {
                name: "职场协作",
                value: 40
              },
              {
                name: "职场基础",
                value: 40
              }
            ]
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
