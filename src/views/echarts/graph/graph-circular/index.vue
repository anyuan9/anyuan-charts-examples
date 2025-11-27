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

// 图表数据
const defaultChartData = {
  title: "",
  // 节点分类的类目
  categories: [],
  // 关系图的节点数据
  seriesData: [
    // { name: '', value: 0 }
  ],
  // 节点间的关系数据
  linksData: []
};

function getOption(data) {
  const { title = "", categories, seriesData, linksData } = data;

  seriesData.forEach((item, index) => {
    item.itemStyle = null;
    item.symbolSize = item.value;
    item.label = {
      show: item.value > 10
    };
  });

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
    // 图例(series内容需要配置name属性)
    legend: {
      top: "2%",
      right: "5%",
      icon: "rect", // 图例项的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
      itemWidth: 12, // 图例标记的图形宽度，默认25
      itemHeight: 12, // 图例标记的图形高度，默认14
      itemGap: 15, // 图例项之间的间隔，单位px，默认10，可取值：5、[5, 10]、[5, 10, 5, 10]
      // 图例文字的样式
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 14
      },
      data: categories.map(item => item.name)
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        type: "graph",
        layout: "circular", // 图的布局。可选：'none' 不采用任何布局；'circular' 采用环形布局；'force' 采用力引导布局
        roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启
        symbol: "circle", // 节点标记类型
        symbolSize: 20, // 节点标记的大小
        edgeSymbol: ["", "arrow"], // 边两端的标记类型，可以是一个数组分别指定两端，也可以是单个统一指定。默认不显示标记，常见的可以设置为箭头，如下：['circle', 'arrow']
        edgeSymbolSize: [2, 5], // 边两端的标记大小
        // 关系边的公用线条样式
        lineStyle: {
          color: "source",
          width: 2,
          opacity: 0.7,
          curveness: 0.3 // 边的曲率，支持从 0 到 1 的值，值越大曲度越大
        },
        // 图形上的文本标签
        label: {
          show: true, // 是否显示标签
          position: "right", // 标签的位置。默认为'inside'
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: 14,
          formatter: "{b}"
        },
        // 环形布局相关配置
        circular: {
          rotateLabel: true // 是否旋转标签，默认false
        },
        categories, // 节点分类的类目
        data: seriesData, // 关系图的节点数据
        links: linksData // 节点间的关系数据
      }
    ]
  };
}

function getSeriesData(categories) {
  const length = categories.length;
  const seriesData = [];
  for (let i = 0; i < length; i++) {
    const count = Math.floor(Math.random() * length) + 2; // 每个类目下的节点数量
    for (let j = 0; j < count; j++) {
      const value = Math.random() * 100;
      seriesData.push({
        name: `数据${i}-${j}`,
        category: i, // 数据项所在类目的 index
        value: Math.random() * 27 + 3
      });
    }
  }
  return seriesData;
}

function getLinksData(seriesData) {
  const length = seriesData.length;
  const linksData = [];
  for (let i = 0; i < length; i++) {
    const count = Math.floor(Math.random() * (length - i) / 2) + 1;
    for (let j = 0; j < count; j++) {
      const targetIndex = Math.floor(Math.random() * (length - i) + i);
      linksData.push({
        source: seriesData[j].name,
        target: seriesData[targetIndex].name
      });
    }
  }
  return linksData;
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const categories = [
      {
        name: "类目1"
      },
      {
        name: "类目2"
      },
      {
        name: "类目3"
      },
      {
        name: "类目4"
      },
      {
        name: "类目5"
      },
      {
        name: "类目6"
      },
      {
        name: "类目7"
      }
    ];
    const seriesData = getSeriesData(categories);
    // const seriesData = [
    //   {
    //     name: '数据0-1',
    //     category: 0, // 数据项所在类目的 index
    //     value: Math.random() * 30,
    //   },
    //   {
    //     name: '数据0-2',
    //     category: 0,
    //   }
    // ]
    const linksData = getLinksData(seriesData);
    // const linksData = [
    //   {
    //     source: '数据0-1', // 边的源节点名称的字符串，也支持使用数字表示源节点的索引。
    //     target: '数据0-2', // 边的目标节点名称的字符串，也支持使用数字表示源节点的索引。
    //   },
    // ]
    const res = {
      code: "0",
      data: {
        title: "知识图谱",
        categories,
        seriesData,
        linksData
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
