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
  const { title = "", seriesData = [] } = data;
  // 数据总和
  const total
    = seriesData?.length > 1 && seriesData[1].data.reduce((acc, item) => {
      return acc + item.value;
    }, 0) || 0;

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
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "rgba(0, 0, 0, 0.6)",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: "rgba(255, 255, 255, 1)"
      },
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: [
      {
        orient: "vertical",
        right: "20%",
        top: "30%", // 'center',
        align: "left",
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 16,
        icon: "rect",
        textStyle: {
          fontSize: 14,
          color: "rgba(255, 255, 255, .8)"
        },
        data: (seriesData?.length && seriesData[0].data.map(v => v.name)) || []
      },
      {
        orient: "vertical",
        right: "10%",
        top: "30%", // 'center',
        align: "left",
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 16,
        icon: "square",
        textStyle: {
          rich: {
            name: {
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.8)",
              padding: [0, 5, 0, 0]
            },
            value: {
              fontSize: 14,
              color: "rgba(255, 255, 255, 1)",
              padding: [0, 5, 0, 0]
            },
            ratio: {
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.4)",
              padding: [0, 5, 0, 0]
            }
          }
        },
        formatter: (name) => {
          const data = seriesData?.length && seriesData[1].data;
          const res = data.find(v => v.name === name);
          const value = (res && res.value) || 0;
          const ratio = ((value * 100) / (total || 1)).toFixed(1);
          return `{name|${name}}  {value|${value}} {ratio|/ ${ratio}%}`;
        },
        data: (seriesData?.length && seriesData[1].data.map(v => v.name)) || []
      }
    ],
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    series: [
      // 内环
      {
        type: "pie",
        radius: [0, "40%"],
        center: ["30%", "50%"],
        label: {
          position: "inside" // 标签的位置，'outside'饼图扇区外侧，'inside'饼图扇区内部，'center'在饼图中心位置
        },
        labelLine: {
          show: false
        },
        data: seriesData?.length && seriesData[0].data || []
      },
      // 外环
      {
        type: "pie",
        radius: ["50%", "70%"],
        center: ["30%", "50%"],
        avoidLabelOverlap: true,
        hoverOffset: 15,
        label: {
          show: true,
          position: "outside",
          fontSize: 18,
          rich: {
            hr: {
              backgroundColor: "rgba(255, 255, 255, .85)",
              borderRadius: 3,
              width: 3,
              height: 3,
              padding: [3, 3, 0, -12]
            },
            name: {
              padding: [-25, 15, -20, 15]
            }
          },
          formatter: "{hr|}\n{name|{b}：{d}%}"
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 30,
          lineStyle: {
            width: 1
          }
        },
        tooltip: {
          show: false
        },
        data: seriesData?.length && seriesData[1].data || []
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
        seriesData: [
          {
            name: "测试数据1",
            data: [
              {
                name: "国内",
                value: 60,
                selected: true
              },
              {
                name: "国外",
                value: 40
              }
            ]
          },
          {
            name: "测试数据2",
            data: [
              {
                name: "北京",
                value: 20
              },
              {
                name: "天津",
                value: 20
              },
              {
                name: "上海",
                value: 20
              },
              {
                name: "美国",
                value: 20
              },
              {
                name: "法国",
                value: 20
              }
            ]
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
