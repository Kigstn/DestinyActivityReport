<script setup lang="ts">
import {RadioGroupItem} from 'radix-vue'

defineProps<{
  name: string,
}>()
</script>

<template>
  <RadioGroupItem
      :id="name"
      class="flex h-12 bg-accent mb-4 p-2 gap-2 justify-center items-center clickable"
      :value="name"
  >
    <slot/>
    <div class="flex gap-4 text-text_bright font-bold text-2xl text-shadow shadow-bg_site items-center">
      <h1 class="">
        {{ name }}
      </h1>
    </div>
  </RadioGroupItem>
</template>
