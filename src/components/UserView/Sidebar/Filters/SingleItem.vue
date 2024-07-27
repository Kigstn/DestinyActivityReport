<script setup lang="ts">
import {ref, watch, watchEffect} from 'vue'

import {Icon} from '@iconify/vue'
import {
  SelectContent,
  SelectGroup, SelectItem, SelectItemIndicator, SelectItemText,
  SelectLabel,
  SelectPortal, SelectRoot, SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from "radix-vue";
import LoadingDiv from "@/components/Misc/LoadingDiv.vue";

const props = defineProps<{
  placeholder: string,
  content: string,
  options: string[] | { [id: string]: string[] },
  loading: boolean,
}>()
const emit = defineEmits(["filterChange"])

const content = ref(props.content)
watchEffect(() => {content.value = props.content})

watch(
    content,
    () => {
      emit("filterChange", content.value)
    },
)
</script>

<template>
  <div v-if="loading" class="h-14 w-full">
    <LoadingDiv />
  </div>

  <SelectRoot v-else v-model="content">
    <SelectTrigger
        class="text-sm clickable h-14 flex flex-col justify-between focus-visible:outline-none hover:no-underline"
        aria-label="Customise options"
    >
      <div class="text-xs text-text_normal p-1  text-left">
        {{ placeholder }}
      </div>
      <div class="flex items-center justify-between text-text_bright px-2 pb-2">
        <SelectValue
            class="text-left p-1 w-full !bg-transparent outline-none text-text_bright data-[state=closed]:border-none !focus:shadow-transparent placeholder-text_dull"
            placeholder="Click here..."
        />
        <Icon icon="radix-icons:chevron-down" class="h-4 w-4 text-text_bright"/>
      </div>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
          class="bg-accent text-text_normal absolute z-10 w-full mt-2 min-w-[160px] max-h-80 overflow-y-scroll rounded-lg will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
      >
        <SelectViewport class="p-[5px]">
          <!-- Render Arrays-->
          <SelectGroup v-if="Array.isArray(options)">
            <SelectItem
                v-for="(option, index) in options"
                class="text-sm leading-none rounded-lg flex items-center min-h-6 px-6 py-1 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-text_bright data-[highlighted]:text-bg_site"
                :key="index"
                :value="option"
            >
              <SelectItemIndicator
                  class="absolute left-0 w-6 inline-flex items-center justify-center"
              >
                <Icon icon="radix-icons:check"/>
              </SelectItemIndicator>
              <SelectItemText>
                {{ option }}
              </SelectItemText>
            </SelectItem>
          </SelectGroup>

          <!-- Render Dicts-->
          <div v-else>
            <SelectGroup v-for="(value, key, index) in options">
              <SelectLabel class="px-6 text-xs leading-4 text-text_dull">
                {{ key }}
              </SelectLabel>

              <SelectItem
                  v-for="(option, index) in value"
                  class="text-sm leading-none rounded-lg flex items-center min-h-6 px-6 py-1 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-text_bright data-[highlighted]:text-bg_site"
                  :key="index"
                  :value="option"
              >
                <SelectItemIndicator
                    class="absolute left-0 w-6 inline-flex items-center justify-center"
                >
                  <Icon icon="radix-icons:check"/>
                </SelectItemIndicator>

                <SelectItemText>
                  {{ option }}
                </SelectItemText>
              </SelectItem>

              <SelectSeparator v-if="(Object.keys(options).length - 1) > index" class="h-0.5 bg-text_dull/50 m-1"/>
            </SelectGroup>
          </div>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
