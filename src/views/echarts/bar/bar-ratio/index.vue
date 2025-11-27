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
  const { title, seriesData } = data;
  const total = seriesData.reduce((sum, item) => sum + item.value, 0);

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
        color: "#ffffff",
        fontSize: 20
      }
    },
    // 简单的图例(series内容需要配置name属性)
    // legend: {
    //   top: '65%',
    //   left: '5%',
    //   icon: 'circle', // 图例项的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
    //   itemWidth: 12, // 图例标记的图形宽度，默认25
    //   itemHeight: 12, // 图例标记的图形高度，默认14
    //   itemGap: 20, // 图例项之间的间隔，单位px，默认10，可取值：5、[5, 10]、[5, 10, 5, 10]
    //   // 图例文字的样式
    //   textStyle: {
    //     fontSize: 14,
    //     color: 'rgba(255, 255, 255, 0.6)',
    //   }
    // },
    // 自定义图例
    legend: seriesData.map((item, index) => ({
      top: `${65 + Number.parseInt(index / 3) * 10}%`, // 一行放三个图例
      left: `${5 + (index % 3) * Number.parseInt(90 / 3)}%`,
      icon: "none",
      itemWidth: 0,
      itemGap: 20, // 图例项之间的间隔，单位px，默认10，可取值：5、[5, 10]、[5, 10, 5, 10]
      // 图例文字的样式
      textStyle: {
        fontSize: 14,
        padding: [4, 8, 4, 8],
        color: "rgba(255, 255, 255, 0.6)",
        backgroundColor: "rgba(25, 178, 255, 0.25)", // 图例选中时的背景色
        rich: {
          icon: {
            width: 12,
            height: 12,
            align: "center",
            lineHeight: 12,
            backgroundColor: chartColor[index],
            borderRadius: 6
          },
          name: {
            width: 80,
            padding: 5,
            fontSize: 16,
            align: "left"
          },
          value: {
            width: 30,
            align: "center"
          },
          percent: {
            width: 40,
            align: "center",
            color: "rgba(255, 255, 255, 0.85)"
          },
          divide: {
            padding: 5,
            align: "center"
          }
        }
      },
      formatter: (name) => {
        const value = item.value;
        const percent = ((value / total) * 100).toFixed(2);
        return `{icon|} {name|${name}} {value|${value}} {divide||} {percent|${percent}%}`;
      },
      data: [item.name]
    })),
    tooltip: {
      show: false,
      trigger: "axis",
      textStyle: {
        color: "#ffffff"
      },
      padding: [8, 12],
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "rgba(0, 0, 0, 0.6)",
      borderWidth: 1,
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
      // formatter: "{b} <br> {c}"
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    xAxis: {
      type: "value",
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: "category",
      data: [""],
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      }
    },
    series:
      (seriesData.length
        && seriesData.map((item, index) => {
          const paddingLeft = index === seriesData.length - 1 ? 16 : 0;
          const paddingRight = index === 0 ? 16 : 0;
          const labelAlign
            = index === 0
              ? "right"
              : index === seriesData.length - 1
                ? "left"
                : "center";
          return {
            type: "bar",
            barWidth: 16,
            stack: "柱状图占比",
            itemStyle: {
              color: chartColor[index],
              borderRadius: [16, paddingLeft, 16, paddingRight]
            },
            label: {
              show: true,
              position: "top",
              distance: 30,
              color: "rgba(0, 0, 0, 0.8)",
              fontWeight: 700,
              fontSize: 14,
              align: labelAlign,
              verticalAlign: "middle",
              borderRadius: 1,
              borderWidth: 10,
              borderColor: chartColor[index],
              backgroundColor: chartColor[index],
              // formatter: '{c}'
              formatter: (params) => {
                if (!params.value) return "";
                return (
                  `${params.name
                  }  ${
                    ((params.value * 100) / (total || 1)).toFixed(1)
                  }%`
                );
              }
            },
            name: item.name || "",
            data: seriesData.length ? [item] : [0]
          };
        }))
        || []
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
            value: Math.floor(Math.random() * 200 + 50)
          },
          {
            name: "测试数据2",
            value: Math.floor(Math.random() * 200 + 50)
          },
          {
            name: "测试数据3",
            value: Math.floor(Math.random() * 200 + 50)
          }
          // {
          //   name: '测试数据4',
          //   value: Math.floor(Math.random() * 200 + 50),
          // },
          // {
          //   name: '测试数据5',
          //   value: Math.floor(Math.random() * 200 + 50),
          // },
          // {
          //   name: '测试数据6',
          //   value: Math.floor(Math.random() * 200 + 50),
          // },
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
