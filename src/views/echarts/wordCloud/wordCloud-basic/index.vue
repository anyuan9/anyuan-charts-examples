<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";
import { symbolUrl } from "./constant";
import "echarts-wordcloud"; // https://github.com/ecomfe/echarts-wordcloud

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

const maskImage = new Image();
maskImage.src = symbolUrl;

function getOption(data) {
  const { title = "", xAxisData, seriesData } = data;

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
        type: "wordCloud",
        width: "100%",
        height: "65%",
        left: "center",
        top: "center",
        shape: "circle", // 'circle' | 'cardioid' | 'diamond' | 'triangle-forward' | 'triangle' | 'pentagon' | 'star'
        // maskImage: maskImage, // 图片遮罩，轮廓图像，白色区域将被排除在绘图文本之外。
        keepAspect: false, // 是否保持同比例缩放，默认为false
        sizeRange: [8, 60], // 字体大小范围，默认为[12,60]
        rotationRange: [0, 0], // 字体旋转范围，默认为[-90, 90]
        rotationStep: 45, // 字体旋转步长，默认为45
        gridSize: 8, // 字体间距，默认为8
        drawOutOfBound: false, // 是否允许字体超出画布范围，默认为false
        shrinkToFit: false, // 是否允许字体缩小以适应画布范围，默认为false
        layoutAnimation: true, // 是否启用布局动画，默认为true
        textStyle: {
          fontFamily: "sans-serif",
          fontWeight: "bold",
          // 颜色，可以是回调函数或颜色字符串
          color: () => {
            return `rgb(${[
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(",")})`;
          }
        },
        emphasis: {
          focus: "self",
          textStyle: {
            textShadowBlur: 10,
            textShadowColor: "#333"
          }
        },
        data: seriesData || []
      }
    ]
  };
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const presents = [
      "有更多经济需求",
      "娱乐活动简单",
      "社交空间单一",
      "集市设施简陋",
      "游客体验感不高",
      "日常较单一",
      "集市停车不便",
      "菜市场利用不高",
      "主街界面封闭",
      "公共空间基本没有",
      "空间利用率低",
      "村镇缺乏活力",
      "缺乏儿童游乐空间",
      "建筑风格少特点",
      "认知度不高",
      "优质的自然人文资源没发挥最好作用"
    ];
    const res = {
      code: "0",
      data: {
        title: "测试数据",
        xAxisData: Array.from(
          { length: 24 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`
        ),
        seriesData: presents.map(item => ({
          name: item,
          value: Math.floor(Math.random() * 500 + 100)
          // textStyle: {}
        }))
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
