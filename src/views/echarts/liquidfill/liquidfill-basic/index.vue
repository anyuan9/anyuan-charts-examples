<!--
 * @Description: echarts-liquidfill
 * @Author: https://ecomfe.github.io/echarts-liquidfill/
 * @Date: 2025-07-04 16:11:42
 -->
<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor, chartColors } from "@/views/echarts/constant";
import "echarts-liquidfill";

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
  const pieVal = Math.floor(200 * seriesData.value);
  const pieData = [pieVal, 2, 200 - pieVal];

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
        type: "liquidFill",
        radius: "45%",
        center: ["50%", "50%"],
        // 修改波浪颜色
        // color:['yellow'], 所有波浪一个颜色
        // color:['yellow','red','pink'], 每个波浪不同颜色，颜色数组长度为对应的波浪个数
        color: [
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: chartColors[0][0]
              },
              {
                offset: 1,
                color: chartColors[0][1]
              }
            ],
            global: false // 缺省为 false
          }
        ],
        label: {
          fontSize: 50,
          outline: {
            borderDistance: 0,
            itemStyle: {
              borderWidth: 2,
              borderColor: "#112165"
            }
          },
          formatter: `${(seriesData.value * 100).toFixed(1)}%`
        },
        // 内部背景
        backgroundStyle: {
          color: "rgb(255,0,255,0.1)",
          borderWidth: 1
        },
        // 外边框
        outline: {
          show: true,
          borderDistance: 4,
          itemStyle: {
            color: "none",
            borderColor: "#294D99",
            borderWidth: 4,
            shadowBlur: 20,
            shadowColor: "rgba(0, 0, 0, 0.25)"
          }
        },
        name: seriesData.name,
        data: Array.from({ length: 3 }, () => seriesData.value) // data个数代表波浪数
      },
      {
        type: "pie",
        center: ["50%", "50%"],
        radius: ["50%", "52%"],
        emphasis: {
          scale: false
        },
        data: [
          {
            name: "",
            value: pieData[0],
            labelLine: {
              show: false
            },
            itemStyle: {
              color: "#5886f0"
            },
            emphasis: {
              labelLine: {
                show: false
              },
              itemStyle: {
                color: "#5886f0"
              }
            }
          },
          {
            // 画中间的图标
            name: "",
            value: pieData[1],
            labelLine: {
              show: false
            },
            itemStyle: {
              color: "#ffffff",
              color: "#5886f0",
              borderColor: "#5886f0",
              borderWidth: 12
              // borderRadius: '100%'
            },
            label: {
              borderRadius: "100%"
            },
            emphasis: {
              labelLine: {
                show: false
              },
              itemStyle: {
                color: "#5886f0"
              }
            }
          },
          {
            // 画剩余的刻度圆环
            name: "",
            value: pieData[2],
            itemStyle: {
              color: "rgba(255,255,255,0)"
            },
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        ]
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
        seriesData: {
          name: "测试数据1",
          value: Math.floor(Math.random() * 100) / 100 // 随机生成0~1之间的数
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
