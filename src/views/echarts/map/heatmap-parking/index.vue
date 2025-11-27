<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";
import { bgImg } from "./data.js";

const chartRef = ref(null);
const { getInstance, setOption, registerMap, showLoading, resize } = useECharts(chartRef, {
  autoTooltipLoop: false, // 是否自动循环 tooltip，默认间隔时间1500ms
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s"
    }
  }
});

const geoMapName = `geoMap${Math.round(Math.random() * 1e10)}`;
const maxWidth = 1200;
const maxHeight = 800;
const fullImage = new Image();
// fullImage.src = bgImg; // 方式1：直接使用图片

// 方式2：使用canvas加载图片
function getFullImage() {
  const echartsInstance = getInstance();

  const img = new Image();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = echartsInstance.getWidth() * window.devicePixelRatio;
  canvas.height = echartsInstance.getHeight() * window.devicePixelRatio;

  img.onload = () => {
    // ctx.translate(0, canvas.height);
    // ctx.scale(1, -1);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    fullImage.src = canvas.toDataURL();
    // setTimeout(() => {
    //   echartsInstance.resize();
    // }, 100)
  };
  img.src = bgImg;
}

function registerCanvasMap() {
  // 地图注册
  const features = {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: {
        name: geoMapName
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [0, 0],
              [maxWidth, 0],
              [maxWidth, maxHeight],
              [0, maxHeight]
            ]
          ]
        ]
      }
    }]
  };
  registerMap(geoMapName, features);
}

function getOption(data) {
  const { title = "", seriesData } = data;

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
    geo: {
      map: geoMapName,
      aspectScale: 1, // 宽高比
      layoutCenter: ["50%", "50%"], // 位置
      layoutSize: Math.max(maxWidth, maxHeight), // 大小
      silent: true, // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
      roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启
      itemStyle: {
        borderWidth: 0,
        // 纹理填充
        color: {
          type: "pattern",
          image: fullImage, // 关键代码，支持为 HTMLImageElement, HTMLCanvasElement，不支持路径字符串
          repeat: "no-repeat" // 是否平铺, 可以是 'repeat-x', 'repeat-y', 'no-repeat'
        }
      }
    },
    visualMap: {
      show: true,
      right: 35,
      bottom: 0,
      itemWidth: 10,
      itemHeight: 100,
      hoverLink: false,
      inRange: {
        color: [
          "#4BFE00",
          "#98FE00",
          "#D7FE00",
          "#FBFE00",
          "#FBE200",
          "#F79300",
          "#F65400",
          "#F50D00"
        ]
      }
    },
    series: [
      {
        type: "heatmap",
        coordinateSystem: "geo",
        pointSize: 15,
        blurSize: 15,
        data: seriesData.data || []
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
          name: "测试数据1",
          data: Array.from({ length: 200 }, () => [Math.random() * maxWidth * 0.5, Math.random() * maxHeight * 0.5, Math.random() * 100])
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
    getFullImage();
    registerCanvasMap();
    getData();
  });
});
</script>

<template>
  <div class="chart-container">
    <div ref="chartRef" id="myChart" :style="{ width: `${maxWidth}px`, height: `${maxHeight}px` }" />
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
