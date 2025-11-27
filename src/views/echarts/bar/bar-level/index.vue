<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

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

const levelConfig = [
  { label: "深睡", color: "#00F0AF", value: 1 },
  { label: "浅睡", color: "#5D8CF5", value: 2 },
  { label: "中睡", color: "#F4E344", value: 3 },
  { label: "清醒", color: "#FFA83C", value: 4 },
];

function getOption(data) {
  const xAxisData = [],
    stackData = [],
    barData = [];
  data.forEach((_data) => {
    xAxisData.push(_data.time);
    stackData.push(_data.value * 1 - 1); // 比数值小1，作为底部的堆叠柱
    barData.push({
      value: 1,
      itemStyle: {
        color:
          levelConfig.find((item) => item.value === _data.value)?.color || "",
      },
    });
  });

  return {
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
    title: {
      text: "睡眠数据",
      left: "left",
      top: 0,
      textStyle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 1)",
      },
    },
    tooltip: {
      show: true,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "transparent",
      padding: [12, 20],
      textStyle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 1)",
      },
      formatter: (params) => {
        return `<div>${params.seriesName}</div>
        <div style='margin-top: 8px;'>
          ${params.marker}
          <span>${params.name}</span>
          <span style='padding-left: 8px; color: ${levelConfig[params.seriesIndex - 1]?.color}'>${
            levelConfig[params.seriesIndex - 1]?.label
          }</span>
        </div>`;
      },
    },
    grid: {
      top: "15%",
      left: "5%",
      right: "5%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      gridIndex: 0,
      splitLine: { show: false },
      axisLine: {
        show: false,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.4)",
        },
      },
      axisLabel: {
        showMinLabel: true,
        showMaxLabel: true,
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 12,
        align: "center",
        margin: 15,
      },
      axisTick: {
        show: false,
      },
      data: xAxisData,
    },
    yAxis: {
      min: 0,
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ["rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.08)"],
        },
      },
      axisLabel: {
        verticalAlign: "top",
        padding: [10, 0, 0, 0],
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 12,
        formatter: (params) => {
          return levelConfig.find((item) => item.value === params)?.label || "";
        },
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: "",
        type: "bar",
        stack: "stackName",
        showBackground: true,
        itemStyle: {
          borderColor: "transparent",
          color: "transparent",
        },
        emphasis: {
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
        },
        tooltip: {
          show: false,
        },
        data: stackData,
      },
      {
        name: "睡眠数据",
        type: "bar",
        stack: "stackName",
        barWidth: 4,
        data: barData,
      },
    ],
  };
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: Array.from({ length: 120 }, (_, i) => {
        const time = new Date((1696963225 + i * 60) * 1000);
        const hour = time.getHours().toString().padStart(2, "0");
        const minute = time.getMinutes().toString().padStart(2, "0");
        const value = Math.ceil(Math.random() * levelConfig.length); // 获取随机睡眠数据1、2、3、4
        return {
          name: "睡眠数据",
          time: `${hour}:${minute}`,
          value: value,
        };
      }),
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
