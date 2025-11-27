<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading, getInstance } = useECharts(chartRef, {
  autoTooltipLoop: false, // 是否自动循环 tooltip，默认间隔时间1500ms
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s",
    },
  },
});

function getOption(data) {
  const { title = "", subtitle = "", xAxisData, seriesData } = data;

  return {
    // 背景颜色，默认无背景
    // backgroundColor: "rgba(8, 25, 66, 1)",
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
    // 标题
    title: {
      text: title || "", // 主标题文本，支持使用 \n 换行。
      link: "", // 主标题文本超链接
      target: "blank", // 指定窗口打开主标题超链接，可选：self（当前窗口）、blank（新窗口）
      textStyle: {
        // width: 0, // 主标题文字的宽度
        // height: 0, // 主标题文字的高度
        lineHeight: 30, // 主标题文字的行高
        overflow: "none", // 主标题文字超出宽度是否截断或换行，可选：'truncate'（截断）、'break'（换行）、'breakAll' 换行（会强制单词内换行）
        ellipsis: "...", // 在overflow配置为'truncate'的时候，可以通过该属性配置末尾显示的文本
        color: "rgba(0, 0, 0, 0.85)",
        fontSize: 20, // 主标题文字的字体大小，默认为18px
        fontWeight: "bolder", // 主标题文字字体的粗细
        // textBorderColor: '', // 主标题文字本身的描边颜色
        // textBorderWidth: 0, // 主标题文字本身的描边宽度
        // textBorderType : 'solid', // 主标题文字本身的描边类型，可选：'solid'、'dashed'、'dotted'
        // textBorderDashOffset: 0, // 主标题文字本身的描边虚线偏移量
        // textShadowColor: '', // 主标题文字本身的阴影颜色
        // textShadowBlur: 0, // 主标题文字本身的阴影模糊大小
        // textShadowOffsetX: 0, // 主标题文字本身的阴影水平方向上的偏移距离
        // textShadowOffsetY: 0, // 主标题文字本身的阴影垂直方向上的偏移距离
      },
      subtext: subtitle || "", // 副标题文本，支持使用 \n 换行。
      sublink: "", // 副标题文本超链接
      subtarget: "blank", // 指定窗口打开副标题超链接，可选：self（当前窗口）、blank（新窗口）
      subtextStyle: {
        fontSize: 16,
        lineHeight: 20,
      },
      top: "2%", // title 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "center", // title 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "auto", // title 组件离容器右侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      bottom: "auto", // title 组件离容器下侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      textAlign: "auto", // 整体（包括 text 和 subtext）的水平对齐。可选值：'auto'、'left'、'right'、'center'。
      textVerticalAlign: "auto", // 整体（包括 text 和 subtext）的垂直对齐。可选值：'auto'、'top'、'bottom'、'middle'。
      padding: 5, // 标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。
      itemGap: 10, // 主副标题之间的间距
      backgroundColor: "transparent", // 标题背景色
      borderColor: "#ccc", // 标题边框颜色
      borderWidth: 0, // 标题边框线宽，单位px，默认为0（无边框）
      borderRadius: 0, // 标题边框圆角，单位px，支持传入数组分别指定 4 个圆角半径，默认为0
      shadowBlur: 10, // 图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
      shadowColor: "rgba(0, 0, 0, 0.5)", // 阴影颜色。支持的格式同color
      shadowOffsetX: 0, // 阴影水平方向上的偏移距离。
      shadowOffsetY: 0, // 阴影垂直方向上的偏移距离。
      triggerEvent: true, // 步骤1：是否触发事件。因为title 默认没有事件，设置title的triggerEvent为true 后，title就可以触发事件了。
    },
    // 提示框
    tooltip: {
      trigger: "axis",
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    // 直角坐标系的 x 轴
    xAxis: {
      type: "category",
      data: xAxisData || [],
    },
    // 直角坐标系的 y 轴
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "bar",
        barWidth: 20,
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || [],
      },
      {
        type: "line",
        smooth: true, // 是否平滑曲线
        // 线条样式
        lineStyle: {
          width: 2,
        },
        name: (seriesData?.length && seriesData[1].name) || "",
        data: (seriesData?.length && seriesData[1].data) || [],
      },
    ],
  };
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "测试数据",
        subtitle: "副标题的内容\n备注说明",
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`,
        ),
        seriesData: [
          {
            name: "测试数据1",
            data: Array.from({ length: 24 }, (_, i) =>
              Math.floor(Math.random() * 500 + 100),
            ),
          },
          {
            name: "测试数据2",
            data: Array.from({ length: 24 }, (_, i) =>
              Math.floor(Math.random() * 500 + 100),
            ),
          },
        ],
      },
    };

    const option = getOption(res.data);
    setOption(option);

    // 步骤2：绑定事件
    const echartsInstance = getInstance();
    if (echartsInstance) {
      echartsInstance.off("click", "title"); // 先解绑事件，防止事件重复触发
      // 绑定事件
      echartsInstance.on("click", "title", (params) => {
        // const { componentIndex, componentType, type, event } = params
        // if(componentType === 'title') {}
      });
    }
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
          color: "rgba(255, 255, 255, 0.6)",
        },
      },
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
