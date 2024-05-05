<script setup lang="ts">
import {
  TabsTrigger
} from 'radix-vue'

defineProps<{
  name: string,
}>()
</script>

<template>
  <TabsTrigger :value="name" class="flex h-12 bg-accent w-full mb-4 p-2 justify-between clickable">
    <div class="flex gap-4 text-text_bright font-bold text-2xl text-shadow shadow-bg_site items-center">
      <slot />

      <h1 class="">
        {{ name }}
      </h1>
    </div>
  </TabsTrigger>
</template>
