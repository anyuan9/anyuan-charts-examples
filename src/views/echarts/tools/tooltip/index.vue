<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";

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
  const { title = "", xAxisData, seriesData } = data;

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
    // 提示框(基础版)
    // tooltip: {
    //   show: true,
    //   padding: [8, 12], // 提示框浮层内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。
    //   backgroundColor: "rgba(0, 0, 0, 0.5)",
    //   borderColor: "rgba(0, 0, 0, 0.4)",
    //   borderWidth: 1,
    //   trigger: "item",
    //   textStyle: {
    //     color: "#fff",
    //   },
    //   formatter: "{a} <br/>{b} : {c} ({d}%)",
    // },
    // 提示框
    tooltip: {
      show: true,
      padding: [8, 12], // 提示框浮层内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderColor: "rgba(0, 0, 0, 0.4)",
      borderWidth: 1,
      // showContent: true, // 是否显示提示框浮层，默认显示。只需tooltip触发事件或显示axisPointer而不需要显示内容时可配置该项为false。
      // alwaysShowContent: false, // 是否永远显示提示框内容
      // showDelay: 0, // 提示框浮层显示的延迟，单位为 ms，默认没有延迟，小数不起作用。在 alwaysShowContent 为 true 的时候无效。
      // hideDelay: 100, // 提示框浮层隐藏的延迟，单位为 ms，在 alwaysShowContent 为 true 的时候无效。
      // transitionDuration: 0.4, // 提示框浮层的动画时长。支持传入一个毫秒级的数值或是一个回调函数，用于返回每一个提示框项的动画时长。
      // enterable: false, // 鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，可设置为 true。
      // renderMode: 'richText', // 浮层内容渲染方式，默认以 'html' 渲染，可选 'html' 或 'richText'(富文本的形式渲染)。
      // className: 'echarts-tooltip', // 指定 tooltip 的 DOM 节点的 CSS 类。（只在 html 模式下生效）。
      // extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);', // 额外附加到浮层的 css 样式
      // order: 'seriesAsc', // 提示框浮层的渲染顺序，可选：'seriesAsc'（默认）表示系列按数组顺序依次渲染；'seriesDesc' 表示系列按数组反顺序依次渲染；'vertical' 表示按垂直顺序依次渲染；'horizontal' 表示按水平顺序依次渲染。
      // 坐标轴指示器
      axisPointer: {
        type: "line", // 指示器类型，默认为'line'，可选为：'line'直线指示器、'shadow'阴影指示器、'none'无指示器、'cross'十字准星指示器。
        // axis: 'auto', // 指示器的坐标轴，默认为'auto'自动选择，可选为：'x'、'y'、'angle'、'radius'、'auto'。
        // 坐标轴指示器的文本标签
        label: {
          show: true,
          margin: 3, // label 距离轴的距离。默认为3，单位px。
          padding: [5, 7, 5, 7], // 文本内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。默认为[5, 7, 5, 7]
          // width: 0, // 文本显示宽度
          // height: 0, // 文本显示高度
          lineHeight: 20, // 行高
          overflow: "none", // 文字超出宽度是否截断或换行，可选：'truncate'（截断）、'break'（换行）、'breakAll' 换行（会强制单词内换行）
          ellipsis: "...", // 在overflow配置为'truncate'的时候，可以通过该属性配置末尾显示的文本
          color: "#fff", // 文字的颜色。默认为#fff。
          fontSize: 12, // 文本标签字体大小。默认为12
          fontWeight: "normal", // 文本标签字体粗细。默认为normal，可选为：'normal'、'bold'、'bolder'、'lighter'、100 | 200 | 300 | 400... 等。
          // textBorderColor: '', // 文字本身的描边颜色
          // textBorderWidth: 0, // 文字本身的描边宽度
          // textBorderType : 'solid', // 文字本身的描边类型，可选：'solid'、'dashed'、'dotted'
          // textBorderDashOffset: 0, // 文字本身的描边虚线偏移量
          // textShadowColor: '', // 文字本身的阴影颜色
          // textShadowBlur: 0, // 文字本身的阴影模糊大小
          // textShadowOffsetX: 0, // 文字本身的阴影水平方向上的偏移距离
          // textShadowOffsetY: 0, // 文字本身的阴影垂直方向上的偏移距离
          backgroundColor: "rgba(0, 0, 0, 0.6)", // 文本标签的背景颜色，默认是和 axis.axisLine.lineStyle.color 相同
          borderColor: "rgba(0, 0, 0, 0)", // 文本标签的边框颜色
          borderWidth: 0, // 文本标签的边框宽度
          shadowBlur: 3, // 文本标签的阴影模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
          shadowColor: "#aaa", // 文本标签的阴影颜色
          shadowOffsetX: 0, // 文本标签的阴影水平方向上的偏移距离
          shadowOffsetY: 0, // 文本标签的阴影垂直方向上的偏移距离
          precision: "auto", // 文本标签中数值的小数点精度。默认根据当前轴的值自动判断。也可以指定如 2 表示保留两位小数。
          // formatter : '{value}', // 标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与 'formatter' 通用，详见 formatter。
          formatter: (params) => {
            const { axisIndex, axisDimension, value, seriesData } = params;
            return `${value}`;
          }
        },
        // 直线指示器的样式。axisPointer.type 为 'line' 时有效
        lineStyle: {
          // 纯色
          // color: "rgba(255, 255, 255, 0.4)"
          // 渐变色
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(255, 255, 255, 0)" // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: "rgba(255, 255, 255, 0.4)" // 50% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(255, 255, 255, 0)" // 100% 处的颜色
              }
            ],
            global: false
          },
          width: 1, // 指示器线宽，默认为1。
          type: "solid",
          dashOffset: 0, // 虚线偏移量，可搭配 type 指定 dash array 实现灵活的虚线效果。
          cap: "butt", // 线段末端的绘制方式。'butt': 线段末端以方形结束。'round': 线段末端以圆形结束。'square': 线段末端以方形结束
          join: "bevel", // 线段拐点绘制方式。'bevel': 拐点以斜角绘制。'round': 拐点以圆角绘制。'miter': 拐点以尖角绘制。
          // shadowBlur : 10,
          // shadowColor: "#aaa",
          // shadowOffsetX: 0,
          // shadowOffsetY: 0,
          opacity: 1 // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形
        },
        // 阴影指示器的样式。axisPointer.type 为 'shadow' 时有效
        shadowStyle: {
          // color: "rgba(0, 0, 0, 0.1)", // 填充颜色
          // shadowBlur : 10,
          // shadowColor: "#aaa",
          // shadowOffsetX: 0,
          // shadowOffsetY: 0
        },
        // 十字准星指示器的样式。axisPointer.type 为 'cross' 时有效。
        crossStyle: {
          // 纯色
          // color: "rgba(255, 255, 255, 0.4)"
          // 渐变色
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(255, 255, 255, 0)" // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: "rgba(255, 255, 255, 0.4)" // 50% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(255, 255, 255, 0)" // 100% 处的颜色
              }
            ],
            global: false
          },
          width: 1, // 指示器线宽，默认为1。
          type: "solid",
          dashOffset: 0, // 虚线偏移量，可搭配 type 指定 dash array 实现灵活的虚线效果。
          cap: "butt", // 线段末端的绘制方式。'butt': 线段末端以方形结束。'round': 线段末端以圆形结束。'square': 线段末端以方形结束
          join: "bevel", // 线段拐点绘制方式。'bevel': 拐点以斜角绘制。'round': 拐点以圆角绘制。'miter': 拐点以尖角绘制。
          // shadowBlur : 10,
          // shadowColor: "#aaa",
          // shadowOffsetX: 0,
          // shadowOffsetY: 0,
          opacity: 1 // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形
        },
        animation: true
      },
      // 提示框浮层的文本样式
      textStyle: {
        // width: 0, // 文本显示宽度
        // height: 0, // 文本显示高度
        // lineHeight: 20, // 行高
        // overflow: 'none', // 文字超出宽度是否截断或换行，可选：'truncate'（截断）、'break'（换行）、'breakAll' 换行（会强制单词内换行）
        // ellipsis: '...', // 在overflow配置为'truncate'的时候，可以通过该属性配置末尾显示的文本
        color: "rgba(255, 255, 255, 1)",
        fontSize: 14, // 字体大小
        fontStyle: "normal", // normal: 正常字体；italic: 斜体；oblique: 倾斜体
        fontWeight: "normal", // normal: 正常字体；bold: 粗体；bolder: 更粗；lighter: 更细
        fontFamily: "sans-serif", // 字体系列
        textBorderColor: "rgba(0, 0, 0, 0)", // 文字的边框颜色
        textBorderWidth: 0, // 文字的边框宽度
        textShadowBlur: 3, // 文字的阴影模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
        textShadowColor: "#aaa", // 文字的阴影颜色
        textShadowOffsetX: 0, // 文字的阴影水平方向上的偏移距离
        textShadowOffsetY: 0 // 文字的阴影垂直方向上的偏移距离
      },
      trigger: "axis", // 触发类型，可取值：'item'：数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。'axis'：坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。'none'：不触发
      // tooltip 中数值显示部分的格式化回调函数。仅格式化数值部分（如添加单位、保留小数位等）
      valueFormatter: (value, dataIndex) => {
        return `$${value}`;
      },
      // TODO 需要renderMode: 'richText',
      rich: {
        title: {
          color: "#333",
          fontSize: 16,
          fontWeight: "bold",
          padding: [5, 0]
        },
        value: {
          color: "#ff7f50",
          fontSize: 14,
          padding: [3, 0]
        },
        hr: {
          borderColor: "#777",
          width: "100%",
          borderWidth: 0.5,
          height: 0
        }
      },
      // 提示框浮层内容格式器，控制整个提示框的内容。formatter 的优先级高于valueFormatter。
      // 支持字符串模板和回调函数两种形式。
      // 方式1：字符串模板
      // 模板变量有 {a}, {b}，{c}，{d}，{e}，分别表示系列名，数据名，数据值等。 在 trigger 为 'axis' 的时候，会有多个系列的数据，此时可以通过 {a0}, {a1}, {a2} 这种后面加索引的方式表示系列的索引。
      // 不同图表类型下的 {a}，{b}，{c}，{d} 含义不一样。 其中变量{a}, {b}, {c}, {d}在不同图表类型下代表数据含义为：
      // - 折线（区域）图、柱状（条形）图、K线图 : {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
      // - 散点图（气泡）图 : {a}（系列名称），{b}（数据名称），{c}（数值数组）, {d}（无）
      // - 地图 : {a}（系列名称），{b}（区域名称），{c}（合并数值）, {d}（无）
      // - 饼图、仪表盘、漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
      // 更多其它图表模板变量的含义可以见相应的图表的 label.formatter 配置项。
      // formatter: "{a}<br/>{b} : {c} ({d}%)",
      // formatter: "{a}<br/>{b0}: {c0}<br/>{b1}: {c1}", // 在折线（区域）图、柱状（条形）图、K线图 : {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）

      // 方式2：回调函数
      formatter: (params, ticket, callback) => {
        if (Array.isArray(params)) {
          const {
            axisIndex,
            axisValue,
            componentIndex,
            data,
            dataIndex,
            value,
            name,
            seriesIndex,
            seriesName,
            color
          } = params[0];
          return `${name}<br />${seriesName} : ${value}`;
        } else {
          const {
            axisIndex,
            axisValue,
            componentIndex,
            data,
            dataIndex,
            value,
            name,
            seriesIndex,
            seriesName,
            color
          } = params;
          return `<div style='margin-top: 8px;'>
            <span style='padding-left: 4px;'>${name}</span><br />
            <span style='display:inline-block;width:10px;height:10px;background-color:${color};'></span>
            <span style='padding-left: 4px;'>${seriesName}</span>
            <span style='padding-left: 8px; color: ${color}'>${value}</span>
          </div>`;
        }
      }
      // TODO 待测试
      // formatter: (params, ticket, callback) => {
      //   if (Array.isArray(params)) {
      //     const { axisIndex, axisValue, componentIndex, data, dataIndex, value, name, seriesIndex, seriesName, color } = params[0]
      //     return `{title|${name}}\n{value|${value}}`;
      //   } else {
      //     const { axisIndex, axisValue, componentIndex, data, dataIndex, value, name, seriesIndex, seriesName, color } = params
      //     return `{title|${name}}\n{value|${value}}`;
      //   }
      // }
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
        tooltip: {
          // tooltip 中数值显示部分的格式化回调函数
          valueFormatter: (value, dataIndex) => {
            return `${value} °C`;
          }
        },
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
