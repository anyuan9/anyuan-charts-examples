<script setup>
import { useECharts } from "@anyuan/utils";
import axios from "axios";
import { nextTick, onMounted, ref } from "vue";
// 参考示例 https://www.makeapie.cn/echarts_content/xByLjqtaLz.html

const chartRef = ref(null);
const { registerMap, setOption, getInstance, showLoading, clear } = useECharts(chartRef, {
  autoTooltipLoop: false, // 是否自动循环 tooltip，默认间隔时间1500ms
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s"
    }
  }
});

const baseUrl = `${import.meta.env.BASE_URL}static/mapjson/hubei/`;
const areaList = [
  {
    code: "hubei",
    name: "湖北省"
  }
];
// 中英文对照
const nameMap = {
  武汉市: "wuhan",
  黄石市: "huangshi",
  十堰市: "shiyan",
  宜昌市: "yichang",
  襄阳市: "xiangyang",
  鄂州市: "ezhou",
  荆门市: "jingmen",
  孝感市: "xiaogan",
  荆州市: "jingzhou",
  黄冈市: "huanggang",
  咸宁市: "xianning",
  随州市: "suizhou",
  恩施土家族苗族自治州: "enshi",
  仙桃市: "xiantao",
  潜江市: "qianjiang",
  天门市: "tianmen",
  神农架林区: "shennongjia"
};
const minVal = 1000;
const maxVal = 10000;

const style = {
  font: "18px \"Microsoft YaHei\", sans-serif",
  subFont: "12px \"Microsoft YaHei\", sans-serif",
  textColor: "#eee",
  lineColor: "rgba(147, 235, 248, .8)"
};
const graphicPos = {
  left: 100, // 初始位置，距离左侧的距离
  top: 50, // 初始位置，距离顶部的距离
  width: 66, // 一个图形元素的宽度（可以理解为一个地名的宽度）
  widthArrow: 8, // 箭头宽度
  widthCur: 66, // 用于记录当前graphic图形的总宽度，初始值与width值相同
  padding: 8 // 每个图形元素之间的距离
};

