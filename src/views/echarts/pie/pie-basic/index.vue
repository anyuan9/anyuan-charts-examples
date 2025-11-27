<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
  autoHighlightLoop: true, // 是否自动轮播高亮显示。注意饼图不是使用autoTooltipLoop
  autoChartResize: true, // 是否自动循环 tooltip，默认间隔时间1500ms
  autoLoopIndex: 1, // 自动循环的起始索引，默认为0
  animation: {
    enable: true,
    styles: {
      transition: "all 2s",
    },
  },
});

// 图表数据
const giftImageUrl =
  "data:image/png;base64,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";
function getOption(data) {
  const { title, seriesData = {} } = data;

  // 数据总和
  const total =
    seriesData?.data?.reduce((acc, item) => {
      return acc + item.value;
    }, 0) || 0;
  const bgColor = "rgba(8, 25, 66, 1)";

  return {
    // 背景颜色，默认无背景
    backgroundColor: bgColor,
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
          type: ["line", "bar", "stack"],
        },
      },
    },
    // 原生图形类型，用于绘制自定义的图形元素。可以支持的图形元素包括：image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
    graphic: [
      {
        type: "image",
        left: "center",
        top: "35%",
        style: {
          image: giftImageUrl,
          width: 40,
          height: 40,
        },
      },
      {
        type: "group",
        left: "center",
        top: "50%",
        children: [
          {
            type: "text",
            left: "center",
            top: "center",
            style: {
              text: title,
              textAlign: "center",
              fontSize: 16,
              fill: "rgba(255, 255, 255, 0.6)",
            },
          },
          {
            type: "text",
            left: "center",
            top: "60%",
            style: {
              text: `\n${total}`,
              textAlign: "center",
              fontSize: 26,
              fontWeight: "bold",
              fill: "rgba(255, 255, 255, 0.8)",
            },
          },
        ],
      },
    ],
    // 标题
    // title: [
    //   {
    //     top: 'center',
    //     left: 'center',
    //     textAlign: 'center',
    //     textStyle: {
    //       rich: {
    //         name: {
    //           fontSize: 20,
    //           fontWeight: 'normal',
    //           color: 'rgba(255, 255, 255, 0.8)',
    //           padding: [10, 0],
    //         },
    //         val: {
    //           fontSize: 32,
    //           fontWeight: 'bold',
    //           color: '#ffffff',
    //         },
    //       },
    //     },
    //     text: '{name|' + title + '}\n{val|' + total + '}',
    //   },
    //   {
    //     top: 20,
    //     left: 20,
    //     textStyle: {
    //       fontSize: 14,
    //       color: '#ffffff',
    //       fontWeight: 400,
    //     },
    //     text: '单位：个',
    //   },
    // ],
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderColor: "rgba(0, 0, 0, 0.6)",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: "rgba(255, 255, 255, 1)",
      },
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      x: "right",
      y: "center",
      right: "10%",
      align: "left",
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16,
      icon: "rect", // 图例形状：circle，rect ，roundRect，triangle，diamond，pin，arrow，none
      textStyle: {
        rich: {
          name: {
            fontSize: 12,
            color: "rgba(255, 255, 255, 0.8)",
            padding: [0, 5, 0, 0],
          },
          value: {
            fontSize: 14,
            color: "rgba(255, 255, 255, 1)",
            padding: [0, 5, 0, 0],
          },
          ratio: {
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.4)",
            padding: [0, 5, 0, 0],
          },
          ...chartColor.reduce((acc, color, index) => {
            acc[`${index}`] = {
              fontSize: 14,
              color,
              padding: [0, 5, 0, 0],
            };
            return acc;
          }, {}),
        },
      },
      formatter: (name) => {
        const res = seriesData?.data?.find((v) => v.name === name);
        const idx =
          seriesData?.data?.findIndex((v) => v.name === name) % chartColor.length;
        if (res) {
          const value = (res && res.value) || 0;
          const ratio = ((value * 100) / (total || 1)).toFixed(1);
          return `{name|${name}}  {value${idx}|${value}} {ratio|/ ${ratio}%}`;
        }
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
        // 环形图为空时背景
        type: "pie",
        radius: ["45%", "60%"],
        center: ["50%", "50%"],
        selectedMode: false,
        animation: false,
        cursor: "auto",
        emphasis: {
          scale: false,
        },
        itemStyle: {
          color: `${chartColor[0]}80`,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        tooltip: {
          show: false,
        },
        data: [{ value: 1, name: "" }],
      },
      {
        type: "pie",
        radius: ["45%", "60%"],
        center: ["50%", "50%"],
        // minAngle: 2, //最小的扇区角度（0 ~ 360）
        // padAngle: 10, // 方案1：饼图扇区之间的间隔角度（0 ~ 360），从 v5.5.0 开始支持
        itemStyle: {
          borderWidth: 10, // 方案2：设置边框宽度，表示中间的空格区域
          borderColor: bgColor, // 分割颜色，与背景色保持一致
          borderRadius: 10,
        },
        label: {
          padding: [0, -100, 0, -100],
          position: "outside", // 标签的位置，'outside'饼图扇区外侧，'inside'饼图扇区内部，'center'在饼图中心位置
          rich: {
            icon: {
              fontSize: 16,
            },
            name: {
              fontSize: 14,
              color: "rgba(255, 255, 255, 0.6)",
              padding: [0, 10, 0, 4],
            },
            value: {
              fontSize: 18,
              fontWeight: "bold",
              color: "rgba(255, 255, 255, 0.8)",
            },
          },
          formatter: "{icon|●}{name|{b}}{value|{c}}\n\n{value|{d}%}",
          // formatter: params => {
          //   return '{icon|●}{name|' + params.name + '}{value|' + params.value + '}'
          // },
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 120,
          lineStyle: {
            color: "rgba(255, 255, 255, 0.6)",
          },
        },
        emphasis: {
          itemStyle: {
            borderWidth: 0,
            shadowBlur: 10,
            shadowColor: "rgba(255, 255, 255, 0.5)",
          },
        },
        name: seriesData?.name || '',
        data: seriesData?.data || [],
      },
      {
        // 内部背景
        type: "pie",
        radius: ["0%", "40%"],
        center: ["50%", "50%"],
        selectedMode: false,
        animation: false,
        cursor: "auto",
        itemStyle: {
          color: {
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.8,
            global: false,
            colorStops: [
              {
                offset: 0,
                color: "rgba(0, 0, 0, 0)", // 50% 处的颜色
              },
              {
                offset: 1,
                color: `${chartColor[0]}80`, // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          scale: false,
        },
        tooltip: {
          show: false,
        },
        data: [{ value: 1, name: "" }],
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
        seriesData: {
          name: "测试数据",
          data: [
            {
              name: "A类",
              value: 3720,
            },
            {
              name: "B类",
              value: 2920,
            },
            {
              name: "C类",
              value: 2200,
            },
            {
              name: "D类",
              value: 1420,
            },
          ],
        }
      },
    };

    const option = getOption(res.data || {});
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
          fontSize: 20,
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
  background: rgba(8, 25, 66, 1);
}
</style>
