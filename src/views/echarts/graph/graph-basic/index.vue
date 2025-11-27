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

  categories.forEach((item, index) => {
    item.label = {
      ...item.label,
      formatter: '{b}',
      color: chartColors[index],
    }
    item.itemStyle = {
      color: {
        type: 'radial',
        r: 0.9,
        colorStops: [
          {
            offset: 0,
            color: '#0c1746',
          },
          {
            offset: 0.8,
            color: chartColor[index],
          },
        ],
        global: false, // 缺省为 false
      },
      borderColor: chartColor[index],
      borderWidth: 1,
    }
  })

  linksData.forEach((link, index) => {
    link.label = {
      align: 'center',
      fontSize: 12,
    }
    link.lineStyle = {
      color: categories.find(item => item.name === link.value).itemStyle.borderColor,
    }
  })

  return {
    // 背景颜色，默认无背景
    backgroundColor: "rgba(8, 25, 66, 1)",
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
    title: {
      text: title,
      subtext: '',
      top: '2%',
      left: 'center',
      textStyle: {
        align: 'center',
        color: '#fff',
        fontSize: 20,
      },
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
      data: categories.map(item => item.name),
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'force', // 图的布局。可选：'none' 不采用任何布局；'circular' 采用环形布局；'force' 采用力引导布局
        roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启
        draggable: true, // 节点是否可拖拽
        symbol: 'circle', // 节点标记类型
        symbolSize: 20, // 节点标记的大小
        edgeSymbol: ['circle', 'arrow'], // 边两端的标记类型，可以是一个数组分别指定两端，也可以是单个统一指定。默认不显示标记，常见的可以设置为箭头，如下：['circle', 'arrow']
        edgeSymbolSize: [2, 6], // 边两端的标记大小
        // 边的标签
        edgeLabel: {
          show: true,
          position: 'middle', // 标签的位置。可选'start' 线的起始点；'middle' 线的中点；'end' 线的结束点。
          align: 'center', // 文字水平对齐方式，默认自动。可选：'left','center','right'
          fontSize: 20,
          color: 'rgba(255, 255, 255, 0.8)',
          formatter: '{c}',
        },
        // 关系边的公用线条样式
        lineStyle: {
          width: 2,
          opacity: 0.7,
          curveness: 0, // 边的曲率，支持从 0 到 1 的值，值越大曲度越大。
        },
        // 图形上的文本标签
        label: {
          show: true,
          position: 'inside', // 标签的位置。默认为'inside'
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 14,
        },
        // 环形布局相关配置
        circular: {
          rotateLabel: true, // 是否旋转标签，默认false
        },
        // 力引导布局相关的配置项
        force: {
          repulsion: 200, // 节点之间的斥力因子。值越大则斥力越大，默认为50
          gravity: 0, // 节点受到的向中心的引力因子。该值越大节点越往中心点靠拢，默认为0.1
          edgeLength: 100, // 边的两个节点之间的距离，这个距离也会受 repulsion影响 。值越小则长度越大，默认为30
          layoutAnimation: true, //默认动态为true
        },
        emphasis: {
          focus: 'adjacency',  // 鼠标经过节点是否突出显示
        },
        categories: categories, // 节点分类的类目
        data: seriesData, // 关系图的节点数据
        links: linksData, // 节点间的关系数据
      },
    ],
  }
}

