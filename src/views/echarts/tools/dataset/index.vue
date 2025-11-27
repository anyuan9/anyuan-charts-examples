<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";

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
    xAxis: {
      // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
      type: "category"
    },
    yAxis: {},
    dataset: {
      source: [
        ["product", "2015", "2016", "2017"],
        ["Matcha Latte", 43.3, 85.8, 93.7],
        ["Milk Tea", 83.1, 73.4, 55.1],
        ["Cheese Cocoa", 86.4, 65.2, 82.5],
        ["Walnut Brownie", 72.4, 53.9, 39.1]
      ]
    },
    // dataset: {
    //   // 这里指定了维度名的顺序，从而可以利用默认的维度到坐标轴的映射。
    //   // 如果不指定 dimensions，也可以通过指定 series.encode 完成映射，参见后文。
    //   dimensions: ['product', '2015', '2016', '2017'],
    //   source: [
    //     { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
    //     { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
    //     { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
    //     { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 }
    //   ]
    // },
    series: [
      // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
      { type: "bar", seriesLayoutBy: "column" }, // seriesLayoutBy: 配置dataset是列（column）还是行（row）映射为图形系列（series），默认是按照列（column）来映射。
      { type: "bar", seriesLayoutBy: "column" },
      { type: "bar", seriesLayoutBy: "column" }
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
        seriesData: []
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
