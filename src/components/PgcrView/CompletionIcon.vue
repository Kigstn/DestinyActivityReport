<script setup lang="ts">
defineProps<{
  special?: boolean,
  full?: boolean,
  cp?: boolean,
}>()
</script>

<template>
  <div v-if="!cp" class="w-5 h-5 rounded-xl border-2 border-text_dull bg-[#E54D2E]"/>
  <div v-else-if="special" class="w-5 h-5 rounded-xl border-2 border-text_dull bg-[#FFE629] "/>
  <div v-else-if="full" class="w-5 h-5 rounded-xl border-2 border-text_dull bg-accent "/>
  <div v-else class="w-5 h-5 rounded-xl border-2 border-text_dull bg-[#75AAAA]"/>
</template>
