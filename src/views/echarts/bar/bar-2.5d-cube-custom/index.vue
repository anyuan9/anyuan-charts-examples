<script setup>
import { useECharts } from "@anyuan/utils";
import * as echarts from "echarts/core";
import { nextTick, onMounted, ref } from "vue";
import { chartColor, chartColors } from "@/views/echarts/constant";

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

// 绘制左侧面
const CubeLeft = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0
  },
  buildPath: (ctx, shape) => {
    // 会canvas的应该都能看得懂，shape是从custom传入的
    const xAxisPoint = shape.xAxisPoint;
    const c0 = [shape.x, shape.y];
    const c1 = [shape.x - 13, shape.y - 13];
    const c2 = [xAxisPoint[0] - 13, xAxisPoint[1] - 13];
    const c3 = [xAxisPoint[0], xAxisPoint[1]];
    ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath();
  }
});
// 绘制右侧面
const CubeRight = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0
  },
  buildPath: (ctx, shape) => {
    const xAxisPoint = shape.xAxisPoint;
    const c1 = [shape.x, shape.y];
    const c2 = [xAxisPoint[0], xAxisPoint[1]];
    const c3 = [xAxisPoint[0] + 18, xAxisPoint[1] - 9];
    const c4 = [shape.x + 18, shape.y - 9];
    ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
  }
});
// 绘制顶面
const CubeTop = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0
  },
  buildPath: (ctx, shape) => {
    const c1 = [shape.x, shape.y];
    const c2 = [shape.x + 18, shape.y - 9];
    const c3 = [shape.x + 5, shape.y - 22];
    const c4 = [shape.x - 13, shape.y - 13];
    ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
  }
});
// 注册三个面图形
echarts.graphic.registerShape("CubeLeft", CubeLeft);
echarts.graphic.registerShape("CubeRight", CubeRight);
echarts.graphic.registerShape("CubeTop", CubeTop);

function getOption(data) {
  const { title = "", xAxisData, seriesData } = data;
  const max = Math.max(...seriesData.data);
  const maxData = xAxisData.map(() => max);
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
    // 提示框
    tooltip: {
      trigger: "axis",
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
    // 直角坐标系的 x 轴
    xAxis: {
      type: "category",
      data: xAxisData || []
    },
    // 直角坐标系的 y 轴
    yAxis: {
      type: "value",
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        fontSize: 16
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "rgba(255,255,255,0.1)"
        }
      },
      boundaryGap: ["20%", "20%"]
    },
    series: [
      // 内部柱
      {
        type: "custom",
        // custom 系列需要开发者自己提供图形渲染的逻辑。https://echarts.apache.org/zh/option.html#series-custom.renderItem
        renderItem: (params, api) => {
          // api.value 得到给定维度的数据值。
          const xValue = api.value(0);
          const yValue = api.value(1);
          // api.coord([]) 将数据值映射到坐标系上。返回画布上的点的坐标。
          const location = api.coord([xValue, yValue]);
          return {
            type: "group",
            children: [{
              type: "CubeLeft",
              shape: {
                api,
                xValue,
                yValue,
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([xValue, 0])
              },
              style: {
                fill: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: chartColors[0][0] // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: chartColors[1][0] // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            }, {
              type: "CubeRight",
              shape: {
                api,
                xValue,
                yValue,
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([xValue, 0])
              },
              style: {
                fill: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: chartColors[0][1] // 0% 处的颜色
                    },
                    {
                      offset: 0.8,
                      color: chartColors[1][1] // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            }, {
              type: "CubeTop",
              shape: {
                api,
                xValue,
                yValue,
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([xValue, 0])
              },
              style: {
                fill: {
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
                      offset: 0.65,
                      color: chartColors[0][1] // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            }]
          };
        },
        name: seriesData.name || "",
        data: seriesData.data || []
      },
      // 外部柱(背景阴影)
      {
        type: "custom",
        renderItem: (params, api) => {
          const xValue = api.value(0);
          const yValue = api.value(1);
          const location = api.coord([xValue, yValue]);
          return {
            type: "group",
            children: [{
              type: "CubeLeft",
              shape: {
                api,
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([xValue, 0])
              },
              style: {
                fill: "rgba(47,102,192,.27)"
              }
            }, {
              type: "CubeRight",
              shape: {
                api,
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([xValue, 0])
              },
              style: {
                fill: "rgba(59,128,226,.27)"
              }
            }, {
              type: "CubeTop",
              shape: {
                api,
                x: location[0],
                y: location[1],
                xAxisPoint: api.coord([xValue, 0])
              },
              style: {
                fill: "rgba(72,156,221,.27)"
              }
            }]
          };
        },
        tooltip: {
          show: false
        },
        data: maxData
      },
      // 隐藏的最大值柱子，用于显示顶部数字
      {
        type: "bar",
        label: {
          show: true,
          position: "top",
          fontSize: 16,
          color: "#fff",
          offset: [2, -24]
        },
        itemStyle: {
          color: "transparent"
        },
        tooltip: {
          show: false
        },
        data: seriesData.data || []
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
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`
        ),
        seriesData: {
          name: "测试数据1",
          data: Array.from({ length: 24 }, (_, i) =>
            Math.floor(Math.random() * 500 + 100))
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