let option = null;
function getOption(data, mapName) {
  const { title = "", seriesData } = data;
  const seriesData2 = seriesData.map((item) => {
    return {
      name: item.name,
      value: [...item.geoCoord, item.value] // 地图上散点的数据：经度，纬度，数值
    };
  });
  option = {
    // 背景颜色，默认无背景
    backgroundColor: {
      type: "linear",
      x: 0,
      y: 0,
      x2: 1,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: "#0f2c70" // 0% 处的颜色
        },
        {
          offset: 1,
          color: "#091732" // 100% 处的颜色
        }
      ],
      global: false // 缺省为 false
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
          type: ["line", "bar", "stack"]
        }
      }
    },
    // 标题
    title: {
      text: title || "",
      subtext: "下载链接",
      sublink: "http://datav.aliyun.com/tools/atlas/#&lat=30.772340792178525&lng=103.94573258937584&zoom=9.5",
      top: "2%", // title 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')', '像素值(20)', '或者自动对齐值('top', 'middle', 'bottom')
      left: "center", // title 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')', '像素值(20)', '或者自动对齐值('left', 'center', 'right')
      textStyle: {
        align: "center",
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 20
      }
    },
    // 提示框
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        return `${params.name}: ${params.value || 0}`;
      }
    },
    // 图形元素
    graphic: [
      {
        type: "group",
        left: graphicPos.left,
        top: graphicPos.top,
        children: [
          // 顶部的横线
          {
            type: "line",
            left: 0,
            top: -20,
            shape: {
              x1: 0,
              y1: 0,
              x2: graphicPos.width,
              y2: 0
            },
            style: {
              stroke: style.lineColor
            }
          },
          // 底部的横线
          {
            type: "line",
            left: 0,
            top: 20,
            shape: {
              x1: 0,
              y1: 0,
              x2: graphicPos.width,
              y2: 0
            },
            style: {
              stroke: style.lineColor
            }
          }
        ]
      },
      {
        type: "group",
        left: graphicPos.left + graphicPos.padding,
        top: graphicPos.top + 8,
        children: [
          // 中文名
          {
            type: "text",
            left: 0,
            top: "middle",
            style: {
              text: areaList[0].name,
              textAlign: "center",
              fill: style.textColor,
              font: style.font
            },
            onclick: (params) => {
              resetOption(areaList[0]);
            }
          },
          // 英文名
          {
            type: "text",
            left: 0,
            top: 10,
            style: {
              text: areaList[0].code.toUpperCase(),
              textAlign: "center",
              fill: style.textColor,
              font: style.subFont
            },
            onclick: () => {
              resetOption(areaList[0]);
            }
          }
        ]
      }
    ],
    geo: {
      map: mapName,
      aspectScale: 1, // 长宽比
      zoom: 1,
      roam: false, // 是否开启鼠标缩放和平移漫游。建议不开启，因为页面上实际会有2个地图图层（geo一个，type为'map'一个）
      selectedMode: false, // 选中模式，表示是否支持多个选中。
      z: 0,
      label: {
        show: false
      },
      itemStyle: {
        areaColor: "#031525",
        borderColor: "#1773c3"
        // shadowColor: '#1773c3',
        // shadowBlur: 20,
        // shadowOffsetX: 0,
        // shadowOffsetY: 10,
      },
      emphasis: {
        label: {
          show: false
        },
        itemStyle: {
          areaColor: "#0f2c70",
          borderWidth: 0,
          color: "green",
          label: {
            show: false
          }
        }
      }
    },
    series: [
      // 建议隐藏这个map图层，否则会遮挡geo地图的缩放效果
      // {
      //   type: 'map',
      //   aspectScale: 1, //长宽比
      //   zoom: 1, //
      //   roam: false, //是否开启鼠标缩放和平移漫游。建议不开启
      //   selectedMode: false, // 选中模式，表示是否支持多个选中。(关闭后，可避免在点击区域块后，再点击其他区域块时，区域块显示为黄色的问题)
      //   // 地图区域的多边形 图形样式
      //   itemStyle: {
      //       areaColor: '#031525',
      //       borderColor: '#3B5077',
      //       borderWidth: 1,
      //   },
      //   // 区域名样式
      //   label: {
      //       show: true,
      //       fontSize: 10,
      //       color: 'rgba(255,255,255,.5)',
      //   },
      //   tooltip: {
      //     show: true,
      //     padding: [12, 20],
      //     borderWidth: 1,
      //     borderColor: 'transparent',
      //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
      //     textStyle: {
      //       fontSize: 14,
      //       color: 'rgba(255, 255, 255, 1)',
      //     },
      //     formatter: params => {
      //       return `${params.name}`
      //     },
      //   },
      //   emphasis: {
      //     itemStyle: {
      //       areaColor: '#0f2c70',
      //     },
      //     label: {
      //       show: true,
      //       color: 'rgba(255,255,255,1)',
      //     },
      //   },
      //   map: mapName,
      //   data: seriesData || [],
      // },
      {
        type: "effectScatter",
        coordinateSystem: "geo",
        showEffectOn: "render", // 何时显示特效，可选'render' 绘制完成后显示特效；'emphasis' 高亮（hover）的时候显示特效。
        // 涟漪特效相关配置
        rippleEffect: {
          brushType: "stroke", // 波纹绘制方式，可选 'stroke' 和 'fill'
          period: 4, // 动画时间，值越小速度越快
          scale: 4 // 波纹圆环最大限制，值越大波纹越大
        },
        // 图形样式
        itemStyle: {
          color: "rgba(241, 109, 115, .8)",
          shadowBlur: 10,
          shadowColor: "#333"
        },
        emphasis: {
          scale: true
        },
        data: seriesData2
      }
    ]
  };
  return option;
}

/**
 * @description: 更新地图option
 * @param {object} area, 当前点击的区域,包含name和code
 * @return {*}
 */
async function resetOption(area) {
  const index = areaList.findIndex(item => item.code === area.code);
  if (index === areaList.length - 1) {
    return;
  }
  if (index < 0) {
    // 如果未添加到areaList，则下钻到下一级
    const breadcrumb = createBreadcrumb(area);
    option.graphic.push(breadcrumb);
    option.graphic[0].children[0].shape.x2 = graphicPos.widthCur; // 增加横线的长度
    option.graphic[0].children[1].shape.x2 = graphicPos.widthCur;
    areaList.push(area);
  } else {
    // 如果已添加到areaList，则返回到上一级
    const length = option.graphic.length;
    graphicPos.widthCur -= (graphicPos.width + graphicPos.widthArrow) * (length - 1 - (index + 1));
    option.graphic.splice(index + 2); // 删除图形元素组件内的内容（中文名和英文名）
    option.graphic[0].children[0].shape.x2 = graphicPos.widthCur;
    option.graphic[0].children[1].shape.x2 = graphicPos.widthCur;
    areaList.splice(index + 1);
  }

  await resetSeriesData(area);
  // option.series[0].map = area.code
  option.geo.map = area.code;
  option.geo.zoom = 0.2;
  clear();
  setOption(option);
  zoomAnimation();
}

