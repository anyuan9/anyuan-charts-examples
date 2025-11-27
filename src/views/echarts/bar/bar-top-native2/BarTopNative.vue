<template>
  <div class="bar-top-wrap">
    <div v-if="!chartData || !chartData.length" class="chart-list">
      <empty-dark size="sm" />
    </div>
    <div v-else class="chart-list" :style="{ gridTemplateColumns: `repeat(${gridColumn}, 1fr)` }">
      <div v-for="(item, index) in chartData" :key="index" class="chart-card" :class="[cardDirection]">
        <div class="card-left">
          <div class="card-index">
            <div class="card-index-inner">{{ index + 1 }}</div>
          </div>
          <div v-if="item.icon" class="card-icon">
            <img :src="item.icon" alt="" />
          </div>
          <div class="card-name ellipsis">{{ item.name }}</div>
        </div>

        <div class="card-center">
          <div class="card-content">
            <div class="card-bar">
              <div class="card-bar-inner" :style="{ width: item.percent + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="card-right">
          <div class="card-value ellipsis">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import EmptyDark from '@/components/EmptyDark/index.vue'

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [], // [{icon, name, value}]
  },
  gridColumn: {
    type: Number,
    default: 1,
  },
  cardDirection: {
    type: String,
    default: 'horizontal', // horizontal, vertical
  },
})

// 图表数据
const chartData = ref([])
watch(
  () => props.chartData,
  val => {
    try {
      chartData.value = val || []

      const sum = chartData.value.reduce((prev, curr) => prev + curr.value, 0)
      chartData.value.forEach(item => (item.percent = (item.value * 100) / (sum || 1)))
    } catch (err) {
      console.error(err)
    }
  },
  { deep: true, immediate: true },
)
</script>

<style lang="scss" scoped>
.bar-top-wrap {
  width: 100%;
  height: 100%;
  min-width: 400px;
  max-width: 100%;
  overflow: hidden;

  .chart-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 4px 8px;
    width: 100%;
    height: 100%;
    overflow-y: auto;

    .chart-card {
      // margin-bottom: 8px;
    }

    &::-webkit-scrollbar {
      width: 6px;
      background: #0a3c55;
      border: 1px solid #18719e;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #12638b;
      border: 1px solid #18719e;
      border-radius: 3px;
    }
  }

  .no-data {
    width: 100%;
    height: 100%;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    padding-top: 15%;
  }
}

.chart-card {
  display: grid;
  grid-template-columns: 160px minmax(120px, 1fr) 60px;
  grid-template-areas: 'a b c';
  place-self: center;
  gap: 4px;
  width: 100%;
  padding: 0 8px 0 4px;
  background-image: linear-gradient(90deg, rgba(39, 85, 166, 0.3) 0%, rgba(76, 160, 255, 0.1) 100%);

  &.vertical {
    grid-template-columns: minmax(120px, 1fr) 60px;
    grid-template-areas:
      'a c'
      'b b';
  }

  .card-left,
  .card-center,
  .card-right {
    display: flex;
    align-items: center;
    height: 24px;
    overflow: hidden;
  }

  .card-left {
    grid-area: a;
  }

  .card-center {
    grid-area: b;
    height: 18px;
  }

  .card-right {
    grid-area: c;
  }

  .card-index {
    position: relative;
    margin-right: 4px;
    text-align: center;
    font-size: 12px;
    color: #78c5ff;
    padding: 1px;
    border-radius: 50%;
    background-image: linear-gradient(0deg, #41a6ff, rgba(181, 211, 255, 1), transparent);

    .card-index-inner {
      width: 18px;
      height: 18px;
      line-height: 18px;
      border-radius: 50%;
      background: rgb(20 70 128); // 圆形内部背景色
    }
  }

  .card-icon {
    width: 18px;
    height: 18px;
    margin-right: 4px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .card-name {
    flex: 1;
    font-size: 14px;
    color: #ffffff;
  }

  .card-content {
    position: relative;
    width: 100%;
  }

  .card-bar {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background-color: rgba(181, 211, 255, 0.4);

    .card-bar-inner {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 3px;
      background-image: linear-gradient(270deg, #41a6ff 0%, rgba(71, 169, 255, 0.2) 97%);
    }

    .card-bar-inner::after {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 2px 4px rgb(255 255 255 / 20%);
    }
  }

  .card-value {
    width: 100%;
    font-family: HIKLDH-Number-CondensedMedium;
    font-size: 14px;
    color: #6dbbff;
    text-align: right;
    font-weight: 500;
  }

  &:first-child {
    .card-index {
      color: #ffae4a;
      background-image: linear-gradient(0deg, #ffae4a, rgba(255, 148, 71, 0.6), transparent);
    }

    .card-bar-inner {
      background-image: linear-gradient(270deg, #ff9041 0%, rgba(255, 148, 71, 0.2) 98%);
    }
  }

  &:nth-child(2),
  &:nth-child(3) {
    .card-index {
      color: #c7d2e6;
      background-image: linear-gradient(0deg, #a8b4d1, rgba(168, 180, 209, 0.6), transparent);
    }

    .card-bar-inner {
      background-image: linear-gradient(270deg, #a8b4d1 0%, rgba(168, 180, 209, 0.2) 98%);
    }
  }
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
