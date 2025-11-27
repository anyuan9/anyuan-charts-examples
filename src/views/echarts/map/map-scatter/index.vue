<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import axios from 'axios'
import markerLabelIcon from './marker-label.png'
import markerLabelActiveIcon from './marker-label-active.png'

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

let mapName = 'hubei'
const minVal = 1000
const maxVal = 10000
const minSymbolSize = 12
const maxSymbolSize = 30
// 图标: 星星
const iconStar =
  'image://' + 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNCRkRBMEJBQzgwRjExRUFBNUI0RTMyMThEN0UxMzFEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNCRkRBMEJCQzgwRjExRUFBNUI0RTMyMThEN0UxMzFEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0JGREEwQjhDODBGMTFFQUE1QjRFMzIxOEQ3RTEzMUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0JGREEwQjlDODBGMTFFQUE1QjRFMzIxOEQ3RTEzMUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5mT42iAAABQ0lEQVR42mL8LabOQCQIBOL1xChkItJAkLp+IBajpqFWQCwPxJ7UNDQCSgdQy1BmIA6Bsl2AmJMahjoAsTiUzQPETtQwNAKN709IAwvUayZQ/hcg/o0k/x6Ig9D0+ABxKJT9HYh/oMm/BBm6GYitgTgfiBmJcLkkEK/CIXcGiGNB3v8JxIVQF31gIA/8AeIWaNK7gRymG4BYH4hPkGjgXSC2A+JaWNChR9QjqIJeIP5PhIGzgdgAiI8Tin2QbSVAvIOAgROBOA0auUQlKV4gtidgqBGp6RSUFrmIKA/ESDEUPcGfBOIUIH6Lln29iTVUCIjdkJJKExDbAPFcqJdPEMpd2AwF5TBWaFKxBeJ6qOHIqaMbmjrcsBUw2AwNh7rKAEeaBaWOMiD2BeJvQOxOyFBuaFJJwZZU0MBWaHCIo0sABBgAetA4Jx5t/ToAAAAASUVORK5CYII='
// 图标: 菱形
  const iconMaker = 'image://' + 'data:image/png;base64,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'
