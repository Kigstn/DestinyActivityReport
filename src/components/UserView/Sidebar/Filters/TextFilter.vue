<script setup lang="ts">
import {ref, watch} from "vue";
import {useDebouncedRef} from "@/funcs/utils";

const props = defineProps<{
  name: string,
}>()
const emit = defineEmits(["filterChange"])

const value = useDebouncedRef("", filterChange)

function filterChange () {
  emit("filterChange", value.value)
}
</script>

<template>
  <div class="clickable min-h-14 flex flex-col justify-between">
    <div class="text-xs text-text_normal p-1">
      {{ name }}
    </div>
    <input
        v-model="value"
        class="w-full bg-transparent focus-visible:outline-none px-2 pb-2 text-text_bright flex text-sm"
        placeholder="Type here..."
    >
  </div>
</template>
