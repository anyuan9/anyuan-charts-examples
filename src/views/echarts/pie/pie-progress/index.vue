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
  const { title = "", seriesData = {} } = data;

  // 数据总和
  const total = 100;
  // 构建圆环的数据，一个是当前百分比，另一个是剩余的百分比
  const _seriesData = [
    {
      name: seriesData.name,
      value: seriesData.value,
      itemStyle: {
        // color: chartColor[0], // 完成的圆环的颜色
        // 颜色线性渐变，但是圆环超过半圆的话，颜色并不是在顶端颜色最深
        color: {
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
              color: chartColors[0][1] // 100% 处的颜色
            }
          ],
          global: false // 缺省为 false
        }
      },
      emphasis: {
        itemStyle: {
          color: chartColor[1]
        }
      }
    },
    {
      name: "其他",
      value: total - seriesData.value,
      itemStyle: {
        color: "rgba(66, 66, 66, .3)" // 未完成的圆环的颜色
      }
    }
  ];

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
    title: [
      {
        top: "center",
        left: "center",
        textStyle: {
          rich: {
            name: {
              fontSize: 20,
              fontWeight: "normal",
              color: "rgba(255, 255, 255, 0.8)",
              padding: [10, 0]
            },
            val: {
              fontSize: 32,
              fontWeight: "bold",
              color: "#ffffff"
            }
          }
        },
        text: `{name|${seriesData.name}}\n{val|${seriesData.value}%}`
      },
      {
        top: 20,
        left: 20,
        textStyle: {
          fontSize: 14,
          color: "#ffffff",
          fontWeight: 400
        },
        text: "单位：个"
      }
    ],
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "rgba(0, 0, 0, 0.6)",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: "rgba(255, 255, 255, 1)"
      },
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: "vertical",
      x: "right",
      y: "center",
      right: "10%",
      align: "left",
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16,
      icon: "rect", // 图例形状：circle，rect ，roundRect，triangle，diamond，pin，arrow，none
      textStyle: {
        rich: {
          name: {
            fontSize: 12,
            color: "rgba(255, 255, 255, 0.8)",
            padding: [0, 5, 0, 0]
          },
          value: {
            fontSize: 14,
            color: "rgba(255, 255, 255, 1)",
            padding: [0, 5, 0, 0]
          },
          ratio: {
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.4)",
            padding: [0, 5, 0, 0]
          }
        }
      },
      formatter: (name) => {
        const res = _seriesData.find(v => v.name === name);
        const value = (res && res.value) || 0;
        const ratio = ((value * 100) / (total || 1)).toFixed(1);
        return `{name|${name}}  {value|${value}} {ratio|/ ${ratio}%}`;
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
      {
        // 环形图为空时背景
        type: "pie",
        radius: ["55%", "60%"],
        center: ["50%", "50%"],
        selectedMode: false,
        animation: false,
        cursor: "auto",
        itemStyle: {
          color: `${chartColor[0]}80`
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        tooltip: {
          show: false
        },
        emphasis: {
          scale: false // 鼠标移入变大
        },
        data: [{ value: 1, name: "" }]
      },
      {
        type: "pie",
        radius: ["55%", "60%"],
        center: ["50%", "50%"],
        // minAngle: 2, //最小的扇区角度（0 ~ 360）
        // padAngle: 10, // 方案1：饼图扇区之间的间隔角度（0 ~ 360），从 v5.5.0 开始支持
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        emphasis: {
          // scale: false, // 鼠标移入变大
        },
        data: _seriesData || []
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
          value: Math.floor(Math.random() * 90 + 10) // 百分比
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
