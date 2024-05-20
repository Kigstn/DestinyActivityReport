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
      <p class="truncate">
        {{ name }}
      </p>
    <slot name="icon"/>
  </RadioGroupItem>
</template>
