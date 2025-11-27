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
  const { title = "", xAxisData, seriesData } = data;
  console.log("seriesData", seriesData);

  const halfLen = Number(xAxisData.length / 2);
  const upperLimit = {
    name: "上限",
    value: 450,
    color: chartColor[2],
  };
  const lowerLimit = {
    name: "下限",
    value: 200,
    color: chartColor[3],
  };

  return {
    // 背景颜色，默认无背景
    backgroundColor: "rgba(8, 25, 66, 1)",
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
    // 标题
    title: [
      {
        text: title || "",
        textStyle: {
          color: "rgba(255, 255, 255, 0.85)",
          fontSize: 20,
        },
        top: "5%",
        left: "2%",
      },
      // 左侧标题
      {
        text: (seriesData.length && seriesData[0].name) || "",
        left: "25%",
        top: 10,
        textStyle: {
          // fontSize: '20',
          color: chartColor[0],
        },
      },
      // 右侧标题
      {
        subtext: (seriesData.length && seriesData[1].name) || "",
        right: "25%",
        top: 0,
        subtextStyle: {
          fontStyle: "bold",
          fontSize: "20",
          color: chartColor[1],
        },
      },
    ],
    // 提示框
    tooltip: {
      show: true,
      trigger: "axis", // 触发类型，可取值：数据项图形触发('item')、坐标轴触发('axis')、不触发('none')
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderColor: "transparent",
      padding: [12, 20],
      textStyle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 1)",
      },
      axisPointer: {
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
        // const { axisIndex, axisValue, color, data, dataIndex, name, seriesIndex, seriesName, value } = params[0]
        if (params[0].dataIndex <= halfLen) {
          return `${params[0].axisValue}: ${params[0].value}`;
        } else if (params[0].dataIndex >= halfLen) {
          return `${params[1].axisValue}: ${params[1].value}`;
        }
      },
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
    xAxis: [
      {
        type: "category",
        data: xAxisData || [],
      },
    ],
    // 直角坐标系的 y 轴
    yAxis: {
      type: "value",
    },
    // 视觉映射，用于设置视觉元素（如颜色、大小）与数据的关系
    visualMap: {
      show: false,
      type: "piecewise",
      dimension: 1,
      // seriesIndex: 0,
      pieces: [
        { gte: 0, lte: lowerLimit.value, color: lowerLimit.color }, // 使用visualMap设置color，则不能设置线条样式lineStyle
        {
          gte: lowerLimit.value,
          lte: upperLimit.value,
          color: "rgba(132,92,255,1)",
        },
        { gte: upperLimit.value, color: upperLimit.color },
      ],
    },
    series: [
      {
        type: "line",
        smooth: false, // 是否平滑曲线
        symbol: "circle", // 标记(折线拐点)的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
        // symbol: `image://${require('@/assets/images/anchor.png')}`, // 标记(折线拐点)的图形
        symbolSize: 4,
        showSymbol: false,
        // 折线拐点标志的样式
        itemStyle: {
          color: chartColor[0],
        },
        // 线条样式
        // lineStyle: {
        //   width: 2,
        //   color: chartColor[0], // 线条颜色
        //   borderColor: 'rgba(0, 0, 0, 0.4)',
        // },
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
                color: chartColor[0] + "80", // 0% 处的颜色
              },
              {
                offset: 1,
                color: chartColor[0] + "00", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          shadowColor: chartColor[0] + "80", // 阴影颜色
          shadowBlur: 20, // shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
        },
        // 图表标域
        markArea: {
          itemStyle: {
            color: chartColor[0] + "1a",
          },
          data: [
            [
              {
                xAxis: (xAxisData.length && xAxisData[0]) || "",
              },
              {
                xAxis: (xAxisData.length && xAxisData[halfLen]) || "",
              },
            ],
          ],
        },
        name: (seriesData.length && seriesData[0].name) || "",
        data: (seriesData.length && seriesData[0].data) || [],
      },
      {
        type: "line",
        smooth: false, // 是否平滑曲线
        symbol: "circle", // 标记(折线拐点)的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
        // symbol: `image://${require('@/assets/images/anchor.png')}`, // 标记(折线拐点)的图形
        symbolSize: 4,
        showSymbol: false,
        // 折线拐点标志的样式
        itemStyle: {
          color: chartColor[1],
        },
        // 线条样式
        // lineStyle: {
        //   width: 2,
        //   color: chartColor[1],, // 线条颜色
        //   borderColor: 'rgba(0, 0, 0, 0.4)',
        // },
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
                color: chartColor[1] + "80", // 0% 处的颜色
              },
              {
                offset: 1,
                color: chartColor[1] + "00", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          shadowColor: chartColor[1] + "80", // 阴影颜色
          shadowBlur: 20, // shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
        },
        // 图表标域
        markArea: {
          itemStyle: {
            color: chartColor[1] + "1a",
          },
          data: [
            [
              {
                xAxis: (xAxisData.length && xAxisData[halfLen]) || "",
              },
              {
                xAxis:
                  (xAxisData.length && xAxisData[xAxisData.length - 1]) || "",
              },
            ],
          ],
        },
        name: (seriesData.length && seriesData[1].name) || "",
        data: (seriesData.length && seriesData[1].data) || [],
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
        title: "标域",
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`,
        ),
        seriesData: [
          {
            name: "白天",
            data: Array.from({ length: 24 }, (_, i) => {
              if (i < 12) return Math.floor(Math.random() * 500 + 100); // 折线图的前一半数据
              if (i === 12) return 320; // 中间数字需要相同，保持连贯性
              return null;
            }),
          },
          {
            name: "夜晚",
            data: Array.from({ length: 24 }, (_, i) => {
              if (i > 12) return Math.floor(Math.random() * 500 + 100); // 折线图的后一半数据
              if (i === 12) return 320; // 中间数字需要相同，保持连贯性
              return null;
            }),
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
}
</style>
