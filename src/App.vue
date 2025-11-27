<script lang="ts" setup>
import zhCn from "element-plus/es/locale/lang/zh-cn"; // Element Plus 中文包
import { ref } from "vue";

// 缓存的路由组件名称数组
const keepAliveComponents = ref(["echarts-examples"]);
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="keepAliveComponents">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </router-view>
  </el-config-provider>
</template>
