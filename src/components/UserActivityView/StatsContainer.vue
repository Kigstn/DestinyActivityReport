<script setup lang="ts">
defineProps<{
  name: string,
  classOverwrite?: string,
  noScroll?: boolean
}>()
</script>

<template>
  <div class="pb-8 pt-4">
    <p class="text-center pb-4 text-accent text-xl font-bold">
      {{ name }}
    </p>

    <div :class="`${!noScroll && 'max-h-[464px] overflow-y-scroll scrollbar'} grid grid-cols-2 md:grid-cols-5 place-items-center gap-4 ${classOverwrite && classOverwrite}`">
      <slot/>
    </div>
  </div>
</template>
