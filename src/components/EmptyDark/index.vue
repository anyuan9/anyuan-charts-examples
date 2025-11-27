<template>
  <div class="empty-dark" :class="`empty-dark--${size}`">
    <div class="empty-dark__content" :class="{ 'empty-dark__content--row': direction === 'row' }">
      <div class="empty-dark__content__icon">
        <slot name="img">
          <img src="./empty_dark.svg" alt="empty-dark" />
        </slot>
      </div>
      <div class="empty-dark__content__text">
        <p v-if="title" class="empty-dark__title">{{ title }}</p>
        <p v-if="description" class="empty-dark__description">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '暂无数据',
  },
  description: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator(value) {
      return ['xs', 'sm', 'md', 'lg'].includes(value)
    },
  },
  direction: {
    type: String,
    default: 'column',
    validator(value) {
      return ['row', 'column'].includes(value)
    },
  },
})
</script>

<style lang="scss" scoped>
.empty-dark {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: rgba(255, 255, 255, 0.5);
  &--xs {
    .empty-dark__content__icon {
      width: 48px;
      height: 48px;
      margin-bottom: 6px;
    }
    .empty-dark__content__text {
      .empty-dark__title {
        font-size: 12px;
        margin-bottom: 4px;
      }
      .empty-dark__description {
        font-size: 12px;
      }
    }
  }
  &--sm {
    .empty-dark__content__icon {
      width: 60px;
      height: 60px;
      margin-bottom: 8px;
    }
    .empty-dark__content__text {
      .empty-dark__title {
        font-size: 14px;
        margin-bottom: 6px;
      }
      .empty-dark__description {
        font-size: 12px;
      }
    }
  }
  &--lg {
    .empty-dark__content__icon {
      width: 150px;
      height: 150px;
      margin-bottom: 20px;
    }
    .empty-dark__content__text {
      .empty-dark__title {
        font-size: 20px;
        margin-bottom: 16px;
      }
      .empty-dark__description {
        font-size: 16px;
      }
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &--row {
      flex-direction: row;
      align-items: flex-start;
      gap: 6px;
    }
    &__icon {
      width: 100px;
      height: 100px;
      margin-bottom: 16px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &__text {
      text-align: center;
      .empty-dark__title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
      }
      .empty-dark__description {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.4);
      }
    }
  }
}
</style>
