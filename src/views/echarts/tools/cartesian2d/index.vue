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
  const { title = "", xAxisName, yAxisName, xAxisData, seriesData } = data;

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
      trigger: "axis"
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "25%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    // 直角坐标系的 x 轴，一般情况下单个 grid 组件最多只能放上下两个 x 轴，多于两个 x 轴需要通过配置 offset 属性防止同个位置多个 x 轴的重叠。
    xAxis: [
      {
        show: true,
        type: "category", // 坐标轴类型，可选：'value'数值轴，适用于连续数据。'category'类目轴，适用于离散的类目数据。'time'时间轴，适用于连续的时序数据。'log'对数轴，适用于对数数据
        // gridIndex: 0, // x 轴所在的 grid 的索引，默认位于第一个 grid
        position: "bottom", // x 轴的位置，默认为 bottom，可选：top、bottom
        offset: 0, // X 轴相对于默认位置的偏移
        inverse: false, // 是否是反向坐标轴，默认为 false，可选：true、false
        boundaryGap: false, // 坐标轴两边留白策略，设置为 true 坐标轴两边留白。可取值：true | false | ['20%', '20%']
        min: "dataMin", // 坐标轴刻度最小值，可选：'dataMin' | 'dataMax' | number | Function
        max: "dataMax", // 坐标轴刻度最大值，可选：'dataMin' | 'dataMax' | number | Function
        startValue: 0, // 坐标轴的起始值。
        splitNumber: 5, // 坐标轴的分割段数，默认值：5。需要注意的是这个分割段数只是个预估值，最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整。
        minInterval: 0, // 自动计算的坐标轴最小间隔大小，例如可以设置成1保证坐标轴分割刻度显示成整数。只在数值轴或时间轴中（type: 'value' 或 'time'）有效。
        maxInterval: 0, // 自动计算的坐标轴最大间隔大小，例如可以设置成30保证坐标轴分割刻度最大为30。只在数值轴或时间轴中（type: 'value' 或 'time'）有效。
        // interval: 0, // 强制设置坐标轴分割间隔，在类目轴中无效。设置为 0 后，坐标轴不会自动分割，而是保留所有类目标签，一般不建议使用。
        animation: true, // 是否开启动画，默认为true。
        // animationThreshold : 2000, // 是否开启动画的阈值，当单个系列显示的图形数量大于这个阈值时会关闭动画。
        // animation其他属性
        silent: false, // 坐标轴是否是静态无法交互。
        triggerEvent: false, // 坐标轴的标签是否响应和触发鼠标事件，默认为 false。
        zlevel: 0, // zlevel用于 Canvas 分层，不同zlevel值的图形会放置在不同的 Canvas 中。zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面。默认：0
        z: 0, // z值用于控制图形的前后顺序，z值小的图形会被z值大的图形覆盖。z相比zlevel优先级更低，而且不会创建新的 Canvas。默认：0

        name: xAxisName, // 坐标轴名称
        nameLocation: "end", // 坐标轴名称显示位置。可选：'start'、'middle'、'end'
        nameGap: 15, // 坐标轴名称与轴线之间的距离
        nameRotate: 0, // 坐标轴名字旋转，角度值
        // 坐标轴名称的文字样式
        nameTextStyle: {
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: 14,
          align: "right",
          padding: 0
        },
        // 坐标轴名字的截断
        nameTruncate: {
          width: 80, // 截断文本的最大长度，超过此长度会被截断。
          ellipsis: "..." // 截断后文字末尾显示的内容。
        },

        // 坐标轴的轴线
        axisLine: {
          show: true, // 是否显示分隔线。默认为 true
          symbol: "none", // 轴线两边的箭头，可选：'none'、'arrow'、或者只在末端显示箭头可以设置为 ['none', 'arrow']
          symbolSize: [10, 15], // 轴线两边的箭头的大小，第一个数字表示宽度（垂直坐标轴方向），第二个数字表示高度（平行坐标轴方向）
          symbolOffset: 0, // 轴线两边的箭头的偏移，如果是数组，第一个数字表示起始箭头的偏移，第二个数字表示末端箭头的偏移；如果是数字，表示这两个箭头使用同样的偏移。
          // 所有属性{ color , width , type , dashOffset , cap , join , miterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)", // 坐标轴轴线颜色，默认为'#333'
            width: 1, // 坐标轴刻度线的宽度，默认为1
            type: "solid", // 坐标轴刻度线的类型，默认为solid，可选：'solid'、'dashed'、'dotted'
            dashOffset: 0, // 坐标轴刻度线的虚线偏移量，默认为0，可搭配 type 指定 dash array 实现灵活的虚线效果。
            cap: "round", // 坐标轴刻度线端点的形状，默认为'butt'，可选：'butt': 线段末端以方形结束、'round: 线段末端以圆形结束'、'square': 线段末端以方形结束
            join: "bevel", // 用于设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起，默认为'bevel'，可选：'miter'、'round'、'bevel'
            miterLimit: 10, // 最大斜接长度，当 setLineJoin 为 'miter' 时有效，超过该值时，连接效果变为 'bevel'
            opacity: 1 // 坐标轴刻度线的透明度，默认为1
          }
        },
        // 坐标轴的刻度
        axisTick: {
          show: true,
          inside: false, // 刻度是否朝内，默认false(朝外)
          length: 5, // 刻度线长
          interval: 0, // 坐标轴刻度的间隔，默认为'auto'自动判断。如果为 0，则强制设置为不间隔。如果设置为 1，表示『隔一个标签显示一个标签』。可以用数值表示间隔的数据，也可以通过回调函数控制。
          alignWithLabel: false, // 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐。默认 false
          // 所有属性{ color , width , type , dashOffset , cap , join , miterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)" // 坐标轴刻度线的颜色，默认取 axisTick.lineStyle.color
          }
        },
        // 坐标轴次刻度
        minorTick: {
          show: false, // 是否显示次刻度线，默认 false
          splitNumber: 5, // 次刻度线分割数，默认为5
          length: 3, // 次刻度线长
          // 所有属性{ color , width , type , dashOffset , cap , join , miterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)" // 次刻度线颜色，默认取 axisTick.lineStyle.color
            // ... 其他和 axisTick.lineStyle 相同的配置项
          }
        },
        // 坐标轴的刻度标签
        axisLabel: {
          show: true, // 是否显示刻度标签。默认为 true
          inside: false, // 刻度标签是否朝内，默认false(朝外)
          rotate: -30, // 刻度标签旋转的角度，从 -90 度到 90 度，默认0
          margin: 4, // 刻度标签与轴线之间的距离，默认值8
          padding: 0, // 刻度标签的内边距，例如  [3, 4, 5, 6]：表示 [上, 右, 下, 左] 的边距；例如 [3, 4]：表示 [上下, 左右] 的边距：4表示 [上, 右, 下, 右] 的边距。
          fontSize: 12,
          fontWeight: 400,
          // color: 'rgba(255, 255, 255, 0.4)',
          color: "rgba(255, 255, 255, 1)",
          opacity: 0.4
          // TODO
          // backgroundColor: {
          //   image: `${require('./image/bg_bq.png')}`,
          // },
        },
        // 坐标轴的分隔线
        splitLine: {
          show: true, // 是否显示分隔线。默认为 true
          showMinLine: true, // 是否显示分隔区域中的最小间隔线，默认 true
          showMaxLine: true, // 是否显示分隔区域中的最大间隔线，默认 true
          interval: 0, // 分隔线的间隔，默认为'auto'自动判断。如果为 0，则强制设置为不间隔。如果设置为 1，表示『隔一个标签显示一个标签』。可以用数值表示间隔的数据，也可以通过回调函数控制。
          // 所有属性{ color , width , type , dashOffset , cap , join , miterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)"
          }
        },
        // 次分隔线。次分割线会对齐次刻度线 minorTick
        minorSplitLine: {
          show: false, // 是否显示次分隔线。默认 false
          // 所有属性{ color , width , type , dashOffset , cap , join , miterLimit , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)" // 分隔线颜色，默认取 splitLine.lineStyle.color
          }
        },
        // 分隔区域
        splitArea: {
          show: false, // 是否显示分隔区域。默认 false
          interval: "auto", // 分隔区域的间隔，默认为'auto'自动判断。如果为 0，则强制设置为不间隔。如果设置为 1，表示『隔一个标签显示一个标签』。可以用数值表示间隔的数据，也可以通过回调函数控制。
          // 所有属性{ color , shadowBlur , shadowColor , shadowOffsetX , shadowOffsetY , opacity }
          areaStyle: {
            color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"]
          }
        },
        // 坐标轴指示器
        axisPointer: {
          show: false, // 是否显示坐标轴指示器，默认为 false
          type: "line", // 指示器类型，默认为'line'，可选为：'line'直线指示器、'shadow'阴影指示器、'none'无指示器、'cross'十字准星指示器。
          z: 0, // 坐标轴指示器的 z 值。控制图形的前后顺序。z值大的图形会覆盖 z值小的图形
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
          }
        },
        // 坐标轴 tooltip 设置，注意需设置 triggerEvent 为 true 并启用全局 option.tooltip 组件。
        tooltip: {
          show: false // 是否显示提示框组件，默认为false
        },
        data: xAxisData || []
      }
    ],
    // 直角坐标系的 y 轴，一般情况下单个 grid 组件最多只能放左右两个 y 轴，多于两个 y 轴需要通过配置 offset 属性防止同个位置多个 Y 轴的重叠。
    // y 轴的属性与 x 轴类似，只不过 x 轴是水平放置的，y 轴是垂直放置的。
    yAxis: {
      show: true,
      type: "value",
      splitNumber: 3, // 坐标轴的分割段数，默认值：5。需要注意的是这个分割段数只是个预估值，最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整。
      // min: 0, // 坐标轴刻度最小值，可选：'dataMin' | 'dataMax' | number | Function
      // min: 'dataMin', // 'dataMin'取该轴上的最小值作为最小刻度
      // min: value => {
      //   return parseInt(value.min * 0.75)
      // },
      // max: 'dataMax', // 坐标轴刻度最大值，可选：'dataMin' | 'dataMax' | number | Function
      // max: (value) => {
      //    return parseInt(value.max * 1.2);
      // },

      name: yAxisName,
      // 坐标轴名称的文字样式
      nameTextStyle: {
        align: "right",
        padding: [0, 6, 0, 0],
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.6)"
      },
      // 坐标轴的轴线
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)"
        }
      },
      // 坐标轴的刻度
      axisTick: {
        show: false
      },
      // 坐标轴的刻度标签
      axisLabel: {
        show: true, // 是否显示刻度标签。默认为 true
        inside: false, // 刻度标签是否朝内，默认false(朝外)
        rotate: -30, // 刻度标签旋转的角度，从 -90 度到 90 度，默认0
        margin: 4, // 刻度标签与轴线之间的距离，默认值8
        padding: 0, // 刻度标签的内边距，例如  [3, 4, 5, 6]：表示 [上, 右, 下, 左] 的边距；例如 [3, 4]：表示 [上下, 左右] 的边距：4表示 [上, 右, 下, 右] 的边距。
        hideOverlap: false, // 是否隐藏重叠标签，默认 false
        width: 0, // 坐标轴刻度标签的宽度
        height: 0, // 坐标轴刻度标签的高度
        lineHeight: 20, // 坐标轴刻度标签的行高
        fontSize: 12,
        fontWeight: 400,
        fontStyle: "normal", // 坐标轴刻度标签文字的样式
        fontFamily: "sans-serif", // 坐标轴刻度标签文字的字体
        // color: 'rgba(255, 255, 255, 0.4)',
        color: "rgba(255, 255, 255, 1)",
        opacity: 0.4,
        align: "center", // 刻度标签与轴线之间的对齐方式，默认为'center'，可选：'left'、'right'
        verticalAlign: "middle", // 垂直对齐方式，默认为'middle'，可选：'top'、'bottom'
        backgroundColor: "transparent", // 坐标轴刻度标签的背景颜色
        borderColor: "transparent", // 坐标轴刻度标签的边框颜色
        borderWidth: 0, // 坐标轴刻度标签的边框宽度
        borderRadius: 0, // 坐标轴刻度标签的圆角半径
        shadowBlur: 0, // 坐标轴刻度标签的阴影模糊大小
        shadowColor: "transparent", // 坐标轴刻度标签的阴影颜色
        shadowOffsetX: 0, // 坐标轴刻度标签的阴影水平偏移
        shadowOffsetY: 0, // 坐标轴刻度标签的阴影垂直偏移
        overflow: "none", // 坐标轴刻度标签的文字超出宽度是否截断或换行，可选：'truncate'（截断）、'break'（换行）、'breakAll' 换行（会强制单词内换行）
        ellipsis: "...", // 坐标轴刻度标签的文字超出宽度是否截断或换行，可选：'truncate'（截断）、'break'（换行）、'breakAll' 换行（会强制单词内换行）
        // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。
        // 使用字符串模板，模板变量为刻度默认标签 {value}
        // formatter: '{value} kg',
        // 使用函数模板，函数参数分别为刻度数值（类目），刻度的索引
        formatter(value, index) {
          return `${value}kg`;
        }
      },
      // 坐标轴在 grid 区域中的分隔线
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)"
        }
      },
      // 坐标轴在 grid 区域中的分隔区域
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.08)"]
        }
      }
    },
    series: [
      {
        type: "line",
        coordinateSystem: "cartesian2d", // 该系列使用的坐标系，默认值为'cartesian2d'
        xAxisIndex: 0, // 该系列使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。
        yAxisIndex: 0, // 该系列使用的 y 轴的 index，在单个图表实例中存在多个 y 轴的时候有用。
        smooth: true, // 是否平滑曲线
        // 线条样式
        lineStyle: {
          width: 2
        },
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || []
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
        title: "直角坐标系",
        xAxisName: "单位(时)",
        yAxisName: "单位(个)",
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`
        ),
        seriesData: [
          {
            name: "测试数据1",
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
    <h2>
      二维的直角坐标系(笛卡尔坐标系):
      coordinateSystem:'cartesian2d'，用于绘制柱状图、折线图、散点图等。
    </h2>
    <h3>
      它由 x 轴和 y 轴组成，可以通过 xAxis 和 yAxis 配置项进行设置。可以通过
      xAxisIndex, yAxisIndex指定相应的坐标轴组件。
    </h3>

    <div ref="chartRef" :style="{ width: '100%', height: '100%' }" />
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 680px;
}
</style>
