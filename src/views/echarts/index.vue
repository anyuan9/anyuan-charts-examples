<script setup>
import { useRouter } from "vue-router";
import { dynamicRoutes } from "@/router";

// 添加组件名称（必须与keep-alive的include匹配）
defineOptions({
  name: 'echarts-examples'
});

const chartGroups =
  dynamicRoutes?.find((item) => item.name === "echarts")?.children || [];

function getImageUrl(path, childPath) {
  path = `./${path}/${childPath}/preview.png`;
  return new URL(path, import.meta.url).href;
}

const router = useRouter();
function goToChart(item, _item) {
  const path = `/echarts/${item.path}/${_item.path}`;
  router.push({
    // path: path,
    path: 'code-viewer',
    query: {
      component: path, // 相对于src的路径
      name: _item?.name || '',
      title: _item?.meta?.title || '',
    }
  });
}
</script>

<template>
  <div class="example-panel">
    <el-row v-for="(item, index) in chartGroups" :key="item.name" class="example-group">
      <el-col :span="24" class="example-header">
        <span>{{ item.meta?.title }}</span>
        <span v-if="item.children?.length">（{{item.children?.length}}）</span>
      </el-col>
      <el-col v-for="_item in item.children" :key="_item.name" :span="4" class="example-list">
        <div class="example-list-item" @click="goToChart(item, _item)">
          <img :src="getImageUrl(item.path, _item.path)" alt="" class="example-link" />
          <span class="example-title">{{ _item.meta?.title }}</span>
          <span class="example-subtitle">{{ _item.name }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.example-panel {
  margin: 30px 15px 30px 15px;
}

.example-group {
  .example-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e1e5f2;
    font-weight: normal;
    color: #464646;
    font-size: 20px;
  }

  .example-list {}
}

.example-list-item {
  width: 100%;
  height: 100%;
  max-width: 350px;
  padding: 6%;
  margin-bottom: 30px;
  position: relative;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .example-link {
    width: 100%;
    height: calc(100% - 74px);
    max-height: 300px;
    border-radius: 5px;
    box-shadow: 0 0 20px rgb(0 0 0 / 5%);
    overflow: hidden;
    display: block;
  }

  .example-title {
    color: #293c55;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 10px 10px 2px 10px;
    margin: 0;
    display: block;
    font-size: 14px;
    text-align: left;
  }

  .example-subtitle {
    font-size: 12px;
    text-align: left;
    color: #aaa;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 3px 0 0 0;
    padding-left: 10px;
  }
}
</style>
