<script setup lang="ts">
import type {ActivityStats, PlayerProfile} from "@/funcs/bungie";
import UserSummaryCard from "@/components/UserView/UserSummary/UserSummaryCard.vue";
import UserSummaryInfoTile from "@/components/UserView/UserSummary/UserSummaryInfoTile.vue";
import {formatTime} from "@/funcs/utils";

const props = defineProps<{
  user: PlayerProfile,
  activities: { [name: string]: ActivityStats }
}>()

let clears = 0
let specialClears = 0
let timeSpent = 0
let kills = 0
let deaths = 0
let assists = 0
for (const [name, value] of Object.entries(props.activities)) {
    clears += value.clears
    specialClears += value.specialClears
    timeSpent += value.timeSum
    kills += value.kills
    deaths += value.deaths
    assists += value.assists
}
</script>

<template>
  <div class="grid grid-cols-2 xl:flex xl:flex-row justify-around gap-4 mx-2">
    <div class="flex col-span-2 xl:hidden justify-center">
      <UserSummaryCard :user="user"/>
    </div>

    <div class="flex gap-2 justify-center col-span-2 md:col-span-1">
      <UserSummaryInfoTile name="Clears" :value="clears"/>
      <UserSummaryInfoTile name="Special Clears" :value="specialClears"/>
      <UserSummaryInfoTile name="Time Spent" :value="formatTime(timeSpent)"/>
    </div>

    <div class="hidden xl:flex">
      <UserSummaryCard :user="user"/>
    </div>

    <div class="flex gap-2 justify-center col-span-2 md:col-span-1">
      <UserSummaryInfoTile name="Kills" :value="kills"/>
      <UserSummaryInfoTile name="Assists" :value="assists"/>
      <UserSummaryInfoTile name="Deaths" :value="deaths"/>
    </div>
  </div>
</template>
