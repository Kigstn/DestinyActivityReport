<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger
} from "radix-vue";
</script>

<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger class="">
        <slot name="hoverable"/>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent class="tooltip z-50">
          <slot name="content"/>

          <TooltipArrow class="fill-text_bright" :width="12"/>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