function getOption(data) {
  let { title = "", seriesData } = data;
  seriesData = seriesData.sort((a, b) => {
    return b.value[2] - a.value[2] // 按照value[2]降序排序
  })
  const top5Data = seriesData.slice(0, 6)

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
      top: "2%",
      right: "5%",
      icon: "rect", // 图例项的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
      itemWidth: 12, // 图例标记的图形宽度，默认25
      itemHeight: 12, // 图例标记的图形高度，默认14
      itemGap: 15, // 图例项之间的间隔，单位px，默认10，可取值：5、[5, 10]、[5, 10, 5, 10]
      // 图例文字的样式
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 14,
      },
    },
    // 提示框
    tooltip: {},
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    // 视觉映射组件
    visualMap: {
      min: minVal,
      max: maxVal,
      text: ['High', 'Low'],
      left: '2%',
      top: 'bottom',
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#b7d6f3', '#40a9ed', '#3598c1', '#215096'],
      },
      textStyle: {
        color: 'rgba(255,255,255,0.8)',
      },
    },
    // 地理坐标系组件，用于地图的绘制，支持在地理坐标系上绘制散点图，线集。
    geo: {
      map: mapName,
      aspectScale: 1, //长宽比
      zoom: 1.05, // 地图缩放级别
      layoutCenter: ['50%', '50%'], // 地图中心
      layoutSize: '100%', // 地图在容器中的宽高
      roam: false, // 是否开启鼠标缩放和平移漫游。建议不开启，因为页面上实际会有2个地图图层（geo一个，type为'map'一个）
      selectedMode: false, // 选中模式，表示是否支持多个选中。
      z: 0,
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
        // 区域名显示在地图上
        label: {
          show: false,
          textStyle: {
            fontSize: 10,
            color: 'rgba(255,255,255,.5)',
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
        map: mapName,
        data: [],
      },
      {
        name: '城市',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin', // 气泡
        symbolSize: val => {
          return (
            parseInt(((val[2] - minVal) * (maxSymbolSize - minSymbolSize)) / (maxVal - minVal)) +
            minSymbolSize
          )
        },
        label: {
          show: false,
          position: 'top',
          color: '#ffffff', // 文字的颜色。注意：echarts5 需要设置颜色，否则字体会看起来有阴影
          formatter: '{b}',
          // formatter: params => {
          //   const {name, value, data} = params
          //   return `${name}: ${value[2]}`
          // },
        },
        itemStyle: {
          color: '#ddb926',
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        tooltip: {
          show: true,
          trigger: 'item',
          triggerOn: 'mousemove',
          padding: [0, 0, 0, 0], // 设置内边距
          backgroundColor: 'transparent',
          borderWidth: 0,
          formatter: (params) => {
            const {
              name,
              value,
              data: { details = [] },
              dataIndex,
              seriesIndex,
            } = params

            const strArr = details?.map(item => {
                return `<div class="tooltip-list-item">
                        <div class="tooltip-item-top">
                            <div class="tooltip-label">${item.title}</div>
                            <div class="tooltip-num">${item.value}</div>
                        </div>
                        <div class="tooltip-item-bottom">
                            <div class="tooltip-label">${item.subTitle}</div>
                            <div class="tooltip-rate">${item.percent}</div>
                        </div>
                    </div>`
              }) || []
            return `<div class="my-map-tooltip">
                <div class="tooltip-title">${name}</div>
                <div class="tooltip-list-content">${strArr.join('')}</div>
            </div>`
          }
        },
        data: seriesData,
      },
      {
        name: 'TOP5',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        showEffectOn: 'render', // 何时显示特效，可选'render' 绘制完成后显示特效；'emphasis' 高亮（hover）的时候显示特效。
        symbolSize: val => {
          return (
            parseInt(((val[2] - minVal) * (maxSymbolSize - minSymbolSize)) / (maxVal - minVal)) +
            minSymbolSize
          )
        },
        // 涟漪特效相关配置
        rippleEffect: {
          brushType: 'stroke', // 波纹绘制方式，可选 'stroke' 和 'fill'
          period: 4, // 动画时间，值越小速度越快
          scale: 4, // 波纹圆环最大限制，值越大波纹越大
        },
        // 图形样式
        itemStyle: {
          color: '#f4e925',
          shadowBlur: 10,
          shadowColor: '#333',
        },
        // 图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
        label: {
          show: true,
          position: 'top', // 标签的位置
          offset: [5, 0], // 标签的偏移设置
          color: '#ffffff', // 文字的颜色。注意：echarts5 需要设置颜色，否则字体会看起来有阴影
          formatter: '{b}', // {a}：系列名; {b}：数据名; {c}：数据值; {@xxx}：数据中名为 'xxx' 的维度的值；{@[n]}：数据中维度 n 的值
          // formatter: params => {
          //   const {name, value, data} = params
          //   return `${name}`
          // },
        },
        emphasis: {
          scale: true,
        },
        data: top5Data,
      },
      {
        name: '中心',
        type: 'scatter',
        coordinateSystem: 'geo',
        // symbol: iconStar, // 星星图标
        // symbolSize: 20,
        symbol: iconMaker, // 菱形图标
        symbolSize: [44, 64],
        symbolOffset: [0, -16],
        label: {
          show: true,
          position: 'top',
          padding: [6, 8],
          // width: 100,
          fontSize: 15,
          color: '#ffffff', // 文字的颜色。注意：echarts5 需要设置颜色，否则字体会看起来有阴影
          textShadowColor: '#030615',
          // backgroundColor: 'rgba(0,0,0,0.5)',
          backgroundColor: {
            image: markerLabelIcon, // 设置背景图片
          },
          formatter: '{b}',
        },
        itemStyle: {
          color: '#ddb926',
        },
        emphasis: {
          label: {
            show: true,
            color: '#FDFF6B',
            backgroundColor: {
              image: markerLabelActiveIcon,
            },
          },
        },
        tooltip: {
          show: false,
        },
        data: [
          {
            name: '武汉',
            value: [114.298572, 30.584355, 100],
          },
        ],
      },
    ],
  };
}

