<script setup lang="ts">
defineProps<{
  name: string,
}>()
</script>

<template>
  <div class="pb-8 pt-4">
    <p class="text-center pb-4 text-accent text-xl font-bold">
      {{ name }}
    </p>

    <div class="grid grid-cols-5 place-items-center gap-4">
      <slot/>
    </div>
  </div>
</template>
