<script setup lang="ts">
import { computed } from 'vue'
import SwitchDark from '@/components/SwitchDark.vue'
import SwitchLang from '@/components/SwitchLang.vue'
import TagsView from '@/components/TagsView.vue'
import { useTagsViewStore } from '@/store/tagsView'

defineOptions({
  name: 'Layout',
})

// 获取 tagsView store
const tagsViewStore = useTagsViewStore()

// 获取需要缓存的组件名称列表（用于 KeepAlive）
const cachedViews = computed(() => tagsViewStore.cachedViews)
</script>

<template>
  <div class="layout">
    <div class="sidebar">
      <el-menu router>
        <el-menu-item index="/">
          {{ $t("common.home") }}
        </el-menu-item>
        <el-menu-item index="/about">
          关于
        </el-menu-item>
        <el-menu-item index="/settings">
          设置
        </el-menu-item>
        <el-menu-item index="/login">
          {{ $t("common.login") }}
        </el-menu-item>
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
      <TagsView />
      <el-scrollbar height="calc(100% - 50px - 40px)">
        <router-view v-slot="{ Component }">
          <KeepAlive :include="cachedViews">
            <component :is="Component" />
          </KeepAlive>
        </router-view>
      </el-scrollbar>
    </div>
  </div>
</template>

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
