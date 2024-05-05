<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
  <div class="h-screen">
    <header class="h-16">
      <div class="w-screen h-16 bg-text_bright text-bg_site">
        Destiny2 Activity Report
      </div>
    </header>
    <main class="flex justify-around w-full py-4 h-full">
        <RouterView/>
    </main>
  </div>
</template>
