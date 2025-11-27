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

// 图表数据
const defaultChartData = {
  title: "",
  seriesData: [
    // { name: "", data: []}
  ]
};
const chartData = ref(defaultChartData);

const angle = ref(0); // 初始角度

function getOption() {
  const { title = "", seriesData } = chartData.value;
  const bgColor = "rgba(8, 25, 66, 1)";
  // 数据总和
  const total = seriesData?.data?.reduce((acc, item) => {
    return acc + item.value;
  }, 0) || 0;

  return {
    // 背景颜色，默认无背景
    backgroundColor: bgColor,
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
    // 标题
    title: [
      {
        top: "center",
        left: "center",
        textStyle: {
          rich: {
            name: {
              fontSize: 20,
              fontWeight: "normal",
              color: "rgba(255, 255, 255, 0.8)",
              padding: [10, 0]
            },
            val: {
              fontSize: 32,
              fontWeight: "bold",
              color: "#ffffff"
            }
          }
        },
        text: `{name|${title}}\n{val|${total}}`
      },
      {
        top: 20,
        left: 20,
        textStyle: {
          fontSize: 14,
          color: "#ffffff",
          fontWeight: 400
        },
        text: "单位：个"
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
      {
        type: "pie",
        radius: ["45%", "55%"],
        center: ["50%", "50%"],
        // minAngle: 2, //最小的扇区角度（0 ~ 360）
        z: 0,
        itemStyle: {
          borderWidth: 10, // 设置边框宽度，表示中间的空格区域
          borderColor: bgColor
        },
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            borderWidth: 0,
            shadowBlur: 10,
            shadowColor: "rgba(255, 255, 255, 0.5)"
          },
          scale: false // 鼠标移入变大
        },
        name: seriesData?.name || "",
        data: seriesData?.data || []
      },
      // 紫色
      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: (params, api) => {
          return {
            type: "arc",
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
              startAngle: ((0 + angle.value) * Math.PI) / 180,
              endAngle: ((90 + angle.value) * Math.PI) / 180
            },
            style: {
              stroke: "#8450F9",
              fill: "transparent",
              lineWidth: 1.5
            },
            silent: true
          };
        },
        data: [0]
      },
      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: (params, api) => {
          const x0 = api.getWidth() / 2;
          const y0 = api.getHeight() / 2;
          const r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6;
          const point = getCirlPoint(x0, y0, r, 90 + angle.value);
          return {
            type: "circle",
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: "#8450F9",
              fill: "#8450F9"
            },
            silent: true
          };
        },
        data: [0]
      },
      // 蓝色
      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: (params, api) => {
          return {
            type: "arc",
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
              startAngle: ((180 + angle.value) * Math.PI) / 180,
              endAngle: ((270 + angle.value) * Math.PI) / 180
            },
            style: {
              stroke: "#4386FA",
              fill: "transparent",
              lineWidth: 1.5
            },
            silent: true
          };
        },
        data: [0]
      },
      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: (params, api) => {
          const x0 = api.getWidth() / 2;
          const y0 = api.getHeight() / 2;
          const r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6;
          const point = getCirlPoint(x0, y0, r, 180 + angle.value);
          return {
            type: "circle",
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: "#4386FA",
              fill: "#4386FA"
            },
            silent: true
          };
        },
        data: [0]
      },
      // 橘色
      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: (params, api) => {
          return {
            type: "arc",
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
              startAngle: ((90 + -angle.value) * Math.PI) / 180,
              endAngle: ((220 + -angle.value) * Math.PI) / 180
            },
            style: {
              stroke: "#FF8E89",
              fill: "transparent",
              lineWidth: 1.5
            },
            silent: true
          };
        },
        data: [0]
      },
      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: (params, api) => {
          const x0 = api.getWidth() / 2;
          const y0 = api.getHeight() / 2;
          const r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65;
          const point = getCirlPoint(x0, y0, r, 90 + -angle.value);
          return {
            type: "circle",
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: "#FF8E89",
              fill: "#FF8E89"
            },
            silent: true
          };
        },
        data: [0]
      },
      // 绿点
      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: (params, api) => {
          return {
            type: "arc",
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
              startAngle: ((270 + -angle.value) * Math.PI) / 180,
              endAngle: ((40 + -angle.value) * Math.PI) / 180
            },
            style: {
              stroke: "#0CD3DB",
              fill: "transparent",
              lineWidth: 1.5
            },
            silent: true
          };
        },
        data: [0]
      },
      {
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: (params, api) => {
          const x0 = api.getWidth() / 2;
          const y0 = api.getHeight() / 2;
          const r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65;
          const point = getCirlPoint(x0, y0, r, 270 + -angle.value);
          return {
            type: "circle",
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: "#0CD3DB",
              fill: "#0CD3DB"
            },
            silent: true
          };
        },
        data: [0]
      }
    ]
  };
}
// 获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
function getCirlPoint(x0, y0, r, angle) {
  const x1 = x0 + r * Math.cos((angle * Math.PI) / 180);
  const y1 = y0 + r * Math.sin((angle * Math.PI) / 180);
  return {
    x: x1,
    y: y1
  };
}
function draw() {
  angle.value = (angle.value + 3) % 360;
  const option = getOption();
  setOption(option);
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "测试数据",
        seriesData: {
          name: "测试数据",
          data: [
            {
              name: "A类",
              value: 3720
            },
            {
              name: "B类",
              value: 2920
            },
            {
              name: "C类",
              value: 2200
            },
            {
              name: "D类",
              value: 1420
            }
          ]
        }
      }
    };
    chartData.value = res.data;
    const option = getOption();
    setOption(option);

    setInterval(() => {
      // 用setInterval做动画有性能问题，不推荐
      draw();
    }, 100);
    // window.requestAnimationFrame(draw);
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
