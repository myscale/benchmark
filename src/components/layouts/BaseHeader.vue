<script lang="ts" setup>
import { useDark } from "@vueuse/core";

const current_dark = useDark();

function change_theme() {
  current_dark.value = !current_dark.value;
}
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal" :router="true">
    <el-menu-item index="/">Home</el-menu-item>
    <el-menu-item index="/benchmark">Benchmark</el-menu-item>
    <el-menu-item h="full" @click="change_theme()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>
  </el-menu>
</template>
