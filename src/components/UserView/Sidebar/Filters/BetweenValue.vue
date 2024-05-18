<script setup lang="ts">
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldLabel,
  NumberFieldRoot
} from 'radix-vue'
import {Icon} from '@iconify/vue'
import {ref, watch} from "vue";

const props = defineProps<{
  name: string,
  min: number,
  max: number,
  def: number
}>()
const emit = defineEmits(["filterChange"])

const value = ref(props.def)

watch(
    value,
    () => {
      emit("filterChange", value.value)
    },
)
</script>

<template>
  <NumberFieldRoot
      class="text-sm clickable"
      :min="min"
      :max="max"
      :default-value="def"
      v-model="value"
  >
    <NumberFieldLabel class="text-xs text-text_normal pl-1">
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
