// core
import { createApp } from "vue";
import { store } from "@/store";
import { router } from "@/router";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "default-passive-events"; // 解决非被动事件监听警告，提升滚动性能。解决 [Violation] Added non-passive event listener to a scroll-blocking ‘wheel‘ event 警告

// css
import "normalize.css";
import "nprogress/nprogress.css";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/assets/styles/index.scss";

// 创建应用实例
const app = createApp(App);

// 安装
app.use(ElementPlus);
app.use(store).use(router);

// router 准备就绪后挂载应用
router.isReady().then(() => {
  app.mount("#app");
});
