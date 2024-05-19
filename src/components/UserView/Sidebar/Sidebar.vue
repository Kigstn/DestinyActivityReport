<script setup lang="ts">
import {PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger, Toggle} from 'radix-vue'
import {Icon} from "@iconify/vue";
import Tooltip from "@/components/UserView/Tooltip.vue";

defineProps<{
  name: string,
}>()
</script>

<template>
  <div class="hidden 3xl:flex 3xl:flex-col gap-4 shrink w-40 overflow-hidden mt-20">
    <slot/>
  </div>

  <div class="flex flex-col 3xl:hidden ">
    <PopoverRoot>
      <Tooltip>
        <template v-slot:hoverable>
          <PopoverTrigger
              class="clickable !text-text_bright w-12 h-12 inline-flex items-center justify-center"
          >
            <slot name="icon"/>
          </PopoverTrigger>

          <PopoverPortal>
            <PopoverContent
                side="bottom"
                :side-offset="5"
                class="tooltip !p-4 min-w-48 will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
            >
              <div class="flex flex-col gap-4">
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
        </template>

        <template v-slot:content>
          <p>
            {{ name }}
          </p>
        </template>
      </Tooltip>
    </PopoverRoot>
  </div>
</template>
