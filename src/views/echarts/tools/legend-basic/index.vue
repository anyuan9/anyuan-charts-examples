<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
  autoChartResize: true,
  animation: {
    enable: true,
    styles: {
      transition: "all 2s",
    },
  },
});

const iconList = {
  a: "https://www.makeapie.cn/asset/get/s/data-1559121268278-ozjd-lXoz.png",
  b: "https://www.makeapie.cn/asset/get/s/data-1559121263841-UC5w7mTJ9.png",
  c: "https://www.makeapie.cn/asset/get/s/data-1559121259198-sxyPSimU9.png",
  d: "https://www.makeapie.cn/asset/get/s/data-1559121254241-xj5JAIBzC.png",
  e: "https://www.makeapie.cn/asset/get/s/data-1559121249274-QxHDAdQGy.png",
};

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
    // 标题
    title: [
      {
        text: "{name|" + title + "}\n{val|" + subtitle + "}",
        top: "center",
        left: "30%",
        textAlign: 'center',
        textStyle: {
          rich: {
            name: {
              fontSize: 14,
              fontWeight: "normal",
              color: "rgba(255, 255, 255, 0.8)",
              padding: [10, 0],
            },
            val: {
              fontSize: 32,
              fontWeight: "bold",
              color: "rgba(255, 255, 255, 0.65)",
            },
          },
        },
      },
      {
        text: unit,
        top: 20,
        left: 20,
        textStyle: {
          fontSize: 14,
          color: "rgba(255, 255, 255, 0.65)",
          fontWeight: 400,
        },
      },
    ],
    // 图例
    legend: {
      show: true,
      orient: "vertical", // 图例列表的布局朝向，可选值：'horizontal'水平、'vertical'垂直，默认'horizontal'
      x: "60%",
      y: "center",
      padding: [4, 0, 4, 0],
      itemGap: 6, // 图例每项之间的间隔，单位px，默认10。横向布局时为水平间隔，纵向布局时为纵向间隔。
      icon: "circle", // 图例标记的图形，可选值：'circle'圆形、'rect'矩形、'roundRect'圆角矩形、'triangle'三角形、'diamond'菱形、'pin'水滴、'arrow'箭头、'none'无、'image'图片，默认'circle'
      itemWidth: 8, // 图例标记的图形宽度，默认25
      itemHeight: 8, // 图例标记的图形高度，默认14
      // 图例的公用文本样式
      textStyle: {
        width: 220,
        // height: 16,
        color: "#cddafd",
        fontSize: 14,
        // 文字块背景色。可以使用颜色值，例如：'#123234'。也可以直接使用图片，例如：backgroundColor: { image: 'xxx/xxx.png'}
        backgroundColor: {
          image:
            "https://www.makeapie.cn/asset/get/s/data-1545016257824-mxLqGjr4z.png",
        },
        rich: {
          name: {
            width: 80,
            padding: [0, 5, 0, 5],
            color: "rgba(255, 255, 255, 0.65)",
            fontSize: 12,
            fontFamily: "PingFangSC-Medium, PingFang SC",
            fontWeight: 400,
          },
          value: {
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: 14,
            fontFamily: "PingFangSC-Medium, PingFang SC",
            fontWeight: 400,
          },
          rate: {
            color: "#fd5656",
            fontSize: 14,
            fontFamily: "PingFangSC-Medium, PingFang SC",
            fontWeight: 600,
          },
          a: {
            width: 18,
            height: 18,
            lineHeight: 50,
            backgroundColor: {
              image: iconList.a,
            },
            align: "left",
          },
          b: {
            width: 18,
            height: 18,
            lineHeight: 50,
            backgroundColor: {
              image: iconList.b,
            },
            align: "left",
          },
          c: {
            width: 18,
            height: 18,
            lineHeight: 50,
            backgroundColor: {
              image: iconList.c,
            },
            align: "left",
          },
          d: {
            width: 18,
            height: 18,
            lineHeight: 50,
            backgroundColor: {
              image: iconList.d,
            },
            align: "left",
          },
          e: {
            width: 18,
            height: 18,
            lineHeight: 50,
            backgroundColor: {
              image: iconList.e,
            },
            align: "left",
          },
        },
      },
      // 格式化图例文本，支持字符串模板和回调函数两种形式
      // 使用字符串模板，模板变量为图例名称 {name}
      // formatter: 'Legend {name}',
      // 使用回调函数
      formatter: function (name) {
        let res = seriesData.find((v) => v.name === name);
        return `{name|${res.name} }{value|${res.value} }  {${res.imageName}|} {rate|${res.rate} %}`;
      },
    },
    // 直角坐标系内绘图网格
    grid: {
      top: "15%", // grid 组件离容器上侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('top', 'middle', 'bottom')
      left: "5%", // grid 组件离容器左侧的距离，可取值：相对于容器高宽的百分比('20%')、像素值(20)、或者自动对齐值('left', 'center', 'right')
      right: "5%",
      bottom: "2%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "60%"],
        center: ["30%", "50%"],
        label: {
          formatter: (params) => {
            return (
              "{value|" +
              params.value +
              "}" +
              "\n" +
              "{value|" +
              params.percent +
              "%}"
            );
          },
          rich: {
            value: {
              fontSize: 12,
              fontweight: 400,
              color: "rgba(255, 255, 255, 0.65)",
            },
          },
        },
        name: title,
        data: seriesData || [],
      },
    ],
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
            value: Math.floor(Math.random() * 500 + 100),
            imageName: "a", // 补充的属性，用于定义图例图片
          },
          {
            name: "测试数据2",
            value: Math.floor(Math.random() * 500 + 100),
            imageName: "b",
          },
          {
            name: "测试数据3",
            value: Math.floor(Math.random() * 500 + 100),
            imageName: "c",
          },
          {
            name: "测试数据4",
            value: Math.floor(Math.random() * 500 + 100),
            imageName: "d",
          },
          {
            name: "测试数据5",
            value: Math.floor(Math.random() * 500 + 100),
            imageName: "e",
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
    <div ref="chartRef" :style="{ width: '100%', height: '100%' }" />
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 480px;
}
</style>
