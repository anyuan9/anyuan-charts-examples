<script setup>
import { useECharts } from "@anyuan/utils";
import { nextTick, onMounted, ref } from "vue";

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
  const { seriesData, linksData } = data;
  seriesData.forEach((item, index) => {
    if (item.category === 1) {
      item = Object.assign(item, {
        fixed: true,
        symbol: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAyCAYAAAAA9rgCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3QkMzRkE4QUEwQUYxMUVBOUZEREI0QzdBNDdFMjJDQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3QkMzRkE4QkEwQUYxMUVBOUZEREI0QzdBNDdFMjJDQSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdCQzNGQTg4QTBBRjExRUE5RkREQjRDN0E0N0UyMkNBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdCQzNGQTg5QTBBRjExRUE5RkREQjRDN0E0N0UyMkNBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ya4ogQAACBpJREFUeNrsWdtvFFUY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",
        symbolSize: [60, 40],
        symbolOffset: ["-10%", "10%"],
        label: {
          color: "#ffffff",
          position: "bottom"
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "#157eff" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#35c2ff" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      });
    }
    if (item.category === 2) {
      item = Object.assign(item, {
        fixed: true,
        symbol: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAgCAYAAABO6BuSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFMzhFMDM4REEwQUYxMUVBQkY1NEIzNTg4MTM4RjIxOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFMzhFMDM4RUEwQUYxMUVBQkY1NEIzNTg4MTM4RjIxOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkUzOEUwMzhCQTBBRjExRUFCRjU0QjM1ODgxMzhGMjE4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkUzOEUwMzhDQTBBRjExRUFCRjU0QjM1ODgxMzhGMjE4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ZMccrwAACbZJREFUeNrkWUtvJFcV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",
        symbolSize: [60, 30],
        symbolOffset: ["0%", 0],
        label: {
          color: "#efefef",
          position: "bottom"
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "#ffb402" // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#ffdc84" // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      });
    }
  });

  const linesData2 = linksData.map((item) => {
    const { source, target } = item;
    const sourceData = seriesData.find(d => d.name === source).value;
    const targetData = seriesData.find(d => d.name === target).value;
    return {
      coords: [sourceData, targetData]
    };
  });

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
          type: ["line", "bar", "stack"]
        }
      }
    },
    xAxis: {
      show: false,
      type: "value"
    },
    yAxis: {
      show: false,
      type: "value"
    },
    series: [
      {
        type: "graph",
        zlevel: 5,
        draggable: false,
        coordinateSystem: "cartesian2d", // 使用二维的直角坐标系（也称笛卡尔坐标系）
        edgeSymbol: ["none", "arrow"],
        // edgeSymbolSize: [0, 8], //边两端的标记大小，可以是一个数组分别指定两端，也可以是单个统一指定
        // edgeLabel: {
        //     textStyle: {
        //       fontSize: 60
        //     }
        // },
        symbol: "rect",
        symbolOffset: ["15%", 0],
        label: {
          show: true,
          position: "bottom"
        },
        lineStyle: {
          opacity: 1,
          color: "#53B5EA",
          curveness: 0.2,
          // type: "dashed",
          width: 2
        },
        data: seriesData,
        links: linksData
      },
      {
        type: "lines",
        coordinateSystem: "cartesian2d",
        z: 1,
        zlevel: 2,
        animation: false,
        animationEasing: "linear",
        effect: {
          show: true,
          period: 5, // 特效动画的时间，单位为 s
          loop: true,
          smooth: true,
          trailLength: 0.01,
          symbolSize: 12,
          symbol: "pin",
          color: "rgba(55,155,255,0.5)"
        },
        lineStyle: {
          color: "#22AC38",
          width: 0,
          curveness: 0.2
        },
        data: linesData2
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
        seriesData: [
          {
            name: "数据中心人员专题库",
            category: 1,
            value: [700, 400]
          },
          {
            name: "数据治理服务",
            category: 1,
            value: [300, 400]
          },
          {
            name: "OSM",
            category: 2,
            value: [100, 200]
          },
          {
            name: "人员专题库",
            category: 2,
            value: [100, 500]
          },
          {
            name: "人员专题库2",
            category: 2,
            value: [230, 100]
          },
          {
            name: "国家队",
            category: 2,
            value: [1000, 300]
          },
          {
            name: "社会专家",
            category: 2,
            value: [1000, 100]
          },
          {
            name: "志愿者",
            category: 2,
            value: [1000, 200]
          },
          {
            name: "专职队",
            category: 2,
            value: [1000, 400]
          },
          {
            name: "主机",
            category: 2,
            value: [1000, 600]
          },
          {
            name: "自建",
            category: 2,
            value: [600, 600]
          },
          {
            name: "组织机构",
            category: 2,
            value: [1000, 500]
          }
        ],
        linksData: [
          {
            source: "数据治理服务",
            target: "数据中心人员专题库",
            value: "500kb/s"
          },
          {
            source: "OSM",
            target: "数据治理服务",
            value: "500kb/s"
          },
          {
            source: "人员专题库",
            target: "数据治理服务",
            value: "200kb/s"
          },
          {
            source: "数据中心人员专题库",
            target: "社会专家",
            value: "100kb/s"
          },
          {
            source: "数据中心人员专题库",
            target: "志愿者",
            value: "50kb/s"
          },
          {
            source: "数据中心人员专题库",
            target: "国家队",
            value: "50kb/s"
          },
          {
            source: "数据中心人员专题库",
            target: "专职队",
            value: "50kb/s"
          },
          {
            source: "数据中心人员专题库",
            target: "组织机构",
            value: "50kb/s"
          },
          {
            source: "数据中心人员专题库",
            target: "主机",
            value: "50kb/s"
          },
          {
            source: "自建",
            target: "数据中心人员专题库",
            value: "50kb/s"
          },
          {
            source: "人员专题库2",
            target: "数据中心人员专题库",
            value: "50kb/s"
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
