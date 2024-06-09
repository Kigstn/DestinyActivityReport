<script setup lang="ts">
import type {PgcrClass, PgcrClear} from "@/funcs/pgcrStats";
import ActivityClassStat from "@/components/UserActivityView/ActivityClassStat.vue";

defineProps<{
  name: string,
  data: PgcrClear,
}>()
</script>

<template>
  <div class="flex flex-col">
        <p class="text-center text-accent font-bold pb-1">
      {{ name }}
    </p>

    <div class="grid grid-cols-4 gap-4">
      <ActivityClassStat
          name="Fastest"
          :amount="data.fastestTime"
          :link="`/pgcr/${data.fastestTime.instanceId}`"
          time
      />
      <ActivityClassStat
          name="Slowest"
          :amount="data.slowestTime"
          :link="`/pgcr/${data.slowestTime.instanceId}`"
          time
      />
      <ActivityClassStat
          name="Average"
          :amount="data.averageTime"
          time
      />
      <ActivityClassStat
          name="Total"
          :amount="data.totalTime"
          time
      />
    </div>
  </div>
</template>
