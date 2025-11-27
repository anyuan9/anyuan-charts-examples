<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

// const icon_anchor = ${require('@/assets/images/anchor.png')}
import icon_anchor from '@/assets/images/anchor.png'

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
  const { title = "", xAxisData, yAxisName, seriesData } = data;

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
      itemWidth: 8, // 图例标记的图形宽度，默认25
      itemHeight: 8, // 图例标记的图形高度，默认14
      itemGap: 25, // 图例项之间的间隔，单位px，默认10，可取值：5、[5, 10]、[5, 10, 5, 10]
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
      padding: [12, 20],
      textStyle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 1)",
      },
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
                color: "rgba(255, 255, 255, 1)", // 50% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(255, 255, 255, 0)", // 100% 处的颜色
              },
            ],
            global: false,
          },
        },
      },
      formatter: (params) => {
        // 方式1 定义div样式；方式2 使用rich样式
        const labels = params.map((item) => {
          const {
            axisIndex,
            axisValue,
            color,
            data,
            dataIndex,
            name,
            seriesIndex,
            seriesName,
            value,
          } = item;
          return `<div style='margin-top: 8px;'>
          <span style='display:inline-block;width:10px;height:10px;background-color:${item?.color};'></span>
          <span style='padding-left: 4px;'>${item.name}</span>
          <span style='padding-left: 8px; color: ${item?.color}'>${item?.value}</span>
        </div>`;
        });
        return `${title} <br/> ${labels.join(" ")}`;
      },
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
    xAxis: [
      {
        type: "category",
        offset: 5, // X 轴相对于默认位置的偏移
        boundaryGap: false, // 坐标轴两边留白策略，设置为 true 坐标轴两边留白。可取值：true | false | ['20%', '20%']
        // 坐标轴的轴线
        axisLine: {
          // 坐标轴轴线相关设置。数学上的x轴
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
    ],
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
        fontSize: 12,
        // padding: 16
      },
      // 坐标轴在 grid 区域中的分隔线
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      // 坐标轴在 grid 区域中的分隔区域
      splitArea: {
        show: false,
        areaStyle: {
          color: ["rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.08)"],
        },
      },
    },
    series: [
      {
        type: "line",
        smooth: true, // 是否平滑曲线
        symbol: "circle", // 标记(折线拐点)的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
        // symbol: `image://${icon_anchor}`, // 标记(折线拐点)的图形
        symbolSize: 6, // 标记的大小，默认为4。可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。还可以设置为如下格式的回调函数：(value: Array|number, params: Object) => number|Array
        // 折线拐点标志的样式
        itemStyle: {
          color: chartColor[0],
        },
        // 线条样式
        lineStyle: {
          width: 2,
          color: chartColor[0], // 线条颜色。注：修改 lineStyle 中的颜色不会影响图例颜色，如果需要图例颜色和折线图颜色一致，需修改 itemStyle.color，线条颜色默认也会取该颜色。
          borderColor: "rgba(0, 0, 0, .4)",
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
              {
                offset: 0,
                color: `${chartColor[0]}80`, // 0% 处的颜色
              },
              {
                offset: 1,
                color: `${chartColor[1]}00`, // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          shadowColor: `${chartColor[0]}80`, // 阴影颜色
          shadowBlur: 20, // shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
        },
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || [],
      },
      {
        type: "line",
        smooth: true, // 是否平滑曲线
        symbol: "diamond",
        // symbol: 'circle', // 标记(折线拐点)的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
        // symbol: `image://${require('@/assets/images/anchor.png')}`, // 标记(折线拐点)的图形
        symbolSize: 8,
        showSymbol: false,
        // 折线拐点标志的样式
        itemStyle: {
          color: chartColor[1],
          borderWidth: 2,
          borderColor: "rgba(255, 255, 255, 0.8)",
        },
        // 线条样式
        lineStyle: {
          width: 2,
          color: chartColor[1], // 线条颜色
          borderColor: "rgba(0, 0, 0, .4)",
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
              {
                offset: 0,
                color: `${chartColor[1]}80`, // 0% 处的颜色
              },
              {
                offset: 1,
                color: `${chartColor[1]}00`, // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          shadowColor: `${chartColor[1]}80`, // 阴影颜色
          shadowBlur: 20, // shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
        },
        tooltip: {
          show: true,
        },
        name: (seriesData?.length > 1 && seriesData[1].name) || "",
        data: (seriesData?.length > 1 && seriesData[1].data) || [],
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
        yAxisName: "人数",
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
  background: rgba(8, 25, 66, 1);
}
</style>
