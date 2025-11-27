<script setup>
import { ref } from 'vue'

const dataList = ref(Array.from({ length: 10 }, (_, index) => ({
  name: '测试数据' + index,
  count: Math.floor(Math.random() * 200 + 50),
})))
const sum = dataList.value.reduce((prev, curr) => prev + curr.count, 0)
dataList.value.forEach(item => (item.ratio = (item.count * 100) / sum))
</script>

<template>
  <div class="rank-wrap">
    <div class="data-list">
      <div v-for="(item, index) in dataList" :key="index" class="list-item" :class="{ 'top': index < 3 }">
        <div class="item-index">{{ index + 1 }}</div>
        <div class="item-name ellipsis">{{ item.name }}</div>
        <div class="item-bar">
          <div class="bar-left" :style="{ width: `${item.ratio}%` }">
            <div class="bar-inner"></div>
          </div>
          <div class="bar-right">
            <div class="bar-line"></div>
          </div>
        </div>
        <div class="item-value ellipsis">{{ item.count }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$item-content-height: 32px;
$item-bar-height: 12px;
$item-color-top: #f37153;
$item-color-nor: #48A4FF;

.rank-wrap {
  width: 100%;
  height: 480px;
  padding: 14px 16px;
  background: rgba(8, 25, 66, 1);

  .data-list {
    width: 100%;
    height: 100%;
    color: #cceeff;
    font-weight: 400;
    font-size: 14px;
    font-family: MicrosoftYaHei;
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

    .list-item {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      padding: 4px 12px;
      padding-left: 0;
      background-color: rgba(0, 212, 255, 0.14);

      .item-index {
        position: relative;
        width: $item-content-height;
        height: $item-content-height;
        line-height: $item-content-height;
        text-align: center;
        margin: 0 4px;
        color: #daffe8;
        font-weight: 700;
        font-size: 14px;
        font-family: DINAlternate-Bold;
        background: $item-color-nor;

        &::before {
          content: '';
          position: absolute;
          left: -4px;
          top: -2px;
          bottom: -2px;
          width: 10px;
          border: 1px solid $item-color-nor;
          border-right: none;
        }
      }

      .item-name {
        width: $item-content-height * 2.5;
        height: $item-content-height;
        line-height: $item-content-height;
        padding: 0 6px;
        margin-right: 6px;
        border: 1px solid #00aaff;
        background: rgba(0, 111, 167, 0.75);
      }

      .item-bar {
        display: flex;
        align-items: center;
        flex: auto;
        min-width: 0;
        height: $item-bar-height;

        .bar-left {
          display: flex;
          align-items: center;
          flex: none;
          height: 100%;

          .bar-inner {
            position: relative;
            display: flex;
            flex-grow: 1;
            align-items: center;
            height: $item-bar-height;
            background-image: linear-gradient(to right, rgba(255, 85, 0, 0.1) 0%, $item-color-nor 100%);
          }

          .bar-inner::before {
            content: '';
            position: absolute;
            top: -1px;
            right: 0;
            width: $item-bar-height * 2;
            height: $item-bar-height + 2px;
            background-image: linear-gradient(90deg, rgba(255, 178, 25, 0) 0%, $item-color-nor 100%);
          }

          .bar-inner::after {
            content: '';
            position: absolute;
            right: -2px;
            width: 1px;
            height: $item-bar-height + 2px;
            background: $item-color-nor;
          }
        }

        .bar-right {
          position: relative;
          display: flex;
          align-items: center;
          flex: auto;
          min-width: 0;
          height: 100%;

          .bar-line {
            width: 100%;
            height: 1.6px;
            background-color: rgba(0, 170, 255, 0.5);
          }

          &:after {
            content: '';
            position: absolute;
            top: -1px;
            bottom: -1px;
            right: 0;
            width: 4px;
            border: 1px solid rgba(0, 170, 255, 0.5);
            border-left: none;
          }
        }
      }

      .item-value {
        width: $item-content-height * 1.5;
        height: $item-content-height;
        line-height: $item-content-height;
        text-align: right;
        font-size: 16px;
        font-weight: bold;
        margin-left: 6px;
      }
    }

    .list-item+.list-item {
      margin-top: 12px;
    }

    .list-item.top {
      .item-index {
        background-color: $item-color-top;

        &::before {
          border-color: $item-color-top;
        }
      }
    }
  }

  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
