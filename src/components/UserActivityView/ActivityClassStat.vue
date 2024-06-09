<script setup lang="ts">
import type {PgcrClass} from "@/funcs/pgcrStats";
import ActivityStat from "@/components/UserView/Activities/ActivityStat.vue";
import Tooltip from "@/components/UserView/Tooltip.vue";
import {formatPercent, formatTime} from "@/funcs/utils";

defineProps<{
  name: string,
  amount: PgcrClass,
  percent?: boolean,
  time?: boolean,
  showNull?: boolean,
  link?: string
}>()
</script>

<template>
  <Tooltip>
    <template v-slot:hoverable>
      <div v-if="link && amount.total != 0 && amount.total != Infinity" class="cursor-pointer">
        <RouterLink :to="link">
          <ActivityStat v-if="percent" :amount="formatPercent(amount.total)" :name="name" show-null="show-null"/>
          <ActivityStat v-else-if="time" :amount="formatTime(amount.total)" :name="name" show-null="show-null"/>
          <ActivityStat v-else :amount="amount.total" :name="name" show-null="show-null"/>
        </RouterLink>
      </div>

      <div v-else class="cursor-help">
        <ActivityStat v-if="percent" :amount="formatPercent(amount.total)" :name="name" show-null="show-null"/>
        <ActivityStat v-else-if="time" :amount="formatTime(amount.total)" :name="name" show-null="show-null"/>
        <ActivityStat v-else :amount="amount.total" :name="name" show-null="show-null"/>
      </div>
    </template>

    <template v-slot:content>
      <div :class="`grid grid-cols-${Object.keys(amount.byClass).length} gap-4`">
        <ActivityStat
            v-if="percent"
            v-for="(value, key, index) in amount.byClass"
            :amount="formatPercent(value)"
            :name="key"
            show-null="show-null"
        />
        <ActivityStat
            v-else-if="time" v-for="(value, key, index) in amount.byClass"
            :amount="formatTime(value)"
            :name="key"
            show-null="show-null"
        />
        <ActivityStat
            v-else v-for="(value, key, index) in amount.byClass"
            :amount="value"
            :name="key"
            show-null="show-null"
        />
      </div>
    </template>
  </Tooltip>
</template>
