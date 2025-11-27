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

function getPieData(length = 10, radius = 20, opacity = 1) {
  let dataArr = []
  for (let i = 0; i < 100; i++) {
    dataArr.push({
      name: (i + 1).toString(),
      value: i % length === 0 ? radius : 100,
      itemStyle: {
        color: 'rgba(0,255,255,1)',
        opacity: i % length === 0 ? opacity : 0,
        borderWidth: 0,
        borderColor: 'rgba(0,0,0,0)',
      },
    })
  }
  return dataArr
}

function getOption(data) {
  const { title, subtext, total, seriesData } = data;
  const ratio = seriesData[0].ratio;
  const ratioText = (ratio * 100).toFixed(1) + '%'

  return {
    // 背景颜色，默认无背景
    backgroundColor: "rgba(8, 25, 66, 1)",
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
    // 标题
    title: [
      {
        text: '{a|' + ratioText + '}',
        subtext: subtext,
        x: 'center',
        y: '40%',
        textStyle: {
          rich: {
            a: {
              fontSize: 36,
              color: 'rgba(255, 255, 255, 1)',
            },
          },
        },
        subtextStyle: {
          fontSize: 20,
          color: 'rgba(255, 255, 255, 0.85)',
        },
      },
      {
        text: 'DESIGN ELEMENTS',
        left: '50%',
        top: '58%',
        textAlign: 'center',
        textStyle: {
          fontSize: '16',
          fontWeight: '400',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.3)',
        },
      },
      {
        text: 'DONUT CHART',
        left: '50%',
        top: '64%',
        textAlign: 'center',
        textStyle: {
          fontSize: '14',
          fontWeight: '400',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.3)',
        },
      },
    ],
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    // 极坐标系
    polar: {
      radius: ['50%', '54%'],
      center: ['50%', '50%'],
    },
    // 极坐标系的角度轴
    angleAxis: {
      max: 100,
      show: false,
    },
    // 极坐标系的径向轴
    radiusAxis: {
      show: true,
      type: 'category',
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      // 圆环形状的仪表盘
      {
        type: 'gauge',
        center: ['50%', '50%'],
        radius: '64%',
        startAngle: 90, // 起始角度
        endAngle: -270, // 结束角度
        clockwise: true, // 是否顺时针
        splitNumber: 160, // 间隔刻度的数量(可看作是仪表盘的分割段数)
        // 进度条
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
          },
        },
        // 仪表盘轴线
        axisLine: {
          show: true,
          lineStyle: {
            width: 20,
            color: [
              [ratio, chartColor[0]], // 关键部分，根据ratio值来设置颜色，ratio的值范围0~1
              [1, chartColor[0] + '3c'],
            ],
          },
        },
        // 刻度
        axisTick: {
          show: false,
        },
        // 刻度标签
        axisLabel: {
          show: false,
        },
        // 分隔线
        splitLine: {
          show: true,
          length: 20,
          distance: -20, // 距离轴线的距离
          lineStyle: {
            color: 'rgba(8, 25, 66, 1)', // 与背景色一致，实现分割效果
            width: 2,
          },
        },
        // 指针
        pointer: {
          show: false,
        },
      },
      {
        name: '中环',
        type: 'bar',
        barWidth: 60,
        roundCap: true,
        coordinateSystem: 'polar', // 使用极坐标系，可选：'cartesian2d'使用直角坐标系，'polar'使用极坐标系
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
        itemStyle: {
          color: {
            type: 'linear',
            x: 1,
            y: 0,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: chartColors[0][0], // 0% 处的颜色
              },
              {
                offset: 1,
                color: chartColors[0][1], // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        data: [75],
      },
      {
        name: '内环装饰',
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['46%', '47.5%'],
        clockwise: false,
        itemStyle: {
          shadowBlur: 20,
          shadowColor: chartColor[0],
          color: chartColor[0],
        },
        label: {
          show: false,
        },
        emphasis: {
          scale: false,
        },
        data: [100],
      },
      // 以下是外部装饰
      {
        type: 'pie',
        silent: true,
        radius: ['73%', '71.5%'],
        zlevel: 0,
        z: 1,
        label: {
            show: false,
        },
        labelLine: {
            show: false,
        },
        data: getPieData(10, 30, 1),
      },
      {
        type: 'pie',
        silent: true,
        startAngle: -150,
        radius: ['71%', '69.5%'],
        zlevel: 0,
        z: 1,
        label: {
            show: false,
        },
        labelLine: {
            show: false,
        },
        data: getPieData(10, 30, 0.5),
      },
      {
        type: 'pie',
        silent: true,
        startAngle: -140,
        radius: ['74%', '72.5%'],
        zlevel: 0,
        z: 1,
        label: {
            show: false,
        },
        labelLine: {
            show: false,
        },
        data: getPieData(10, 30, 1),
      },
      {
        type: 'pie',
        silent: true,
        radius: ['67%', '66%'],
        zlevel: 0,
        z: 1,
        label: {
            show: false,
        },
        labelLine: {
            show: false,
        },
        data: getPieData(5, 20, 1),
      },
      {
        type: 'pie',
        silent: true,
        startAngle: -140,
        radius: ['67%', '66%'],
        zlevel: 0,
        z: 1,
        label: {
            show: false,
        },
        labelLine: {
            show: false,
        },
        data: getPieData(5, 20, 0.3),
      },
      {
        type: 'pie',
        silent: true,
        startAngle: -147.5,
        radius: ['67%', '66%'],
        zlevel: 0,
        z: 1,
        label: {
            show: false,
        },
        labelLine: {
            show: false,
        },
        data: getPieData(5, 20, 0.3),
      },
    ],
  };
}

