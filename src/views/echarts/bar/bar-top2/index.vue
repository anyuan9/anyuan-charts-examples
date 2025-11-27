<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import { useECharts } from '@anyuan/utils';
import { chartColor, chartColors } from "@/views/echarts/constant";

const chartRef = ref(null);
const { setOption, showLoading } = useECharts(chartRef, {
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
  const { title = "", seriesData } = data;
  const yAxisData = seriesData?.map((item) => item.name) || [];
  let maxValue =
    Math.max(...(seriesData?.map((item) => item.value) || [])) * 1.1;
  let maxBarData = Array.from(
    { length: seriesData?.length },
    (v, k) => maxValue,
  );

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
          type: ["line", "bar", "stack"],
        },
      },
    },
    // 标题
    title: {
      text: title || "",
      subtext: "",
      top: "2%",
      left: "center",
      textStyle: {
        align: "center",
        color: "#ffffff",
        fontSize: 20,
      },
    },
    tooltip: {
      show: true,
      trigger: 'item',
      padding: [8, 15],
      backgroundColor: 'rgba(12, 51, 115,0.8)',
      borderColor: 'rgba(3, 11, 44, 0.5)',
      textStyle: {
        color: 'rgba(255, 255, 255, 1)'
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
    xAxis: {
      show: false,
      max: maxValue,
    },
    yAxis: [
      {
        type: "category",
        // 坐标轴的分隔线
        splitLine: {
          show: false,
        },
        // 坐标轴的轴线
        axisLine: {
          show: false,
        },
        // 坐标轴的刻度
        axisTick: {
          show: false,
        },
        // 坐标轴的刻度标签，在此标注左侧的文字信息
        axisLabel: {
          show: true,
          color: "rgba(255, 255, 255, 0.4)",
          fontSize: 14,
          margin: 15,
          rich: {
            icon1: {
              width: 20,
              height: 20,
              fontSize: 12,
              color: "#ffffff",
              align: "center",
              padding: [0, 0],
              backgroundColor: chartColor[0],
              // borderRadius: 10,
            },
            icon2: {
              width: 20,
              height: 20,
              fontSize: 12,
              color: "#ffffff",
              align: "center",
              padding: [0, 0],
              backgroundColor: chartColor[1],
              // borderRadius: 10,
            },
            icon3: {
              width: 20,
              height: 20,
              fontSize: 12,
              color: "#ffffff",
              align: "center",
              padding: [0, 0],
              backgroundColor: chartColor[2],
              // borderRadius: 10,
            },
            icon: {
              width: 20,
              height: 20,
              fontSize: 12,
              color: "#ffffff",
              align: "center",
              padding: [0, 0],
              backgroundColor: chartColor[3],
              // borderRadius: 10,
            },
          },
          formatter: (value, index) => {
            return `{icon${index < 3 ? index + 1 : ""}|${index + 1}}`;
          },
        },
        inverse: true, // 重要属性，倒序
        data: yAxisData || [],
      },
      {
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        axisLabel: {
          color: '#fff',
          fontSize: 12,
          formatter: (value) => {
            return value + '次'; // 用于显示右方的数字
          },
        },
        data: seriesData.map((item) => item.value),
      },
    ],
    series: [
      {
        name: '背景1',
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          color: '#194B72',
          borderRadius: 30,
        },
        // 用于显示右上方的数字
        label: {
          show: true,
          position: 'right',
          offset: [-10, -16],
          color: '#fff',
          fontSize: 12,
          fontWeight: 500,
          align: 'right',
          formatter: (params) => {
            const { dataIndex, name, value } = params;
            return seriesData[dataIndex].value + '次';
          }
        },
        z: 1,
        data: maxBarData,
      },
      {
        name: '',
        type: 'bar',
        barWidth: 10,
        barGap: '-100%',
        // showBackground: true, // 背景2
        // backgroundStyle: {
        //   color: '#194B72',
        // },
        label: {
          show: true,
          position: 'left',
          offset: [10, -16],
          color: '#fff',
          fontWeight: 500,
          align: 'left',
          formatter: (params) => {
            return params.data.name;
          }
        },
        z: 2,
        data: seriesData.map((item, index) => {
          return {
            name: item.name,
            value: item.value,
            itemStyle: {
              borderRadius: [30, 0, 0, 30],
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#0F1F45',
                  },
                  {
                    offset: 1,
                    color: chartColor[index],
                  },
                ],
                global: false, // 缺省为 false
              }
            }
          }
        }),
      },
      {
        name: '顶部白色块',
        type: 'scatter',
        symbol: 'rect',
        symbolSize: [5, 16],
        animationDelay: 500,
        barGap: '-100%',
        itemStyle: {
          color: '#ffffff',
          borderWidth: 1,
          barBorderRadius: [30, 0, 0, 30],
          shadowColor: 'rgba(255, 255, 255, 0.5)',
          shadowBlur: 5,
          opacity: 1,
        },
        emphasis: {
          scale: false,
        },
        tooltip: {
          show: false,
        },
        z: 3,
        data: seriesData,
      },
      // 另一种形式的白点
      // {
      //   name: '白点',
      //   type: 'pictorialBar',
      //   yAxisIndex: 0,
      //   symbol:
      //     'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAZlBMVEUAAABe3uVe3+Vf3uVf3+Zf3uVg3+Zg3+Zf3+Vi4OZh4OZg3+Z86/Bh3+Zi4Odj4Odi4OZ86/B76/B86/Bj4ed56+9x5+xn4umB7/N87PB36e+A7/N+7fF/7vJ/7vJ+7fGA7/OB7/PReX+lAAAAIXRSTlMABQkVDREmIhk3MR10LEFFPHh7cUprXE35h2XnqMLAp+mHAG9cAAAB5ElEQVRIx83WjU7CMBQFYIoiKMqU/XUboHv/l/Tce7t2XamDNSacETEmX86tlK2rx4py150o+MstMBLwWRfHKo6JCVxLnvmFGBjFQ58oF1//sUZhGy/ClSTWObgnL4O+bkeN4nY2okfNMbkRt9/vtxz8InoTsWplJSCzFxPmO8+GpSIByX3YQAuGDWtRKhKjCnxDXhF6Z4yxnZ20Wgko7BMRDmxtSGVaI4kdTIgb+zTYoJQlIMlDlmUFgrcDWWC201qSayqlTkiCddWWeV62VU0YlnpRi9VOKaSUsiyq/N0krwq2Ugt7lVpZl5BfHNiytjagMi+XYp0kCR45hMlivVQrE/uU5pXSrCB5bM6d1t2lOZItMqmliT3q5uVxqxzyW/ccfYLNKx7ZTeykMvNyac2yt2Fbc61MHLSC0rwoxbiNdlQ3GBm1NLHQsHUrtEXppR/ljNpW6DbSCoqlFiVoN6YdaFlgsSFVPs1BdT8OaB5QyQzVcaqWDows/zepxR8ObLglTrdtCRVuRNj4Rrxh+//0ke2f8KVL+Kon3GCSbmsJN9OUW3j6g0Ns+LgCij2u0h+Sghc8mlMPBMgdx5DFh59VmOVHrvmDnoNxCz3J7MFWsMuaLyR089xz/xhlfijvwutR8gv3zk6BLUUeCgAAAABJRU5ErkJggg==',
      //   symbolSize: [40, 40],
      //   symbolOffset: [20, 0],
      //   itemStyle: {
      //       color: '#fff',
      //   },
      //   emphasis: {
      //     scale: false,
      //   },
      //   tooltip: {
      //     show: false,
      //   },
      //   z: 3,
      //   data:
      //     barData.map(item => {
      //       return {
      //         value: item,
      //         symbolPosition: 'end',
      //       }
      //     }) || [],
      // },
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
        seriesData: [
          {
            name: "测试数据",
            value: Math.floor(Math.random() * 20 + 200),
          },
          {
            name: "测试数据2",
            value: Math.floor(Math.random() * 20 + 180),
          },
          {
            name: "测试数据3",
            value: Math.floor(Math.random() * 20 + 160),
          },
          {
            name: "测试数据4",
            value: Math.floor(Math.random() * 20 + 140),
          },
          {
            name: "测试数据5",
            value: Math.floor(Math.random() * 20 + 120),
          },
          {
            name: "测试数据6",
            value: 1,
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
