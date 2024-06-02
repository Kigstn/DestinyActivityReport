<script setup lang="ts">
import {AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger} from "radix-vue"
import {Icon} from "@iconify/vue";

defineProps<{
  question: string,
}>()
</script>

<template>
  <AccordionItem
      class="text-left clickable !rounded-none mt-px overflow-hidden first:mt-0 first:!rounded-t-lg last:!rounded-b-lg focus-within:relative focus-within:z-10 leading-none "
      :value="question">
    <AccordionHeader class="flex">
      <AccordionTrigger
          class="flex flex-1 min-h-12 items-center justify-between p-1 px-5 text-lg outline-none group data-[state=open]:text-text_bright leading-none text-left">
        <p>
          {{ question }}
        </p>
        <Icon
            icon="radix-icons:chevron-down"
            class="ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
        />
      </AccordionTrigger>
    </AccordionHeader>
    <AccordionContent
        class="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
      <div class="px-5 py-4 font-normal text-base leading-none flex flex-col gap-4">
        <slot />
      </div>
    </AccordionContent>
  </AccordionItem>
</template>
