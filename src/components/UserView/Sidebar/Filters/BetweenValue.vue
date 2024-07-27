<script setup lang="ts">
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot
} from 'radix-vue'
import {Icon} from '@iconify/vue'
import {ref, watch, watchEffect} from "vue";
import {useDebouncedRef} from "@/funcs/utils";
import LoadingDiv from "@/components/Misc/LoadingDiv.vue";

const props = defineProps<{
  name: string,
  min: number,
  max: number,
  content: number,
  loading: boolean,
}>()
const emit = defineEmits(["filterChange"])

const content = useDebouncedRef(props.content, filterChange)
watchEffect(() => {
  content.value = props.content
})

function filterChange() {
  emit("filterChange", content.value)
}
</script>

<template>
  <div v-if="loading" class="h-14 w-full">
    <LoadingDiv/>
  </div>

  <NumberFieldRoot
      v-else
      class="text-sm clickable h-14 flex flex-col justify-between hover:no-underline"
      :min="min"
      :max="max"
      v-model="content"
  >
    <label class="text-xs text-text_normal p-1">
      {{ name }}
    </label >

    <div class="flex items-center justify-between text-text_bright">
      <NumberFieldDecrement class="p-2 disabled:opacity-20">
        <Icon icon="radix-icons:minus"/>
      </NumberFieldDecrement>

      <NumberFieldInput
          class="grow bg-transparent w-20 tabular-nums focus-visible:outline-none p-1 text-center"
      />

      <NumberFieldIncrement class="p-2 disabled:opacity-20">
        <Icon icon="radix-icons:plus"/>
      </NumberFieldIncrement>
    </div>
  </NumberFieldRoot>
</template>