const chartData = ref({
  title: '设备总数',
  subtext:"设备在线率",
  total: 0,
  seriesData: [
    {
      name: '',
      value: 0,
      color: chartColor[0],
    },
    {
      name: '',
      value: 0,
      color: chartColor[1],
    },
  ],
})
async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: '设备总数',
        subtext:"设备在线率",
        seriesData: [
          {
            name: '设备在线',
            value: Math.floor(Math.random() * 80 + 10),
            color: chartColor[0],
          },
          {
            name: '设备离线',
            value: Math.floor(Math.random() * 80 + 10),
            color: chartColor[1],
          },
        ],
      },
    };

    const total = res.data.seriesData.reduce((sum, item) => sum + item.value, 0);
    chartData.value = {
      title: res.data.title,
      subtext: res.data.subtext,
      total: total,
      seriesData: res.data.seriesData.map((item) => ({
        ...item,
        ratio: item.value / (total || 1),
      })),
    };

    const option = getOption(chartData.value);
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
    <div ref="chartRef" :style="{ width: '65%', height: '100%' }" />

    <div class="legend-wrap">
      <div class="total">
        <span class="name">{{ chartData.total }}</span>
        <span class="value">{{ chartData.title }}</span>
      </div>
      <div v-for="(item, index) in chartData.seriesData" :key="index" class="item">
        <span class="name">{{ item.name }}</span>
        <span class="value">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 480px;
  background: rgba(8, 25, 66, 1);
}

.legend-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height:  480px;

  .total {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 220px;
    padding-left: 6px;

    .name {
      color: #ffffff;
      font-weight: 400;
      font-size: 14px;
    }

    .value {
      color: #00fff1;
      font-weight: 700;
      font-size: 20px;
      font-family: DINAlternate-Bold;
    }
  }

  .item {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 220px;
    margin-top: 8px;
    padding: 6px 8px 6px 12px;
    line-height: 28px;
    border: 1px solid rgba(218, 249, 255, 0.3);

    &::before {
      position: absolute;
      top: 50%;
      left: 6px;
      width: 2px;
      height: 10px;
      margin-top: -5px;
      background: #f7b500;
      content: '';
    }

    .name {
      color: #ccf6ff;
      font-weight: 400;
      font-size: 12px;
    }

    .value {
      color: #ffff01;
      font-weight: 700;
      font-size: 14px;
      font-family: DINAlternate-Bold;
    }
  }

  .item:first-child::before {
    background: #f7b500;
  }

  .item:nth-child(2):before {
    background: #097a97;
  }
}
</style>
