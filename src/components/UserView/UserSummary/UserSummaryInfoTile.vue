<script setup lang="ts">
import Tag from "@/components/UserView/Tag.vue";
import Clears from "@/components/UserView/Activities/Clears.vue";

defineProps<{
  name: string,
  value: string | number | null
}>()
</script>

<template>
  <div class="flex flex-col justify-center">
    <div class="flex flex-col h-4/5 min-h-14 justify-center items-center">
      <Tag class="!rounded-lg w-28">
        <Clears :amount="value" :name="name"/>
      </Tag>
    </div>
  </div>
</template>
