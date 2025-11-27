<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";
// import * as echarts from "echarts"

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s"
    }
  }
});

function getOption(data) {
  const { title = "", subtitle = "", unit = "", seriesData = [] } = data;
  const total = seriesData.reduce((total, item) => total + item.value, 0);
  seriesData.forEach((item) => {
    item.rate = ((item.value / total) * 100).toFixed(2);
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
    // 标题
    title: [
      {
        text: `{name|${title}}\n{val|${subtitle}}`,
        top: "center",
        left: "30%",
        textAlign: "center",
        textStyle: {
          rich: {
            name: {
              fontSize: 14,
              fontWeight: "normal",
              color: "rgba(255, 255, 255, 0.8)",
              padding: [10, 0]
            },
            val: {
              fontSize: 32,
              fontWeight: "bold",
              color: "rgba(255, 255, 255, 0.65)"
            }
          }
        }
      },
      {
        text: unit,
        top: 20,
        left: 20,
        textStyle: {
          fontSize: 14,
          color: "rgba(255, 255, 255, 0.65)",
          fontWeight: 400
        }
      }
    ],
    // 图例
    legend: {
      show: true,
      type: "scroll", // 图例类型，可选值：'plain'普通图例、'scroll'可滚动翻页的图例，默认'plain'
      orient: "vertical", // 图例列表的布局朝向，可选值：'horizontal'水平、'vertical'垂直，默认'horizontal'
      x: "70%",
      y: "center",
      align: "left", // 图例标记和文本的对齐，可选值：'auto'自动、'left'左对齐、'right'右对齐，默认'auto'
      width: "auto", // 图例组件的宽度，默认自适应
      height: "60%", // 图例组件的高度，默认自适应
      padding: [10, 0, 10, 0],
      itemGap: 10, // 图例每项之间的间隔，单位px，默认10。横向布局时为水平间隔，纵向布局时为纵向间隔。
      icon: "circle", // 图例标记的图形，可选值：'circle'圆形、'rect'矩形、'roundRect'圆角矩形、'triangle'三角形、'diamond'菱形、'pin'水滴、'arrow'箭头、'none'无、'image'图片，默认'circle'
      itemWidth: 8, // 图例标记的图形宽度，默认25
      itemHeight: 8, // 图例标记的图形高度，默认14
      symbolRotate: 0, // 图例标记的旋转角度，默认'inherit'继承
      // 图例标记的图形样式
      itemStyle: {
        borderWidth: 0, // 图例标记的图形边框宽度，默认0
        borderColor: "#000" // 图例标记的图形边框颜色，默认'#000'
      },
      // 图例图形中线的样式，用于诸如折线图图例横线的样式设置
      lineStyle: {
        width: 2, // 图例图形为线时的线宽，默认2
        color: "#000" // 图例图形为线时的颜色，默认'#000'
      },
      selectedMode: true, // 图例选择的模式，可选值：true单选、false多选、'single'单选、'multiple'多选，默认true
      // selected: {}, // 图例选中状态表，可配置图例选中状态，例如 {'系列1': true, '系列2': false} 表示选中'系列1'，不选中'系列2'
      inactiveColor: "#ccc", // 图例关闭时的颜色，默认'#ccc'
      inactiveBorderColor: "#ccc", // 图例关闭时的边框颜色，默认'#ccc'
      inactiveBorderWidth: 0, // 图例关闭时的边框宽度，默认'auto'
      backgroundColor: "transparent", // 图例背景色，默认透明
      borderColor: "#ccc", // 图例边框颜色，默认'#ccc'
      borderWidth: 0, // 图例边框宽度，默认1
      borderRadius: 0, // 图例边框圆角，默认0
      shadowBlur: 0, // 图例阴影模糊大小，默认0
      shadowColor: "transparent", // 图例阴影颜色，默认透明
      shadowOffsetX: 0, // 图例阴影水平方向偏移，默认0
      shadowOffsetY: 0, // 图例阴影垂直方向偏移，默认0
      pageButtonPosition: "end", // 图例控制按钮的位置，可选值：'start'起始位置、'end'结束位置，默认'end'。legend.type 为 'scroll' 时有效。
      pageButtonItemGap: 5, // 图例控制按钮之间的间隔，默认5
      pageFormatter: "{current}/{total}", // 图例翻页信息展示的格式化器，默认'{current}/{total}'
      // pageIcons: {
      //   horizontal: 'https://www.makeapie.cn/asset/get/s/data-1559121263841-UC5w7mTJ9.png',
      //   vertical: 'https://www.makeapie.cn/asset/get/s/data-1559121259198-sxyPSimU9.png'
      // }, // 图例控制按钮的图标，默认为左右两个箭头，可以设置成自己图标，可以是图片路径或者base64，也可以是SVG字符串
      pageIconColor: "#2f4554", // 图例控制按钮的颜色，默认'#2f4554'
      pageIconInactiveColor: "#aaa", // 图例控制按钮的禁用颜色，默认'#aaa'
      pageIconSize: 12, // 图例控制按钮的大小，默认15
      pageTextStyle: {
        color: "#2f4554" // 图例翻页信息文字的颜色，默认'#2f4554'
      },
      selector: true, // 图例组件中的选择器按钮，目前包括“全选”和“反选”两种功能。默认false不显示
      selectorPosition: "end", // 选择器按钮的位置，可选值：'start'起始位置、'end'结束位置，默认'end'
      selectorItemGap: 7, // 选择器按钮之间的间隔，默认7
      selectorButtonGap: 10, // 选择器按钮与图例组件之间的间隔，默认10
      // 选择器按钮的文本标签样式，默认显示。
      selectorLabel: {
        distance: 5, // 选择器标签与选择器按钮的间隔，默认5
        color: "#666", // 选择器标签文字的颜色，默认'#666'
        fontSize: 12, // 选择器标签文字的字体大小，默认12
        fontWeight: "normal" // 选择器标签文字的字体粗细，默认'normal'
      },
      // 图例的公用文本样式
      textStyle: {
        width: 220,
        // height: 16,
        color: "#cddafd",
        fontSize: 14,
        backgroundColor: "rgba(0,23,11,0.3)", // 文字块背景色。可以使用颜色值，例如：'#123234'。也可以直接使用图片，例如：backgroundColor: { image: 'xxx/xxx.png'}
        rich: {
          name: {
            width: 80,
            padding: [0, 5, 0, 5],
            color: "rgba(255, 255, 255, 0.65)",
            fontSize: 12,
            fontFamily: "PingFangSC-Medium, PingFang SC",
            fontWeight: 400
          },
          value: {
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: 14,
            fontFamily: "PingFangSC-Medium, PingFang SC",
            fontWeight: 400
          },
          rate: {
            color: "#fd5656",
            fontSize: 14,
            fontFamily: "PingFangSC-Medium, PingFang SC",
            fontWeight: 600
          }
        }
      },
      // 格式化图例文本，支持字符串模板和回调函数两种形式
      // 方案一：使用字符串模板，模板变量为图例名称 {name}
      // formatter: 'Legend {name}',
      // 方案二：使用回调函数
      // formatter: name => {
      //   return name.length > 3 ? name.substr(0, 3) + '...' : name // 字符串截取，防止文字太长
      // },
      // 使用truncateText方法截取文本并添加省略号，以适应一定宽度的容器
      // 其中 truncateText(text, containerWidth, font, ellipsis, options) 详见https://github.com/apache/echarts/issues/7479
      // formatter: (name) => {
      //   return echarts.format.truncateText(name, 60, "14px Microsoft Yahei", "…")
      // },
      formatter: (name) => {
        const res = seriesData.find(v => v.name === name);
        return `{name|${res.name} }{value|${res.value} } {rate|${res.rate} %}`;
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
        type: "pie",
        radius: ["40%", "60%"],
        center: ["30%", "50%"],
        label: {
          formatter: (params) => {
            return (
              `{value|${
                params.value
              }}`
              + `\n`
              + `{value|${
                params.percent
              }%}`
            );
          },
          rich: {
            value: {
              fontSize: 12,
              fontweight: 400,
              color: "rgba(255, 255, 255, 0.65)"
            }
          }
        },
        name: title,
        data: seriesData || []
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
        subtitle: "11680",
        unit: "单位：个",
        seriesData: [
          {
            name: "测试数据1",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据2",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据3",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据4",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据5",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据6",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据7",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据8",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据9",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据10",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据11",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据12",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据13",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据14",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据15",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据16",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据17",
            value: Math.floor(Math.random() * 500 + 100)
          },
          {
            name: "测试数据18",
            value: Math.floor(Math.random() * 500 + 100)
          }
        ]
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
