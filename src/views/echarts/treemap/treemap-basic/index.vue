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
  const { title = "", seriesData } = data;

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
      formatter: (params) => {
        const { dataIndex, color, seriesName, data, treePathInfo } = params;
        if (!(seriesName && data.value)) {
          return "";
        }
        return `<div>${data.path}</div>
        <div style="color: #3CA890;">${data.value}<span style="margin: 0 6px;">/</span>${data.percent}%</div>`;
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
    series: [
      {
        type: "treemap",
        itemStyle: {
          borderColor: "#fff",
          borderRadius: 6
        },
        label: {
          show: true,
          fontSize: 16,
          color: "#fff",
          rich: {
            name: {
              fontSize: 16,
              color: "#fff"
            },
            value: {
              fontSize: 30,
              color: "#fff",
              fontFamily: "liquidCrystal"
            }
          },
          // formatter: (params) => {
          //   return `{name|${params.data.name}}\n{value|${params.data.value}}`
          // },
          formatter: "{a} {b}（{c}）" // a: seriesName, b:name, c:value
        },
        levels: [
          {
            color: chartColor,
            itemStyle: {
              borderWidth: 0,
              borderColor: "#fff",
              gapWidth: 5
            }
          },
          {
            // 标签
            upperLabel: {
              show: true, // 大部分时候，不显示
              height: 30,
              color: "#555555"
            },
            itemStyle: {
              gapWidth: 1
            }
          },
          {
            itemStyle: {
              gapWidth: 1,
              borderColorSaturation: 0.6
            },
            // colorAlpha: [1, 0.5],
            colorSaturation: [0.35, 0.5]
          }
        ],
        name: seriesData.name || "",
        data: seriesData.data || []
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
        seriesData: {
          name: "树状图",
          data: [
            {
              value: 40, // 必选
              percent: 20,
              name: "A1", // 必选
              path: "分组A" // 可选，建议
            },
            {
              value: 72,
              percent: 36,
              name: "B1",
              path: "分组B",
              children: [
                {
                  value: 60,
                  percent: 30,
                  name: "B-1",
                  path: "分组B-1",
                  children: [
                    {
                      value: 12,
                      percent: 6,
                      name: "B-1-1",
                      path: "分组B-1-1"
                    },
                    {
                      value: 28,
                      percent: 14,
                      name: "B-1-2",
                      path: "分组B-1-2"
                    },
                    {
                      value: 20,
                      percent: 10,
                      name: "B-1-3",
                      path: "分组B-1-3"
                    }
                  ]
                },
                {
                  value: 12,
                  percent: 6,
                  name: "B-2",
                  path: "分组B-2",
                  children: [
                    {
                      value: 12,
                      percent: 6,
                      name: "B-2-1",
                      path: "分组B-2-1"
                    }
                  ]
                }
              ]
            },
            {
              value: 36,
              percent: 18,
              name: "C1",
              path: "分组C",
              children: [
                {
                  value: 36,
                  percent: 18,
                  name: "C-1",
                  path: "分组C-1",
                  children: [
                    {
                      value: 36,
                      percent: 18,
                      name: "C-1-1",
                      path: "分组C-1-1"
                    },
                    {
                      value: 8,
                      percent: 4,
                      name: "C-1-2",
                      path: "分组C-1-2"
                    },
                    {
                      value: 12,
                      percent: 6,
                      name: "C-1-3",
                      path: "分组C-1-3"
                    }
                  ]
                }
              ]
            },
            {
              value: 52,
              percent: 26,
              name: "D1",
              path: "分组D",
              children: [
                {
                  value: 32,
                  percent: 16,
                  name: "D-1",
                  path: "分组D-1"
                },
                {
                  value: 20,
                  percent: 10,
                  name: "D-2",
                  path: "分组D-2"
                }
              ]
            }
          ]
        }
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
