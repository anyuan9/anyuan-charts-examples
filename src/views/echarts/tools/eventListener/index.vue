<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { chartColor, chartColors } from "@/views/echarts/constant";
// 参考：Echarts 的 dispatchAction https://blog.csdn.net/wgf1997/article/details/124815817

const chartRef = ref(null);
const { setOption, getInstance, showLoading } = useECharts(chartRef, {
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
      subtext: "",
      top: "2%",
      left: "center",
      textStyle: {
        align: "center",
        color: "#fff",
        fontSize: 20
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
      }
    },
    // 提示框
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "rgba(0, 0, 0, 0.6)",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: "rgba(255, 255, 255, 1)"
      },
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
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
    xAxis: [
      {
        type: "category",
        // 坐标轴的分隔线
        splitLine: {
          show: false,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)"
          }
        },
        // 坐标轴的轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)"
          }
        },
        // 坐标轴的刻度
        axisTick: {
          show: true,
          interval: 0, // 刻度显示间隔，此时显示所有刻度
          length: 4, // 坐标轴刻度的长度，默认5
          inside: false, // 刻度标签是否朝内，默认false(朝外)
          alignWithLabel: true, // 刻度与标签对齐
          lineStyle: {
            fontSize: 12,
            fontWeight: 400,
            // color: 'rgba(255, 255, 255, 0.4)',
            color: "rgba(255, 255, 255, 1)",
            opacity: 0.4
          }
        },
        // 坐标轴的刻度标签
        axisLabel: {
          interval: 0,
          // rotate: -30, // 刻度标签旋转的角度，从 -90 度到 90 度，默认0
          inside: false, // 刻度标签是否朝内，默认false(朝外)
          fontSize: 12,
          fontWeight: 400,
          // color: 'rgba(255, 255, 255, 0.4)',
          color: "rgba(255, 255, 255, 1)",
          opacity: 0.4
        },
        data: xAxisData || []
      }
    ],
    yAxis: [
      {
        type: "value",
        splitNumber: 5, // 坐标轴的分割段数，默认值：5。需要注意的是这个分割段数只是个预估值，最后实际显示的段数会在这个基础上根据分割后坐标轴刻度显示的易读程度作调整。
        // 坐标轴的分隔线
        splitLine: {
          show: false
        },
        // 坐标轴的轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.2)"
          }
        },
        // 坐标轴的刻度
        axisTick: {
          show: false
        },
        // 坐标轴的刻度标签
        axisLabel: {
          show: true,
          color: "rgba(255, 255, 255, 0.4)"
        }
      }
    ],
    series: [
      {
        type: "bar",
        barWidth: "40%",
        barMaxWidth: 100,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: chartColors[0][0] // 0% 处的颜色
              },
              {
                offset: 1,
                color: chartColors[0][1] // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          },
          borderRadius: [0, 0, 0, 0]
        },
        name: seriesData.name || "",
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
        xAxisData: Array.from(
          { length: 12 },
          (_, i) => `${i.toString().padStart(2, "0")}:00`
        ),
        seriesData: {
          name: "测试数据1",
          data: Array.from({ length: 12 }, (_, i) => ({
            name: `${i.toString().padStart(2, "0")}:00`,
            value: Math.floor(Math.random() * 500 + 100),
            id: `${currentParentId.value}-child${i}`,
            parentId: currentParentId.value
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

const currentParentId = ref("root");
const parentIds = ref([]);
function handleClick(params) {
  const { id, parentId } = params.data;
  if (parentId && !parentIds.value.includes(parentId)) {
    parentIds.value.push(parentId);
    currentParentId.value = id;
    getData();
  }
}

function handleBack() {
  currentParentId.value = parentIds.value.pop();
  getData();
}

let intervalId = null;
onMounted(() => {
  nextTick(() => {
    showLoading();
    getData().then(() => {
      const echartsInstance = getInstance();

      // 第一类事件：用户鼠标操作点击的事件，如 'click'、'dblclick'、'mousedown'、'mousemove'、'mouseup'、'mouseover'、'mouseout'、'globalout'、'contextmenu' 事件。
      // 方式1：chart.on(eventName, handler);
      echartsInstance.on("click", (params) => {
        const { componentType, seriesType, dataType } = params;
        // {
        //   // 当前点击的图形元素所属的组件名称，其值如 'series'、'markLine'、'markPoint'、'timeLine' 等。
        //   componentType: string,
        //   // 系列类型。值可能为：'line'、'bar'、'pie' 等。当 componentType 为 'series' 时有意义。
        //   seriesType: string,
        //   // 系列在传入的 option.series 中的 index。当 componentType 为 'series' 时有意义。
        //   seriesIndex: number,
        //   // 系列名称。当 componentType 为 'series' 时有意义。
        //   seriesName: string,
        //   // 数据名，类目名
        //   name: string,
        //   // 数据在传入的 data 数组中的 index
        //   dataIndex: number,
        //   // 传入的原始数据项
        //   data: Object,
        //   // sankey、graph 等图表同时含有 nodeData 和 edgeData 两种 data，
        //   // dataType 的值会是 'node' 或者 'edge'，表示当前点击在 node 还是 edge 上。
        //   // 其他大部分图表中只有一种 data，dataType 无意义。
        //   dataType: string,
        //   // 传入的数据值
        //   value: number|Array
        //   // 数据图形的颜色。当 componentType 为 'series' 时有意义。
        //   color: string
        // }
        handleClick(params);
      });
      // 方式2：chart.on(eventName, query, handler);
      // query 如果为 string 表示组件类型。格式可以是 'mainType' 或者 'mainType.subType'。例如：'series', 'series.line', 'dataZoom', ... 等等
      // query 如果为 Object，可以包含以下一个或多个属性，每个属性都是可选的：
      //   {
      //     <mainType>Index: number // 组件 index
      //     <mainType>Name: string // 组件 name
      //     <mainType>Id: string // 组件 id
      //     dataIndex: number // 数据项 index
      //     name: string // 数据项 name
      //     dataType: string // 数据项 type，如关系图中的 'node', 'edge'
      //     element: string // 自定义系列中的 el 的 name
      //   }
      echartsInstance.on("mouseover", { seriesIndex: 0 }, () => { });

      // 第二类事件：组件交互的行为事件
      // 图例开关的行为只会触发 legendselectchanged 事件
      echartsInstance.on("legendselectchanged", (params) => {
        // 获取点击图例的选中状态
        const isSelected = params.selected[params.name];
        // 在控制台中打印
        console.log(`${isSelected ? "选中了" : "取消选中了"}图例${params.name}`);
        // 打印所有图例的状态
        console.log(params.selected);
      });

      // 第三类事件：触发 ECharts 中组件的行为
      // 通过 dispatchAction({ type: '' }) 来触发图表行为
      let currentDataIndex = -1;
      const dataLen = echartsInstance.getOption().series[0].data.length;
      intervalId = setInterval(() => {
        // 取消之前高亮的图形
        echartsInstance.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: app.currentDataIndex
        });
        currentDataIndex = (currentDataIndex + 1) % dataLen;
        // 高亮当前图形
        echartsInstance.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: currentDataIndex
        });
        // 显示 tooltip
        echartsInstance.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: currentDataIndex
        });
      }, 1000);
    });
  });
});
onBeforeUnmount(() => {
  intervalId && clearInterval(intervalId);
  intervalId = null;
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
