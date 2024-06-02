<script setup lang="ts">
import type {PlayerProfile} from "@/funcs/bungie";
import UserSummaryCard from "@/components/UserView/UserSummary/UserSummaryCard.vue";
import UserSummaryInfoTile from "@/components/UserView/UserSummary/UserSummaryInfoTile.vue";
import {formatTime} from "@/funcs/utils";

defineProps<{
  user: PlayerProfile,
  clears: number,
  specialClears: number,
  timeSpent: number,
  kills: number,
  deaths: number,
  assists: number,
}>()


</script>

<template>
  <div class="grid grid-cols-2 xl:flex xl:flex-row justify-around gap-4 mx-2">
    <div class="flex col-span-2 xl:hidden justify-center">
      <UserSummaryCard :user="user"/>
    </div>

    <div class="flex gap-2 justify-center col-span-2 md:col-span-1">
      <UserSummaryInfoTile name="Clears" :value="clears"/>
      <UserSummaryInfoTile name="Special Clears" :value="specialClears"/>
      <UserSummaryInfoTile name="Total Time" :value="formatTime(timeSpent)"/>
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
