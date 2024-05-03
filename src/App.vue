<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
  <div class="h-screen flex flex-col">
    <header>
      <div class="w-screen h-16 bg-text_bright text-bg_site">
        Destiny2 Activity Report
      </div>
    </header>
    <main class="flex justify-around w-full h-full lg:px-4">
      <div class="w-full max-w-[1600px]">
        <RouterView/>
      </div>
    </main>
  </div>
</template>
