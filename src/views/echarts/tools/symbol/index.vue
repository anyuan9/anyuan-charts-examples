<script setup>
// 导入Vue相关API
import { ref, nextTick, onMounted } from "vue";
// 导入ECharts工具函数
import { useECharts } from '@anyuan/utils';
// 导入图表颜色配置
import { chartColors } from "@/views/echarts/constant";

// const icon_anchor = ${require('@/assets/images/anchor.png')}
import icon_anchor from '@/assets/images/anchor.png'

// 图表容器引用
const chartRef = ref(null);
// 初始化ECharts实例，配置自动工具提示循环和自动调整大小
const { setOption, showLoading } = useECharts(chartRef, {
  autoTooltipLoop: true,
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s",
    },
  },
});

/**
 * 生成测试数据的辅助函数
 * @param {number} xBase - X轴基础值，用于将不同系列的数据分开显示
 * @param {number} count - 生成的数据点数量，默认为10个
 * @param {number} yRange - Y轴数据范围，默认为0-100
 * @returns {Array} 包含name和value属性的数据数组
 */
function generateData(xBase, count = 10, yRange = 100) {
  return Array.from({ length: count }, (_, i) => ({
    name: `数据${i + 1}`,
    value: [xBase + Math.random() * 5, Math.floor(Math.random() * yRange)]
  }));
}

/**
 * 生成ECharts配置项的函数
 * @returns {Object} ECharts配置对象
 */
function getOption() {
  return {
    // 背景颜色，深色主题
    backgroundColor: "rgba(8, 25, 66, 1)",
    // 图表配色方案
    color: chartColors,
    // 工具栏配置
    toolbox: {
      show: true,
      right: "5%",
      top: "7%",
      feature: {
        saveAsImage: {},
        magicType: {
          type: ["line", "bar", "stack"],
        },
      },
    },
    // 标题配置
    title: {
      text: "ECharts Symbol属性示例",
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 20,
      },
      top: "5%",
      left: "2%",
    },
    // 提示框配置
    tooltip: {
      trigger: 'item',
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderColor: "transparent",
      borderWidth: 1,
      padding: [12, 20],
      position: 'top',
      textStyle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 1)",
      },
      // 自定义提示框内容
      formatter: function(params) {
        return `${params.seriesName}<br/>X: ${params.value[0].toFixed(2)}, Y: ${params.value[1]}`;
      }
    },
    // 图例配置，右侧垂直显示
    legend: {
      top: "15%",
      right: "5%",
      orient: 'vertical',
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 12,
      },
    },
    // 网格配置，为图例留出右侧空间
    grid: {
      top: "15%",
      left: "5%",
      right: "30%",
      bottom: "2%",
      containLabel: true,
    },
    // X轴配置
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    // Y轴配置
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    // 系列配置 - 展示各种symbol类型
    series: [
      /**
       * 第一部分：内置标记类型示例
       * ECharts提供的8种内置标记类型
       */
      // 圆形标记
      {
        type: 'scatter',
        symbol: 'circle',
        symbolSize: 20,
        name: 'circle (圆形)',
        data: generateData(10)
      },
      // 矩形标记
      {
        type: 'scatter',
        symbol: 'rect',
        symbolSize: 20,
        name: 'rect (矩形)',
        data: generateData(20)
      },
      // 圆角矩形标记
      {
        type: 'scatter',
        symbol: 'roundRect',
        symbolSize: 20,
        name: 'roundRect (圆角矩形)',
        data: generateData(30)
      },
      // 三角形标记
      {
        type: 'scatter',
        symbol: 'triangle',
        symbolSize: 20,
        name: 'triangle (三角形)',
        data: generateData(40)
      },
      // 菱形标记
      {
        type: 'scatter',
        symbol: 'diamond',
        symbolSize: 20,
        name: 'diamond (菱形)',
        data: generateData(50)
      },
      // 别针标记
      {
        type: 'scatter',
        symbol: 'pin',
        symbolSize: 20,
        name: 'pin (别针)',
        data: generateData(60)
      },
      // 箭头标记
      {
        type: 'scatter',
        symbol: 'arrow',
        symbolSize: 20,
        name: 'arrow (箭头)',
        data: generateData(70)
      },
      // 无标记（用于对比）
      {
        type: 'scatter',
        symbol: 'none',
        symbolSize: 20,
        name: 'none (无标记)',
        data: generateData(80)
      },

      /**
       * 第二部分：图片URL格式示例
       * 使用image://前缀加载外部图片
       */
      {
        type: 'scatter',
        // 使用在线CDN的ECharts图标作为示例
        // 实际应用中，这里应该替换为您自己的图片URL
        symbol: 'image://https://echarts.apache.org/zh/asset/lottie/json/images/img_1.png',
        symbolSize: 30, // 图片标记的大小
        name: 'image:// (图片URL)',
        data: generateData(90, 3) // 只生成3个数据点，避免过多重叠
      },
      {
        type: 'scatter',
        // 使用本地图片
        symbol: `image://${icon_anchor}`,
        symbolSize: 30, // 图片标记的大小
        name: 'image:// (图片URL)',
        data: generateData(90, 3) // 只生成3个数据点，避免过多重叠
      },

      /**
       * 第三部分：dataURI格式示例
       * 使用base64编码的图片数据
       * 这里使用一个简单的红色半透明圆点SVG
       */
      {
        type: 'scatter',
        symbol: 'image://data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cGF0aCBkPSJNMTUwIDE1MGMtNTAgMC01MCA1MC01MCAxMDBzNTAgMTAwIDUwIDEwMCA1MC01MCA1MC0xMDAgMC0xMDBzLTUwLTUwLTUwLTEwMHoiIGZpbGw9IiNlNDM5MzkvMjAiLz48L3N2Zz4=',
        symbolSize: 30,
        name: 'image://dataURI',
        data: generateData(100, 5)
      },

      /**
       * 第四部分：矢量路径格式示例
       * 使用path://前缀定义SVG路径
       * 这种方式比图片更清晰，且可以设置颜色
       * 下面的路径定义了一个带两个矩形的圆形
       */
      {
        type: 'scatter',
        symbol: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z',
        symbolSize: 30,
        name: 'path:// (矢量路径)',
        data: generateData(110, 5)
      }
    ]
  };
}

/**
 * 初始化图表的函数
 * 包含错误处理，确保在出现问题时提供友好的提示
 */
function initChart() {
  try {
    const option = getOption();
    setOption(option);
  } catch (err) {
    // 错误处理，显示错误信息
    console.error('初始化图表失败:', err);
    setOption({
      title: {
        show: true,
        text: "初始化图表失败",
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

/**
 * 组件挂载后的生命周期钩子
 * 在DOM更新后初始化图表，并显示加载状态
 */
onMounted(() => {
  nextTick(() => {
    showLoading(); // 显示加载动画
    initChart(); // 初始化图表
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
  height: 500px;
}
</style>
