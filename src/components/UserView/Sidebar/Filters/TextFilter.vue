<script setup lang="ts">
import {ref, watch, watchEffect} from "vue";
import {useDebouncedRef} from "@/funcs/utils";

const props = defineProps<{
  name: string,
  content: string
}>()
const emit = defineEmits(["filterChange"])

const content = useDebouncedRef(props.content, filterChange)
watchEffect(() => {content.value = props.content})

function filterChange () {
  emit("filterChange", content.value)
}
</script>

<template>
  <div class="clickable min-h-14 flex flex-col justify-between">
    <div class="text-xs text-text_normal p-1">
      {{ name }}
    </div>
    <input
        v-model="content"
        class="w-full bg-transparent focus-visible:outline-none px-2 pb-2 text-text_bright flex text-sm"
        placeholder="Type here..."
    >
  </div>
</template>
