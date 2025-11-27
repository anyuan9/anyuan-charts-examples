<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

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
  const barData = seriesData?.map((item) => item.value) || [];
  const yAxisData = seriesData?.map((item) => item.name) || [];
  const yAxisData2 = seriesData?.map((item) => item.value) || [];
  let maxValue = Math.max(...barData) + 100;
  let maxBarData = Array.from({ length: barData?.length }, (v, k) => maxValue);

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
    title: {
      text: title || "",
      subtext: "",
      top: "2%",
      left: "center",
      textStyle: {
        align: "center",
        color: "#ffffff",
        fontSize: 20,
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
    xAxis: {
      show: false,
    },
    yAxis: [
      {
        type: "category",
        // 坐标轴的轴线
        axisLine: {
          show: false,
        },
        // 坐标轴的刻度
        axisTick: {
          show: false,
        },
        // 坐标轴的刻度标签，在此标注左侧的文字信息
        axisLabel: {
          show: true,
          color: "rgba(255, 255, 255, 0.4)",
          fontSize: 14,
          margin: 30,
          rich: {
            icon1: {
              width: 20,
              height: 20,
              fontSize: 12,
              color: "#ffffff",
              align: "center",
              padding: [0, 0],
              backgroundColor: chartColor[0],
              // borderRadius: 10,
            },
            icon2: {
              width: 20,
              height: 20,
              fontSize: 12,
              color: "#ffffff",
              align: "center",
              padding: [0, 0],
              backgroundColor: chartColor[1],
              // borderRadius: 10,
            },
            icon3: {
              width: 20,
              height: 20,
              fontSize: 12,
              color: "#ffffff",
              align: "center",
              padding: [0, 0],
              backgroundColor: chartColor[2],
              // borderRadius: 10,
            },
            icon: {
              width: 20,
              height: 20,
              fontSize: 12,
              color: "#ffffff",
              align: "center",
              padding: [0, 0],
              backgroundColor: chartColor[3],
              // borderRadius: 10,
            },
            name: {
              width: 50,
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.8)",
              align: "left",
              padding: [3, 10, 3, 30],
            },
          },
          formatter: (value, index) => {
            return `{icon${index < 3 ? index + 1 : ""}|${index + 1}}{name|${value}}`;
          },
        },
        // 坐标轴的分隔线
        splitLine: {
          show: false,
        },
        inverse: true, // 重要属性，倒序
        data: yAxisData || [],
      },
      // 方案1：使用坐标轴刻度标签显示右侧文字信息，（方案2：使用series的label显示右侧文字信息，详见BarTop3）
      {
        splitLine: "none",
        axisLine: "none",
        axisTick: "none",
        // 坐标轴的刻度标签，在此标注右侧的文字信息
        axisLabel: {
          color: "#ffffff",
          fontSize: "16",
        },
        inverse: true, // 重要属性，倒序
        data: yAxisData2,
      },
    ],
    series: [
      {
        name: "内部横柱",
        type: "bar",
        yAxisIndex: 0,
        barWidth: 10,
        itemStyle: {
          borderRadius: 10,
          color: (params) => {
            const colorTmp = chartColor[params.dataIndex % chartColor.length];
            return {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: colorTmp + "4d",
                },
                {
                  offset: 1,
                  color: colorTmp,
                },
              ],
              global: false, // 缺省为 false
            };
          },
        },
        label: {
          // show: true,
          // position: 'right', // 'inside', 'right'
          // formatter: '{c}',

          show: true,
          position: "insideBottomRight", // 'inside',
          distance: 0,
          offset: [30, -20],
          padding: [6, 15],
          color: "#ffffff",
          fontSize: 14,
          backgroundColor: {
            image:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAAA+CAYAAAD5wvNAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA0xpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjQ3NTQ1RkVGOUM1MTFFOEJCQTdENzhFNjM5MzM3NkYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjQ3NTQ1RkRGOUM1MTFFOEJCQTdENzhFNjM5MzM3NkYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmE5M2UxZjIxLTQyMmYtMTE3Yy05MTVlLWVhNzA0NDUwYzIzOSIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmE5M2UxZjIxLTQyMmYtMTE3Yy05MTVlLWVhNzA0NDUwYzIzOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvulhDwAAAQ3SURBVHja7J1JaBRBGIX/iZEQN1CjwVxUcL+4hUnUU8SDHjQiiqJR0EOCYMAtIG4HRQXBBUQkXgQxxoOieJZ4UzO4oAe3CKJoQI2IGhUTZHz/dI12mul090xcJvU+ePSkpqsTXr1Ud81Ud8UW1SZFYuJgtsn0z+Iqd+2TFPHWGY1tFVSJ96ZgOx5lo7AdDBX9OmbMczx3mas8076BZQUhfoe3ns+xve/7/X6JcpyIZRK17u+2+I7tF5S/w+vneP0YuoXX16G33mMk5kkkCiV7RkLroNXQbE/Tk39HkdEIaDK00JTr//kd6Dx0FnqfzcELsqgzBjoCvYCOQuUMS14QM22lbfYSOgGV/cnAaG/UAD2FtkKD2QZ5yyBoE/QkfkMaoIF9HZiJerqDDkND6He/YYhp0wRCM62vAlMN3YZm0t9+ywyoNX5TluYamFroEjSMnlrR21xEaGqzDcxGqBEaQC+tQdu6MX4r1faRArPEXEUTOzkRb01lIFRgpkJN7Fms72maEJqpQYHR4VUzR0LEZKA5nug55PYGZjM0nV4Rg2Zhi19g9FO/vfSIeNiDXqYsU2B28lREfE5Nu7yBKYE20Bviw3r0MiXuwNRAxfSF+FBsMtIjMIT0xpp0YEZDs+gHCWC2XvxqYOYL57OQYDQjVRqYCnpBQlKugZlCH0hIJmtgJtAHEpKJGphS+kBCUqqBGUofSEiGFtADEgUGhjAwhIEhDAzJQ7o0MJ/pAwnJZw3MG/pAQvJBA/OMPpCQtGlgHtMHEpInGphW+kBCckcDo08mStILEoBmpCV90XuXfpAA7ibi0p7+HOYc/SAB6KPOxB2Yb/SE+KDZOOsOTAd0hr4QH87gdNThDoxyAOqkN8RDp8mGeAPTDu2jP8TDfr3YzRQY5Th0jx4Rg2bhmLvAG5huaCX0iV5Zj34pvQq9S3dvgVHaoLXQD3pmLdr2NYmK1DOZJSgwylWonr5ZSz3CcjXTG71NoDoF1bGnsa5nqUtUptpeogZGOQ0t5zWNNcPnFYk5qTaXbAOjXBFnUQOOnvov96EKhOVy0I5h5/TqhXClOI+u4lcI/Qdty91QPDFXHoapEGUSeBd0UJyFKnRs/oV+5y1foZPQJATlANQVtmI2dw28Fmf5m3Fmq4s2cT7N/096gS1ts7HiLH/zKupBclmRrcP0NCq9ob9KnGfN6NOjnSX8nCcwDmRb/VW6zQWss4SfyCNxZlXqRLmcJ/wX9tEfqX/IBaN84RC0I8dj6Opm22xKo803sulziZtyqK91t9tmms2B0XO6Ppv4WhZ1W0zdJANjFzo6qJZod07o/Odlpq4wMHYOMRdLuBv6dB9d1vejrWYxMA46olhktrnsw8BYhPYeC3x6j84IvRADYxEPMlyfZHOdw8BYhHsElB5JtdAWh0JakBH9jGW4OJ9UN9GO3/wUYAAaXtVsjsG1HQAAAABJRU5ErkJggg==",
          },
          formatter: "{c}", // {a}:系列名；{b}:数据名；{c}:数据值；{@xxx}：数据中名为 'xxx' 的维度的值
        },
        data: barData,
      },
      {
        name: "内部横柱顶部的白点",
        type: "scatter",
        yAxisIndex: 0,
        symbol: "circle",
        symbolSize: 12,
        itemStyle: {
          color: (params) => {
            const colorTmp = chartColor[params.dataIndex % chartColor.length];
            return colorTmp;
          },
          borderColor: '#fff',
          borderWidth: 3,
          borderRadius: [30, 0, 0, 30],
          // shadowColor: "rgba(255, 255, 255, 0.5)",
          // shadowBlur: 5,
          opacity: 1,
        },
        emphasis: {
          scale: false,
        },
        tooltip: {
          show: false,
        },
        z: 3,
        animationDelay: 500,
        data: barData || [],
      },
      {
        name: "外部框",
        type: "bar",
        yAxisIndex: 1,
        barGap: "-100%",
        barWidth: 20,
        itemStyle: {
          color: "none",
          borderColor: "#00c1de",
          borderWidth: 2,
          borderRadius: 10,
        },
        tooltip: {
          show: false,
        },
        data: maxBarData,
      },
      {
        name: '外部圆',
        type: 'scatter',
        yAxisIndex: 0,
        symbolSize: 24,
        itemStyle: {
          color: (params) => {
            const colorTmp = chartColor[params.dataIndex % chartColor.length];
            return colorTmp;
          },
          opacity: 1,
        },
        emphasis: {
          scale: false,
        },
        z: 30,
        data: Array.from({ length: barData?.length }, (v, k) => 0)
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
        seriesData: [
          {
            name: "测试数据",
            value: Math.floor(Math.random() * 20 + 200),
          },
          {
            name: "测试数据2",
            value: Math.floor(Math.random() * 20 + 180),
          },
          {
            name: "测试数据3",
            value: Math.floor(Math.random() * 20 + 160),
          },
          {
            name: "测试数据4",
            value: Math.floor(Math.random() * 20 + 140),
          },
          {
            name: "测试数据5",
            value: Math.floor(Math.random() * 20 + 120),
          },
          {
            name: "测试数据6",
            value: Math.floor(Math.random() * 20 + 100),
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