async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    // 类目
    const categories = [
      {
        name: '前端',
        symbolSize: 100, // 节点大小
        label: {
          fontSize: 20,
        },
      },
      {
        name: '分支',
        symbolSize: 80,
        label: {
          fontSize: 16,
        },
      },
      {
        name: '技术',
        symbolSize: 60,
        label: {
          fontSize: 14,
        },
      },
    ]
    const seriesData = [
      {
        name: '前端技术栈',
        category: 0, // 数据项所在类目的 index
      },
      {
        name: '基础',
        category: 1,
      },
      {
        name: '框架',
        category: 1,
      },
      {
        name: 'UI组件',
        category: 1,
      },
      {
        name: '工程化',
        category: 1,
      },
      {
        name: '网络',
        category: 1,
      },
      {
        name: 'app',
        category: 1,
      },
      // 基础
      {
        name: 'html',
        category: 2,
      },
      {
        name: 'js',
        category: 2,
      },
      {
        name: 'css',
        category: 2,
      },
      {
        name: 'es6',
        category: 2,
      },
      {
        name: 'ts',
        category: 2,
      },
      {
        name: 'express',
        category: 2,
      },
      {
        name: 'node',
        category: 2,
      },
      // 框架
      {
        name: 'vue',
        category: 2,
      },
      {
        name: 'react',
        category: 2,
      },
      {
        name: 'angular',
        category: 2,
      },
      {
        name: 'nuxt',
        category: 2,
      },
      {
        name: 'jquery',
        category: 2,
      },
      // UI组件
      {
        name: 'element-ui',
        category: 2,
      },
      {
        name: 'antd',
        category: 2,
      },
      {
        name: 'iview',
        category: 2,
      },
      // 工程化
      {
        name: 'npm',
        category: 2,
      },
      {
        name: 'webpack',
        category: 2,
      },
      {
        name: 'vite',
        category: 2,
      },
      // 网络
      {
        name: 'ajax',
        category: 2,
      },
      {
        name: 'socket',
        category: 2,
      },
      // app
      {
        name: 'uni-app',
        category: 2,
      },
      {
        name: 'flutter',
        category: 2,
      },
    ]
    const linksData = [
      {
        source: '前端技术栈', // 边的源节点名称的字符串，也支持使用数字表示源节点的索引。
        target: '基础', // 边的目标节点名称的字符串，也支持使用数字表示源节点的索引。
        value: categories[1].name, // 边的数值，可以在力引导布局中用于映射到边的长度。
      },
      {
        source: '前端技术栈',
        target: '框架',
        value: categories[1].name,
      },
      {
        source: '前端技术栈',
        target: 'UI组件',
        value: categories[1].name,
      },
      {
        source: '前端技术栈',
        target: '工程化',
        value: categories[1].name,
      },
      {
        source: '前端技术栈',
        target: '网络',
        value: categories[1].name,
      },
      {
        source: '前端技术栈',
        target: 'app',
        value: categories[1].name,
      },
      // 基础
      {
        source: '基础',
        target: 'html',
        value: categories[2].name,
      },
      {
        source: '基础',
        target: 'js',
        value: categories[2].name,
      },
      {
        source: '基础',
        target: 'css',
        value: categories[2].name,
      },
      {
        source: '基础',
        target: 'es6',
        value: categories[2].name,
      },
      {
        source: '基础',
        target: 'ts',
        value: categories[2].name,
      },
      {
        source: '基础',
        target: 'express',
        value: categories[2].name,
      },
      {
        source: '基础',
        target: 'node',
        value: categories[2].name,
      },
      // 框架
      {
        source: '框架',
        target: 'vue',
        value: categories[2].name,
      },
      {
        source: '框架',
        target: 'react',
        value: categories[2].name,
      },
      {
        source: '框架',
        target: 'angular',
        value: categories[2].name,
      },
      {
        source: '框架',
        target: 'nuxt',
        value: categories[2].name,
      },
      {
        source: '框架',
        target: 'jquery',
        value: categories[2].name,
      },
      // UI组件
      {
        source: 'UI组件',
        target: 'element-ui',
        value: categories[2].name,
      },
      {
        source: 'UI组件',
        target: 'antd',
        value: categories[2].name,
      },
      {
        source: 'UI组件',
        target: 'iview',
        value: categories[2].name,
      },
      // 工程化
      {
        source: '工程化',
        target: 'npm',
        value: categories[2].name,
      },
      {
        source: '工程化',
        target: 'webpack',
        value: categories[2].name,
      },
      {
        source: '工程化',
        target: 'vite',
        value: categories[2].name,
      },
      // 网络
      {
        source: '网络',
        target: 'ajax',
        value: categories[2].name,
      },
      {
        source: '网络',
        target: 'socket',
        value: categories[2].name,
      },
      // app
      {
        source: 'app',
        target: 'uni-app',
        value: categories[2].name,
      },
      {
        source: 'app',
        target: 'flutter',
        value: categories[2].name,
      },
    ]
    const res = {
      code: "0",
      data: {
        title: "知识图谱",
        categories: categories,
        seriesData: seriesData,
        linksData: linksData
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
