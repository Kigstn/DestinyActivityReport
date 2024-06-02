<script setup lang="ts">
import {ref, watch, watchEffect} from "vue";
import {useDebouncedRef} from "@/funcs/utils";
import LoadingDiv from "@/components/LoadingDiv.vue";

const props = defineProps<{
  name: string,
  content: string,
  loading: boolean,
}>()
const emit = defineEmits(["filterChange"])

const content = useDebouncedRef(props.content, filterChange)
watchEffect(() => {content.value = props.content})

function filterChange () {
  emit("filterChange", content.value)
}
</script>

<template>
  <div v-if="loading" class="h-14 w-full">
    <LoadingDiv />
  </div>

  <div v-else class="clickable min-h-14 flex flex-col justify-between">
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
