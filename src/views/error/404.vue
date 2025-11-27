<script setup>
import ErrorPage from "./components/ErrorPage.vue";
import Svg404 from "./images/404.svg?component"; // vite-svg-loader 插件的功能
</script>

<template>
  <ErrorPage>
    <Svg404 />
  </ErrorPage>
</template>
