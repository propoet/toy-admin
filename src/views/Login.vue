<template>
  <div style="padding: 40px; text-align: center">
    <el-card style="max-width: 400px; margin: auto">
      <h2>{{ $t("loginPage.title") }}</h2>
      <el-form>
        <el-form-item :label="$t('loginPage.username')">
          <el-input :placeholder="$t('loginPage.usernamePlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('loginPage.password')">
          <el-input type="password" :placeholder="$t('loginPage.passwordPlaceholder')" />
        </el-form-item>
        <el-button type="primary">{{ $t("loginPage.button") }}</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Login",
});
</script>
