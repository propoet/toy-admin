<template>
  <div class="layout">
    <div class="sidebar">
      <el-menu router>
        <el-menu-item index="/">{{ $t("common.home") }}</el-menu-item>
        <el-menu-item index="/login">{{ $t("common.login") }}</el-menu-item>
      </el-menu>
    </div>
    <div class="main">
      <div class="header">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>{{ $t("common.home") }}</span>
          <div style="display: flex; gap: 10px">
            <SwitchLang />
            <SwitchDark />
          </div>
        </div>
      </div>
      <el-scrollbar height="calc(100% - 50px)">
        <router-view v-slot="{ Component }">
          <KeepAlive include="Home">
            <component :is="Component" />
          </KeepAlive>
        </router-view>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup lang="ts">
import SwitchLang from "@/components/SwitchLang.vue";
import SwitchDark from "@/components/SwitchDark.vue";
defineOptions({
  name: "Layout",
});
</script>
<style scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: row;
}
.sidebar {
  width: 200px;
  background-color: #2d3a4b;
  color: white;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.header {
  height: 50px;
  background: #409eff;
  color: white;
  text-align: center;
  line-height: 50px;
}
</style>