async function getData() {
  try {
    // 将下载后的json文件放置/public目录下
    const { data } = await axios.get(`${import.meta.env.BASE_URL}static/mapjson/province/${mapName}.json`)
    // 使用数据注册地图
    registerMap(mapName, data)

    const geoCoordList = data.features.map(item => {
      const { id, properties } = item
      return {
        id,
        name: properties.name,
        geoCoord: properties.cp,
      }
      // 示例：
      // {
      //   id: '420100',
      //   name: '武汉市',
      //   geoCoord: [114.3162, 30.581084],
      // }
    })

    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "测试数据",
        seriesData: geoCoordList.map(item => ({
          name: item.name,
          value: [...item.geoCoord, Math.floor(Math.random() * (maxVal - minVal) + minVal)], // 地图上散点的数据：经度，纬度，数值
          details: [
            {title: '视频监控', value: Math.floor(Math.random()*1000), unit: '个', subTitle:'在线率', subValue: 0, percent: '0%'},
            {title: '硬盘录像机', value: Math.floor(Math.random()*1000), unit: '个', subTitle:'在线率', subValue: 0, percent: '0%'},
            {title: '报警主机', value: Math.floor(Math.random()*1000), unit: '个', subTitle:'在线率', subValue: 0, percent: '0%'},
            {title: '用电主机', value: Math.floor(Math.random()*1000), unit: '个', subTitle:'在线率', subValue: 0, percent: '0%'},
            {title: '动环主机', value: Math.floor(Math.random()*1000), unit: '个', subTitle:'在线率', subValue: 0, percent: '0%'},
            ]
        })),
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
<style lang="scss">
.my-map-tooltip {
  position: absolute;
  width: 312px;
  height: 260px;
  background-image: linear-gradient(206deg, rgba(11, 41, 86, 0.95) 0%, rgba(2, 43, 84, 0.70) 95%);
  box-shadow: inset 0 -2px 9px 0 rgba(2, 168, 255, 0.32);

  .tooltip-title {
    padding: 12px 16px;
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-shadow: 0 0 4px rgba(82, 191, 254, 0.50);
    font-weight: 700;
  }

  .tooltip-list-content {
    width: 100%;
    padding: 0 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .tooltip-list-item {
      width: calc(50% - 4px);
      height: 60px;
      padding: 6px 8px;
      border-radius: 3px;
      background-image: linear-gradient(180deg, rgba(70,143,250,0.00) 55%, rgba(87,136,255,0.12) 100%),
      linear-gradient(11deg, rgba(255,165,34,0.20) 0%, rgba(51,109,255,0.00) 44%),
      radial-gradient(circle at 97% 88%, rgba(100,167,252,0.24) 0%, rgba(51,87,170,0.00) 100%),
      linear-gradient(180deg, rgba(123,179,255,0.00) 0%, rgba(69,152,255,0.12) 99%);

      .tooltip-item-top,
      .tooltip-item-bottom {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .tooltip-label {
          font-family: MicrosoftYaHei;
          font-size: 14px;
          color: #D8F5FF;
          letter-spacing: 0;
          font-weight: 400;
        }

        .tooltip-num {
          font-family: D-DIN;
          font-size: 20px;
          color: #FFA843;
          letter-spacing: 0;
          font-weight: 400;
        }

        .tooltip-rate {
          font-family: D-DIN;
          font-size: 14px;
          color: #FFFFFF;
          letter-spacing: 0;
          font-weight: 400;
        }
      }
      .tooltip-item-top {
        margin-bottom: 6px;
      }
    }
  }
}
</style>
