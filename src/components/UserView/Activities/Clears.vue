<script setup lang="ts">
const props = defineProps<{
  name: string,
  amount: number
}>()
</script>

<template>
  <div class="flex flex-col">
    <!-- todo show class info on hover -->
    <p class="self-center font-bold text-3xl text-text_bright">
      {{ amount }}
    </p>
    <p class="self-center font-medium italic text-sm text-text_dull">
      {{ name }}
    </p>
  </div>
</template>
