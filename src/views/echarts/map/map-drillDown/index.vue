<script setup>
import { useECharts } from "@anyuan/utils";
import axios from "axios";
import { nextTick, onMounted, ref } from "vue";
import { chartColor } from "@/views/echarts/constant";

const chartRef = ref(null);
const { registerMap, setOption, getInstance, showLoading } = useECharts(chartRef, {
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

let option = null;
function getOption(data, mapName) {
  const { title = "", seriesData } = data;

  option = {
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
      subtext: "下载链接",
      sublink: "http://datav.aliyun.com/tools/atlas/#&lat=30.772340792178525&lng=103.94573258937584&zoom=9.5",
      top: "2%", // title 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "center", // title 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      textStyle: {
        align: "center",
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 20
      }
    },
    // 图例(series内容需要配置name属性)
    legend: {
      show: true,
      top: "2%",
      right: "5%",
      icon: "rect", // 图例项的图形，可取值'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none', 'image://url'形式的图片链接, 'path://'形式的矢量路径
      itemWidth: 8, // 图例标记的图形宽度，默认25
      itemHeight: 8, // 图例标记的图形高度，默认14
      itemGap: 25, // 图例项之间的间隔，单位px，默认10，可取值：5、[5, 10]、[5, 10, 5, 10]
      // 图例文字的样式
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 14
      }
    },
    // 提示框
    tooltip: {
      trigger: "item", // 触发类型，可取值：数据项图形触发('item')、坐标轴触发('axis')、不触发('none')
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderColor: "transparent",
      borderWidth: 1,
      padding: [12, 20],
      textStyle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 1)"
      },
      formatter: (params) => {
        return `${params.name}: ${params.value || 0}`;
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
    // 视觉映射组件
    visualMap: {
      min: 0,
      max: 50000,
      text: ["High", "Low"],
      realtime: false,
      calculable: true,
      inRange: {
        color: ["#b7d6f3", "#40a9ed", "#3598c1", "#215096"]
      },
      textStyle: {
        color: "rgba(255,255,255,0.8)"
      }
    },
    geo: {
      map: mapName,
      aspectScale: 1, // 长宽比
      zoom: 1.05, //
      roam: false,
      selectedMode: false, // 选中模式，表示是否支持多个选中。
      z: 0,
      itemStyle: {
        areaColor: "#091632",
        borderColor: "#1773c3",
        shadowColor: "#1773c3",
        shadowBlur: 20
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: false
        }
      }
    },
    series: [
      {
        type: "map",
        map: mapName,
        aspectScale: 1, // 长宽比
        zoom: 1.05, //
        roam: false, // 是否开启鼠标缩放和平移漫游
        selectedMode: false, // 选中模式，表示是否支持多个选中。(关闭后，可避免在点击区域块后，再点击其他区域块时，区域块显示为黄色的问题)
        // 地图区域的多边形 图形样式
        itemStyle: {
          areaColor: "#031525",
          borderColor: "#3B5077",
          borderWidth: 1
        },
        // 区域名样式
        label: {
          show: false,
          fontSize: 10,
          color: "rgba(0,0,0,.5)"
        },
        tooltip: {
          show: true
        },
        emphasis: {
          itemStyle: {
            areaColor: "#0f2c70"
          },
          label: {
            show: false,
            color: "rgba(255,255,255,1)"
          }
        },
        data: (seriesData?.length && seriesData) || []
      }
    ]
  };
  return option;
}

async function getMapData(mapName) {
  try {
    // 将下载后的json文件放置/public目录下
    const { data } = await axios.get(`${baseUrl}/${mapName}.json`);
    // 使用数据注册地图
    registerMap(mapName, data);

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

    // const res = await axios.get("/api/getChartData?code=" + mapName);
    const res = {
      code: "0",
      data: {
        title: "地图下钻示例(单击下钻，双击返回)",
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
    const data = await getMapData(mapName);
    const option = getOption(data, mapName);

    nextTick(() => {
      setOption(option);

      // 添加事件
      const echartsInstance = getInstance();
      echartsInstance.on("click", handleClick);
      echartsInstance.on("dblclick", handleDblClick);
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

async function reloadMap(mapName) {
  const data = await getMapData(mapName);

  option.geo.map = mapName; // 地图名称
  option.series[0].map = mapName; // 地图名称
  option.series[0].data = data?.seriesData || [];
  setOption(option);
}

let timeoutId = null;
// 绑定双击事件(注意：双击事件会触发2次单击事件)，返回上一级地图
function handleDblClick(params) {
  console.log("handleDblClick", params);
  // 当双击事件发生时，清除单击事件，仅响应双击事件
  clearTimeout(timeoutId);

  areaList.pop();
  const mapName = areaList[areaList.length - 1].code;
  reloadMap(mapName);
}

// 绑定单击事件，切换到下一级地图
function handleClick(params) {
  console.log("handleClick", params);
  clearTimeout(timeoutId); // 防止双击事件触发单击事件

  // 由于单击事件和双击事件冲突，故单击的响应事件延迟250毫秒执行
  timeoutId = setTimeout(() => {
    const { data } = params;
    if (data?.code) {
      reloadMap(data.code);
      areaList.push({ code: data.code, name: data.name });
    } else {
      console.log("无此区域地图");
    }
  }, 250);
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
