<script setup lang="ts">
import type {PgcrTeammate} from "@/funcs/pgcrStats";
import {getPlayerInfo, type PlayerProfile} from "@/funcs/bungie";
import LoadingDiv from "@/components/Misc/LoadingDiv.vue";
import {type Ref, ref, watch} from "vue";
import {useRoute} from "vue-router";
import ActivityStat from "@/components/UserView/Activities/ActivityStat.vue";
import PlayerCard from "@/components/PgcrView/PlayerCard.vue";
import {formatTime} from "@/funcs/utils";


const props = defineProps<{
  data: PgcrTeammate,
}>()

const loading = ref(true)
// @ts-ignore
const teammate: Ref<PlayerProfile> = ref(null)

const route = useRoute()
watch(() => route.params, fetchData, {immediate: true})

async function fetchData(newRoute: any) {
  if (teammate.value != null && props.data.membershipId == teammate.value.membershipId) {
    return
  }

  // @ts-ignore
  teammate.value = null
  loading.value = true

  if (props.data.membershipType.toString() != "0") {
    teammate.value = await getPlayerInfo(props.data.membershipId, props.data.membershipType)
  } else {
    teammate.value = {
        membershipType: "0",
        membershipTypes: ["0"],
        membershipId: props.data.membershipId,
        iconUrl: "https://www.bungie.net/img/misc/missing_icon_d2.png",
        emblemUrl: "https://www.bungie.net/img/misc/missing_icon_d2.png",
        name: "Unknown",
        code: "0000",
        lastPlayed: new Date("1970-01-01"),
        light: 0,
        totalMinutesPlayed: props.data.totalTime,
    }
  }
  loading.value = false
}
</script>

<template>
  <div v-if="loading" class="w-64 h-[140px]">
    <LoadingDiv class="!bg-bg_site"/>
  </div>

  <div v-else class="flex flex-col justify-center w-64 bg-bg_site rounded-lg" :id="teammate.membershipId">
    <PlayerCard :teammate="teammate" :hint="formatTime(data.totalTime)" hint-tooltip="How long you played together in this activity"/>

    <!-- Stats -->
    <div class="grid grid-cols-3 place-items-center gap-2 px-1 p-4">
      <ActivityStat name="Full" :amount="data.fullClears" show-null/>
      <ActivityStat name="Checkpoint" :amount="data.cpClears" show-null/>
      <ActivityStat name="Failed" :amount="data.failedClears" show-null/>
    </div>
  </div>
</template>
