<template>
  <div>
    <el-card>
      <h2 class="text-2xl font-bold text-blue-500">
        {{ $t("common.home") }}
      </h2>
      <p class="text-gray-700 dark:text-gray-100">
        {{ $t("homePage.welcome") }}
      </p>
      <input type="text" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Home",
});
</script>
