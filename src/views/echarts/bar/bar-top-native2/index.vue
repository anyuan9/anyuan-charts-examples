<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, nextTick } from "vue";
import BarTopNative from './BarTopNative.vue'

const barTopData = ref([
  {
    name: '测试数据',
    value: Math.floor(Math.random() * 200 + 50),
  },
  {
    name: '测试数据2',
    value: Math.floor(Math.random() * 200 + 50),
  },
  {
    name: '测试数据3',
    value: Math.floor(Math.random() * 200 + 50),
  },
  {
    name: '测试数据4',
    value: Math.floor(Math.random() * 200 + 50),
  },
  {
    name: '测试数据5',
    value: Math.floor(Math.random() * 200 + 50),
  },
  {
    name: '测试数据6',
    value: Math.floor(Math.random() * 200 + 50),
  },
  {
    name: '测试数据7',
    value: Math.floor(Math.random() * 200 + 50),
  },
  {
    name: '测试数据8',
    value: Math.floor(Math.random() * 200 + 50),
  },
])
</script>

<template>
  <div class="bar-top-container">
  <BarTopNative :chart-data="barTopData" style="height: 164px" />

  <BarTopNative :chart-data="barTopData" :grid-column="2" card-direction="vertical" style="height: 220px" />
</div>
</template>

<style lang="scss" scoped>
.bar-top-container {
  width: 600px;
  height: 100%;
  margin: 20px auto;
  background: rgba(8, 25, 66, 1);
}
.bar-top-wrap {
  width: 100%;
  height: 240px;
  padding: 12px;
}
</style>
