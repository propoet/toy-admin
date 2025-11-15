<script setup lang="ts">
import type { TagView } from '@/store/tagsView'
import { Close } from '@element-plus/icons-vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagsViewStore } from '@/store/tagsView'

defineOptions({
  name: 'TagsView',
})

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()

// 获取已访问的标签列表
const visitedViews = computed(() => tagsViewStore.visitedViews)

// 右键菜单相关
const contextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const selectedTag = ref<TagView | null>(null)

/**
 * 判断标签是否激活
 */
function isActive(tag: TagView) {
  return tag.path === route.path
}

/**
 * 点击标签切换路由
 */
function handleTagClick(tag: TagView) {
  router.push(tag.path)
}

/**
 * 关闭标签
 */
function handleClose(tag: TagView, e: MouseEvent) {
  e.stopPropagation() // 阻止事件冒泡

  // 如果是固定标签，不允许关闭
  if (tag.affix)
    return

  // 如果关闭的是当前标签，先找到跳转目标
  if (isActive(tag)) {
    const index = visitedViews.value.findIndex(v => v.name === tag.name)
    const latestView = visitedViews.value[index - 1] || visitedViews.value[index + 1] || visitedViews.value[0]

    // 删除标签
    tagsViewStore.delView(tag)

    // 跳转到目标标签或首页
    if (latestView && latestView.name !== tag.name) {
      router.push(latestView.path)
    }
    else {
      // 如果没有其他标签，跳转到首页
      router.push('/')
    }
  }
  else {
    // 如果关闭的不是当前标签，直接删除
    tagsViewStore.delView(tag)
  }
}

/**
 * 右键菜单 - 关闭当前标签
 */
function handleCloseCurrent() {
  if (selectedTag.value) {
    handleClose(selectedTag.value, new MouseEvent('click'))
  }
  contextMenuVisible.value = false
}

/**
 * 右键菜单 - 关闭其他标签
 */
function handleCloseOthers() {
  if (selectedTag.value) {
    tagsViewStore.delOthersViews(route)
    // 如果关闭其他后，当前标签不在列表中，跳转到选中的标签
    const exists = tagsViewStore.visitedViews.some(v => v.path === route.path)
    if (!exists && selectedTag.value) {
      router.push(selectedTag.value.path)
    }
  }
  contextMenuVisible.value = false
}

/**
 * 右键菜单 - 关闭所有标签
 */
function handleCloseAll() {
  tagsViewStore.delAllViews()
  // 跳转到首页或第一个固定标签
  const firstView = tagsViewStore.visitedViews[0]
  if (firstView) {
    router.push(firstView.path)
  }
  else {
    router.push('/')
  }
  contextMenuVisible.value = false
}

/**
 * 显示右键菜单
 */
function showContextMenu(tag: TagView, e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()

  selectedTag.value = tag
  contextMenuX.value = e.clientX
  contextMenuY.value = e.clientY
  contextMenuVisible.value = true
}

/**
 * 点击其他地方关闭右键菜单
 */
function handleClickOutside() {
  contextMenuVisible.value = false
}

// 监听路由变化，确保当前标签高亮
watch(
  () => route.path,
  () => {
    // 路由变化时，可以在这里做一些处理
  },
)

onMounted(() => {
  // 点击页面其他地方关闭右键菜单
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="tags-view-container">
    <el-scrollbar class="tags-view-wrapper">
      <div class="tags-view-list">
        <transition-group name="tag-list" tag="div" class="tags-list">
          <span
            v-for="tag in visitedViews"
            :key="tag.name"
            class="tags-view-item"
            :class="{ active: isActive(tag) }"
            @click="handleTagClick(tag)"
            @contextmenu="showContextMenu(tag, $event)"
          >
            <span class="tag-title">{{ tag.title }}</span>
            <el-icon
              v-if="!tag.affix"
              class="tag-close-icon"
              @click.stop="handleClose(tag, $event)"
            >
              <Close />
            </el-icon>
          </span>
        </transition-group>
      </div>
    </el-scrollbar>

    <!-- 右键菜单 -->
    <teleport to="body">
      <div
        v-if="contextMenuVisible"
        class="context-menu"
        :style="{
          left: `${contextMenuX}px`,
          top: `${contextMenuY}px`,
        }"
        @click.stop
      >
        <div
          class="context-menu-item"
          :class="{ disabled: selectedTag?.affix }"
          @click="handleCloseCurrent"
        >
          关闭当前
        </div>
        <div
          class="context-menu-item"
          @click="handleCloseOthers"
        >
          关闭其他
        </div>
        <div
          class="context-menu-item"
          @click="handleCloseAll"
        >
          关闭所有
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped lang="css">
.tags-view-container {
  height: 40px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.dark .tags-view-container {
  background-color: #1d1e1f;
  border-bottom-color: #4c4d4f;
}

.tags-view-wrapper {
  height: 100%;
}

.tags-view-list {
  height: 100%;
  padding: 0 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tags-list {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tags-view-item {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
  color: #606266;
  background-color: #f0f2f5;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.dark .tags-view-item {
  background-color: #2d2d2d;
  border-color: #4c4d4f;
  color: #e5eaf3;
}

.tags-view-item:hover {
  background-color: #ecf5ff;
  border-color: #b3d8ff;
}

.dark .tags-view-item:hover {
  background-color: #3d3d3d;
  border-color: #5c5d5f;
}

.tags-view-item.active {
  color: #409eff;
  background-color: #ecf5ff;
  border-color: #409eff;
}

.dark .tags-view-item.active {
  color: #409eff;
  background-color: #1e3a5f;
  border-color: #409eff;
}

.tag-title {
  margin-right: 4px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-close-icon {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-close-icon:hover {
  background-color: #c0c4cc;
  color: #fff;
}

.dark .tag-close-icon:hover {
  background-color: #5c5d5f;
}

/* 标签列表过渡动画 */
.tag-list-enter-active,
.tag-list-leave-active {
  transition: all 0.3s;
}

.tag-list-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.tag-list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.tag-list-move {
  transition: transform 0.3s;
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  z-index: 3000;
  min-width: 120px;
}

.dark .context-menu {
  background-color: #1d1e1f;
  border-color: #4c4d4f;
}

.context-menu-item {
  padding: 8px 16px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dark .context-menu-item {
  color: #e5eaf3;
}

.context-menu-item:hover:not(.disabled) {
  background-color: #f5f7fa;
}

.dark .context-menu-item:hover:not(.disabled) {
  background-color: #2d2d2d;
}

.context-menu-item.disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.dark .context-menu-item.disabled {
  color: #5c5d5f;
}
</style>
