<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";
import axios from 'axios'

const chartRef = ref(null);
const { registerMap, setOption, showLoading } = useECharts(chartRef, {
  autoTooltipLoop: false, // 是否自动循环 tooltip，默认间隔时间1500ms
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s",
    },
  },
});

let mapName = 'china'

function getOption(data) {
  const { title = "", seriesData } = data;

  return {
    // 背景颜色，默认无背景
    backgroundColor: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 1,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#0f2c70', // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#091732', // 100% 处的颜色
        },
      ],
      global: false, // 缺省为 false
    },
    // 工具栏
    toolbox: {
      show: true,
      left: "5%",
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
    // 标题
    title: {
      text: title || '',
      subtext: '下载链接',
      sublink: 'http://datav.aliyun.com/tools/atlas/#&lat=30.772340792178525&lng=103.94573258937584&zoom=9.5',
      top: '2%', // title 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')', '像素值(20)', '或者自动对齐值('top', 'middle', 'bottom')
      left: 'center', // title 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')', '像素值(20)', '或者自动对齐值('left', 'center', 'right')
      textStyle: {
        align: 'center',
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 20,
      },
    },
    // 图例(series内容需要配置name属性)
    legend: {
      show: true,
      top: '2%',
      right: '5%',
      icon: 'rect', // 图例项的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
      itemWidth: 8, // 图例标记的图形宽度，默认25
      itemHeight: 8, // 图例标记的图形高度，默认14
      itemGap: 25, // 图例项之间的间隔，单位px，默认10，可取值：5', '[5, 10]', '[5, 10, 5, 10]
      // 图例文字的样式
      textStyle: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 14,
      },
    },
    // 提示框
    tooltip: {},
    // 地理坐标系组件，用于地图的绘制，支持在地理坐标系上绘制散点图，线集。
    geo: {
      map: mapName,
      aspectScale: 1, //长宽比
      zoom: 1.05,
      roam: false, // 是否开启鼠标缩放和平移漫游。建议不开启，因为页面上实际会有2个地图图层（geo一个，type为'map'一个）
      selectedMode: false, // 选中模式，表示是否支持多个选中。
      // z: 0,
      // 地图区域的多边形图形样式
      itemStyle: {
        areaColor: 'transparent',
        borderColor: '#1773c3',
        shadowColor: '#1773c3',
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 10,
      },
      label: {
        show: false,
      },
      emphasis: {
        itemStyle: {
          areaColor: '#0f2c70',
          borderWidth: 0,
          color: 'green',
          label: {
            show: false,
          },
        },
        label: {
          show: false,
        },
      },
    },
    series: [
      {
        type: 'map',
        aspectScale: 1, //长宽比
        zoom: 1.05, //
        roam: false, //是否开启鼠标缩放和平移漫游。建议不开启
        selectedMode: false, // 选中模式，表示是否支持多个选中。(关闭后，可避免在点击区域块后，再点击其他区域块时，区域块显示为黄色的问题)
        // 地图区域的多边形 图形样式
        itemStyle: {
          areaColor: '#031525',
          borderColor: '#3B5077',
          borderWidth: 1,
        },
        //区域名样式
        label: {
          show: false,
          textStyle: {
            fontSize: 10,
            color: 'rgba(255,255,255,.5)',
          },
        },
        tooltip: {
          show: true,
          padding: [12, 20],
          borderWidth: 1,
          borderColor: 'transparent',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          textStyle: {
            fontSize: 14,
            color: 'rgba(255, 255, 255, 1)',
          },
          formatter: params => {
            return `${params.name}`
          },
        },
        emphasis: {
          itemStyle: {
            areaColor: '#0f2c70',
          },
          label: {
            show: false,
            textStyle: {
              color: 'rgba(255,255,255,1)',
            },
          },
        },
        map: mapName,
        data: [],
      },
      {
        type: 'lines',
        zlevel: 2, // 设置这个才会有轨迹线的小尾巴
        lineStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(33,168,230,0.1)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(33,168,230,1)', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          }, // 线条颜色
          width: 1.5, // 尾迹线条宽度
          opacity: 0.2, // 尾迹线条透明度
          curveness: 0.1, // 尾迹线条曲度，支持从 0 到 1 的值，值越大曲度越大。
          shadowColor: '#ffffff',
        },
        effect: {
          show: true,
          color: 'rgba(255,67,67,0.3)', // 流动点颜色
          symbol: 'arrow',
          symbolSize: 6,
          period: 10, // 箭头指向速度，值越小速度越快
          trailLength: 0.7, // 特效尾迹长度[0,1]值越大，尾迹越长重
        },
        emphasis: {
          lineStyle: {
            width: 3,
            opacity: 1,
          },
        },
        data: [
          {
            fromName: '深圳',
            toName: '北京',
            coords: [
              [114.271522, 22.753644],
              [116.24, 39.55],
              [114.271522, 22.753644],
            ],
          },
          {
            fromName: '深圳',
            toName: '浙江',
            coords: [
              [114.271522, 22.753644],
              [120.19, 30.26],
            ],
          },
          {
            fromName: '深圳',
            toName: '重庆',
            coords: [
              [114.271522, 22.753644],
              [106.54, 29.59],
            ],
          },
        ],
      },
      {
        type: 'lines',
        symbol: 'circle',
        symbolSize: [5, 5],
        color: '#ff8003',
        opacity: 1,
        zlevel: 3,
        label: {
          show: true,
          padding: [10, 20],
          color: '#fff',
          backgroundColor: '#1a3961',
          borderColor: '#aee9fb',
          borderWidth: 1,
          borderRadius: 6,
          formatter(params) {
            let arr = [params.name, '上行：' + params.value[1] + 'G/s', '下行：' + params.value[0] + 'G/s']
            return arr.join('\n')
          },
          textStyle: {
            align: 'left',
            lineHeight: 20,
          },
        },
        lineStyle: {
          type: 'solid',
          color: '#fff',
          width: 0.5,
          opacity: 1,
        },
        data: seriesData,
      },
    ],
  };
}

async function getData() {
  try {
    // 将下载后的json文件放置/public目录下
    const { data } = await axios.get(`${import.meta.env.BASE_URL}static/mapjson/${mapName}.json`)
    // 使用数据注册地图
    registerMap(mapName, data)

    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "地图飞线图",
        seriesData: [
          {
            name: '北京',
            coords: [
              [116.24, 39.55, 100],
              [120.24, 46.55, 100],
            ], // 线条位置[开始位置，结束位置]
            value: [10.21, 1.2],
          },
          {
            name: '深圳',
            coords: [
              [114.271522, 22.753644],
              [118.24, 18.55, 100],
            ], // 线条位置[开始位置，结束位置]
            value: [10.21, 1.2],
          },
          {
            name: '重庆',
            coords: [
              [106.54, 29.59],
              [100.24, 40.55],
            ], // 线条位置[开始位置，结束位置]
            value: [10.21, 1.2],
          },
          {
            name: '浙江',
            coords: [
              [120.19, 30.26],
              [128.24, 35.55, 100],
            ], // 线条位置[开始位置，结束位置]
            value: [10.21, 1.2],
          },
        ]
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
