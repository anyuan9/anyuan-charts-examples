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
  const { title = "", xAxisData, yAxisData, xAxisName, yAxisName, seriesData = { name: "", value: [] } } = data;
  const min = Math.min(...seriesData.data.map(item => item[2]));
  const max = Math.max(...seriesData.data.map(item => item[2]));
  const total = seriesData.data.reduce((sum, item) => sum + item[2], 0);
  console.log("min, max, total", seriesData);

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
    // 直角坐标系内绘图网格
    grid: [
      // 左上，主数据
      {
        top: "15%",
        bottom: "30%",
        left: "10%",
        right: "30%",
        containLabel: false
      },
      // 右上，行合计
      {
        top: "15%",
        bottom: "30%",
        left: "75%",
        right: "5%",
        containLabel: false
      },
      // 左下，列合计
      {
        top: "80%",
        bottom: "10%",
        left: "10%",
        right: "30%",
        containLabel: false
      },
      // 右下，总合计
      {
        top: "80%",
        bottom: "10%",
        left: "75%",
        right: "5%",
        containLabel: false
      }
    ],
    xAxis: [
      {
        type: "category",
        gridIndex: 0,
        name: xAxisName,
        nameGap: 0,
        nameTextStyle: {
          align: "center",
          verticalAlign: "top",
          padding: [14, 0, 0, 0],
          color: "rgba(255, 255, 255, 0.6)"
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          margin: 14,
          color: "rgba(255, 255, 255, 0.4)"
        },
        splitArea: {
          show: true
        },
        data: xAxisData
      },
      {
        type: "category",
        gridIndex: 1,
        position: "top",
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          margin: 14,
          color: "rgba(255, 255, 255, 0.4)"
        },
        data: ["行合计"]
      },
      {
        show: false,
        type: "category",
        gridIndex: 2
      },
      {
        show: false,
        type: "category",
        gridIndex: 3
      }
    ],
    yAxis: [
      {
        type: "category",
        gridIndex: 0,
        name: yAxisName,
        nameGap: 0,
        nameTextStyle: {
          align: "right",
          padding: [0, 6, 0, 0],
          fontSize: 14,
          color: "rgba(255, 255, 255, 0.6)"
        },
        axisLabel: {
          margin: 14,
          color: "rgba(255, 255, 255, 0.4)"
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        data: yAxisData
      },
      {
        show: false,
        type: "category",
        gridIndex: 1
      },
      {
        type: "category",
        gridIndex: 2,
        axisLabel: {
          margin: 14,
          color: "rgba(255, 255, 255, 0.4)"
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        data: ["列合计"]
      },
      {
        type: "category",
        gridIndex: 3,
        axisLabel: {
          show: false,
          margin: 14
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      }
    ],
    visualMap: {
      top: "5%",
      right: "30%",
      min: 0,
      max,
      padding: 0,
      calculable: true,
      orient: "horizontal",
      inverse: true,
      itemWidth: 18,
      itemHeight: 114,
      inRange: {
        color: ["#99d7ff", "#007bcb"],
        symbolSize: [100, 100]
      },
      text: ["高", "低"],
      textGap: 8,
      textStyle: {
        color: "rgba(255, 255, 255, 0.4)"
      }
    },
    series: [
      {
        type: "heatmap",
        gridIndex: 0,
        xAxisIndex: 0,
        yAxisIndex: 0,
        label: {
          show: true,
          formatter: (p) => {
            const v = p.value[2];
            return `${v} | ${((v / total) * 100).toFixed(2)}%`;
          },
          color: "#333"
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.6)"
        },
        name: seriesData.name,
        data: seriesData.data
      },
      {
        type: "heatmap",
        gridIndex: 1,
        xAxisIndex: 1,
        yAxisIndex: 1,
        label: {
          show: true,
          formatter: (p) => {
            const v = p.value[2];
            return `${v} | ${((v / total) * 100).toFixed(2)}%`;
          },
          color: "#333"
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.6)",
          color: "#E0EAFB"
        },
        name: seriesData.name,
        data: [
          [
            0,
            0,
            seriesData.data.reduce((r, e) => {
              if (e[1] === 0) {
                r += e[2];
              }
              return r;
            }, 0)
          ],
          [
            0,
            1,
            seriesData.data.reduce((r, e) => {
              if (e[1] === 1) {
                r += e[2];
              }
              return r;
            }, 0)
          ],
          [
            0,
            2,
            seriesData.data.reduce((r, e) => {
              if (e[1] === 2) {
                r += e[2];
              }
              return r;
            }, 0)
          ],
          [
            0,
            3,
            seriesData.data.reduce((r, e) => {
              if (e[1] === 3) {
                r += e[2];
              }
              return r;
            }, 0)
          ],
          [
            0,
            4,
            seriesData.data.reduce((r, e) => {
              if (e[1] === 4) {
                r += e[2];
              }
              return r;
            }, 0)
          ]
        ]
      },
      {
        type: "heatmap",
        gridIndex: 2,
        xAxisIndex: 2,
        yAxisIndex: 2,
        label: {
          show: true,
          formatter: (p) => {
            const v = p.value[2];
            return `${v} | ${((v / total) * 100).toFixed(2)}%`;
          },
          color: "#333"
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.6)",
          color: "#E0EAFB"
        },
        name: seriesData.name,
        data: [
          [
            0,
            0,
            seriesData.data.reduce((r, e) => {
              if (e[0] === 0) {
                r += e[2];
              }
              return r;
            }, 0)
          ],
          [
            1,
            0,
            seriesData.data.reduce((r, e) => {
              if (e[0] === 1) {
                r += e[2];
              }
              return r;
            }, 0)
          ],
          [
            2,
            0,
            seriesData.data.reduce((r, e) => {
              if (e[0] === 2) {
                r += e[2];
              }
              return r;
            }, 0)
          ],
          [
            3,
            0,
            seriesData.data.reduce((r, e) => {
              if (e[0] === 3) {
                r += e[2];
              }
              return r;
            }, 0)
          ],
          [
            4,
            0,
            seriesData.data.reduce((r, e) => {
              if (e[0] === 4) {
                r += e[2];
              }
              return r;
            }, 0)
          ]
        ]
      },
      {
        type: "heatmap",
        gridIndex: 3,
        xAxisIndex: 3,
        yAxisIndex: 3,
        label: {
          show: true,
          formatter: (p) => {
            const v = p.value[2];
            return `${v} | ${((v / total) * 100).toFixed(2)}%`;
          },
          color: "#333"
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.8)",
          color: "#E0EAFB"
        },
        name: seriesData.name,
        data: [[0, 0, total]]
      }
    ]
  };
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const xAxisData = ["F>24", "18<F≤24", "12<F≤18", "6<F≤12", "0<F≤6"];
    const yAxisData = ["R≤30", "30<R≤60", "60<R≤90", "90<R≤180", "R>180"];
    const data = xAxisData.reduce((acc, cur, i) => {
      for (let j = 0; j < yAxisData.length; j++) {
        const val = Math.trunc(Math.random() * 200);
        acc.push([i, j, val]);
      }
      return acc;
    }, []);

    const res = {
      code: "0",
      data: {
        title: "测试数据",
        xAxisData,
        yAxisData,
        xAxisName: "到站次数(F)",
        yAxisName: "停留时间(R)",
        seriesData: {
          name: "测试数据1",
          data
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
