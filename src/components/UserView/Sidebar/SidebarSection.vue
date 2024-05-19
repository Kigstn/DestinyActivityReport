<script setup lang="ts">

defineProps<{
  name?: string | undefined,
  rightSide?: boolean
}>()
</script>

<template>
  <div class="flex flex-col min-w-48 3xl:min-w-fit">
    <p :class="`flex pb-1 text-text_normal ${rightSide && '3xl:justify-end'}`" v-if="name !== undefined">
      {{ name }}
    </p>
    <div class="flex flex-col gap-2">
      <slot/>
    </div>
  </div>
</template>
