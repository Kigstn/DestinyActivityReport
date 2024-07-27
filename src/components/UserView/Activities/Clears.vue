<script setup lang="ts">
const props = defineProps<{
  name: string,
  amount: number | string,
  small?: boolean
}>()
</script>

<template>
  <div class="flex flex-col justify-center">
    <p :class="`self-center font-bold text-text_bright ${small ? 'text-2xl' : 'text-3xl'}`">
      {{ amount.toLocaleString() }}
    </p>
    <p class="self-center font-medium italic text-sm text-text_dull">
      {{ name }}
    </p>
  </div>
</template>
