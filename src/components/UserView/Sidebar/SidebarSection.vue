<script setup lang="ts">
import {watch} from "vue";

defineProps<{
  name: string | undefined,
}>()
</script>

<template>
  <div class="">
    <p class="pb-1 text-text_normal" v-if="name !== undefined">
      {{ name }}
    </p>
    <div class="flex flex-col gap-2">
      <slot/>
    </div>
  </div>
</template>
