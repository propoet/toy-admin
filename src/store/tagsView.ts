import type { RouteLocationNormalized } from 'vue-router'
import { defineStore } from 'pinia'

export interface TagView {
  path: string
  name: string
  title: string
  meta?: Record<string, any>
  affix?: boolean // 是否固定标签（如首页）
}

// localStorage 存储的 key
const TAGS_VIEW_STORAGE_KEY = 'tags-view-storage'

export const useTagsViewStore = defineStore('tagsView', {
  state: () => {
    // 从 localStorage 恢复状态
    const savedState = loadTagsViewState()
    return {
      visitedViews: savedState.visitedViews || [] as TagView[],
      cachedViews: savedState.cachedViews || [] as string[], // 组件名称列表，用于 KeepAlive
    }
  },

  getters: {
    // 获取所有已访问的标签
    getVisitedViews: state => state.visitedViews,
    // 获取需要缓存的组件名称列表
    getCachedViews: state => state.cachedViews,
  },

  actions: {
    /**
     * 保存状态到 localStorage
     */
    saveState() {
      const state = {
        visitedViews: this.visitedViews,
        cachedViews: this.cachedViews,
      }
      try {
        localStorage.setItem(TAGS_VIEW_STORAGE_KEY, JSON.stringify(state))
      }
      catch (error) {
        console.error('保存 TagsView 状态失败:', error)
      }
    },

    /**
     * 添加标签
     * @param view 路由信息
     */
    addView(view: RouteLocationNormalized) {
      // 如果路由没有 name，不添加到 tagsView
      if (!view.name)
        return

      // 检查是否已存在该标签
      const hasView = this.visitedViews.some(v => v.name === view.name)

      if (!hasView) {
        // 添加新标签
        const tagView: TagView = {
          path: view.path,
          name: view.name as string,
          title: (view.meta?.title as string) || view.name as string,
          meta: view.meta,
          affix: Boolean(view.meta?.affix), // 是否固定标签
        }

        this.visitedViews.push(tagView)

        // 如果路由 meta 中 KeepAlive 为 true，添加到缓存列表
        if (view.meta?.KeepAlive && view.name) {
          this.addCachedView(view.name as string)
        }

        // 保存状态
        this.saveState()
      }
      else {
        // 如果已存在，更新标签信息（可能路由参数变化）
        this.updateVisitedView(view)
      }
    },

    /**
     * 添加需要缓存的组件名称
     * @param viewName 组件名称（路由 name）
     */
    addCachedView(viewName: string) {
      if (!this.cachedViews.includes(viewName)) {
        this.cachedViews.push(viewName)
        // 保存状态
        this.saveState()
      }
    },

    /**
     * 删除标签
     * @param view 路由信息或标签名称
     */
    delView(view: TagView | string) {
      const viewName = typeof view === 'string' ? view : view.name

      // 如果是固定标签，不允许删除
      const targetView = this.visitedViews.find(v => v.name === viewName)
      if (targetView?.affix) {
        return
      }

      // 从已访问列表中删除
      const index = this.visitedViews.findIndex(v => v.name === viewName)
      if (index > -1) {
        this.visitedViews.splice(index, 1)
      }

      // 从缓存列表中删除
      this.delCachedView(viewName)

      // 保存状态
      this.saveState()
    },

    /**
     * 删除缓存的组件名称
     * @param viewName 组件名称
     */
    delCachedView(viewName: string) {
      const index = this.cachedViews.indexOf(viewName)
      if (index > -1) {
        this.cachedViews.splice(index, 1)
        // 保存状态
        this.saveState()
      }
    },

    /**
     * 删除其他标签（保留当前和固定标签）
     * @param view 当前路由信息
     */
    delOthersViews(view: RouteLocationNormalized) {
      if (!view.name)
        return

      // 保留当前标签和所有固定标签
      this.visitedViews = this.visitedViews.filter(
        v => v.name === view.name || v.affix,
      )

      // 更新缓存列表
      this.cachedViews = this.visitedViews
        .filter(v => v.meta?.KeepAlive)
        .map(v => v.name)

      // 保存状态
      this.saveState()
    },

    /**
     * 删除所有标签（保留固定标签）
     */
    delAllViews() {
      // 只保留固定标签
      this.visitedViews = this.visitedViews.filter(v => v.affix)

      // 更新缓存列表
      this.cachedViews = this.visitedViews
        .filter(v => v.meta?.KeepAlive)
        .map(v => v.name)

      // 保存状态
      this.saveState()
    },

    /**
     * 更新标签信息（用于路由参数变化等情况）
     * @param view 路由信息
     */
    updateVisitedView(view: RouteLocationNormalized) {
      if (!view.name)
        return

      const index = this.visitedViews.findIndex(v => v.name === view.name)
      if (index > -1) {
        // 更新标签信息
        this.visitedViews[index] = {
          ...this.visitedViews[index],
          path: view.path,
          title: (view.meta?.title as string) || view.name as string,
          meta: view.meta,
        }

        // 保存状态
        this.saveState()
      }
    },

    /**
     * 初始化固定标签（页面刷新后恢复固定标签）
     * @param views 固定标签列表
     */
    initAffixTags(views: TagView[]) {
      // 合并固定标签，确保固定标签始终存在
      const affixTags = views.filter(v => v.affix)
      affixTags.forEach((tag) => {
        const exists = this.visitedViews.some(v => v.name === tag.name)
        if (!exists) {
          this.visitedViews.push(tag)
          if (tag.meta?.KeepAlive) {
            this.addCachedView(tag.name)
          }
        }
      })

      // 按固定标签顺序排序
      this.visitedViews.sort((a, b) => {
        const aIndex = affixTags.findIndex(v => v.name === a.name)
        const bIndex = affixTags.findIndex(v => v.name === b.name)
        if (aIndex === -1 && bIndex === -1)
          return 0
        if (aIndex === -1)
          return 1
        if (bIndex === -1)
          return -1
        return aIndex - bIndex
      })

      // 保存状态
      this.saveState()
    },
  },
})

/**
 * 从 localStorage 加载 TagsView 状态
 */
function loadTagsViewState(): { visitedViews: TagView[], cachedViews: string[] } {
  try {
    const saved = localStorage.getItem(TAGS_VIEW_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  }
  catch (error) {
    console.error('加载 TagsView 状态失败:', error)
  }
  return { visitedViews: [], cachedViews: [] }
}
