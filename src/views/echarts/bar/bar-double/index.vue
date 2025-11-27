<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColors } from "@/views/echarts/constant";

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
  const { title = "", yAxisData, seriesData } = data;

  return {
    // 背景颜色，默认无背景
    backgroundColor: "rgba(8, 25, 66, 1)",
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
    // 直角坐标系内绘图网格
    grid: [
      // 左边
      {
        show: false,
        left: "10%",
        top: "10%",
        bottom: "20",
        width: "33%",
        containLabel: true
      },
      // 中间
      {
        show: false,
        left: "51%",
        top: "10%",
        bottom: "20",
        width: "0%"
      },
      // 右边
      {
        show: false,
        right: "10%",
        top: "10%",
        bottom: "20",
        width: "33%",
        containLabel: true
      }
    ],
    // 标题
    title: {
      text: title || "",
      subtext: "",
      top: "2%",
      left: "center",
      textStyle: {
        align: "center",
        color: "#ffffff",
        fontSize: 20
      }
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
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "rgba(0, 0, 0, 0.4)",
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
    xAxis: [
      {
        type: "value",
        inverse: true,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      {
        gridIndex: 1,
        show: false
      },
      {
        gridIndex: 2,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitLine: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: "category",
        inverse: true,
        position: "right",
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        data: yAxisData || []
      },
      {
        gridIndex: 1,
        type: "category",
        inverse: true,
        position: "center",
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          align: "center",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: 14
        },
        data: yAxisData || []
      },
      {
        gridIndex: 2,
        type: "category",
        inverse: true,
        position: "left",
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        data: yAxisData || []
      }
    ],
    series: [
      {
        type: "bar",
        xAxisIndex: 0,
        yAxisIndex: 0,
        barWidth: 15,
        showBackground: true,
        itemStyle: {
          borderRadius: 5,
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
          show: true,
          position: "left",
          color: chartColors[0][0]
        },
        name: seriesData?.length ? seriesData[0].name : "",
        data: seriesData?.length ? seriesData[0].data : []
      },
      {
        type: "bar",
        xAxisIndex: 2,
        yAxisIndex: 2,
        barWidth: 15,
        showBackground: true,
        itemStyle: {
          borderRadius: 5,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: chartColors[1][0] // 0% 处的颜色
              },
              {
                offset: 1,
                color: chartColors[1][0] // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        label: {
          show: true,
          position: "right",
          color: chartColors[1][0]
        },
        name: seriesData?.length ? seriesData[1].name : "",
        data: seriesData?.length ? seriesData[1].data : []
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
        yAxisData: Array.from(
          { length: 12 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`
        ),
        seriesData: [
          {
            name: "测试数据1",
            data: Array.from({ length: 12 }, (_, i) =>
              Math.floor(Math.random() * 500 + 100))
          },
          {
            name: "测试数据2",
            data: Array.from({ length: 12 }, (_, i) =>
              Math.floor(Math.random() * 500 + 100))
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
