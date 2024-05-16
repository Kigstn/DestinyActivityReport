<script setup lang="ts">
import {PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger} from 'radix-vue'
import {Icon} from "@iconify/vue";
</script>

<template>
  <div class="hidden 3xl:flex shrink w-48 overflow-hidden bg-green-400">
    <slot/>
  </div>

  <div class="flex 3xl:hidden">
    <PopoverRoot>
      <PopoverTrigger
          class="clickable !text-text_bright w-12 h-12 inline-flex items-center justify-center"
      >
        <slot name="icon" />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
            side="bottom"
            :side-offset="5"
            class="tooltip min-w-48 will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
        >
          <div class="flex flex-col gap-2.5">
               <slot/>
          </div>
          <PopoverClose
              class="clickable h-6 w-6 flex items-center justify-center absolute top-1 right-1"
              aria-label="Close"
          >
            <Icon icon="radix-icons:cross-2"/>
          </PopoverClose>
          <PopoverArrow class="fill-text_bright"/>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </div>
</template>
