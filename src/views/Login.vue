<template>
  <div style="padding: 40px; text-align: center">
    <el-card style="max-width: 400px; margin: auto">
      <h2>登录页</h2>
      <el-form>
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-button type="primary">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Login",
});
</script>
