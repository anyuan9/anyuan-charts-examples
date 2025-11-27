<script setup>
import { useECharts } from "@anyuan/utils";
import * as echarts from "echarts";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";

const chartRef = ref(null);
const { getInstance, setOption, showLoading } = useECharts(chartRef, {
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
    // 提示框
    tooltip: {
      formatter: (params) => {
        return params.marker + params.value[3];
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
    // 直角坐标系的 x 轴
    xAxis: {
      axisLine: {
        symbol: ["none", "arrow"],
        symbolSize: [8, 8],
        lineStyle: {
          width: 2,
          color: "rgba(255,255,255,0.4)"
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "rgba(255,255,255,0.2)"
        }
      },
      data: xAxisData || []
    },
    // 直角坐标系的 y 轴
    yAxis: {
      axisLine: {
        show: true,
        symbol: ["none", "arrow"],
        symbolSize: [8, 8],
        lineStyle: {
          width: 2,
          color: "rgba(255,255,255,0.4)"
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        lineStyle: {
          type: "dotted",
          color: "rgba(255,255,255,0.2)"
        }
      }
    },
    series: [
      {
        type: "line",
        smooth: true,
        symbol: "circle",
        animation: false,
        symbolSize: 14,
        silent: true,
        itemStyle: {
          color: (params) => {
            return chartColor[params.dataIndex];
          },
          borderWidth: 4,
          borderColor: "#ffffff"
        },
        lineStyle: {
          color: "#eff1f4"
        },
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && seriesData[0].data) || []
      },
      {
        type: "custom",
        encode: {
          y: [1, 2],
          x: 0
        },
        // custom 系列需要开发者自己提供图形渲染的逻辑。https://echarts.apache.org/zh/option.html#series-custom.renderItem
        renderItem,
        name: (seriesData?.length && seriesData[1].name) || "",
        data: (seriesData?.length && seriesData[1].data) || []
      }
    ]
  };
}

function renderItem(params, api) {
  const STAGE_BORDER_RADIUS = 4;
  const TRIANGLE_SIZE = 9;
  const DEL_ICON = "M755.330958 336.707648l-20.329001 0 0 510.511089-67.077721 0L667.924235 336.707648 556.122917 336.707648l0 510.511089-67.081815 0L489.041102 336.707648 377.248993 336.707648l0 510.511089-67.077721 0L310.171272 336.707648l-42.688241 0c-50.514487 0-91.471294-0.728594-91.471294 0L176.011736 870.099864c0 49.105395 40.957831 88.914052 91.471294 88.914052l487.838717 0c50.52779 0 91.467201-39.808658 91.467201-88.914052L846.788949 336.707648C846.793042 332.960301 805.862841 336.707648 755.330958 336.707648L755.330958 336.707648zM890.73381 176.440501 690.283476 176.440501l0-54.552453c0-31.620162-56.511062-57.243749-89.446171-57.243749l-178.873923 0c-32.917714 0-89.432869 25.623587-89.432869 57.243749l0 54.552453-200.414519 0c-25.15389 0-45.537126 20.025079-45.537126 44.722574 0 24.684192 20.37812 44.709271 45.537126 44.709271l758.617817 0c25.127284 0 45.50131-20.025079 45.50131-44.709271C936.225911 196.46558 915.851884 176.440501 890.73381 176.440501L890.73381 176.440501zM600.841398 176.440501 421.972591 176.440501l0-22.35924 178.86983 0L600.842421 176.440501 600.841398 176.440501zM600.841398 176.440501";

  // api.value 得到给定维度的数据值。
  const xValue = api.value(0);
  const yValue = api.value(1);
  const yValue2 = api.value(2);
  const name = api.value(3);
  const stage = api.value(4);
  // api.coord([]) 将数据值映射到坐标系上。返回画布上的点的坐标。
  const start = api.coord([xValue, yValue]);
  const end = api.coord([xValue, yValue2]);
  // api.size([]) 得到每个尺寸的值。返回值是包含两个元素的数组，分别表示宽和高。
  const width = api.size([1, 0])[0] * 0.6;
  const height = end[1] - start[1];
  const x = start[0] - width / 2;
  const y = start[1] + height / 2;

  const rectShape = echarts.graphic.clipRectByRect(
    {
      x,
      y,
      width,
      height
    },
    {
      x: params.coordSys.x,
      y: params.coordSys.y,
      width: params.coordSys.width,
      height: params.coordSys.height
    }
  );
  rectShape.r = STAGE_BORDER_RADIUS; // 圆角

  const isFstStage = stage === 0;
  const textSize = isFstStage ? 16 : 14;
  const textColor = isFstStage ? "#fff" : "#34495e";

  const btnDelSize = isFstStage ? 16 : 12;
  const btnDelX = start[0] + width / 2 + btnDelSize;
  return {
    type: "group",
    children: [
      {
        type: "path", // 此处设置svg路径类型
        shape: {
          pathData: isFstStage
            ? "m63.1875,76.61313l17,-29.75l17,29.75l-34,0z"
            : "", // 三角形
          width: TRIANGLE_SIZE,
          height: TRIANGLE_SIZE,
          x: x + width / 2 - TRIANGLE_SIZE / 2,
          y: y - TRIANGLE_SIZE + 1
        },
        style: {}
      },
      {
        type: "rect",
        shape: rectShape,
        style: {
          fill: api.visual("color")
        }
      },
      {
        type: "text",
        style: {
          x: x + width / 2,
          y: y + height / 4,
          textAlign: "center",
          text: name,
          fill: textColor,
          textFont: api.font({
            fontSize: textSize
          })
        }
      },

      {
        type: "path",
        name: "btn-del",
        shape: {
          pathData: DEL_ICON,
          x: -8,
          y: -8,
          width: btnDelSize,
          height: btnDelSize
        },
        position: [btnDelX, y + height / 2],
        style: {
          fill: "#99a4ae"
        }
      }
    ]
  };
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    // ["A", "B", "C", "D", "E", "F", "G", "H"]
    const xAxisData = Array.from(
      { length: 8 },
      (_, i) => String.fromCharCode(65 + i)
    );
    // [500, 595, 649, 667, 667, 649, 595, 500]
    const lineData = Array.from({ length: 8 }, (_, i) =>
      Math.floor(Math.random() * 200 + 300));

    const res = {
      code: "0",
      data: {
        title: "测试数据",
        xAxisData,
        seriesData: [
          {
            name: "测试数据2",
            data: lineData
          },
          {
            name: "测试数据1",
            data: getStageData(xAxisData, lineData)
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

function getStageData(xAxisData, lineData) {
  const STAGE_COLOR = "#ecf4fc";
  const STAGE_COUNT = 4;
  const PARENT_STAGE_HEIGHT = 70;
  const PARENT_STAGE_GAP = 20;
  const CHILD_STAGE_HEIGHT = 50;
  const CHILD_STAGE_GAP = 10;

  const stageData = [];
  xAxisData.forEach((category, index) => {
    let basePosition = lineData[index];
    for (let i = 0; i < STAGE_COUNT; i++) {
      const duration = i === 0 ? PARENT_STAGE_HEIGHT : CHILD_STAGE_HEIGHT;
      const textName = category + (i === 0 ? "期" : i);

      stageData.push({
        name: textName,
        value: [index, basePosition, (basePosition -= duration), textName, i],
        itemStyle: {
          color: i === 0 ? chartColor[index] : STAGE_COLOR
        }
      });
      basePosition
        = basePosition - (i === 0 ? PARENT_STAGE_GAP : CHILD_STAGE_GAP);
    }
  });
  return stageData;
}

onMounted(() => {
  nextTick(() => {
    showLoading();
    getData().then(() => {
      const echartsInstance = getInstance();

      echartsInstance.on("click", {
        element: "btn-del"
      }, (params) => {
        console.log(params);
      });
    });
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
