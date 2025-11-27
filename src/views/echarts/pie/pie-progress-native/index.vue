<script setup>
import { computed, defineProps, ref } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  showTip: {
    type: Boolean,
    default: false
  }
});

const defaultData = {
  name: "进度",
  value: 0,
  percent: 0, // 百分比, 大于0小于100
  color: "#4CAF50",
  icon: "circle", // 'circle' | path
  size: 80
};
// const pieData = computed(() => {
//   return {
//     ...defaultData,
//     ...props.data
//   }
// })
const pieData = ref({
  name: "进度",
  value: 1230,
  percent: 72.3, // 百分比, 大于0小于100
  color: "#17c1ff",
  icon: "circle",
  size: 80
});
const circumference = computed(() => 2 * Math.PI * 35); // 半径改为35
const dashOffset = computed(() => circumference.value * (1 - pieData.value.percent / 100));
</script>

<template>
  <div class="chart-container">
    <!-- 左侧圆环部分 -->
    <div class="progress-ring">
      <svg v-if="pieData.icon === 'circle'" :width="pieData.size" :height="pieData.size" viewBox="0 0 80 80">
        <!-- 大背景圆环 -->
        <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(197,219,255,0.12)" stroke-width="20" />

        <!-- 背景圆环 -->
        <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(197,219,255,0.3)" stroke-width="6" />

        <!-- 进度圆环 -->
        <circle
          cx="40" cy="40" r="30" fill="none" :stroke="pieData.color" stroke-width="6" stroke-linecap="round"
          :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset" transform="rotate(-90 40 40)"
        />

        <!-- 中心百分比 -->
        <text v-if="showTip" x="40" y="45" text-anchor="middle" font-size="20" font-weight="bold" fill="#fff">
          {{ pieData.percent }}%
        </text>
      </svg>
      <!-- 显示图片图标 -->
      <div v-else-if="pieData.icon">
        <img :src="pieData.icon" :style="{ width: `${pieData.size}px`, height: `${pieData.size}px` }">
      </div>
    </div>

    <!-- 右侧文本部分 -->
    <div class="progress-info">
      <div class="progress-name ellipsis">
        {{ pieData.name }}
      </div>
      <div class="progress-value ellipsis" :style="{ color: pieData.color }">
        {{ pieData.value }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  height: 480px;
  background-color: rgba(8, 25, 66, 1);
  font-family: MicrosoftYaHeiUI;
  font-size: 24px;
  color: #ffffff;
  font-weight: 400;
}

.progress-ring {
  flex-shrink: 0;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .progress-name {
    font-size: 24px;
  }

  .progress-value {
    font-family: DIN-Medium;
    font-size: 32px;
    color: #ff90a7;
    font-weight: 400;
  }
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
