<script setup lang="ts">
import {
  CollapsibleTrigger, Toggle,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider, TooltipRoot,
  TooltipTrigger
} from 'radix-vue'
import {Icon} from '@iconify/vue'

defineProps<{
  name: string,
  open: boolean,
}>()
</script>

<template>
  <div class="flex h-12 bg-accent w-full my-4 p-2 justify-between">
    <div class="flex gap-4 text-text_bright font-bold text-2xl text-shadow shadow-bg_site items-center">
      <slot name="icon"/>

      <h1 class="">
        {{ name }}
      </h1>
    </div>

    <div class="flex justify-end gap-12 items-center">
      <div class="flex justify-end gap-4 items-center">
        <slot/>
      </div>

      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger>
            <CollapsibleTrigger
                class="clickable !bg-text_bright stroke-bg_site flex items-center justify-center rounded-lg w-8 h-8 data-[state=closed]:border-none data-[state=open]:border-2 data-[state=open]:border-bg_site"
            >
              <Icon v-if="open" icon="radix-icons:cross-2" class=""/>
              <Icon v-else icon="radix-icons:row-spacing" class=""/>
            </CollapsibleTrigger>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent class="tooltip">
              <p v-if="open">
                Close
              </p>
              <p v-else>
                Open
              </p>
              <TooltipArrow class="fill-text_bright" :width="12"/>
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </TooltipProvider>
    </div>
  </div>
</template>
