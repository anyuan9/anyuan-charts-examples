<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import BarRatioNative from './BarRatioNative.vue'
import { chartColor, chartColors } from "@/views/echarts/constant.js";

const barRatioData = ref(Array.from({ length: 8 }, (_, index) => {
  return {
    name: `测试数据${index + 1}`,
    value: Math.floor(Math.random() * 200 + 50),
    colors: chartColors[index],
  }
}))

const barRatioData2 = ref([
  {
    name: '测试数据1',
    value: Math.floor(Math.random() * 200 + 50),
    colors: ['#3F8FF3', '#69D8FC'], // 蓝色
    valueColor: '#6DBBFF',
  },
  {
    name: '测试数据2',
    value: Math.floor(Math.random() * 200 + 50),
    colors: ['#FF5E00', '#FFC293 '], // 橙色
    valueColor: '#FF9B54',
  },
])
</script>

<template>
  <div class="bar-radio-container">

    <BarRatioNative :chart-data="barRatioData" :show-total="true" :show-list="false" :show-ratio="true"
      :show-legend="true" legend-icon="rect" style="height: 226px" />

    <BarRatioNative :chart-data="barRatioData2" :show-total="false" :show-list="true" :show-ratio="false"
      :show-legend="false" :auto-tooltip-loop="false" style="height: 96px; margin-bottom: 8px" />
  </div>
</template>

<style lang="scss" scoped>
.bar-radio-container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  padding: 60px;
  background: rgba(8, 25, 66, 1);
}


.bar-radio-wrap {
  width: 600px;
  height: 240px;
  padding: 12px;
  margin: 0 auto;
}
</style>
