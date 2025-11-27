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
  const total
    = seriesData?.data?.reduce((acc, item) => {
      return acc + item.value;
    }, 0) || 0;

  const pieData = seriesData?.data?.reduce((acc, item, index) => {
    const num = Math.round((item.value / total) * 100);
    for (let i = 0; i < num; ++i) {
      acc.push(
        {
          value: 4, // 有颜色部分的宽度
          name: item.name,
          itemStyle: {
            color: chartColors[index % chartColors.length][0]
          }
        },
        {
          value: 1, // 无颜色部分的宽度
          name: "",
          itemStyle: {
            label: { show: false },
            labelLine: { show: false },
            color: "rgba(0, 0, 0, 0)",
            borderColor: "rgba(0, 0, 0, 0)",
            borderWidth: 0
          }
        }
      );
    }
    return acc;
  }, []);

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
        text: `{name|${title}}\n{val|${total}}`
      }
    ],
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
          },
          ...chartColor.reduce((acc, color, index) => {
            acc[`value${index}`] = {
              fontSize: 14,
              color,
              padding: [0, 5, 0, 0]
            };
            return acc;
          }, {})
        }
      },
      formatter: (name) => {
        const res = seriesData?.data?.find(v => v.name === name);
        const idx = seriesData?.data?.findIndex(v => v.name === name) % chartColor.length;
        if (res) {
          const value = (res && res.value) || 0;
          const ratio = ((value * 100) / (total || 1)).toFixed(1);
          return `{name|${name}}  {value${idx}|${value}} {ratio|/ ${ratio}%}`;
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
      {
        // 环形图为空时背景
        type: "pie",
        radius: ["50%", "60%"],
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
          scale: false
        },
        data: [{ value: 1, name: "" }]
      },
      {
        type: "pie",
        radius: ["50%", "60%"],
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
          scale: false // 鼠标移入变大
        },
        data: pieData || []
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
          name: "测试数据",
          data: [
            {
              name: "A类",
              value: 3720
            },
            {
              name: "B类",
              value: 2920
            },
            {
              name: "C类",
              value: 2200
            },
            {
              name: "D类",
              value: 1420
            }
          ]
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
