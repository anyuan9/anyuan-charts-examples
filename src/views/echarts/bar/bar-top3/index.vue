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
  const { title = "", seriesData } = data;
  const yAxisData = seriesData?.map(item => item.name) || [];
  const maxValue
    = Math.max(...(seriesData?.map(item => item.value) || [])) * 1.1;
  const maxBarData = Array.from(
    { length: seriesData?.length },
    (v, k) => maxValue
  );

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
      subtext: "",
      top: "2%",
      left: "center",
      textStyle: {
        align: "center",
        color: "#ffffff",
        fontSize: 20
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
    xAxis: {
      show: false
    },
    yAxis: {
      type: "category",
      // 坐标轴的分隔线
      splitLine: {
        show: false
      },
      // 坐标轴的轴线
      axisLine: {
        show: false
      },
      // 坐标轴的刻度
      axisTick: {
        show: false
      },
      // 坐标轴的刻度标签，在此标注左侧的文字信息
      axisLabel: {
        show: true,
        color: "rgba(255, 255, 255, 0.4)",
        fontSize: 14,
        margin: 15,
        rich: {
          icon1: {
            width: 20,
            height: 20,
            fontSize: 12,
            color: "#ffffff",
            align: "center",
            padding: [0, 0],
            backgroundColor: chartColor[0]
            // borderRadius: 10,
          },
          icon2: {
            width: 20,
            height: 20,
            fontSize: 12,
            color: "#ffffff",
            align: "center",
            padding: [0, 0],
            backgroundColor: chartColor[1]
            // borderRadius: 10,
          },
          icon3: {
            width: 20,
            height: 20,
            fontSize: 12,
            color: "#ffffff",
            align: "center",
            padding: [0, 0],
            backgroundColor: chartColor[2]
            // borderRadius: 10,
          },
          icon: {
            width: 20,
            height: 20,
            fontSize: 12,
            color: "#ffffff",
            align: "center",
            padding: [0, 0],
            backgroundColor: chartColor[3]
            // borderRadius: 10,
          }
        },
        formatter: (value, index) => {
          return `{icon${index < 3 ? index + 1 : ""}|${index + 1}}`;
        }
      },
      inverse: true, // 重要属性，倒序
      data: yAxisData || []
    },
    series: [
      // 内部柱状图：使用背景颜色填充
      {
        name: "内部",
        type: "bar",
        barWidth: 20,
        barCategoryGap: 20, // 同一系列的柱间距离
        z: 2,
        zlevel: 1,
        itemStyle: {
          borderRadius: [0, 0, 0, 0],
          color: (params) => {
            const colorTmp = chartColor[params.dataIndex % chartColor.length];
            return {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: `${colorTmp}4d`
                },
                {
                  offset: 1,
                  color: colorTmp
                }
              ],
              global: false // 缺省为 false
            };
          }
        },
        label: {
          show: true,
          position: "insideTopLeft",
          distance: 0,
          offset: [0, -20],
          padding: [0, 0],
          color: "#ffffff",
          fontSize: 14,
          rich: {
            name: {
              width: 50,
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.8)",
              align: "left",
              padding: [0, 0, 0, 0]
            }
          },
          formatter: (params) => {
            const { name, dataIndex } = params;
            return `{name|${name}}`;
          }
        },
        data: seriesData
      },
      // 内部柱状图：使用背景图填充，形成顶部三角的效果(缺点：顶部三角形会被拉伸变形)
      {
        name: "顶部三角形",
        type: "pictorialBar",
        barWidth: 20,
        z: 2,
        zlevel: 1,
        symbol: "path://m1,153l0,-152l146,152l-146,0z",
        symbolSize: [20, 20],
        symbolPosition: "end",
        symbolOffset: [19.5, 0],
        animation: true,
        animationEasing: "linear",
        animationDelay: 150,
        itemStyle: {
          color: (params) => {
            const { dataIndex, value } = params;
            const colorTmp = chartColor[dataIndex % chartColor.length];
            return value > 0 ? colorTmp : "transparent";
          }
        },
        label: {
          show: true,
          position: "right",
          offset: [-25, 2],
          padding: [0, 0],
          distance: 0,
          align: "right",
          color: "#ffffff",
          fontSize: "16",
          formatter: (params) => {
            const { name, value, dataIndex } = params;
            return value;
          }
        },
        data: seriesData.map((item) => {
          return {
            ...item,
            label: {
              offset: item.value / maxValue > 0.1 ? [-25, 2] : [30, 2], // 根据数值大小调整文字显示位置
              formatter: "{c}%"
            }
          };
        })
      },
      {
        name: "外部",
        type: "bar",
        barGap: "-100%",
        barWidth: 20,
        itemStyle: {
          color: "rgba(0, 0, 0, .4)"
        },
        // 方案2：使用series的label显示右侧文字信息，（方案1：使用坐标轴刻度标签显示右侧文字信息，详见BarTop）
        label: {
          show: true,
          position: "right",
          distance: 0,
          offset: [0, -20],
          padding: [0, 0],
          align: "right",
          color: "#ffffff",
          fontSize: "16",
          formatter: (params) => {
            const { name, dataIndex } = params;
            return seriesData[dataIndex].value;
          }
        },
        tooltip: {
          show: false
        },
        data: maxBarData
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
            name: "测试数据",
            value: Math.floor(Math.random() * 20 + 200)
          },
          {
            name: "测试数据2",
            value: Math.floor(Math.random() * 20 + 180)
          },
          {
            name: "测试数据3",
            value: Math.floor(Math.random() * 20 + 160)
          },
          {
            name: "测试数据4",
            value: Math.floor(Math.random() * 20 + 140)
          },
          {
            name: "测试数据5",
            value: Math.floor(Math.random() * 20 + 120)
          },
          {
            name: "测试数据6",
            value: 1
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
