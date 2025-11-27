<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";
import { lunarDate } from "./constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
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
  const { title = "", seriesData } = data;

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
        fontSize: 20,
      },
      top: "5%",
      left: "2%",
    },
    // 提示框
    tooltip: {},
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    // 视觉映射
    visualMap: {
      show: true,
      orient: "horizontal",
      left: "center",
      bottom: 20,
      min: 0,
      max: 300,
      inRange: {
        color: ["#e0ffff", "#006edd"],
        opacity: 0.3,
      },
      controller: {
        inRange: {
          opacity: 0.5,
        },
      },
    },
    // 日历坐标系
    calendar: [
      {
        top: "middle", // calendar 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
        left: "center", // calendar 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
        cellSize: [70, 70], // 日历每格框的大小，可设置单值 或数组 第一个元素是宽 第二个元素是高。 支持设置自适应：auto, 默认为高宽均为20
        orient: "vertical", // 日历坐标的布局朝向，可选值：'horizontal'、'vertical'，默认为'horizontal'
        silent: false, // 坐标轴是否是静态无法交互。
        zlevel: 0, // zlevel用于 Canvas 分层，不同zlevel值的图形会放置在不同的 Canvas 中。zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面。默认：0
        z: 0, // z值用于控制图形的前后顺序，z值小的图形会被z值大的图形覆盖。z相比zlevel优先级更低，而且不会创建新的 Canvas。默认：0
        // 设置日历坐标中 年的样式
        yearLabel: {
          show: true, // 是否显示年标签，默认true
          position: "left", // 年份的位置 默认横向是'left' 竖向是'top'。可选：'top','bottom','left','right'
          margin: 30, // 年份标签与轴线之间的距离，默认30
          padding: 5, // 年份标签内边距，单位px，默认0
          width: 0, // 文本显示宽度
          height: 0, // 文本显示高度
          lineHeight: 0, // 行高
          fontSize: 16, // 文本字体大小，默认12
          fontWeight: "normal", // 文本字体粗细，默认normal
          fontStyle: "normal", // 文本字体样式，默认normal
          fontFamily: "Arial, Verdana, sans-serif", // 文本字体，默认Arial, Verdana, sans-serif
          color: "rgba(255, 255, 255, 0.4)", // 文本颜色，默认'#000'
          backgroundColor: "transparent", // 文本背景颜色，默认透明
          align: "center", // 文本水平对齐方式，默认center。可选：'left'、'center'、'right'
          verticalAlign: "middle", // 文本垂直对齐方式，默认middle。可选：'top'、'middle'、'bottom'
          borderColor: "transparent", // 文本边框颜色，默认透明
          borderWidth: 0, // 文本边框宽度，默认0
          borderRadius: 0, // 文本边框圆角，默认0
          shadowBlur: 0, // 文本阴影模糊大小，默认0
          shadowColor: "transparent", // 文本阴影颜色，默认透明
          shadowOffsetX: 0, // 文本阴影水平偏移量，默认0
          shadowOffsetY: 0, // 文本阴影垂直偏移量，默认0
          overflow: "none", // 文本溢出显示方式，默认'none'。可选：'none'、'truncate'、'break'、'breakAll'
          ellipsis: "...", // 文本溢出显示省略号，默认'...'
          // 格式化年份文本，支持字符串模板和回调函数两种形式。
          // 使用字符串模板，模板变量：
          // {nameMap} 年份原本名称 eg：'2017-2018'
          // {start}   开始年份 eg: 2017
          // {end}     结束年份 eg: 2018
          // formatter: '{start}-{end}'
          // 使用函数模板，函数参数分别为刻度数值（类目），刻度的索引
          formatter: ({ nameMap, start, end }) => {
            return `${start}-${end}`;
          },
        },
        // 设置日历坐标中 月份轴的样式
        monthLabel: {
          show: true, // 是否显示月标签，默认true
          position: "start", // 月份的位置 在开头还是结尾。可选：'start','end'
          color: "rgba(255, 255, 255, 0.4)",
        },
        // 设置日历坐标中 日标签的样式
        dayLabel: {
          show: true, // 是否显示日标签，默认true
          firstDay: 1, // 日历坐标中一周的第一天是哪一天，默认0，可选：0-6，分别表示周日-周六
          nameMap: "ZH", // 星期显示的效果，默认为'en'。可设置中英文(ZH / EN)以及自定义
          position: "start", // 月份的位置 在开头还是结尾。可选：'start','end'
          color: "rgba(255, 255, 255, 0.4)",
        },
        // 设置日历格的样式
        itemStyle: {
          color: "#0C1328", // 日历坐标的背景色，默认'#fff'
          borderWidth: 1, // 日历坐标的边框宽度
          borderColor: "#fff", // 日历坐标的边框颜色，默认'#ccc'
          borderType: "solid", // 日历坐标的边框类型，可选值：'solid'、'dashed'、'dotted'
          borderDashOffset: 0, // 坐标轴刻度线的虚线偏移量，默认为0，可搭配 type 指定 dash array 实现灵活的虚线效果。
          borderCap: "butt", // 坐标轴刻度线端点的形状，默认为'butt'，可选：'butt': 线段末端以方形结束、'round: 线段末端以圆形结束'、'square': 线段末端以方形结束
          borderJoin: "bevel", // 用于设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起，默认为'bevel'，可选：'miter'、'round'、'bevel'
          borderMiterLimit: 10, // 最大斜接长度，当 setLineJoin 为 'miter' 时有效，超过该值时，连接效果变为 'bevel'
          opacity: 1, // 日历坐标的透明度，默认1
        },
        // 设置日历坐标分隔线的样式
        splitLine: {
          show: true, // 是否显示日历坐标的分割线，默认true
          // 所有属性{ color , width , type , dashOffset , cap , join , miterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
          lineStyle: {
            color: "#fff", // 日历坐标的分割线颜色，默认'#000'
            width: 1, // 日历坐标的分割线宽度
            type: "solid", // 日历坐标的分割线类型，可选值：'solid'、'dashed'、'dotted'
            dashOffset: 0, // 坐标轴刻度线的虚线偏移量，默认为0，可搭配 type 指定 dash array 实现灵活的虚线效果。
            cap: "round", // 坐标轴刻度线端点的形状，默认为'butt'，可选：'butt': 线段末端以方形结束、'round: 线段末端以圆形结束'、'square': 线段末端以方形结束
            join: "bevel", // 用于设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起，默认为'bevel'，可选：'miter'、'round'、'bevel'
            miterLimit: 10, // 最大斜接长度，当 setLineJoin 为 'miter' 时有效，超过该值时，连接效果变为 'bevel'
            opacity: 1, // 坐标轴刻度线的透明度，默认为1
          },
        },
        range: "2017-03", // 必填，日历坐标的范围，支持多种格式：年：2017，月：'2017-06'，日：'2017-07-15'，范围：['2017-01-01'-'2017-12-31']
        // 注意 此写法会识别为['2017-01-01', '2017-02-01']
        // range: ['2017-01', '2017-02'] // 此写法会识别为['2017-01-01', '2017-02-28']
      },
    ],
    series: [
      {
        type: "scatter",
        coordinateSystem: "calendar", // 设置日历坐标系
        label: {
          show: true,
          color: "#000",
          formatter: (params) => {
            return (
              new Date(params.value[0]).getDate() +
              "\n\n" +
              params.value[2] +
              "\n\n"
            );
          },
        },
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || [],
      },
      {
        type: "heatmap",
        coordinateSystem: "calendar", // 设置日历坐标系
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
        title: "日历坐标系",
        seriesData: [
          {
            name: "日历数据",
            data: lunarDate.map((item) => [item[0], 1, item[1], item[2]]),
          },
          {
            name: "热力数据",
            data: lunarDate.map((item) => [item[0], Math.random() * 300]),
          },
        ],
      },
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
    <h2>
      日历坐标系：coordinateSystem:'calendar'，用于绘制日历图，可以在热力图、散点图、关系图中使用日历坐标系。
    </h2>
    <h3>通过 calendar 配置项进行设置。</h3>

    <div ref="chartRef" :style="{ width: '100%', height: '100%' }" />
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 680px;
}
</style>
