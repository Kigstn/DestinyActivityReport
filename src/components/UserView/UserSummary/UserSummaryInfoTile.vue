<script setup lang="ts">
import Tag from "@/components/UserView/Tag.vue";
import Clears from "@/components/UserView/Activities/Clears.vue";
import LoadingDiv from "@/components/Misc/LoadingDiv.vue";

defineProps<{
  name: string,
  value: string | number,
  loading: boolean,
}>()
</script>

<template>
  <div class="flex flex-col justify-center">
    <div class="flex flex-col h-4/5 min-h-14 w-32 justify-center items-center">
      <Tag v-if="!loading" class="!rounded-lg !w-full overflow-x-clip">
        <Clears :amount="value" :name="name"/>
      </Tag>
      <LoadingDiv v-else/>
    </div>
  </div>
</template>
