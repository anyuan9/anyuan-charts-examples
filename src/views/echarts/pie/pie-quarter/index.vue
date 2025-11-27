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
  const { title = "", seriesData = {} } = data;
  const sum = seriesData?.data?.reduce((total, item) => total + item.value, 0)

  const pieSeries = [], yAxisData = []
  seriesData?.data?.forEach((item, i) => {
    pieSeries.push(
      {
        name: item.name,
        type: 'pie',
        clockWise: false, // 是否顺时加载
        radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
        center: ['30%', '50%'],
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          borderRadius: 100,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: chartColor[i], // 0% 处的颜色
              },
              {
                offset: 1,
                color: chartColor[i] + '4d', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        emphasis: {
          scale: false, // 鼠标移入变大
        },
        data: [
          {
            value: item.value,
            name: item.name,
          },
          {
            value: sum - item.value,
            name: '',
            tooltip: {
              show: false,
            },
            itemStyle: {
              color: 'rgba(0, 0, 0, 0)',
            },
          },
        ],
      },
      {
        name: '',
        type: 'pie',
        silent: true,
        z: 1,
        clockWise: false, // 是否顺时加载
        radius: [65 - i * 15 + '%', 57 - i * 15 + '%'],
        center: ['30%', '50%'],
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          borderRadius: 100,
        },
        emphasis: {
          scale: false, // 鼠标移入变大
        },
        data: [
          {
            value: 7.5,
            tooltip: {
              show: false,
            },
            itemStyle: {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          },
          {
            value: 2.5,
            name: '',
            tooltip: {
              show: false,
            },
            itemStyle: {
              color: 'rgba(255, 255, 255, 0)',
            },
          },
        ],
      },
    )
    yAxisData.push({
      value: i,
      textStyle: {
        rich: {
          circle: {
            color: chartColor[i],
            padding: [0, 5],
          },
        },
      },
    })
  })

  return {
    // 背景颜色，默认无背景
    backgroundColor: 'rgba(8, 25, 66, 1)',
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
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "30%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "54%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    xAxis: {
      show: false,
    },
    yAxis: {
      type: 'category',
      inverse: true,
      // 坐标轴的轴线
      axisLine: {
        show: false,
      },
      // 坐标轴的刻度
      axisTick: {
        show: false,
      },
      // 坐标轴的刻度标签
      axisLabel: {
        show: true,
        inside: true,
        interval: 0,
        textStyle: {
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 14,
          rich: {
            line: {
              width: 170,
              height: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
            name: {
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 14,
            },
            bd: {
              color: 'rgba(255, 255, 255, 0.3)',
              padding: [0, 5],
              fontSize: 14,
            },
            percent: {
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 14,
            },
            value: {
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 16,
              fontWeight: 500,
              padding: [0, 0, 0, 20],
            },
            unit: {
              fontSize: 14,
            },
          },
        },
        formatter: params => {
          const item = seriesData?.data[params]
          const percent = ((item.value * 100) / sum).toFixed(1) + '%'
          return `{line|}{circle|●}{name|${item.name}}{bd||}{percent|${percent}}{value|${item.value}}{unit|元}`
        },
      },
      data: yAxisData,
    },
    series: pieSeries,
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
          name: "测试数据",
          data: [
            {
              name: 'A类',
              value: 3720,
            },
            {
              name: 'B类',
              value: 2920,
            },
            {
              name: 'C类',
              value: 2200,
            },
            {
              name: 'D类',
              value: 1420,
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
