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
          type: ["line", "bar", "stack"],
        },
      },
    },
    // 提示框
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
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
        type: 'tree',
        top: '5%',
        left: '7%',
        bottom: '2%',
        right: '60%',
        symbol: 'emptyCircle',
        symbolSize: 7,
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
        itemStyle: {
          color: chartColor[0],
          borderColor: chartColor[0],
        },
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 12,
          color: 'rgba(255,255,255,0.8)'
        },
        emphasis: {
          focus: 'descendant'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        name: (seriesData?.length && seriesData[0].name) || "",
        data: (seriesData?.length && [seriesData[0].data]) || [],
      },
      {
        type: 'tree',
        top: '20%',
        left: '60%',
        bottom: '22%',
        right: '18%',
        layout: 'orthogonal', // 树图的布局方式，可选 'orthogonal'（正交）和 'radial'（径向），默认为 'orthogonal'。
        orient: 'BT', // 树图中正交布局的方向，只在 layout = 'orthogonal' 配置项生效。取值分别为 'LR'从左到右，'RL'从右到左，'TB'从上到下，'BT'从下到上。注意，layout 配置项值 'horizontal' 等同于 'LR'， 'vertical' 等同于 'TB'。
        symbol: 'rect', // 节点标记的图形，包括'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'；也可以通过 'image://url' 设置为图片，其中 url 支持网络图片、base64、或 HTML 引用路径。默认'emptyCircle'
        symbolSize: [12, 16],
        symbolRotate: 90, // 节点标记的旋转角度（而非弧度）。正值表示逆时针旋转
        symbolKeepAspect: true, // 节点标记的宽高是否按照比例缩放, 默认为false
        symbolOffset: [0, 0], // 节点标记相对于原本位置的偏移。默认情况下，标记会居中置放在数据对应的位置
        edgeShape: 'polyline', // 树图在正交布局下，边的形状。取值是 curve曲线 和 polyline折线.
        edgeForkPosition: '63%', // 树图在正交布局下，边的拐点位置。取值是百分比或者绝对像素值，默认是'50%'，表示在节点的中间位置发生拐角。
        roam: false, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
        expandAndCollapse: true, // 子树折叠和展开的交互，默认为true
        initialTreeDepth: 2, // 初始展开的层级。根节点为第 0 层，默认为2。如果设置为 -1 或者 null 或者 undefined，所有节点都将展开。
        animationDuration: 550,
        animationDurationUpdate: 750,
        // 树图中每个节点的样式
        itemStyle: {

        },
        // 树图中每个节点的文本标签样式
        label: {
          position: 'bottom',
          verticalAlign: 'middle',
          align: 'right',
          rotate: 90,
          formatter: (params) => {
            const { name, value, seriesIndex, dataIndex, treeAncestors } = params;
            const length = treeAncestors.length;
            if (length === 1) {
              return '{a|' + name + '}'
            } else if (length === 2) {
              return '{b|' + name + '}'
            } else if (length === 3) {
              return '{c|' + name + '}'
            } else {
              return '{d|' + name + '}'
            }
          },
          rich: {
            a: {
              padding: 6,
              borderRadius: 3,
              color: '#fff',
              backgroundColor: '#546fc6'
            },
            b: {
              padding: 6,
              borderRadius: 3,
              color: '#fff',
              backgroundColor: '#7ab1a6'
            },
            c: {
              padding: 6,
              borderRadius: 3,
              color: '#fff',
              backgroundColor: '#bec985'
            },
            d: {
              padding: 6,
              borderRadius: 3,
              color: '#fff',
              backgroundColor: '#fed360'
            }
          }
        },
        // 树图中每个节点的标签的统一布局配置
        labelLayout: {

        },
        // 定义树图边的样式
        lineStyle: {
          color: '#91cd75'
        },
        emphasis: {
          focus: 'descendant'
        },
        // 淡出状态的相关配置，开启 emphasis.focus 后有效
        blur: {},
        // 选中状态的相关配置
        select: {},
        // 叶子节点的特殊配置
        leaves: {
          label: {
            position: 'top',
            verticalAlign: 'middle',
            align: 'left',
            rotate: 90,
          }
        },
        name: (seriesData?.length && seriesData[1].name) || "",
        data: (seriesData?.length && [seriesData[1].data]) || [],
      },
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
        seriesData: [
          {
            name: "测试数据1",
            data: {
              name: 'flare',
              children: [
                {
                  name: 'data',
                  children: [
                    {
                      name: 'converters',
                      children: [
                        { name: 'Converters', value: 721 },
                        { name: 'DelimitedTextConverter', value: 4294 }
                      ]
                    },
                    {
                      name: 'DataUtil',
                      value: 3322
                    }
                  ]
                },
                {
                  name: 'display',
                  children: [
                    { name: 'DirtySprite', value: 8833 },
                    { name: 'LineSprite', value: 1732 },
                    { name: 'RectSprite', value: 3623 }
                  ]
                },
                {
                  name: 'flex',
                  children: [{ name: 'FlareVis', value: 4116 }]
                },
                {
                  name: 'query',
                  children: [
                    { name: 'And', value: 1027 },
                    { name: 'Arithmetic', value: 3891 },
                    { name: 'Fn', value: 3240 },
                    { name: 'If', value: 2732 },
                    { name: 'IsA', value: 2039 },
                    { name: 'Literal', value: 1214 },
                    { name: 'Match', value: 3748 },
                    { name: 'Maximum', value: 843 },
                    {
                      name: 'methods',
                      children: [
                        { name: 'add', value: 593 },
                        { name: 'and', value: 330 },
                        { name: 'average', value: 287 },
                        { name: 'count', value: 277 },
                        { name: 'distinct', value: 292 },
                        { name: 'div', value: 595 },
                        { name: 'eq', value: 594 },
                        { name: 'fn', value: 460 },
                        { name: 'gt', value: 603 },
                        { name: 'gte', value: 625 },
                        { name: 'iff', value: 748 },
                        { name: 'isa', value: 461 },
                        { name: 'lt', value: 597 },
                        { name: 'lte', value: 619 },
                        { name: 'max', value: 283 },
                        { name: 'min', value: 283 },
                        { name: 'mod', value: 591 },
                        { name: 'mul', value: 603 },
                        { name: 'neq', value: 599 },
                        { name: 'not', value: 386 },
                        { name: 'or', value: 323 },
                      ]
                    },
                    { name: 'Minimum', value: 843 },
                    { name: 'Not', value: 1554 },
                    { name: 'Or', value: 970 },
                    { name: 'Query', value: 13896 },
                    { name: 'Range', value: 1594 },
                    { name: 'Sum', value: 791 },
                    { name: 'Xor', value: 1101 }
                  ]
                },
                {
                  name: 'scale',
                  children: [
                    { name: 'IScaleMap', value: 2105 },
                    { name: 'LinearScale', value: 1316 },
                    { name: 'LogScale', value: 3151 },
                    { name: 'RootScale', value: 1756 },
                    { name: 'Scale', value: 4268 },
                    { name: 'ScaleType', value: 1821 },
                    { name: 'TimeScale', value: 5833 }
                  ]
                }
              ]
            },
          },
          {
            name: "测试数据2",
            data: {
              name: 'flare',
              children: [
                {
                  name: 'flex',
                  children: [{ name: 'FlareVis', value: 4116 }]
                },
                {
                  name: 'scale',
                  children: [
                    { name: 'LinearScale', value: 1316 },
                    { name: 'LogScale', value: 3151 },
                    { name: 'RootScale', value: 1756 },
                    { name: 'ScaleType', value: 1821 },
                    { name: 'TimeScale', value: 5833 }
                  ]
                },
                {
                  name: 'display',
                  children: [{ name: 'DirtySprite', value: 8833 }]
                }
              ]
            }
          },
        ],
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
