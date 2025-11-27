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

function getOption(data) {
  const { title = "", seriesData=[] } = data;

  return {
    baseOption: {
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: {
            show: true,
            type: ['pie', 'funnel'],
          },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      title: {
        text: '南丁格尔玫瑰图',
        subtext: '纯属虚构',
        x: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8'],
      },
      calculable: true,
      series: [
        {
          name: '半径模式',
          type: 'pie',
          roseType: 'radius',
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
            },
            labelLine: {
              show: true,
            },
          },
          data: [
            { value: 10, name: 'rose1' },
            { value: 5, name: 'rose2' },
            { value: 15, name: 'rose3' },
            { value: 25, name: 'rose4' },
            { value: 20, name: 'rose5' },
            { value: 35, name: 'rose6' },
            { value: 30, name: 'rose7' },
            { value: 40, name: 'rose8' },
          ],
        },
        {
          name: '面积模式',
          type: 'pie',
          roseType: 'area',
          data: [
            { value: 10, name: 'rose1' },
            { value: 5, name: 'rose2' },
            { value: 15, name: 'rose3' },
            { value: 25, name: 'rose4' },
            { value: 20, name: 'rose5' },
            { value: 35, name: 'rose6' },
            { value: 30, name: 'rose7' },
            { value: 40, name: 'rose8' },
          ],
        },
      ],
    },
    media: [
      // 定义 media query 的规则。
      {
        option: {
          legend: {
            right: 'center',
            bottom: 0,
            orient: 'horizontal',
          },
          series: [
            {
              radius: [20, '50%'],
              center: ['25%', '50%'],
            },
            {
              radius: [30, '50%'],
              center: ['75%', '50%'],
            },
          ],
        },
      },
      {
        query: {
          minAspectRatio: 1,
        },
        option: {
          legend: {
            right: 'center',
            bottom: 0,
            orient: 'horizontal',
          },
          series: [
            {
              radius: [20, '50%'],
              center: ['25%', '50%'],
            },
            {
              radius: [30, '50%'],
              center: ['75%', '50%'],
            },
          ],
        },
      },
      {
        query: {
          maxAspectRatio: 1,
        },
        option: {
          legend: {
            right: 'center',
            bottom: 0,
            orient: 'horizontal',
          },
          series: [
            {
              radius: [20, '50%'],
              center: ['50%', '30%'],
            },
            {
              radius: [30, '50%'],
              center: ['50%', '70%'],
            },
          ],
        },
      },
      {
        query: {
          maxWidth: 500,
        },
        option: {
          legend: {
            right: 10,
            top: '15%',
            orient: 'vertical',
          },
          series: [
            {
              radius: [20, '50%'],
              center: ['50%', '30%'],
            },
            {
              radius: [30, '50%'],
              center: ['50%', '75%'],
            },
          ],
        },
      },
    ],
  }
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "测试数据",
        seriesData: [],
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
