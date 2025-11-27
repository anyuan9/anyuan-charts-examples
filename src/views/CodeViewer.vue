<script setup>
import { vue } from "@codemirror/lang-vue";
import { oneDark } from "@codemirror/theme-one-dark";
import { useClipboard } from "@vueuse/core";
import { computed, defineAsyncComponent, onMounted, reactive, shallowRef } from "vue";
import CodeMirror from "vue-codemirror6";
import { useRoute, useRouter } from "vue-router";

// 从路由参数获取组件路径
const route = useRoute();
const router = useRouter();
const pathQuery = computed(() => {
  return {
    component: route.query.component,
    name: route.query.name,
    title: route.query.title
  };
});
function handleBack() {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    // 没有历史记录时，跳转到首页
    const fallbackRoute = { path: "/" };
    router.push(fallbackRoute);
  }
}

const previewState = reactive({ status: "loading", error: null });
const sourceState = reactive({ state: "loading", error: null, code: "" });

const dynamicComponent = shallowRef(null);
const extensions = [
  vue(),
  // html(),
  // javascript(),
  oneDark
];

const { copy, isSupported } = useClipboard();
async function handleCopy(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  if (!isSupported.value) {
    console.log("浏览器不支持剪贴板功能");
    return;
  }

  try {
    await copy(sourceState.code);
  } catch (err) {
    console.error("复制错误:", err);
  }
}

onMounted(async () => {
  if (!pathQuery.value.component) {
    console.log("未指定组件路径");
    return;
  }

  try {
    previewState.status = "loading";
    const modules = import.meta.glob("./**/index.vue");
    const compPath = String(pathQuery.value.component).replace(/^\//, "");
    const key = `./${compPath}/index.vue`;
    dynamicComponent.value = defineAsyncComponent(() => modules[key] ? modules[key]() : Promise.reject(new Error("not found")));
    previewState.status = "success";
  } catch (err) {
    previewState.status = "error";
    previewState.error = `组件加载失败: ${err.message}`;
  }

  try {
    sourceState.state = "loading";
    const rawModules = import.meta.glob("./**/index.vue", { as: "raw" });
    const compPath = String(pathQuery.value.component).replace(/^\//, "");
    const key = `./${compPath}/index.vue`;
    const raw = rawModules[key] ? await rawModules[key]() : "";
    sourceState.code = raw || "";

    sourceState.state = "success";
  } catch (err) {
    sourceState.state = "error";
    sourceState.error = `源代码加载失败: ${err.message}`;
  }
});
</script>

<template>
  <div class="code-viewer-container">
    <!-- 左侧：组件预览 -->
    <div class="preview-wrap">
      <div class="breadcrumb">
        <div class="icon" @click="handleBack">
          <svg>
            <polyline
              stroke-width="4"
              fill="transparent"
              stroke="#1dc1f5"
              points="11, 0 2, 10 11, 20"
            />
            <polyline
              stroke-width="2"
              fill="transparent"
              stroke="#1dc1f5"
              points="19, 0 10, 10 19, 20"
            />
          </svg>
        </div>
        <h2 class="title">
          {{ pathQuery.title }}
        </h2>
        <h3 class="name">
          {{ pathQuery.name }}
        </h3>
      </div>
      <div v-if="previewState.status === 'loading'" class="status-message loading">
        加载组件中...
      </div>
      <div v-else-if="previewState.status === 'error'" class="status-message error">
        {{ previewState.error }}
      </div>
      <component v-else :is="dynamicComponent" />
    </div>

    <!-- 右侧：源代码展示 -->
    <div class="source-wrap">
      <div>
        <h2>源代码</h2>
        <button class="copy-btn" @click="handleCopy">
          复制代码
        </button>
      </div>
      <div v-if="sourceState.state === 'loading'" class="status-message">
        加载源代码中...
      </div>
      <div v-else-if="sourceState.state === 'error'" class="status-message error">
        {{ sourceState.error }}
      </div>
      <CodeMirror v-else v-model="sourceState.code" :extensions="extensions" readonly />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.code-viewer-container {
  display: flex;
  height: 100vh;
}

.preview-wrap,
.source-wrap {
  position: relative;
  flex: 1;
  height: 100%;
  padding: 20px;
  overflow: auto;
}

.source-wrap {
  border-left: 1px solid #eee;
}

.copy-btn {
  position: absolute;
  top: 42px;
  right: 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;

  .icon {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: rgba(0, 0, 0, 0.65);
    // border: 1px solid rgba(0, 0, 0, 0.65);
    // border-radius: 50%;
    cursor: pointer;
  }

  .icon:hover {
    // color: #ec5153;
    // border-color: #ec5153;
  }

  .title {
    margin-left: 8px;
    margin-right: 8px;
  }

  .name {
    color: #666;
  }
}

.status-message {
  padding: 20px;
  text-align: center;
}
</style>
