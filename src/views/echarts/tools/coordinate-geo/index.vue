<script setup>
import axios from "axios";
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

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

function getOption(data) {
  const { title = "", mapName, seriesData } = data;

  return {
    // 背景颜色，默认无背景
    backgroundColor: "rgba(8, 25, 66, 1)",
    // 调色盘颜色列表，依次循环取颜色作为series的颜色
    color: chartColor,
    // 标题
    title: {
      text: title || "",
      textStyle: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 20,
      },
      top: "5%",
      left: "2%",
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    // 地理坐标系
    geo: {
      show: true,
      map: mapName, // 使用 registerMap 注册的地图名称
      roam: false, // 是否开启鼠标缩放和平移漫游，默认不开启，如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
      // 自定义地图投影，至少需要提供project, unproject两个方法分别用来计算投影后的坐标以及计算投影前的坐标。
      // projection: {
      //   // projection: (pt) => project(pt)
      // },
      // center: [115.97, 29.71], // 当前视角的中心点，用经纬度表示
      // center: project([115.97, 29.71]), // 如果设置了projection则用投影后的坐标表示。
      aspectScale: 1, // 地图的长宽比，如果设置了projection则无效。
      zoom: 1.05, // 当前视角的缩放比例
      scaleLimit: {
        min: 1, // 缩放的最小值
        max: 3, // 缩放的最大值
      },
      // 自定义地区的名称映射
      // nameMap : { 'China' : '中国' },
      // nameProperty: 'name', // 地图区域名称属性，默认为'name'
      selectedMode: false, // 选中模式，表示是否支持多个选中。默认关闭，支持布尔值和字符串，字符串取值可选'single'表示单选，或者'multiple'表示多选。
      // left: 'auto', // 地图组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      // top: 'auto', // 地图组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      zlevel: 0, // zlevel用于 Canvas 分层，不同zlevel值的图形会放置在不同的 Canvas 中。zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面。默认：0
      z: 0, // z值用于控制图形的前后顺序，z值小的图形会被z值大的图形覆盖。z相比zlevel优先级更低，而且不会创建新的 Canvas。默认：0
      label: {
        show: false,
      },
      itemStyle: {
        areaColor: "#023677",
        borderColor: "#1180c7",
      },
      // 高亮状态下的多边形和标签样式
      emphasis: {
        label: {
          show: false,
        },
        itemStyle: {
          areaColor: "#4499d0",
        },
      },
      // 选中状态下的多边形和标签样式。
      select: {},
      // 淡出状态下的多边形和标签样式。
      blur: {},
      // 在地图中对特定的区域配置样式。
      regions: [
        {
          name: "广东",
          itemStyle: {
            areaColor: "red",
            color: "red",
          },
        },
      ],
    },
    visualMap: {
      show: true,
      min: 0,
      max: 200,
      left: "10%",
      top: "bottom",
      calculable: true,
      seriesIndex: [1],
      inRange: {
        color: ["#04387b", "#467bc0"], // 蓝绿
      },
    },
    series: [
      {
        type: "map",
        roam: false, //是否开启鼠标缩放和平移漫游
        aspectScale: 1, // 地图的长宽比，如果设置了projection则无效。
        zoom: 1.05, // 当前视角的缩放比例
        selectedMode: false, // 选中模式，表示是否支持多个选中。(关闭后，可避免在点击区域块后，再点击其他区域块时，区域块显示为黄色的问题)
        // 地图区域的多边形 图形样式
        itemStyle: {
          areaColor: "#031525",
          borderColor: "#3B5077",
          borderWidth: 1,
        },
        //区域名样式
        label: {
          show: true,
          fontSize: 10,
          color: "rgba(255,255,255,.5)",
        },
        emphasis: {
          itemStyle: {
            areaColor: "#0f2c70",
          },
          label: {
            color: "rgba(255,255,255,1)",
          },
        },
        map: mapName,
        // 这是要显示的数据
        data: (seriesData?.length && seriesData[0].data) || [],
      },
      {
        type: "scatter",
        coordinateSystem: "geo",
        symbolSize: (val) => {
          return val[2] / 10;
        },
        label: {
          show: true,
          formatter: "{b}",
          position: "right",
        },
        itemStyle: {
          color: "#fff",
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        name: (seriesData?.length && seriesData[1].name) || "",
        data: (seriesData?.length && seriesData[1].data) || [],
      },
      {
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 1,
        symbolSize: (val) => {
          return val[2] / 10;
        },
        showEffectOn: "render",
        rippleEffect: {
          brushType: "stroke",
        },
        emphasis: {
          scale: true,
        },
        label: {
          show: false,
          formatter: "{b}",
          position: "left",
        },
        itemStyle: {
          color: "yellow",
          shadowBlur: 10,
          shadowColor: "yellow",
        },
        name: (seriesData?.length && seriesData[2].name) || "",
        data: (seriesData?.length && seriesData[2].data) || [],
      },
    ],
  };
}

async function getData() {
  try {
    const mapName = "china"; // 地图名称
    // 将下载后的json文件放置/public目录下
    const res1 = await axios.get(
      `${import.meta.env.BASE_URL}static/mapjson/${mapName}.json`,
    );
    // 使用数据注册地图
    registerMap(mapName, res1.data);
    const geoCoordNames = res1.data.features.reduce((acc, cur) => {
      const { name } = cur.properties || {};
      return typeof name === "string" ? acc.concat(name) : acc;
    }, []);
    const geoCoordMap = res1.data.features.reduce((acc, cur) => {
      const { name, center } = cur.properties || {};
      if (typeof name === "string" && geoCoordNames.includes(name)) {
        acc = {
          ...acc,
          [name]: center || [],
        };
      }
      return acc;
    }, {});

    const mapData = [
      { name: "北京市", value: 199 },
      { name: "天津市", value: 42 },
      { name: "河北省", value: 72 },
      { name: "山西省", value: 81 },
      { name: "内蒙古自治区", value: 47 },
      { name: "辽宁省", value: 67 },
      { name: "吉林省", value: 82 },
      { name: "黑龙江省", value: 93 },
      { name: "上海市", value: 24 },
      { name: "江苏省", value: 92 },
      { name: "浙江省", value: 144 },
      { name: "安徽省", value: 109 },
      { name: "福建省", value: 116 },
      { name: "江西省", value: 91 },
      { name: "山东省", value: 119 },
      { name: "河南省", value: 117 },
      { name: "湖北省", value: 116 },
      { name: "湖南省", value: 114 },
      { name: "重庆市", value: 91 },
      { name: "四川省", value: 125 },
      { name: "贵州省", value: 62 },
      { name: "云南省", value: 83 },
      { name: "西藏自治区", value: 9 },
      { name: "陕西省", value: 80 },
      { name: "甘肃省", value: 56 },
      { name: "青海省", value: 10 },
      { name: "宁夏回族自治区", value: 18 },
      { name: "新疆维吾尔自治区", value: 180 },
      { name: "广东省", value: 123 },
      { name: "广西壮族自治区", value: 59 },
      { name: "海南省", value: 14 },
      { name: "台湾省", value: 23 },
      { name: "香港特别行政区", value: 22 },
      { name: "澳门特别行政区", value: 11 },
    ];
    const convertData = (data) => {
      return data.map((item) => {
        return {
          name: item.name,
          value: geoCoordMap[item.name].concat(item.value),
        };
      });
    };
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: "0",
      data: {
        title: "地理坐标系",
        mapName: "china",
        seriesData: [
          {
            name: "地图数据",
            data: mapData,
          },
          {
            name: "散点数据",
            data: convertData(mapData),
          },
          {
            name: "散点Top5",
            data: convertData(
              mapData.sort((a, b) => b.value - a.value).slice(0, 5),
            ),
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
    <h2>
      地理坐标系:
      coordinateSystem:'geo'，用于绘制地图，可以在地图上绘制散点图、线集等。
    </h2>
    <h3>通过 geo 配置项进行设置。</h3>
    <div ref="chartRef" :style="{ width: '100%', height: '100%' }" />
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 680px;
}
</style>
