<script setup>
import { ref, onMounted, nextTick } from 'vue'
import ProcessCard from './BarTopProcessCard.vue'

// 图表数据
const chartData = ref([])
async function getData() {
  try {
    // const res = await axios.get("/api/getChartData");
    const res = {
      code: '0',
      data: [
        {
          name: '测试数据',
          value: Math.floor(Math.random() * 20 + 200),
        },
        {
          name: '测试数据2',
          value: Math.floor(Math.random() * 20 + 180),
        },
        {
          name: '测试数据3',
          value: Math.floor(Math.random() * 20 + 160),
        },
        {
          name: '测试数据4',
          value: Math.floor(Math.random() * 20 + 140),
        },
        {
          name: '测试数据5',
          value: Math.floor(Math.random() * 20 + 120),
        },
        {
          name: '测试数据6',
          value: Math.floor(Math.random() * 20 + 100),
        },
      ],
    }
    chartData.value = res.data || []

    const sum = chartData.value.reduce((prev, curr) => prev + curr.value, 0)
    chartData.value.forEach(item => (item.percent = (item.value * 100) / sum))
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  nextTick(() => {
    getData()
  })
})
</script>

<template>
  <div class="chart-container">
    <div v-if="chartData && chartData.length" class="list">
      <ProcessCard v-for="(item, index) in chartData" :key="index" :chart-data="item" class="item"></ProcessCard>
    </div>
    <div v-else class="list">
      <div class="no-data">暂无数据</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 480px;
  background: rgba(8, 25, 66, 1);

  .list {
    height: 100%;
    overflow-y: auto;

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

    .item {
      margin: 12px 0;
      padding: 0 18px;
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
</style>
