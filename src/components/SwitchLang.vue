<template>
  <el-select
    v-model="lang"
    @change="changeLang"
    size="small"
    style="width: 100px"
  >
    <el-option label="中文" value="zh-CN" />
    <el-option label="English" value="en-US" />
  </el-select>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const lang = ref(locale.value);

function changeLang(value: string) {
  locale.value = value;
}
</script>