// 面包屑内容
function createBreadcrumb(area) {
  const breadcrumb = {
    type: "group",
    id: area.code,
    left: graphicPos.left + graphicPos.widthCur,
    top: graphicPos.top + 8,
    children: [
      // 分隔符号(箭头)
      {
        type: "polyline",
        left: 0,
        top: -5,
        shape: {
          points: [
            [0, 0],
            [graphicPos.widthArrow, 8],
            [0, 16]
          ]
        },
        style: {
          stroke: "#fff"
        }
      },
      // 中文名
      {
        type: "text",
        left: graphicPos.widthArrow + graphicPos.padding,
        top: "middle",
        style: {
          key: area.code, // 自定义变量，用于点击事件的传参
          text: area.name,
          textAlign: "center",
          fill: style.textColor,
          font: style.font
        },
        onclick() {
          const area = areaList.find(item => item.code === this.style.key);
          resetOption(area);
        }
      },
      // 英文名
      {
        type: "text",
        left: graphicPos.widthArrow + graphicPos.padding,
        top: 10,
        style: {
          key: area.code, // 自定义变量，用于点击事件的传参
          text: area.code.toUpperCase(),
          textAlign: "center",
          fill: style.textColor,
          font: style.subFont
        },
        onclick() {
          const area = areaList.find(item => item.code === this.style.key);
          resetOption(area);
        }
      }
    ]
  };
  graphicPos.widthCur += graphicPos.width + graphicPos.widthArrow;

  return breadcrumb;
}

// 更新地图的series数据,这里可根据实际情况请求接口数据
async function resetSeriesData(area) {
  try {
    // 将下载后的json文件放置/public目录下
    const { data } = await axios.get(`${baseUrl}/${area.code}.json`);
    const geoCoordList = data.features.map((item) => {
      const { id, properties } = item;
      return {
        id,
        name: properties.name,
        geoCoord: properties.cp,
        code: nameMap[properties.name] || ""
      };
      // 示例：
      // {
      //   id: '420100',
      //   name: '武汉市',
      //   geoCoord: [114.3162, 30.581084],
      //   code: 'wuhan',
      // }
    });

    const data2 = await getMapData(area.name, geoCoordList);
    // option.series[0].data = data2?.seriesData || []
    option.series[0].data = data2?.seriesData?.map((item) => {
      return {
        name: item.name,
        value: item.geoCoord ? [...item.geoCoord, item.value] : [] // 地图上散点的数据：经度，纬度，数值
      };
    }) || [];
  } catch (err) {
    console.error(err);
  }
}

// 放大效果
function zoomAnimation() {
  const _zoom = function (zoomVal) {
    setOption({
      geo: {
        zoom: zoomVal
      }
    });
    if (zoomVal < 1) {
      window.requestAnimationFrame(() => {
        _zoom(zoomVal + 0.2);
      });
    }
  };
  window.requestAnimationFrame(() => {
    _zoom(0.2);
  });
}

async function getMap(mapName) {
  try {
    // 将下载后的json文件放置/public目录下
    const res = await axios.get(`${baseUrl}/${mapName}.json`);
    // 使用数据注册地图
    registerMap(mapName, res.data);

    const geoCoordList = res.data.features.map((item) => {
      const { id, properties } = item;
      return {
        id,
        name: properties.name,
        geoCoord: properties.cp,
        code: nameMap[properties.name] || ""
      };
      // 示例：
      // {
      //   id: '420100',
      //   name: '武汉市',
      //   geoCoord: [114.3162, 30.581084],
      //   code: 'wuhan',
      // }
    });
    return geoCoordList;
  } catch (err) {
    console.error(err);
  }
}

async function getMapData(mapName, geoCoordList) {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "地图下钻示例",
        seriesData: geoCoordList.map(item => ({
          ...item, // 补充数据，如id, geoCoord, code
          name: item.name,
          value: Math.floor(Math.random() * (maxVal - minVal) + minVal)
        }))
      }
    };
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

async function getData() {
  try {
    // 将下载后的json文件放置/public目录下
    const mapName = areaList[areaList.length - 1].code;
    const geoCoordList = await getMap(mapName);
    const data = await getMapData(mapName, geoCoordList);
    const option = getOption(data, mapName);

    nextTick(() => {
      setOption(option);

      // 添加事件
      const echartsInstance = getInstance();
      echartsInstance.on("click", handleClick);
    });
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

async function handleClick(params) {
  const { name, value, data } = params;
  const code = nameMap[name] || data?.code || "";
  if (code) {
    const geoCoordList = await getMap(code);
    const area = {
      code,
      name
    };
    resetOption(area);
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
