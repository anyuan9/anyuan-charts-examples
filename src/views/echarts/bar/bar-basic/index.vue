<script setup>
import { ref, watch, onMounted, defineProps, nextTick } from 'vue'
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from '@/views/echarts/constant'

const chartRef = ref(null)
const { setOption, showLoading } = useECharts(chartRef, {
  autoTooltipLoop: true, // 是否自动循环 tooltip，默认间隔时间1500ms
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: 'all 2s',
    },
  },
})

function getOption(data) {
  const { title, xAxisData, seriesData } = data

  return {
    // 背景颜色，默认无背景
    backgroundColor: 'rgba(8, 25, 66, 1)',
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
    // 工具栏
    toolbox: {
      show: true,
      right: '5%',
      top: '7%',
      feature: {
        // 保存为图片
        saveAsImage: {},
        // 动态类型切换
        magicType: {
          type: ['line', 'bar', 'stack'],
        },
      },
    },
    // 标题
    title: {
      text: title || '',
      subtext: '',
      textStyle: {
        color: '#fff',
        fontSize: 20,
      },
      top: '2%',
      left: 'center',
    },
    // 图例(series内容需要配置name属性)
    legend: {
      top: '2%',
      right: '5%',
      icon: 'rect', // 图例项的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
      itemWidth: 12, // 图例标记的图形宽度，默认25
      itemHeight: 12, // 图例标记的图形高度，默认14
      itemGap: 15, // 图例项之间的间隔，单位px，默认10，可取值：5、[5, 10]、[5, 10, 5, 10]
      // 图例文字的样式
      textStyle: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 14,
      },
    },
    // 提示框
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderColor: 'rgba(0, 0, 0, 0.6)',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: 'rgba(255, 255, 255, 1)',
      },
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    // 直角坐标系内绘图网格
    grid: {
      top: '15%', // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: '5%', // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: '5%',
      bottom: '5%',
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    xAxis: [
      {
        type: 'category',
        // 坐标轴的轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)',
          },
        },
        // 坐标轴的刻度
        axisTick: {
          show: true,
          interval: 0, // 刻度显示间隔，此时显示所有刻度
          length: 4, // 坐标轴刻度的长度，默认5
          inside: false, // 刻度标签是否朝内，默认false(朝外)
          alignWithLabel: true, // 刻度与标签对齐
          lineStyle: {
            fontSize: 12,
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.4)',
          },
        },
        // 坐标轴的刻度标签
        axisLabel: {
          interval: 0,
          // rotate: -30, // 刻度标签旋转的角度，从 -90 度到 90 度，默认0
          inside: false, // 刻度标签是否朝内，默认false(朝外)
          fontSize: 12,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.4)',
        },
        // 坐标轴的分隔线
        splitLine: {
          show: false,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        data: xAxisData || [],
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitNumber: 5, // 坐标轴的分割段数，默认值：5。需要注意的是这个分割段数只是个预估值，最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整。
        // 坐标轴的轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.2)',
          },
        },
        // 坐标轴的刻度
        axisTick: {
          show: false,
        },
        // 坐标轴的刻度标签
        axisLabel: {
          show: true,
          color: 'rgba(255, 255, 255, 0.4)',
        },
        // 坐标轴的分隔线
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        type: 'bar',
        barWidth: '40%',
        barMaxWidth: 100,
        showBackground: true,
        backgroundStyle: {
          color: `${chartColor[0]}4d`, // 背景颜色
        },
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
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
          borderRadius: [0, 0, 0, 0],
          shadowColor: 'rgba(255, 255, 255, 1)', // 实现柱体顶部白色方块
          shadowBlur: 0,
          shadowOffsetY: -6,
        },
        label: {
          show: true,
          position: 'top',
          padding: 10, // 文字内边距，拉开一段距离
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 700,
          fontSize: 14,
        },
        name: (seriesData?.length && seriesData[0].name) || '',
        data: (seriesData?.length && seriesData[0].data) || [],
      },
    ],
  }
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: '0',
      data: {
        title: '测试统计表',
        xAxisData: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
        seriesData: [
          {
            name: '测试数据',
            data: Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 500 + 100)),
          },
        ],
      },
    }

    const option = getOption(res.data || {})
    setOption(option)
  } catch (err) {
    console.error(err)
    setOption({
      title: {
        show: true,
        text: '获取数据失败',
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 20,
        },
      },
    })
  }
}

onMounted(() => {
  nextTick(() => {
    showLoading()
    getData()
  })
})
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
  background: rgba(8, 25, 66, 1);
}
</style>
