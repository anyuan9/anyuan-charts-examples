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
  const { title = "", min, max, seriesData } = data;

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
      trigger: "item",
      // 坐标轴指示器
      axisPointer: {
        type: "cross"
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
      type: "value",
      // 坐标轴的分隔线
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)"
        }
      }
    },
    // 直角坐标系的 y 轴
    yAxis: {
      type: "value",
      // 坐标轴的分隔线
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)"
        }
      }
    },
    // 视觉映射
    visualMap: {
      show: true, // 是否显示
      type: "continuous", // 类型，'continuous'连续型;'piecewise'分段型
      // dimension: 0, // 指定用数据（即 series.data）的『哪个维度』，映射到视觉元素上。默认取 data 中最后一个维度。
      seriesIndex: [0], // 指定取哪个系列的数据，即哪个系列的 series.data。默认取所有系列。
      orient: "vertical", // 水平（'horizontal'）或者竖直（'vertical'）放置
      right: 10,
      top: "center",
      min, // 允许的最小值。'min' 必须用户指定。
      max, // 允许的最大值。'max' 必须用户指定。
      range: [min, max], // 定义了选中的范围，即高亮的范围
      calculable: true, // 是否显示拖拽用的手柄（手柄能拖拽调整选中范围）
      realtime: true, // 拖拽时，是否实时更新。如果为false则拖拽结束时，才更新视图
      inverse: false, // 是否反转 visualMap 组件
      precision: 0.1, // 数据展示的小数精度，默认为0，无小数点。
      itemWidth: 20, // 图形的宽度，即长条的宽度。
      itemHeight: 140, // 图形的高度，即长条的高度。
      padding: 10, // 组件的内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。
      backgroundColor: "rgba(255, 255, 255, 0.2)", // 组件的背景色，默认'rgba(0,0,0,0)'
      borderColor: "rgba(255, 255, 255, 0.2)", // 边框颜色，默认'#ccc'
      borderWidth: 0, // 边框线宽，默认0

      text: ["HIGH", "LOW"], // 两端的文本
      textGap: 10, // 两端文字与轴线的距离
      textStyle: {
        color: "rgba(255, 255, 255, 0.6)"
      },
      // 选中范围中的视觉配置
      inRange: {
        color: [chartColor[0], chartColor[1]], // 定义了图形颜色映射的颜色列表，从数据最小值到最大值
        symbolSize: [5, 10] // 定义了图形尺寸的映射范围，
      },
      // 选中范围外的视觉配置
      outOfRange: {
        symbolSize: [3, 8]
      },
      // 控制器
      controller: {
        // inRange: {
        //   color: chartColor[2],
        // },
        // outOfRange: {
        //   color: chartColor[3],
        // },
      }
    },
    series: [
      {
        type: "scatter",
        symbolSize: 5,
        markPoint: {
          data: [
            { type: "max", name: "最大值" },
            { type: "min", name: "最小值" }
          ]
        },
        markLine: {
          data: [{ type: "average", name: "平均值" }]
        },
        name: "price-area",
        data: seriesData
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
        min: 200,
        max: 5000,
        seriesData: Array.from({ length: 500 }, (_, i) => [
          Math.floor(Math.random() * 480 + 20),
          Math.floor(Math.random() * 4800 + 200)
        ])
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
