<script setup lang="ts">
import type {PlayerProfile} from "@/funcs/bungie";
import UserSummaryClears from "@/components/UserView/UserSummary/UserSummaryClears.vue";
import UserSummaryCard from "@/components/UserView/UserSummary/UserSummaryCard.vue";

defineProps<{
  user: PlayerProfile,
}>()

</script>

<template>
  <div class="bg-red-500 grid grid-cols-2 sm:flex justify-center gap-4 mx-2">
    <div class="flex col-span-2 sm:hidden justify-center">
      <UserSummaryCard :user="user"/>
    </div>

    <UserSummaryClears>
      Clears
    </UserSummaryClears>

    <div class="hidden sm:flex">
      <UserSummaryCard :user="user"/>
    </div>

    <UserSummaryClears>
      Special Clears
    </UserSummaryClears>
  </div>
</template>
