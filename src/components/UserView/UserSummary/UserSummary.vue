<script setup lang="ts">
import type {PlayerProfile} from "@/funcs/bungie";
import UserSummaryCard from "@/components/UserView/UserSummary/UserSummaryCard.vue";
import UserSummaryInfoTile from "@/components/UserView/UserSummary/UserSummaryInfoTile.vue";
import {formatTime} from "@/funcs/utils";

defineProps<{
  user: PlayerProfile | null,
  clears: number,
  specialClears: number,
  timeSpent: number,
  kills: number,
  deaths: number,
  assists: number,
  loading: boolean,
  userLoading: boolean,
}>()


</script>

<template>
  <div class="flex justify-center ">
    <div class="grid grid-cols-2 xl:flex xl:flex-row justify-between gap-4 mx-2 w-full max-w-[1600px]">
      <div class="flex col-span-2 xl:hidden justify-center">
        <UserSummaryCard :user="user" :loading="userLoading"/>
      </div>

      <div class="flex gap-2 justify-center col-span-2 md:col-span-1">
        <UserSummaryInfoTile :loading="loading" name="Clears" :value="clears"/>
        <UserSummaryInfoTile :loading="loading" name="Special Clears" :value="specialClears"/>
        <UserSummaryInfoTile :loading="loading" name="Total Time" :value="formatTime(timeSpent)"/>
      </div>

      <div class="hidden xl:flex">
        <UserSummaryCard :user="user" :loading="userLoading"/>
      </div>

      <div class="flex gap-2 justify-center col-span-2 md:col-span-1">
        <UserSummaryInfoTile :loading="loading" name="Kills" :value="kills"/>
        <UserSummaryInfoTile :loading="loading" name="Assists" :value="assists"/>
        <UserSummaryInfoTile :loading="loading" name="Deaths" :value="deaths"/>
      </div>
    </div>
  </div>
</template>
