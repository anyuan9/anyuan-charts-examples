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

const minVal = 50
const maxVal = 200
const minSymbolSize = 10
const maxSymbolSize = 50
function getOption(data) {
  const { title = "", xAxisData, maxValue, seriesData=[] } = data;

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
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 20,
      },
      top: "5%",
      left: "2%",
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
        fontSize: 14,
      },
    },
    // 提示框
    tooltip: {
      className: 'echarts-tooltip-scatter',
      backgroundColor: 'transparent',
      formatter: params => {
        const {
          name,
          dataIndex,
          data: { value },
        } = params
        const htmlStr = `
              <div style="width: 200px;position: relative;background: rgba(12,18,34,0.9);font-size:16px;color:rgba(216,229,255,1);">
                <div style="padding: 8px 12px;">
                  <div>${name}</div>
                  <div style="width:100%;display:flex;align-items:center;margin-top: 12px;">
                    <span style="">${xAxisData[dataIndex]}：</span>
                    <span style="font-size:20px;font-weight: 700;">${value}</span>
                  </div>
                </div>
              </div>
            `
        return htmlStr
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
    xAxis: {
      type: "category",
      boundaryGap: true, // 坐标轴两边留白策略
      data: xAxisData || [],
    },
    // 直角坐标系的 y 轴
    yAxis: {
      type: "value",
      // 坐标轴的分隔线
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
    visualMap: {
      show: true,
      min: 0,
      max: maxValue,
      inRange: {
        symbolSize: [minSymbolSize, maxSymbolSize],
      },
    },
    series: [
      {
        type: 'scatter',
        symbol: 'circle',
        symbolSize: (value) => {
          return parseInt(((value - minVal) * (maxSymbolSize - minSymbolSize)) / (maxVal - minVal)) + minSymbolSize
        },
        itemStyle: {
          color: chartColor[0],
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.2)',
        },
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || [],
      },
      {
        type: 'effectScatter', //effectScatter 涟漪效果, scatter 散点
        symbol: 'circle',
        symbolSize: (value) => {
          return parseInt(((value - minVal) * (maxSymbolSize - minSymbolSize)) / (maxVal - minVal)) + minSymbolSize
        },
        itemStyle: {
          color: chartColor[1],
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.2)',
        },
        // label: {
        //   show: true,
        //   position: 'right',
        //   formatter: '{b}：{c}', // {a}：系列名; {b}：数据名; {c}：数据值; {@xxx}：数据中名为 'xxx' 的维度的值；{@[n]}：数据中维度 n 的值
        // },
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
        xAxisData: Array.from(
          { length: 6 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`,
        ),
        maxValue: 100,
        seriesData: [
          {
            name: '测试数据1',
            data: Array.from({ length: 6 }, (_, i) => {
              const value = Math.floor(Math.random() * (maxVal - minVal) + minVal)
              return {
                name: '散点'+i,
                value: value,
              }
            }),
          },
          {
            name: '测试数据2',
            data: Array.from({ length: 6 }, (_, i) => {
              const value = Math.floor(Math.random() * (maxVal - minVal) + minVal)
              return {
                name: '涟漪散点'+i,
                value: value,
              }
            }),
          },
        ]
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
