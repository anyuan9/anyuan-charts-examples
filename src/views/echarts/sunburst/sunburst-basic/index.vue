<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";
import { data } from "./data";

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
      }
    },
    // 提示框
    tooltip: {
      trigger: "axis"
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
        type: "sunburst",
        center: ["50%", "50%"],
        radius: [0, "90%"],
        clockwise: true, // 控制扇形块是否顺时针排序，默认为true
        startAngle: 90, // 控制扇形块顺时针排序的起始角度，默认为90
        // 多层配置
        levels: [
          {
            // 留给数据下钻点的空白配置
          },
          {
            // 最靠内测的第一层配置
            radius: ["15%", "30%"], // 从 v5.2.0 开始支持。当前层的内半径和外半径，注意其它层的内外半径不会因为该层的改变自适应。
            // 文本标签的样式
            label: {
              rotate: "tangential"
            },
            // 标签的视觉引导线配置
            labelLine: {

            },
            // 扇形块的样式
            itemStyle: {
              borderWidth: 3
            },
            // 高亮状态配置
            emphasis: {

            },
            // 淡出状态配置
            blur: {

            },
            // 选中状态配置
            select: {

            }
          },
          {
            radius: ["32%", "70%"],
            label: {
              align: "right"
            }
          },
          {
            radius: ["75%", "85%"],
            label: {
              position: "outside",
              padding: 3,
              silent: false
            },
            itemStyle: {
              borderWidth: 3
            },
            emphasis: {
              focus: "ancestor"
            }
          }
        ],
        // 每个扇形块的文本标签的样式。
        label: {
          rotate: "radial", // 如果是 number 类型，则表示标签的旋转角，从 -90 度到 90 度，正值是逆时针。字符串 'radial' 表示径向旋转、'tangential' 表示切向旋转。
          position: "inside", // 标签的位置。可以通过内置的语义声明位置：支持：top / left / right / bottom / inside（默认值） / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight；也可以用一个数组表示相对的百分比或者绝对像素值表示标签相对于图形包围盒左上角的位置，例如[10, 10], ['50%', '50%']。
          distance: 5, // 标签与扇形块的距离，默认为5
          formatter: "{b}: {c} ({d}%)", // 标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与 'formatter' 通用，详见文档。回调函数的参数为：
          // {b}: 数据项名称
          // {c}: 数据项值
          color: "#fff", // 标签字体颜色，默认为 '#fff'
          fontSize: 12, // 标签字体大小，默认为 12
          backgroundColor: "transparent",
          borderColor: "transparent", // 文字块边框颜色，如果设置为 'inherit'，则为视觉映射得到的颜色，如系列色。
          borderWidth: 0 // 文字块边框宽度，默认为 0
        },
        // 标签的视觉引导线配置
        labelLine: {
          length2: 10, // 连接到图形的线长度
          smooth: false, // 是否平滑视觉引导线，默认false
          lineStyle: {}
        },
        // 标签的统一布局配置
        labelLayout: {
          // rotate: 0, // 标签旋转角度
          // align: 'center', // 标签水平对齐方式。可以设置'left', 'center', 'right'。
          // verticalAlign: 'middle', // 标签垂直对齐方式。可以设置'top', 'middle', 'bottom'。
          fontSize: 12 // 标签字体大小
        },
        // 扇形块的样式
        itemStyle: {
          borderColor: "transparent", // 图形的描边颜色。默认为'white'，支持的颜色格式同 color，不支持回调函数。
          borderWidth: 2,
          borderRadius: 2
        },
        // 高亮状态配置
        emphasis: {
          focus: "ancestor", // 在高亮图形时，是否淡出其它数据的图形已达到聚焦的效果。支持如下配置：
          // 'none' 不淡出其它图形，默认使用该配置。
          // 'self' 只聚焦（不淡出）当前高亮的数据的图形。
          // 'series' 聚焦当前高亮的数据所在的系列的所有图形。
          // 'ancestor' 聚焦所有祖先节点。
          // 'descendant' 聚焦所有子孙节点。
          // 'relative' 聚焦所有子孙和祖先节点。（从 v5.6.0 开始支持）
          label: {},
          labelLine: {},
          itemStyle: {}
        },
        // 淡出状态配置
        blur: {

        },
        // 选中状态配置
        select: {

        },
        name: seriesData.name || "",
        data: seriesData.data || [],
        // 扇形块根据数据 value 的排序方式，如果未指定 value，则其值为子元素 value 之和。默认值 'desc' 表示降序排序；还可以设置为 'asc' 表示升序排序；null 表示不排序，使用原始数据的顺序；或者用回调函数进行排列：
        sort: (a, b) => {
          if (a.depth === 1) {
            return b.getValue() - a.getValue();
          } else {
            return a.dataIndex - b.dataIndex;
          }
        }
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
          data
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
