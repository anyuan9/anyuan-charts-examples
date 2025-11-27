<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";
import EmptyDark from '@/components/EmptyDark/index.vue'

const chartRef = ref(null);
const { dataIndex, setOption, showLoading } = useECharts(chartRef, {
  autoHighlightLoop: true, // 是否自动轮播高亮显示。注意饼图不是使用autoTooltipLoop
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
  const bgColor = 'rgba(8, 25, 66, 1)'

  return {
    // 背景颜色，默认无背景
    backgroundColor: bgColor,
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
    title: {
      text: title || "",
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 20,
      },
      top: "5%",
      left: "2%",
    },
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
        type: 'pie',
        radius: ['45%', '65%'],
        center: ['30%', '50%'],
        // minAngle: 2, //最小的扇区角度（0 ~ 360）
        // padAngle: 10, // 方案1：饼图扇区之间的间隔角度（0 ~ 360），从 v5.5.0 开始支持
        itemStyle: {
          borderWidth: 10, // 方案2：设置边框宽度，表示中间的空格区域
          borderColor: bgColor,
        },
        label: {
          show: false,
          position: 'center', // 标签的位置，'outside'饼图扇区外侧，'inside'饼图扇区内部，'center'在饼图中心位置
          rich: {
            value: {
              fontSize: 36,
              fontWeight: 'bold',
              color: 'rgba(255, 255, 255, 0.8)',
            },
          },
          formatter: '{value|{d}%}',
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            borderWidth: 0,
          },
          label: {
            show: true,
            fontSize: 36,
          },
          scale: false, // 鼠标移入变大
        },
        name: seriesData?.name || '',
        data: seriesData?.data || [],
      },
      // 外环阴影
      {
        type: 'pie',
        radius: ['62%', '70%'],
        center: ['30%', '50%'],
        itemStyle: {
          shadowBlur: 30,
          shadowColor: 'rgba(255, 255, 255, 0.4)',
          color: 'rgba(255, 255, 255, 0.1)',
        },
        label: {
          show: false,
        },
        tooltip: {
          show: false,
        },
        emphasis: {
          scale: false, // 鼠标移入变大
        },
        data: [100],
      },
      // 内环刻度线
      {
        type: 'gauge',
        splitNumber: 10, //刻度数量
        min: 0,
        max: 100,
        radius: '45%', //图表尺寸
        center: ['30%', '50%'],
        startAngle: 90,
        endAngle: -269.9999,
        axisLine: {
          show: true,
          lineStyle: {
            width: 0,
            shadowBlur: 0,
            color: [
              [0, 'rgba(255, 255, 255, 0.3)'],
              [1, 'rgba(255, 255, 255, 0.3)'],
            ],
          },
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)',
            width: 1,
          },
          length: 5,
          splitNumber: 10,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        pointer: {
          // 仪表盘指针
          show: false,
        },
        detail: {
          show: false,
        },
      },
    ],
  };
}

// 图例数据
const legendData = ref([])
async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "测试数据",
        seriesData: {
          name: "测试数据1",
          data: Array.from({ length: 4 }, (_, i) => {
            return {
              name: `name${i}`,
              value: Math.floor(Math.random() * 800 + 20),
            }
          }),
        },
      },
    };

    // 数据总和
    const total =
      res.data?.seriesData?.data?.reduce((acc, item) => {
        return acc + item.value
      }, 0) || 0
    legendData.value = res.data?.seriesData?.data?.map((item, index) => {
      return {
        ...item,
        color: chartColor[index % chartColor.length],
        percent: ((item.value / total) * 100).toFixed(2) + '%',
      }
    }) || []

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

    <div v-if="legendData.length" class="chart-legend">
      <div v-for="(item, index) in legendData" :key="index" class="chart-legend-item"
        :class="{ active: index === dataIndex }">
        <div class="legend-item_left">
          <span class="icon" :style="`background: ${item.color};`"></span>
          <span class="name">{{ item.name }}</span>
        </div>
        <div class="legend-item_right">
          <span class="value">{{ item.value }}</span>
          <span class="divide"></span>
          <span class="percent">{{ item.percent }}</span>
        </div>
      </div>
    </div>

    <div v-if="legendData.length" class="legend-wrap">
      <div v-for="(item, index) in legendData" :key="index" class="legend-item">
        <div class="legend-left">
          <div class="legend-icon"
            :style="{'background-image': `linear-gradient(0deg, ${chartColors[index][0]} 0%, ${chartColors[index][1]} 100%)`}">
          </div>
          <div class="legend-text">{{ item.name }}</div>
        </div>
        <div class="legend-right">
          <div class="legend-text legend-value ellipsis">{{ item.value }}</div>
          <div class="divide" />
          <div class="legend-text">{{ item.percent }}</div>
        </div>
      </div>
    </div>
    <div v-else style="flex: 1">
      <empty-dark size="sm" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 480px;
  background: rgba(8, 25, 66, 1);
}

.chart-legend {
  position: absolute;
  top: 30%;
  right: 5%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  font-size: 14px;
  transform: translate(0%, -50%);

  .chart-legend-item {
    position: relative;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    padding: 6px 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-right: none;
    border-left: none;

    &::before {
      position: absolute;
      top: -1px;
      right: 0;
      width: 4px;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.8);
      content: '';
    }

    &::after {
      position: absolute;
      right: 0;
      bottom: -1px;
      width: 4px;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.8);
      content: '';
    }

    &.active {
      background-color: rgba(25, 178, 255, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-right: none;
      border-left: none;
    }

    .legend-item_left,
    .legend-item_right {
      display: flex;
      align-items: center;
    }

    .icon {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin-right: 8px;
      transform: rotate(45deg);
    }

    .name {
      width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .value {
      text-align: right;
    }

    .divide {
      width: 1px;
      height: 16px;
      margin: 0 8px;
      // background-color: rgba(255, 255, 255, 0.5);
      background-image: linear-gradient(
        180deg,
        rgba(76, 160, 255, 0.2) 0%,
        rgb(49 124 255) 50%,
        rgba(76, 160, 255, 0.2) 100%
      );
    }

    .percent {
      display: inline-block;
      width: 60px;
      text-align: right;
    }
  }
}


.legend-wrap {
  position: absolute;
  top: 70%;
  right: 5%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
  flex: 1;
  margin-left: 12px;

  .legend-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 26px;
    padding-right: 4px;
    overflow: hidden;
    background-image: linear-gradient(90deg, rgba(35, 89, 183, 0.5) 0%, rgba(76, 160, 255, 0) 100%);

    .legend-icon {
      width: 3px;
      height: 14px;
      border-radius: 3px;
      margin-right: 8px;
      background-image: linear-gradient(90deg, #54d7ff 0%, #37a8ff 100%);
    }

    .legend-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
    }

    .legend-left,
    .legend-right {
      display: flex;
      align-items: center;
    }

    .legend-right {
      flex: 1;
      justify-content: flex-end;
      padding-left: 8px;
      overflow: hidden;

      .legend-text {
        color: rgba(255, 255, 255, 1);
        text-align: right;
      }

      .legend-value {
        flex: 1;
      }
    }

    .divide {
      width: 1px;
      height: 16px;
      margin: 0 8px;
      // background-color: rgba(255, 255, 255, 0.5);
      background-image: linear-gradient(
        180deg,
        rgba(76, 160, 255, 0.2) 0%,
        rgb(49 124 255) 50%,
        rgba(76, 160, 255, 0.2) 100%
      );
    }
  }
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
