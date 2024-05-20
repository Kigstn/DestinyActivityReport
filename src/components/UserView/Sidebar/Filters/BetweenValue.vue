<script setup lang="ts">
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldLabel,
  NumberFieldRoot
} from 'radix-vue'
import {Icon} from '@iconify/vue'
import {ref, watch, watchEffect} from "vue";
import {useDebouncedRef} from "@/funcs/utils";

const props = defineProps<{
  name: string,
  min: number,
  max: number,
  content: number
}>()
const emit = defineEmits(["filterChange"])

const content = useDebouncedRef(props.content, filterChange)
watchEffect(() => {content.value = props.content})

function filterChange () {
  emit("filterChange", content.value)
}
</script>

<template>
  <NumberFieldRoot
      class="text-sm clickable h-14 flex flex-col justify-between"
      :min="min"
      :max="max"
      v-model="content"
  >
    <NumberFieldLabel class="text-xs text-text_normal p-1">
      {{ name }}
    </NumberFieldLabel>

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
