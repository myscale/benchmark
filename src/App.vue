<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import { computed, ref } from "vue";

// 获得当前颜色主题
const isDark = useDark();

// 使用计算属性，动态更新网页背景
const divStyle = computed(() => ({
  "background-color": isDark.value ? "#303030" : "#e5e5f7",
  opacity: 1,
  "background-size": "32px 32px",
  "background-position": "0 0,16px 16px",
}));
</script>

<template>
  <div class="main" :style="divStyle">
    <el-config-provider namespace="ep">
      <el-container>
        <el-header class="header-container">
          <BaseHeader />
        </el-header>
        <el-main class="main-container">
          <div class="sub-container">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-config-provider>
  </div>
</template>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}
.header-container {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(5px);
}
.ep-menu {
  /* background-color: var(--ep-menu-bg-color); */
  background-color: rgba(var(--ep-menu-bg-color), 0.4);
}
.main-container {
  min-height: calc(100vh);
  padding-top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  height: 100%;
}
.sub-container {
  max-width: 1280px;
}
</style>
