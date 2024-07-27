<script setup lang="ts">
defineProps<{
  text?: string,
}>()
</script>

<template>
  <div :class="`animate-pulse bg-bg_box w-full h-full rounded-lg text-center flex flex-col justify-center text-text_dull text-base italic ${text && 'p-8'}`">
    {{ text && text}}
  </div>
</template>
