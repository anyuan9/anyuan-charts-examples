<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
  autoTooltipLoop: true, // 是否自动循环 tooltip，默认间隔时间1500ms
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s",
    },
  },
});

function getOption(data) {
  const {
    title = "",
    xAxisData,
    xAxisName,
    yAxisName,
    seriesData,
    markLineData,
  } = data;
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
          type: ["line", "bar", "stack"],
        },
      },
    },
    // 标题
    title: {
      text: title || "",
      subtext: "",
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 20,
      },
      top: "2%", // title 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "center", // title 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
    },
    // 图例(series内容需要配置name属性)
    legend: {
      show: true,
      top: "2%",
      right: "5%",
      icon: "rect", // 图例项的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
      itemWidth: 12, // 图例标记的图形宽度，默认25
      itemHeight: 12, // 图例标记的图形高度，默认14
      itemGap: 15, // 图例项之间的间隔，单位px，默认10，可取值：5、[5, 10]、[5, 10, 5, 10]
      // 图例文字的样式
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 14,
      },
    },
    // 提示框
    tooltip: {
      trigger: "axis", // 触发类型，可取值：数据项图形触发('item')、坐标轴触发('axis')、不触发('none')
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderColor: "transparent",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 1)",
      },
      // 坐标轴指示器
      axisPointer: {
        type: "line", // 指示器类型，默认为'line'，可选为：'line'直线指示器、'shadow'阴影指示器、'none'无指示器、'cross'十字准星指示器。
        lineStyle: {
          type: "solid",
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
                color: "rgba(255, 255, 255, 0)", // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: "rgba(255, 255, 255, 0.4)", // 50% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(255, 255, 255, 0)", // 100% 处的颜色
              },
            ],
            global: false,
          },
        },
        label: {
          show: true,
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderColor: "rgba(0, 0, 0, 0)",
          shadowColor: "rgba(0, 0, 0, 0)",
          shadowOffsetY: 0,
        },
      },
      showContent: true, // 是否显示提示框浮层，默认显示。只需tooltip触发事件或显示axisPointer而不需要显示内容时可配置该项为false。
      // 提示框浮层内容格式器 - 字符串模板
      formatter: "{a}<br />{b0}: {c0}", // 在折线（区域）图、柱状（条形）图、K线图 : {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "5%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    // 直角坐标系的 x 轴
    xAxis: {
      type: "category",
      boundaryGap: true, // 坐标轴两边留白策略，设置为 true 坐标轴两边留白。可取值：true | false | ['20%', '20%']
      name: xAxisName, // 坐标轴名称
      // 坐标轴名称的文字样式
      nameTextStyle: {
        align: "center",
      },
      // 坐标轴的轴线
      axisLine: {
        show: true,
        symbol: ["none", "arrow"],
        symbolSize: [10, 15],
        symbolOffset: [0, 0],
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      // 坐标轴的刻度
      axisTick: {
        show: true,
        interval: 0, // 刻度显示间隔，此时显示所有刻度
        length: 4, // 坐标轴刻度的长度，默认5
        inside: true, // 刻度标签是否朝内，默认false(朝外)
        alignWithLabel: true, // 刻度与标签对齐
        lineStyle: {
          fontSize: 12,
          fontWeight: 400,
          color: "#ffffff",
          opacity: 0.4,
        },
      },
      // 坐标轴的刻度标签
      axisLabel: {
        inside: false, // 刻度标签是否朝内，默认false(朝外)
        rotate: 0, // 刻度标签旋转的角度，从 -90 度到 90 度，默认0
        margin: 4, // 刻度标签与轴线之间的距离，默认值8
        fontSize: 12,
        fontWeight: 400,
        color: "rgba(255, 255, 255, 0.4)",
      },
      // 坐标轴的分隔线
      splitLine: {
        show: false,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      data: xAxisData || [],
    },
    // 直角坐标系的 y 轴
    yAxis: {
      type: "value",
      name: yAxisName,
      // 坐标轴名称的文字样式
      nameTextStyle: {
        align: 'right',
        padding: [0, 6, 0, 0],
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
      },
      // 坐标轴的轴线
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      // 坐标轴的刻度
      axisTick: {
        show: false,
      },
      // 坐标轴的刻度标签
      axisLabel: {
        show: true,
        color: "rgba(255, 255, 255, 0.4)",
      },
      // 坐标轴在 grid 区域中的分隔线
      splitLine: {
        lineStyle: {
          type: "dashed", // 线的类型
          color: "rgba(255, 255, 255, 0.2)",
          fontSize: 12,
        },
      },
      // 坐标轴在 grid 区域中的分隔区域
      splitArea: {
        show: true,
        areaStyle: {
          color: ["rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.08)"],
        },
      },
    },
    series: [
      {
        type: "line",
        // xAxisIndex: 0, // 指定使用的 x 轴的 index，在单个图表实例中存在多个 x 轴的时候有用。默认为0。
        // yAxisIndex: 0, // 指定使用的 y 轴的 index，在单个图表实例中存在多个 y 轴的时候有用。默认为0。
        // polarIndex: 0, // 指定使用的极坐标系的 index，在单个图表实例中存在多个极坐标系的时候有用。默认为0。
        smooth: true, // 是否平滑曲线
        // smoothMonotone : "none", // 折线平滑后是否在一个维度上保持单调性，可以设置成'x', 'y'来指明是在 x 轴或者 y 轴上保持单调性
        step: false, // 是否是阶梯图，可选值：false（默认），true，'start'（从起点开始），'middle'（从中间开始），'end'（从终点开始）
        symbol: "circle", // 标记(折线拐点)的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
        // symbol: `image://${require('@/assets/images/anchor.png')}`, // 标记(折线拐点)的图形
        symbolSize: 6, // 标记的大小，默认为4。可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。还可以设置为如下格式的回调函数：(value: Array|number, params: Object) => number|Array
        // symbolRotate: 0, // 标记的旋转角度（而非弧度）。正值表示逆时针旋转。
        // symbolKeepAspect: false, // 如果 symbol 是 path:// 的形式，是否在缩放时保持该图形的长宽比，默认false
        // symbolOffset: [0, 0], // 标记相对于原本位置的偏移。默认情况下，标记会居中置放在数据对应的位置，但是如果 symbol 的尺寸大于数据点，可以通过 symbolOffset 属性来改变标记相对于原本位置的偏移，例如 [0, '-50%'] 可以将标记的底部放在数据对应的位置。
        // showSymbol: true, // 是否显示 symbol(折线拐点), 如果 false 则只有在 tooltip hover 的时候显示。
        // showAllSymbol: 'auto', // 只在主轴为类目轴（axis.type 为 'category'）时有效。 可选值：'auto'（默认值）, true，false。
        // legendHoverLink: true, // 是否启用图例 hover 时的联动高亮。默认为true。
        // triggerLineEvent: false, // 线条和区域面积是否触发事件。默认为false。
        // silent: false, // 是否在鼠标 hover 的时候显示 tooltip。如果设置为 false，只有在 tooltip.trigger 为 'axis' 的时候，tooltip 才会显示。如果设置为 true，则鼠标 hover 的时候不会触发。
        // sampling : "lttb", // 折线图在数据量较多的时候显示策略。可选值：'average'，'max'，'min'，'sum'，'minmax'，'lttb'
        // zlevel: 0, // zlevel用于 Canvas 分层，不同zlevel值的图形会放置在不同的 Canvas 中，Canvas 分层是一种常见的优化手段。我们可以把一些图形变化频繁（例如有动画）的图形放在单独的 Canvas 中，这样可以避免频繁刷新整个 Canvas，从上至下分别为：0（最高） -> 9（最低），默认0。
        // z: 2, // z值用于控制图形的前后顺序。z值小的图形会被z值大的图形覆盖。z相比zlevel优先级更低，而且不会创建新的 Canvas。
        // 折线拐点标志的样式
        itemStyle: {
          color: chartColor[0],
          borderWidth: 8,
          borderColor: "rgba(255, 255, 255, 0.3)",
          opacity: 1, // 透明度
        },
        // 线条样式
        lineStyle: {
          type: "solid", // 线条类型
          width: 4, // 线宽
          // color: chartColor[0], // 线条颜色。注：修改 lineStyle 中的颜色不会影响图例颜色，如果需要图例颜色和折线图颜色一致，需修改 itemStyle.color，线条颜色默认也会取该颜色。
          // 线条的渐变颜色
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: chartColor[0] }, // 0% 处的颜色
              { offset: 1, color: chartColor[1] }, // 100% 处的颜色，可自定义颜色
            ],
            global: false,
          },
          borderColor: "rgba(0, 0, 0, .4)", // 边框颜色
        },
        // 区域填充样式
        areaStyle: {
          // 区域填充样式
          // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${chartColor[0]}80` }, // 0% 处的颜色
              { offset: 1, color: `${chartColor[0]}00` }, // 100% 处的颜色
            ],
            global: false,
          },
          shadowColor: `${chartColor[0]}80`, // 阴影颜色
          shadowBlur: 20, // shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
          opacity: 0.8,
        },
        // 图形上的文本标签
        label: {
          show: true,
          position: "top",
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: 14,
        },
        // 折线端点的标签
        endLabel: {},
        // 标签的视觉引导线配置
        labelLine: {},
        // 标签的统一布局配置
        labelLayout: {},
        // 折线图的高亮状态
        emphasis: {
          itemStyle: {
            color: chartColor[0],
            borderColor: "rgba(255, 255, 255, 0.6)",
          },
          label: {
            // position: "right",
            // distance: 8,
            color: chartColor[0],
            fontWeight: 600,
            fontSize: 14,
            padding: [2, 4],
            borderWidth: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderColor: "rgba(0, 0, 0, 0.8)",
          },
        },
        // 折线图的淡出状态。开启 emphasis.focus 后有效。
        blur: {},
        selectedMode: false, // 选中模式的配置，表示是否支持多个选中，默认关闭，支持布尔值和字符串，字符串取值可选'single'，'multiple'，'series' 分别表示单选，多选以及选择整个系列。
        // 折线图的选中状态。开启 selectedMode 后有效。
        select: {},
        // 图表标注
        markPoint: {},
        // 图表标线。此处是特地用来实现折线下的下拉竖线
        markLine: {
          symbol: [null, null],
          cap: "round",
          lineStyle: {
            type: "dotted",
            width: 2,
            color: `${chartColor[0]}80`,
            // 线性渐变
            // color: {
            //   type: 'linear',
            //   x: 0,
            //   y: 0,
            //   x2: 0,
            //   y2: 1,
            //   colorStops: [
            //     { offset: 0, color: chartColor[0] + '80' },
            //     { offset: 1, color: chartColor[0] + '00' },
            //   ],
            //   global: false
            // },
          },
          data: markLineData || [[{ coord: ["", 0] }, { coord: ["", 0] }]],
        },
        // 图表标域，常用于标记图表中某个范围的数据，例如标出某段时间投放了广告。
        markArea: {
          show: true,
        },
        // 本系列特定的 tooltip 设定
        tooltip: {
          show: true,
        },
        // stack: "总量", // 数据堆叠，同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加。
        // stackStrategy: "samesign", // 堆积数值的策略。可选值：'samesign'，'all'，'positive'，'negative'。默认值：'samesign'。
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || [],
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
        xAxisName: "时间",
        yAxisName: "单位(万)",
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`,
        ),
        seriesData: [
          {
            name: "今日",
            data: Array.from({ length: 24 }, (_, i) =>
              Math.floor(Math.random() * 500 + 100),
            ),
          },
        ],
      },
    };

    const option = getOption({
      ...res.data,
      // 标记线数据，此处是特地用来实现折线下的下拉竖线
      markLineData:
        res.data.seriesData[0].data.map((item, index) => [
          { coord: [res.data.xAxisData[index], item - 3] }, // 高度减3
          { coord: [res.data.xAxisData[index], 0] },
        ]) || [],
    });
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
          fontSize: 20,
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
  background: rgba(8, 25, 66, 1);
}
</style>
