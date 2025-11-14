<template>
  <div>
    <el-card>
      <h2>{{ $t("common.home") }}</h2>
      <p>{{ $t("homePage.welcome") }}</p>
      <input type="text" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Home",
});
</script>
