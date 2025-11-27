<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor, chartColors } from "@/views/echarts/constant";

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

// 纹理
const imageTexture = new Image();
imageTexture.src
  = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKElEQVQ4jWP8//8/AwXgPxMluhkYGBhGDRg1YNQAKhnAwsDAQFF+BgBtSwUd6uvSywAAAABJRU5ErkJggg==";

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
      right: "5%",
      top: "7%",
      feature: {
        // 保存为图片
        saveAsImage: {},
        // 动态类型切换
        magicType: {
          type: ["line", "bar", "stack"]
        }
      }
    },
    title: {
      text: title || "",
      subtext: "",
      top: "2%",
      left: "center",
      textStyle: {
        align: "center",
        color: "#fff",
        fontSize: 20
      }
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
        fontSize: 14
      }
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "rgba(0, 0, 0, 0.6)",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: "#ffffff"
      },
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    xAxis: [
      {
        type: "category",
        // 坐标轴的轴线
        axisLine: {
          show: true,
          symbol: ["none", "arrow"],
          symbolSize: [10, 15],
          symbolOffset: [0, 0],
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)"
          }
        },
        // 坐标轴的刻度
        axisTick: {
          show: true,
          interval: 0, // 刻度显示间隔，此时显示所有刻度
          length: 4, // 坐标轴刻度的长度，默认5
          inside: false, // 刻度标签是否朝内，默认false(朝外)
          alignWithLabel: true, // 刻度与标签对齐
          lineStyle: {
            fontSize: 12,
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.4)"
          }
        },
        // 坐标轴的刻度标签
        axisLabel: {
          interval: 0,
          inside: false, // 刻度标签是否朝内，默认false(朝外)
          fontSize: 12,
          fontWeight: 400,
          color: "rgba(255, 255, 255, 0.4)",
          formatter: (name) => {
            const len = name.length;
            let nameArr = [];
            if (len > 5) {
              // 根据情况控制长度
              name = `${name.slice(0, 5)}...`;
              nameArr = name.split("");
            } else {
              nameArr = name.split("");
            }
            return nameArr.join("\n"); // x轴文字垂直排列
          }
        },
        // 坐标轴的分隔线
        splitLine: {
          show: false,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)"
          }
        },
        data: xAxisData || []
      }
    ],
    yAxis: [
      {
        type: "value",
        splitNumber: 5, // 坐标轴的分割段数
        // 坐标轴的轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)"
          }
        },
        // 坐标轴的刻度
        axisTick: {
          show: true,
          lineStyle: {
            fontSize: 12,
            color: "rgba(255, 255, 255, 0.4)"
          }
        },
        // 坐标轴的刻度标签
        axisLabel: {
          show: true,
          color: "rgba(255, 255, 255, 0.4)"
        },
        // 坐标轴的分隔线
        splitLine: {
          show: false,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)"
          }
        }
      }
    ],
    series: [
      {
        type: "bar",
        barWidth: "40%",
        barMaxWidth: 100,
        showBackground: true,
        backgroundStyle: {
          color: `${chartColor[0]}4d` // 背景颜色
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: chartColors[0][0] // 0% 处的颜色
              },
              {
                offset: 1,
                color: chartColors[0][1] // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          },
          borderRadius: [0, 0, 0, 0]
        },
        label: {
          show: true,
          position: "top",
          color: "rgba(255, 255, 255, 0.8)",
          fontWeight: 700,
          fontSize: 14
        },
        name: seriesData?.length ? seriesData[0].name : "",
        data: seriesData?.length ? seriesData[0].data : []
      },
      // 纹理
      {
        type: "bar",
        barWidth: "40%",
        barMaxWidth: 100,
        barGap: "-100%",
        itemStyle: {
          color: {
            image: imageTexture,
            repeat: "repeat"
          },
          opacity: 0.05
        },
        tooltip: {
          show: false
        },
        z: 0,
        data: seriesData?.length ? seriesData[1].data : []
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
        title:
          "柱状图纹理背景。用backgroundStyle设置背景颜色，再叠加一个背景是纹理图片的柱状图",
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`
        ),
        seriesData: [
          {
            name: "测试数据",
            data: Array.from({ length: 24 }, () =>
              Math.floor(Math.random() * 200 + 50))
          },
          {
            name: "测试数据2",
            data: Array.from({ length: 24 }, () => 250) // 纹理数据，取最大值
          }
        ]
      }
    };

    res.data.xAxisData.forEach(item => item.replace(/[^a-z0-9:\u4E00-\u9FA5]/gi, "")); // 只能是字母、数字、汉字、英文冒号
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
