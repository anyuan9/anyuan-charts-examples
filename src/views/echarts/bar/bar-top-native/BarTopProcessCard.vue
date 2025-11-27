<script setup>
const props = defineProps({
  chartData: {
    type: Object,
    default: () => {
      return { name: '', value: 0, percent: 0 }
    },
  },
})
</script>

<template>
  <div class="hik-chart-card">
    <div class="card-name ellipsis">{{ chartData.name }}</div>
    <div class="card-content-outer">
      <div class="card-content">
        <div class="card-bar">
          <div class="card-bar-outer" :style="{ width: chartData.percent + '%' }">
            <div class="card-line"></div>
            <div class="card-bar-inner"></div>
          </div>
        </div>
        <div class="card-value">{{ chartData.value }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes radar-beam {
  0% {
    transform: translateX(-100%);
  }
  80% {
    transform: translateX(0);
  }
}

.hik-chart-card {
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  line-height: 36px;
  background-size: 100% 100%;
  .card-name {
    width: 100px;
    height:  36px;
    padding: 0 6px;
    color: #ffffff;
    font-size: 16px;
    text-align: center;
    background-image: linear-gradient(90deg, #034093 0%, #033f94 100%);
    border-right: 1px solid rgba(20, 249, 239, 0.53);
    border-left: 1px solid rgba(20, 249, 239, 0.53);
  }
  .card-content-outer {
    flex: 1;
    height:  100%;
    margin-left: 6px;
    padding: 0 6px;
    background: repeating-linear-gradient(30deg, #06498e, #06498e 0.3125rem, #03397d 0, #03397d 0.375rem);
  }
  .card-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    overflow: hidden;
    background: linear-gradient(90deg, transparent, #32c7ff33);
  }
  .card-bar {
    width: 100%;
    height: 12px;
    background-image: linear-gradient(
      90deg,
      rgba(0, 47, 89, 0.5) 35%,
      transparent 35%,
      transparent 50%,
      rgba(0, 47, 89, 0.5) 50%,
      rgba(0, 47, 89, 0.5) 85%,
      transparent 85%,
      transparent 100%
    );
    background-repeat: repeat;
    background-size: 10px 100%;
    .card-bar-outer {
      position: relative;
      height:  100%;
      background-image: linear-gradient(90deg, rgba(0, 130, 255, 1) 0%, rgba(50, 246, 255, 1) 100%);
      .card-line {
        position: absolute;
        top: -50%;
        bottom: -50%;
        // height:  100%;
        width: 100%;
        background: linear-gradient(90deg, transparent 43%, rgba(50, 246, 255, 0.8) 200%);
        border-right: 1px solid rgba(50, 246, 255, 0.85);
        transform: translateX(-100%);
        animation: radar-beam 4s infinite;
        animation-timing-function: cubic-bezier(0.3, 0, 0.43, 0.7);
        animation-delay: 1.5s;
      }
      .card-bar-inner {
        position: relative;
        width: 100%;
        height:  100%;
        background-image: linear-gradient(
          90deg,
          transparent 35%,
          rgba(0, 47, 89, 1) 35%,
          rgba(0, 47, 89, 1) 50%,
          transparent 50%,
          transparent 85%,
          rgba(0, 47, 89, 1) 85%,
          rgba(0, 47, 89, 1) 100%
        );
        background-repeat: repeat;
        background-size: 10px 100%;
      }
      .card-bar-inner::after {
        position: absolute;
        top: -2px;
        right: 0;
        width: 2px;
        height: 16px;
        border-top: 1px solid #ffffff;
        border-right: 1px solid #ffffff;
        border-bottom: 1px solid #ffffff;
        content: '';
      }
    }
  }
  .card-value {
    width: 40px;
    padding-right: 6px;
    padding-left: 6px;
    color: #ffffff;
    font-size: 16px;
    font-family: 'DINAlternate-Bold';
    text-align: right;
  }

  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
