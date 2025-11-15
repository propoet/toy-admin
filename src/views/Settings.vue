<script setup lang="ts">
defineOptions({
  name: 'Settings',
})
</script>

<template>
  <div style="padding: 20px">
    <el-card>
      <h2 class="text-2xl font-bold text-purple-500">设置页面</h2>
      <p class="text-gray-700 dark:text-gray-100">
        这是另一个测试页面，用于测试 TagsView 功能。
      </p>
      <textarea
        placeholder="输入一些内容测试 KeepAlive"
        style="margin-top: 20px; padding: 8px; width: 300px; height: 100px"
      />
    </el-card>
  </div>
</template>

