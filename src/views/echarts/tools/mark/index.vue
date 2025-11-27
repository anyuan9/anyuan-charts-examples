<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
  autoTooltipLoop: true, // 是否自动循环 tooltip，默认间隔时间1500ms
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

  const upperLimit = {
    name: "上限",
    value: 450,
    color: chartColor[2]
  };
  const lowerLimit = {
    name: "下限",
    value: 200,
    color: chartColor[3]
  };

  return {
    // 背景颜色，默认无背景
    backgroundColor: "rgba(8, 25, 66, 1)",
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
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
    // 提示框
    tooltip: {
      show: true
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    // 直角坐标系的 x 轴
    xAxis: [
      {
        type: "category",
        data: xAxisData || []
      }
    ],
    // 直角坐标系的 y 轴
    yAxis: {
      type: "value"
    },
    series: [
      {
        type: "line",
        smooth: true, // 是否平滑曲线
        // 线条样式
        lineStyle: {
          width: 2
        },
        // 图表标注
        markPoint: {
          // symbol: 'image://url',
          label: { fontSize: 16 },
          animationDelay: 3000,
          animationDuration: 1000,
          data: [
            { type: "max", name: "最大值" },
            { type: "min", name: "最小值" },
            {
              yAxis: 300,
              x: "100%",
              symbolSize: 0.1,
              label: {
                padding: [4, 8],
                fontSize: 20,
                borderRadius: 4,
                color: "rgba(0, 0, 0, 0.6)",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                position: "left",
                formatter: "平均区域"
              }
            }
          ]
        },
        // 图表标线
        markLine: {
          silent: true,
          data: [
            {
              yAxis: upperLimit.value
            },
            {
              name: "下限",
              yAxis: lowerLimit.value,
              lineStyle: {
                width: 2,
                type: "dashed",
                color: lowerLimit.color
              },
              label: {
                show: "true",
                align: "center",
                distance: [40, 0],
                fontSize: 14,
                position: "end",
                rich: {
                  a: {
                    backgroundColor: lowerLimit.color,
                    color: "rgba(0, 0, 0, 0.6)",
                    width: 30,
                    height: 20
                  }
                },
                formatter: (params) => {
                  return `${params.name} {a|${params.value}}`;
                }
              }
            }
          ]
        },
        name: (seriesData?.length && seriesData[1].name) || "",
        data: (seriesData?.length && seriesData[1].data) || []
      },
      {
        type: "bar",
        barWidth: 20,
        tooltip: {
          // tooltip 中数值显示部分的格式化回调函数
          valueFormatter: (value, dataIndex) => {
            return `${value} °C`;
          }
        },
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || []
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
        title: "标注 标线",
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`
        ),
        seriesData: [
          {
            name: "测试数据1",
            data: Array.from({ length: 24 }, (_, i) =>
              Math.floor(Math.random() * 500 + 100))
          },
          {
            name: "测试数据2",
            data: Array.from({ length: 24 }, (_, i) =>
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
