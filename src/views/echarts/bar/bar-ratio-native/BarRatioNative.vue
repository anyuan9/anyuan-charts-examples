<script setup>
import { computed, defineProps, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { chartColor, chartColors } from "@/views/echarts/constant";

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [] // [{name, value, ratio, colors, valueColor}]
  },
  // 是否显示总数
  showTotal: {
    type: Boolean,
    default: true
  },
  // 是否显示每一项的名字和值（对于只有两项数据时，有用）
  showList: {
    type: Boolean,
    default: true
  },
  // 是否显示百分比
  showRatio: {
    type: Boolean,
    default: true
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
  },
  // 是否自动轮播tooltip
  autoTooltipLoop: {
    type: Boolean,
    default: true
  },
  legendIcon: {
    type: String,
    default: "rect" // circle, rect
  }
});

const totalData = computed(() => {
  const total = props.chartData?.reduce((prev, curr) => prev + curr.value, 0);
  return {
    name: "总数",
    value: total || 0
  };
});
const seriesData = computed(() => {
  const total = props.chartData?.reduce((prev, curr) => prev + curr.value, 0);

  return props.chartData.map((item, index) => {
    return {
      name: item.name,
      value: item.value,
      ratio: item.ratio ?? `${((item.value / (total || 1)) * 100).toFixed(1)}%`,
      colors: item.colors || chartColors[index % chartColors.length],
      valueColor: item.valueColor || chartColor[index % chartColors.length]
    };
  });
});

watch(
  () => props.chartData,
  (newVal) => {
    nextTick(() => {
      props.autoTooltipLoop && handleInterval();
    });
  },
  { deep: true, immediate: true }
);

const activeIndex = ref(-1);
let timer = null;
function handleInterval() {
  activeIndex.value = 0;
  timer && clearInterval(timer);
  if (props.chartData.length) {
    timer = setInterval(() => {
      if (activeIndex.value === props.chartData.length - 1) activeIndex.value = 0;
      else activeIndex.value++;
    }, 1500);
  }
}

onBeforeUnmount(() => {
  timer && clearInterval(timer);
});
</script>

<template>
  <div class="bar-radio-wrap">
    <section class="main-content">
      <!-- 显示总数 -->
      <div v-if="showTotal" class="row row-total">
        <span class="name">{{ totalData.name }}</span>
        <span class="value">{{ totalData.value }}</span>
      </div>
      <!-- 显示每一项的名字和值（对于只有两项数据时，有用） -->
      <div v-if="showList" class="row row-title">
        <div v-for="(item, index) in seriesData" :key="index" class="row-item title">
          <span class="name">{{ item.name }}</span>
          <span class="value" :style="`color: ${item.valueColor};`">{{ item.value }}</span>
        </div>
      </div>
      <!-- 百分比条 -->
      <div class="row row-percent">
        <span
          v-for="(item, index) in seriesData" :key="index" class="row-item percent"
          :class="{ active: activeIndex === index }" :style="{
            width: item.ratio,
            backgroundImage: item.colors?.length > 1 ? `linear-gradient(270deg, ${item.colors[1]} 0%, ${item.colors[0]} 100%)` : '',
            boxShadow: item.colors?.length ? `0px 0px 6px 0px ${item.colors[0]}` : '',
          }"
        />
      </div>
      <!-- 百分比数字 -->
      <div v-if="showRatio" class="row row-ratio">
        <span v-for="(item, index) in seriesData" :key="index" :style="{ width: item.ratio }" class="row-item ratio">
          {{ item.ratio }}
        </span>
      </div>
    </section>

    <!-- 图例 -->
    <section v-if="showLegend" class="legend-content">
      <div
        v-for="(item, index) in seriesData" :key="index" class="legend-item"
        :class="{ active: activeIndex === index }"
      >
        <div
          class="icon" :class="[legendIcon]" :style="{
            'background-image':
              legendIcon === 'rect' && item.colors?.length > 1
                ? `linear-gradient(90deg, ${item.colors[0]} 0%, ${item.colors[1]} 100%)`
                : '',
          }"
        />
        <div class="label">
          {{ item.name }}
        </div>
        <div class="num-content">
          <span class="num" :style="`color: ${item.valueColor};`">{{ item.value }}</span>
          <span class="divide" />
          <span class="ratio">{{ item.ratio }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.bar-radio-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  font-size: 14px;

  .value {
    font-family: HIKLDH-Number-CondensedMedium;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }

  .main-content {
    .row {
      display: flex;
      align-items: center;

      .row-item {
        overflow: hidden;
        white-space: nowrap;
        text-align: left;
        text-overflow: ellipsis;
      }

      .row-item:last-child {
        text-align: right;
      }

      .row-item + .row-item {
        margin-left: 2px;
      }
    }

    .row-total {
      color: rgba(255, 255, 255, 0.8);
      justify-content: space-between;

      .value {
        font-family: HIKLDH-Number-CondensedMedium;
        font-size: 22px;
        color: #ffffff;
        text-align: right;
        line-height: 26px;
        font-weight: 500;
      }
    }

    .row-title {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px 12px;

      .title {
        .name {
          padding-right: 6px;
          font-size: 14px;
        }

        .value {
          font-weight: 500;
          font-size: 16px;
        }

        .unit {
          color: rgba($color: #d8e5ff, $alpha: 0.6);
          font-size: 14px;
        }
      }
    }

    .row-percent {
      width: 100%;
      height: 18px;
      margin: 6px 0;
      padding: 4px;
      background: rgba(181, 211, 255, 0.2);
      border: 1px solid rgba(89, 173, 255, 0.3);
      border-radius: 6px;

      .percent {
        height: 6px;
        border-radius: 3px;
        transition: all 0.5s;

        &.active {
          height: 8px;
        }
      }
    }

    .row-ratio {
      margin-bottom: 8px;

      .ratio {
        color: rgba($color: #d8e5ff, $alpha: 0.8);
        font-weight: 500;
      }
    }
  }

  .legend-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 12px;
    margin-top: 6px;

    .legend-item {
      display: flex;
      align-items: center;
      transition: all 0.5s;

      &.active {
        color: #ffffff;
        background: rgba(96, 159, 255, 0.2);

        .num-content {
          color: #ffffff;
        }
      }

      .icon.circle {
        width: 10px;
        height: 10px;
        border: 2px solid;
        border-radius: 50%;
        margin-right: 4px;
      }

      .icon.rect {
        width: 3px;
        height: 14px;
        border-radius: 3px;
        margin-right: 4px;
        background-image: linear-gradient(90deg, #54d7ff 0%, #37a8ff 100%);
      }

      .label {
        box-sizing: border-box;
      }

      .num-content {
        display: flex;
        flex: 1;
        text-align: right;
        overflow: hidden;

        .num {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          box-sizing: border-box;
        }

        .divide {
          width: 1px;
          height: 16px;
          margin: 0 8px;
          // background-color: rgba(255, 255, 255, 0.5);
          background-image: linear-gradient(
            180deg,
            rgba(76, 160, 255, 0.2) 0%,
            rgb(49 124 255) 50%,
            rgba(76, 160, 255, 0.2) 100%
          );
        }

        .ratio {
          display: inline-block;
          text-align: right;
          width: 3em;
        }
      }
    }
  }
}
</style>
