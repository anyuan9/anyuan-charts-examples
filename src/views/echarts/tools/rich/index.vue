<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";

const weatherIcons = {
  cloudy: `${import.meta.env.BASE_URL}/static/images/cloudy_128.png`,
  showers: `${import.meta.env.BASE_URL}/static/images/showers_128.png`,
  sunny: `${import.meta.env.BASE_URL}/static/images/sunny_128.png`
};

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
    // 提示框
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    series: [
      {
        type: "pie",
        radius: [0, "30%"],
        selectedMode: "single",
        label: {
          position: "inner",
          fontSize: 14
        },
        labelLine: {
          show: false
        },
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || []
      },
      {
        type: "pie",
        center: ["50%", "50%"],
        radius: ["45%", "60%"],
        selectedMode: "single",
        labelLine: {
          length: 30
        },
        label: {
          backgroundColor: "#F6F8FC",
          borderColor: "rgba(0, 0, 0, 0.6)",
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            title: {
              color: "rgba(255, 255, 255, 0.5)",
              align: "center",
              lineHeight: 24
            },
            titleBg: {
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              width: "100%",
              align: "right",
              height: 24,
              borderRadius: [4, 4, 0, 0]
            },
            hr: {
              width: "100%",
              height: 0,
              borderWidth: 1,
              borderColor: "#8C8D8E"
            },
            name: {
              color: "#4C5058",
              fontSize: 14,
              fontWeight: "bold",
              lineHeight: 33
            },
            value: {
              color: "#4C5058",
              fontSize: 14,
              fontWeight: "bold",
              lineHeight: 33
            },
            percent: {
              color: "#fff",
              padding: [3, 4],
              borderRadius: 4,
              backgroundColor: "#4C5058"
            },
            sunny: {
              width: 30,
              height: 30,
              align: "left",
              backgroundColor: {
                image: weatherIcons.sunny
              }
            },
            cloudy: {
              width: 30,
              height: 30,
              align: "left",
              backgroundColor: {
                image: weatherIcons.cloudy
              }
            },
            showers: {
              width: 30,
              height: 30,
              align: "left",
              backgroundColor: {
                image: weatherIcons.showers
              }
            }
          },
          // formatter: [
          //   '{title|{a}}{titleBg|}',
          //   '{hr|}',
          //   '  {name|{b}：}{c}  {percent|{d}%}  '
          // ].join('\n'),
          formatter: (params) => {
            const { seriesName, name, value, percent, data, dataIndex } = params;
            const weatherName = dataIndex % 3 === 0 ? "sunny" : dataIndex % 3 === 1 ? "cloudy" : "showers";
            return [
              `{title|${seriesName}}{titleBg|}`,
              "{hr|}",
              `  {name|${name}：}${value}  {percent|${percent}%}  `,
              `  {${weatherName}|}`
            ].join("\n");
          }
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
            data: Array.from({ length: 4 }, (_, i) => {
              return {
                name: `数据1_${i}`,
                value: Math.floor(Math.random() * 500 + 100),
                selected: i === 0
              };
            })
          },
          {
            name: "测试数据2",
            data: Array.from({ length: 6 }, (_, i) => {
              return {
                name: `数据2_${i}`,
                value: Math.floor(Math.random() * 500 + 100)
              };
            })
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
