<script setup>
import axios from "axios";
// vue+echarts5 实现中国地图 https://blog.csdn.net/qq_45021462/article/details/122498525
import * as echarts from "echarts";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

let mapInstance = null;
const chartRef = ref(null);

const minVal = 1000;
const maxVal = 10000;
const seriesData = [
  { name: "河南省", value: 55477.48 },
  { name: "湖北省", value: 46992.6 },
  { name: "湖南省", value: 44045.49 },
  { name: "江西省", value: 4045.49 }
];
function initMapEcharts() {
  const mapName = "china";
  // 获取地图数据（提前将下载后的json文件放置/public目录下）
  axios.get(`${import.meta.env.BASE_URL}static/mapjson/${mapName}.json`).then((res) => {
    // 使用数据注册地图
    echarts.registerMap(mapName, res.data);

    nextTick(() => {
      // 初始化地图
      mapInstance = echarts.init(chartRef.value);
      // 设置基础配置项
      const option = {
        // 背景颜色，默认无背景
        backgroundColor: "rgba(8, 25, 66, 1)",
        // 工具栏
        toolbox: {
          show: true,
          right: "5%",
          top: "7%",
          // 工具栏 icon 的样式
          iconStyle: {
            color: "rgba(255, 255, 255, 0.5)", // icon 的颜色
            borderColor: "rgba(255, 255, 255, 0.5)", // icon 的边框颜色
            borderWidth: 1 // icon 的边框宽度
          },
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
          text: "中国地图",
          left: "center",
          subtext: "下载链接",
          sublink:
            "http://datav.aliyun.com/tools/atlas/#&lat=30.772340792178525&lng=103.94573258937584&zoom=9.5"
        },
        // 悬浮窗
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            return `${params.name}: ${params.value || 0}`;
          }
        },
        // 视觉映射组件
        visualMap: {
          min: minVal,
          max: maxVal,
          text: ["High", "Low"],
          left: "2%",
          top: "bottom",
          realtime: false,
          calculable: true,
          seriesIndex: [0],
          inRange: {
            color: ["#b7d6f3", "#40a9ed", "#3598c1", "#215096"]
          },
          textStyle: {
            color: "rgba(255,255,255,0.8)"
          }
        },
        // 要显示的散点数据
        series: [
          {
            type: "map",
            roam: true, // 是否开启鼠标缩放和平移漫游
            selectedMode: false, // 选中模式，表示是否支持多个选中。(关闭后，可避免在点击区域块后，再点击其他区域块时，区域块显示为黄色的问题)
            // 地图区域的多边形 图形样式
            itemStyle: {
              areaColor: "#031525",
              borderColor: "#3B5077",
              borderWidth: 1
            },
            // 区域名显示在地图上
            label: {
              show: true,
              textStyle: {
                fontSize: 10,
                color: "rgba(255,255,255,.5)"
              }
            },
            emphasis: {
              itemStyle: {
                areaColor: "#0f2c70"
              },
              label: {
                show: true,
                textStyle: {
                  color: "rgba(255,255,255,1)"
                }
              }
            },
            map: mapName,
            // 这是要显示的数据
            data: seriesData
          }
        ]
      };
      // 将配置应用到地图上
      mapInstance.setOption(option);

      // 设置定时器，自动循环触发tooltip悬浮窗事件
      setTimer();
      // 当鼠标在地图上时，停止自动tooltip事件
      mapInstance.on("mouseover", { series: 0 }, (params) => {
        clearTimer();
      });
      // 当鼠标移出地图后，再自动tooltip
      mapInstance.on("mouseout", { series: 0 }, (params) => {
        setTimer();
      });
    });
  });
}

let timer = null;
function setTimer() {
  // 当前选中区域的下标
  let curIndex = -1;
  timer && clearInterval(timer);
  timer = setInterval(() => {
    const len = seriesData.length;
    // dispatchAction是主动去触发echarts事件，取消高亮当前的数据图形
    mapInstance.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      dataIndex: curIndex
    });
    // 下一个选中区域的下标
    curIndex = (curIndex + 1) % len;
    // 高亮下一个数据图形
    mapInstance.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: curIndex
    });
    // 显示tooltip
    mapInstance.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: curIndex
    });
  }, 1000);
}
function clearTimer() {
  timer && clearInterval(timer);
  timer = null;
}

onMounted(() => {
  initMapEcharts();
});
onBeforeUnmount(() => {
  clearTimer();
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
