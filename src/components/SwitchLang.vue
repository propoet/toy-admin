<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const lang = ref(locale.value)

function changeLang(value: string) {
  locale.value = value
}
</script>

<template>
  <el-select
    v-model="lang"
    size="small"
    style="width: 100px"
    @change="changeLang"
  >
    <el-option label="中文" value="zh-CN" />
    <el-option label="English" value="en-US" />
  </el-select>
</template>
