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
  const { title = "", xAxisData, seriesData } = data;

  return {
    // 背景颜色，默认无背景
    backgroundColor: "rgba(8, 25, 66, 1)",
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
    // 工具栏
    toolbox: {
      show: true,
      left: "right", // 工具栏组件离容器左侧的距离。可取值：'left'、'center'、'right'、'auto'、像素值、百分比
      top: "top", // 工具栏组件离容器上侧的距离。可取值：'top'、'middle'、'bottom'、'auto'、像素值、百分比
      right: "5%", // 工具栏组件离容器右侧的距离。可取值：'left'、'center'、'right'、'auto'、像素值、百分比
      bottom: "5%", // 工具栏组件离容器下侧的距离。可取值：'top'、'middle'、'bottom'、'auto'、像素值、百分比
      orient: "horizontal", // 工具栏 icon 的布局朝向。可选：'horizontal'、'vertical'
      itemSize: 20, // 工具栏 icon 的大小，默认为15
      itemGap: 8, // 工具栏 icon 每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。默认为8，单位px
      // 工具栏 icon 的样式
      iconStyle: {
        color: "rgba(255, 255, 255, 0.5)" // icon 的颜色
        // borderColor: 'rgba(255, 255, 255, 0.5)', // icon 的边框颜色
        // borderWidth: 1, // icon 的边框宽度
        // borderType: 'solid', // icon 的边框类型，可选：'solid'、'dashed'、'dotted'
        // shadowBlur: 0, // icon 的阴影模糊大小
        // shadowColor: 'rgba(0, 0, 0, 0.5)', // icon 的阴影颜色
        // shadowOffsetX: 0, // icon 的阴影水平偏移
        // shadowOffsetY: 0, // icon 的阴影垂直偏移
        // opacity: 1 // icon 的透明度
      },
      feature: {
        // 数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
        dataView: { readOnly: false },
        // 动态类型切换
        magicType: {
          type: ["line", "bar", "stack"] // 启用的动态类型，包括'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）。
        },
        // 保存为图片
        saveAsImage: {
          type: "png" // 保存的图片格式。如果renderer的类型为 'canvas'（默认），则支持 'png'（默认）和 'jpg'；如果renderer的类型为 'svg'，则只支持 'svg'。
          // name: title, // 保存的文件名称，默认使用 title.text 作为名称。
        },
        // 配置项还原
        restore: {},
        // 数据区域缩放。目前只支持直角坐标系的缩放。
        dataZoom: {
          xAxisIndex: "all", // 指定哪些 xAxis 被控制。如果缺省则控制所有的 xAxis。如果设置为 'none' 则不控制任何 xAxis。如果设置为 'all' 则控制所有的 xAxis。
          yAxisIndex: "none" // 指定哪些 yAxis 被控制。如果缺省则控制所有的 yAxis。如果设置为 'none' 则不控制任何 yAxis。如果设置为 'all' 则控制所有的 yAxis。
        },
        // 选框组件的控制按钮，也可以在 brush.toolbox 中指定
        brush: {
          type: ["rect", "polygon", "clear"] // 启用的刷子组件类型，包括 'rect'（矩形）, 'polygon'（多边形）, 'lineX'（X轴上的直线）, 'lineY'（Y轴上的直线）, 'keep'（保持选择）, 'clear'（清除选择）。
        },
        // 自定义的工具名字，只能以 my 开头，例如下例中的 myTool1，myTool2：
        myTool1: {
          show: true,
          title: "自定义扩展方法1",
          icon: "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891",
          onclick: () => {
            alert("myToolHandler1");
          }
        },
        myTool2: {
          show: true,
          title: "自定义扩展方法2",
          icon: "image://https://echarts.apache.org/zh/images/favicon.png",
          onclick: () => {
            alert("myToolHandler2");
          }
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
      trigger: "axis"
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
      type: "value"
    },
    series: [
      {
        type: "bar",
        barWidth: 20,
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || []
      },
      {
        type: "line",
        smooth: true, // 是否平滑曲线
        // 线条样式
        lineStyle: {
          width: 2
        },
        name: (seriesData?.length && seriesData[1].name) || "",
        data: (seriesData?.length && seriesData[1].data) || []
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
