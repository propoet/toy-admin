<script setup lang="ts">
defineOptions({
  name: 'About',
})
</script>

<template>
  <div style="padding: 20px">
    <el-card>
      <h2 class="text-2xl font-bold text-green-500">关于页面</h2>
      <p class="text-gray-700 dark:text-gray-100">
        这是一个测试页面，用于测试 TagsView 功能。
      </p>
      <input
        type="text"
        placeholder="输入一些内容测试 KeepAlive"
        style="margin-top: 20px; padding: 8px; width: 300px"
      >
    </el-card>
  </div>
</template>

