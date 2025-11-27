<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";
import 'echarts-liquidfill';

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
  const { title = "", seriesData } = data;
  const pieVal = Math.floor(200 * seriesData.value);
  const pieData = [pieVal, 2, 200 - pieVal]

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
    // 标题
    title: [
      {
        text: `{a|${(seriesData.value * 100).toFixed(1)}%}`,
        subtext: title || "",
        top: 'center',
        left: 'center',
        itemGap: 8,
        subtextStyle: {
          color: 'rgba(255,255,255,0.8)',
          fontSize: 22,
          fontWeight: 400,
          top: 'center'
        },
        textStyle: {
          rich: {
            a: {
              color: '#fff',
              fontSize: 42,
              fontWeight: 'normal',
              fontFamily: 'DIN-Medium',
              textShadow: [0, 0, 4, 'rgba(38,52,58,0.50)']
            },
          }
        }
      }],
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    series: [
      {
        type: 'liquidFill',
        radius: '45%',
        center: ['50%', '50%'],

        amplitude: '8%', // 波浪幅度
        waveLength: '80%', // 波浪长度
        phase: 'auto', // 波浪的相位弧度，默认自动计算
        period: 'auto', // 波浪的周期，默认自动计算
        direction: 'right', // 波浪方向，默认'left'。可选值： 'left' | 'right'
        // shape: 'diamond', // 水波形状，默认为圆形。可选值：'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow';
        // shape: 'container', // 装满容器的形状
        // 以'path://'开头的SVG路径，自定义水波形状
        shape: "path://M122.882,128.003 L5.118,128.003 C2.290,128.003 -0.003,125.710 -0.003,122.882 L-0.003,51.199 L64.000,-0.003 L96.593,26.072 L96.593,9.384 C96.593,8.442 97.357,7.678 98.300,7.678 L115.890,7.678 C116.833,7.678 117.597,8.442 117.597,9.384 L117.597,42.875 L128.003,51.199 L128.003,122.882 C128.003,125.710 125.710,128.003 122.882,128.003 ZM77.764,103.593 C77.764,98.070 73.287,93.593 67.764,93.593 L60.236,93.593 C54.713,93.593 50.236,98.070 50.236,103.593 L50.236,128.003 L77.764,128.003 L77.764,103.593 Z",
        // shape: 'path://M367.855,428.202c-3.674-1.385-7.452-1.966-11.146-1.794c0.659-2.922,0.844-5.85,0.58-8.719 c-0.937-10.407-7.663-19.864-18.063-23.834c-10.697-4.043-22.298-1.168-29.902,6.403c3.015,0.026,6.074,0.594,9.035,1.728 c13.626,5.151,20.465,20.379,15.32,34.004c-1.905,5.02-5.177,9.115-9.22,12.05c-6.951,4.992-16.19,6.536-24.777,3.271 c-13.625-5.137-20.471-20.371-15.32-34.004c0.673-1.768,1.523-3.423,2.526-4.992h-0.014c0,0,0,0,0,0.014 c4.386-6.853,8.145-14.279,11.146-22.187c23.294-61.505-7.689-130.278-69.215-153.579c-61.532-23.293-130.279,7.69-153.579,69.202 c-6.371,16.785-8.679,34.097-7.426,50.901c0.026,0.554,0.079,1.121,0.132,1.688c4.973,57.107,41.767,109.148,98.945,130.793 c58.162,22.008,121.303,6.529,162.839-34.465c7.103-6.893,17.826-9.444,27.679-5.719c11.858,4.491,18.565,16.6,16.719,28.643 c4.438-3.126,8.033-7.564,10.117-13.045C389.751,449.992,382.411,433.709,367.855,428.202z',
        // color:['yellow'], // 波浪颜色，所有波浪一个颜色
        // color:['#294D99', '#156ACF', '#1598ED', '#45BDFF'], // 每个波浪不同颜色，颜色数组长度为对应的波浪个数
        color: [
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: chartColors[0][0],
              },
              {
                offset: 1,
                color: chartColors[0][1],
              },
            ],
            global: false, // 缺省为 false
          },
        ],

        waveAnimation: true, // 是否显示水波动画效果
        animationEasing: 'linear',
        animationEasingUpdate: 'linear',
        animationDuration: 2000, // 动画时间，单位ms
        animationDurationUpdate: 1000, // 动画更新时间，单位ms

        itemStyle: {
          opacity: 0.95,
          shadowBlur: 50,
          shadowColor: 'rgba(0, 0, 0, 0.4)'
        },

        label: {
          show: false,
          color: '#294D99',
          insideColor: '#fff',
          fontSize: 50,
          fontWeight: 'bold',

          align: 'center',
          baseline: 'middle',
          position: 'inside'
        },

        // 内部背景
        backgroundStyle: {
          color: '#E3F7FF',
          // borderColor: '#FFBF11',
          borderWidth: 1,
        },

        // 外边框
        outline: {
          show: true,
          borderDistance: 10,
          itemStyle: {
            color: 'none',
            borderColor: '#294D99',
            borderWidth: 8,
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.25)'
          }
        },

        emphasis: {
          itemStyle: {
            opacity: 0.8
          }
        },
        name: seriesData.name,
        data: Array.from({ length: 3 }, () => seriesData.value), // data个数代表波浪数，数字表示波浪高度
      }
    ],
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
          name: "测试数据1",
          value: Math.floor(Math.random() * 100) / 100, // 随机生成0~1之间的数
        },
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
