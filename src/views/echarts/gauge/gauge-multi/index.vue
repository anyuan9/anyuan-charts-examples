<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
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

  const columnNum = 3 // 列数，一行三个仪表盘
  const rowNum = Math.ceil(seriesData.length / columnNum) // 行数
  const rowRadius = 100 / rowNum // 仪表盘半径
  const colRadius = 100 / columnNum // 仪表盘半径

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
    series: seriesData.map((item, index) => {
      // 计算仪表盘位置
      const left = (((index % columnNum) + 0.5) * colRadius).toFixed(1) + '%'
      const top = ((Math.floor(index / columnNum) + 0.5) * rowRadius).toFixed(1) + '%'
      //
      const { name, value, unit, range } = item

      return {
        name: item.name,
        type: 'gauge',
        min: item.range[0],
        max: item.range[1],
        center: [left, top],
        radius: Math.min(rowRadius, colRadius) + '%', // 1行3个
        startAngle: 225, // 起始角度
        endAngle: -45, // 结束角度
        clockwise: true, // 是否顺时针
        splitNumber: 10, // 刻度的间隔数量
        // 仪表盘轴线
        axisLine: {
          show: true,
          lineStyle: {
            width: 2,
            shadowBlur: 0,
            color: [[1, chartColor[0]]],
          },
        },
        // 刻度
        axisTick: {
          show: true,
          length: -5,
          splitNumber: 10,
          lineStyle: {
            width: 1,
            color: chartColor[0],
          },
        },
        // 刻度标签
        axisLabel: {
          distance: -20,
          color: chartColor[0],
          fontSize: '14',
          fontWeight: 'bold',
        },
        // 分隔线
        splitLine: {
          show: true,
          length: -14,
          lineStyle: {
            color: chartColor[0],
          },
        },
        // 指针
        pointer: {
          show: true,
          length: '90%',
        },
        // 仪表盘指针样式
        itemStyle: {
          color: chartColor[0],
        },
        // 仪表盘标题
        title: {
          show: false,
        },
        // 仪表盘详情，用于显示数据
        detail: {
          show: true,
          offsetCenter: [0, '60%'],
          fontSize: 16,
          color: 'rgba(255, 255, 255, 0.85)',
          rich: {
            name: {
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.6)',
            },
          },
          formatter: ['{value} ' + (item.unit || ''), '{name|' + item.name + '}'].join('\n'),
        },
        data: [
          {
            name: item.name,
            value: item.value,
          },
        ],
      }
    }),
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
          { name: '电压', value: 220, unit: 'V', range: [0, 400] },
          { name: '电流', value: 32, unit: 'A', range: [0, 60] },
          { name: '功率因数', value: 0.9, range: [0, 1.0] },
          { name: '有功功率', value: 6.34, unit: 'kW', range: [0, 50] },
          { name: '有功电能', value: 6.28, unit: 'kWh', range: [0, 50] },
          { name: '电网频率', value: 50, unit: 'Hz', range: [0, 100] },
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
