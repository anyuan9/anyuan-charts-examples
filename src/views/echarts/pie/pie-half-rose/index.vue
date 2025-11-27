<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor, chartColors } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
  autoTooltipLoop: false, // 是否自动循环 tooltip，默认间隔时间1500ms
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s"
    }
  }
});

function getOption(data) {
  const { title = "", seriesData = {} } = data;
  seriesData?.data?.forEach((item, index) => {
    item.itemStyle = {
      color: chartColor[index % chartColors.length]
    };
  });
  // 添加透明色占位
  const transparentData = seriesData?.data?.map((item, index) => ({
    value: 0,
    name: "",
    itemStyle: {
      color: "transparent"
    },
    label: {
      show: false
    },
    labelLine: {
      show: false
    }
  }));

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
          type: ["line", "bar", "stack"]
        }
      }
    },
    // 标题
    title: {
      text: title || "",
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 20
      },
      top: "5%",
      left: "2%"
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "rgba(0, 0, 0, 0.6)",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: "rgba(255, 255, 255, 1)"
      },
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true // grid 区域是否包含坐标轴的刻度标签
    },
    series: [
      {
        type: "pie",
        radius: ["25%", "80%"],
        center: ["50%", "65%"],
        startAngle: 180, // 起始角度，支持范围[0, 360]
        avoidLabelOverlap: false, // 是否启用防止标签重叠策略，默认开启，圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false。
        selectedMode: "single",
        roseType: "area", // 是否展示成南丁格尔图，通过半径区分数据大小。可选择'radius'（半径）和'area'（面积）两种模式。
        label: {
          show: true,
          formatter: "{c}千万元"
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 1,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.6)"
          }
        },
        data: seriesData?.data?.concat(transparentData)
      }
    ]
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
          data: Array.from({ length: 8 }, (_, i) => ({
            name: `测试数据${i}`,
            value: Math.floor(Math.random() * 50 + 100 * (i + 1))
          }))
        }
      }
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
          color: "rgba(255, 255, 255, 0.6)"
        }
      }
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
