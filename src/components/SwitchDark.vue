<template>
  <el-switch
    v-model="isDark"
    active-value="dark"
    inactive-value="light"
    @change="toggleDark"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
defineOptions({
  name: "SwitchDark",
});

const isDark = ref<"dark" | "light">("light");

// 初始化主题
onMounted(() => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = prefersDark ? "dark" : "light";
  isDark.value = theme;
  applyTheme(theme);
});

function toggleDark() {
  applyTheme(isDark.value);
}

function applyTheme(theme: "dark" | "light") {
  const html = document.documentElement;
  if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
}
</script>
