<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";
import 'echarts-gl';

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
  const { title = "", seriesData = {} } = data;

  let series = []
  let sumValue = 0
  let startValue = 0
  let endValue = 0
  let k =
    typeof internalDiameterRatio !== 'undefined'
      ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
      : 1 / 3
  const color = ['#00ffff', '#00cfff', '#006ced', '#ffe000', '#ffa800', '#845cff']

  // 为每一个饼图数据，生成一个 series-surface 配置
  for (let i = 0; i < seriesData?.data?.length; i++) {
    const pieData = seriesData?.data[i]
    sumValue += pieData.value

    let seriesItem = {
      name: typeof pieData.name === 'undefined' ? `series${i}` : pieData.name,
      value: typeof pieData.value === 'undefined' ? `series${i}` : pieData.value,
      type: 'surface',
      parametric: true,
      wireframe: {
        show: false,
      },
      pieData: pieData,
      pieStatus: {
        selected: false,
        hovered: false,
        k: k,
      },
      itemStyle: {
        color: color[i],
      },
    }
    series.push(seriesItem)
  }
  // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
  // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
  for (let i = 0; i < series.length; i++) {
    endValue = startValue + series[i].pieData.value

    series[i].pieData.startRatio = startValue / sumValue
    series[i].pieData.endRatio = endValue / sumValue
    series[i].parametricEquation = getParametricEquation(
      series[i].pieData.startRatio,
      series[i].pieData.endRatio,
      false, // false 表示非选中状态; 如果全部为true可以实现选中状态并且分割扇形
      false,
      k,
      series[i].pieData.value,
    )

    startValue = endValue
  }

  return {
    // 背景颜色，默认无背景
    backgroundColor: "rgba(8, 25, 66, 1)",
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
    tooltip: {
      formatter: params => {
        if (params.seriesName !== 'mouseoutSeries') {
          return `${params.seriesName
            }<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color
            };"></span>${series[params.seriesIndex].pieData.value}`
        }
      },
    },
    xAxis3D: {
      min: -1,
      max: 1,
    },
    yAxis3D: {
      min: -1,
      max: 1,
    },
    zAxis3D: {
      min: -1,
      max: 1,
    },
    grid3D: {
      show: false,
      boxHeight: 4,
      viewControl: {
        //3d效果可以放大、旋转等，请自己去查看官方配置
        alpha: 40, // 角度
        // beta: 40,
        // distance: 40, // 调整视角到主体的距离，类似调整zoom
        rotateSensitivity: 0, // 设置为0无法旋转
        zoomSensitivity: 0, // 设置为0无法缩放
        panSensitivity: 0, // 设置为0无法平移
        autoRotate: false, // 自动旋转
      },
    },
    series: series,
  };
}

/**
 * @description: 生成 3D 扇形环曲面
 * @param {float} startRatio: 当前扇形起始比例，取值区间 [0, endRatio)
 * @param {float} endRatio：当前扇形结束比例，取值区间 (startRatio, 1]
 * @param {boolean} isSelected：是否选中，效果参照二维饼图选中效果（单选）
 * @param {boolean} isHovered: 是否放大，效果接近二维饼图高亮（放大）效果
 * @param {float} k：用于参数方程的一个参数，取值 0~1 之间，通过「内径/外径」的值换算而来。
 * @param {float} h：扇形的高度，默认高度为 1
 * @return {*}
 */
function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
  // 计算
  let midRatio = (startRatio + endRatio) / 2
  let startRadian = startRatio * Math.PI * 2
  let endRadian = endRatio * Math.PI * 2
  let midRadian = midRatio * Math.PI * 2

  // 如果只有一个扇形，则不实现选中效果。
  if (startRatio === 0 && endRatio === 1) {
    isSelected = false
  }

  // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
  k = typeof k !== 'undefined' ? k : 1 / 3

  // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
  let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0
  let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0

  // 计算高亮效果的放大比例（未高亮，则比例为 1）
  let hoverRate = isHovered ? 1.05 : 1

  // 返回曲面参数方程
  return {
    u: {
      min: -Math.PI,
      max: Math.PI * 3,
      step: Math.PI / 32,
    },

    v: {
      min: 0,
      max: Math.PI * 2,
      step: Math.PI / 20,
    },

    x: function (u, v) {
      if (u < startRadian) {
        return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      if (u > endRadian) {
        return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate
    },

    y: function (u, v) {
      if (u < startRadian) {
        return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      if (u > endRadian) {
        return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
      }
      return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate
    },

    z: function (u, v) {
      if (u < -Math.PI * 0.5) {
        return Math.sin(u)
      }
      if (u > Math.PI * 2.5) {
        return Math.sin(u) * h * 0.1
      }
      return Math.sin(v) > 0 ? 1 * h * 0.1 : -1
    },
  }
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "测试数据",
        seriesData: {
          name: '测试数据1',
          data: [
            {
              name: 'A类',
              value: 137,
            },
            {
              name: 'B类',
              value: 109,
            },
            {
              name: 'C类',
              value: 72,
            },
            {
              name: 'D类',
              value: 64,
            },
          ],
        }
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
