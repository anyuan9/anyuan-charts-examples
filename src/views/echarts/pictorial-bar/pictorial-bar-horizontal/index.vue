<script setup>
import { useECharts } from "@anyuan/utils";
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

function getOption(data) {
  const { title = "", seriesData } = data;
  const total = seriesData?.reduce((sum, item) => sum + item.value, 0) || 0;
  const yAxisData = seriesData.map(item => item.name);
  const boundingData = seriesData.map(item => ({
    name: item.name,
    value: total
  }));

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
      // 坐标轴的刻度标签
      axisLabel: {
        show: false
      }
    },
    // 直角坐标系的 y 轴
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
      // 坐标轴的刻度标签
      axisLabel: {
        show: true,
        color: "rgba(255, 255, 255, 0.8)"
      },
      inverse: true, // 重要属性，倒序
      data: yAxisData || []
    },
    series: [
      {
        // 内部柱状图，渐变的柱状图，作为象形柱状图的背景底色（如果不实现渐变背景，可去除此bar）
        type: "bar",
        barWidth: 18,
        silent: true,
        legendHoverLink: false,
        animationEasing: "elasticOut",
        z: 1,
        itemStyle: {
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
        data: seriesData || []
      },
      {
        // 内部象形柱状图，用作内部的分隔
        type: "pictorialBar",
        symbol: "rect",
        symbolClip: true,
        symbolMargin: 2,
        symbolSize: [2, 20],
        symbolOffset: ["50%", -1], // 图形相对于原本位置的偏移，水平方向偏移1是为了避免遮挡外框的左边框。垂直方向偏移-1是为了位置居中一点
        symbolRepeat: "fixed", // 'fixed'，指定图形元素是否重复，重复的次数依据 symbolBoundingData 计算得到。此时label将放置在最顶端
        symbolPosition: "start",
        // symbolRotate: "-25",
        symbolBoundingData: total,
        animationEasing: "elasticOut",
        z: 2,
        itemStyle: {
          color: "rgba(8, 25, 66, 1)" // 分隔线颜色，与背景颜色一致
        },
        label: {
          show: true,
          position: "right",
          distance: 0, // 向右偏移位置
          rich: {
            a: {
              color: "red"
            },
            b: {
              color: "yellow"
            },
            c: {
              color: "green"
            },
            d: {
              color: "#ffffff"
            }
          },
          formatter: (params) => {
            const { value, dataIndex } = params;
            let text;
            const radio = `${((value / total) * 100).toFixed(1)}%`;
            if (params.dataIndex == 0) {
              text = `{a|  ${radio}}{d|  ${value}}`;
            } else if (params.dataIndex == 1) {
              text = `{b|  ${radio}}{d|  ${value}}`;
            } else if (params.dataIndex == 2) {
              text = `{c|  ${radio}}{d|  ${value}}`;
            } else {
              text = `{d|  ${radio}}{d|  ${value}}`;
            }
            return text;
          }
        },
        tooltip: {
          show: false
        },
        data: seriesData || []
      },
      {
        // 内部象形柱状图，顶部符号
        type: "pictorialBar",
        symbol: "rect",
        symbolSize: [2, 20],
        symbolOffset: ["50%", -1],
        symbolPosition: "end",
        // symbolRotate: "-25",
        itemStyle: {
          color: "rgba(255, 255, 255, 1)"
        },
        tooltip: {
          show: false
        },
        data: seriesData || []
      },
      {
        // 内部象形柱状图，用作内部的背景
        type: "pictorialBar",
        symbol: "rect",
        symbolClip: true,
        symbolMargin: 2,
        symbolSize: [2, 16],
        symbolOffset: ["50%", -1],
        symbolRepeat: "fixed",
        symbolPosition: "start",
        // symbolRotate: "-25",
        symbolBoundingData: total,
        animationEasing: "elasticOut",
        z: 10,
        itemStyle: {
          color: `${chartColors[0][0]}4d`
        },
        tooltip: {
          show: false
        },
        data: boundingData || []
      },
      {
        // 外边框
        type: "bar",
        barGap: "-120%",
        barWidth: 25,
        z: 0,
        itemStyle: {
          color: "transparent", // 填充色
          borderColor: chartColors[0][0], // 边框色
          borderWidth: 1, // 边框宽度
          // borderRadius: 0, //圆角半径
          label: {
            // 标签显示位置
            show: false,
            position: "top" // insideTop 或者横向的 insideLeft
          }
        },
        tooltip: {
          show: false
        },
        data: Array.from({ length: seriesData?.length }, () => total)
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
            value: Math.floor(Math.random() * 200 + 50)
          },
          {
            name: "测试数据2",
            value: Math.floor(Math.random() * 200 + 50)
          },
          {
            name: "测试数据3",
            value: Math.floor(Math.random() * 200 + 50)
          },
          {
            name: "测试数据4",
            value: Math.floor(Math.random() * 200 + 50)
          },
          {
            name: "测试数据5",
            value: Math.floor(Math.random() * 200 + 50)
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
