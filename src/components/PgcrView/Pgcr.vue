<script setup lang="ts">
import {useRoute} from "vue-router";
import {type Ref, ref, watch} from "vue";
import {getActivities, getPGCRs, getPlayerInfo, getSinglePgcr, type ManifestActivity} from "@/funcs/bungie";
import {useDestinyManifestStore, useSharedData} from "@/funcs/store";
import Tag from "@/components/UserView/Tag.vue";
import LoadingDiv from "@/components/LoadingDiv.vue";
import type {DestinyPostGameCarnageReportData} from "bungie-api-ts/destiny2";
import ErrorDiv from "@/components/ErrorDiv.vue";
import {calcStats, isFresh, type PgcrStats, type PgcrTeammate, type PgcrWeapon} from "@/funcs/pgcrStats";
import ClearMarkers from "@/components/UserView/Activities/ClearMarkers.vue";
import ActivityClassStat from "@/components/UserActivityView/ActivityClassStat.vue";
import UserSummaryCard from "@/components/UserView/UserSummary/UserSummaryCard.vue";
import ActivityStat from "@/components/UserView/Activities/ActivityStat.vue";
import Player from "@/components/PgcrView/Player.vue";
import StatsContainer from "@/components/UserActivityView/StatsContainer.vue";
import ActivityWeapon from "@/components/ActivityWeapon.vue";
import CompletionIcon from "@/components/PgcrView/CompletionIcon.vue";
import {formatTime} from "@/funcs/utils";

// vars we need
const dataLoading = ref(true)
const error = ref(null)
// @ts-ignore
const manifestActivity: Ref<ManifestActivity> = ref(null)
// @ts-ignore
const pgcr: Ref<DestinyPostGameCarnageReportData> = ref(null)
const pgcrData: Ref<any> = ref({})
const currentPgcrId: Ref<string | null> = ref(null)

// --------------------------------------------

// watch for route changes
const route = useRoute()
watch(() => route.params, fetchData, {immediate: true})

async function fetchData(newRoute: any) {
  if (route.params.pgcrId == undefined) {
    return
  }

  const pgcrId = route.params.pgcrId.toString()

  if (!dataLoading.value && currentPgcrId.value == pgcrId) {
    console.log("PgcrView: Ignoring Router change due to unchanged params")
    return
  }

  console.log("PgcrView: Router change, getting new user data")

  error.value = null
  dataLoading.value = true
  // @ts-ignore
  manifestActivity.value = null
  // @ts-ignore
  pgcr.value = null
  pgcrData.value = {}
  currentPgcrId.value = null

  // use stores
  const destinyManifest = useDestinyManifestStore()

  try {
    pgcr.value = await getSinglePgcr(pgcrId)
    const activityId = pgcr.value.activityDetails.referenceId.toString()

    // metadata
    pgcrData.value.period = new Date(pgcr.value.period)
    pgcrData.value.fresh = isFresh(pgcrData.value.period, pgcr.value)
    pgcrData.value.duration = pgcr.value.entries[0].values.activityDurationSeconds.basic.value
    pgcrData.value.specialTags = [] // todo
    pgcrData.value.completed = false
    for (const entry of pgcr.value.entries) {
      if (entry.values.completed.basic.value == 1) {
        pgcrData.value.completed = true
        break
      }
    }
    pgcrData.value.completionReason = "Failed Clear"
    if (pgcrData.value.specialTags.length > 0) {
      pgcrData.value.completionReason = "Special Full Clear"
    } else if (pgcrData.value.completed && pgcrData.value.fresh) {
      pgcrData.value.completionReason = "Full Clear"
    } else if (pgcrData.value.completed) {
      pgcrData.value.completionReason = "Checkpoint Clear"
    }

    // get the correct manifest activity
    for (const entry of destinyManifest.manifest.activities) {
      // @ts-ignore
      if (entry[1].hash.includes(activityId)) {
        // @ts-ignore
        manifestActivity.value = entry[1]
        break
      }
    }
    if (manifestActivity.value === null) {
      throw Error("This activity does not exist! Make sure there are no typos in your URL :)")
    }

    document.title = `PGCR | ${manifestActivity.value.name}`
  } catch (err: any) {
    error.value = err.message
    throw err
  } finally {
    currentPgcrId.value = pgcrId
    dataLoading.value = false
  }
}

function sortWeapons(weapons: PgcrWeapon[]) {
  return weapons.sort((a: PgcrWeapon, b: PgcrWeapon) => {
        if (a.kills.total < b.kills.total) {
          return 1
        } else if (a.kills.total == b.kills.total) {
          return 0
        } else {
          return -1
        }
      }
  )
}

function sortTeammates(teammates: PgcrTeammate[]) {
  return teammates.sort((a: PgcrTeammate, b: PgcrTeammate) => {
        if (a.totalTime < b.totalTime) {
          return 1
        } else if (a.totalTime == b.totalTime) {
          return 0
        } else {
          return -1
        }
      }
  )
}

// todo special conditions for data that is wrong in the bungie API
</script>

<template>
  <div class="w-full max-w-[1400px]">
    <ErrorDiv v-if="error">
      {{ error }}
    </ErrorDiv>

    <div v-else-if="dataLoading" class="mx-4 rounded-2xl h-60">
      <LoadingDiv/>
    </div>

    <div v-else class="mx-4 rounded-2xl bg-bg_box flex flex-col" :id="manifestActivity.hash">
      <div class="relative">
        <img
            class="h-60 w-full rounded-t-2xl object-cover "
            :src=manifestActivity.imageUrl
            :alt="`${manifestActivity.name} Image`"
        >
        <div class="absolute top-0 h-full w-full flex flex-col items-center gap-2 px-2">
          <!-- Activity Name -->
          <div class="text-text_bright font-extrabold text-2xl sm:text-3xl md:text-5xl text-shadow shadow-bg_box">
            {{ manifestActivity.name }}
          </div>

          <!-- Activity Mode -->
          <div class="flex gap-1 text-base md:text-lg font-medium text-shadow shadow-bg_box">
            <img
                class="h-7"
                :src="manifestActivity.modeIconUrl"
                alt="Icon"
            >
            <p>
              {{ manifestActivity.activityMode }}
            </p>
          </div>

          <!-- Activity Description -->
          <div class="hidden md:block text-text_dull text-md italic text-shadow-xs shadow-bg_site pt-4">
            {{ manifestActivity.description }}
          </div>
        </div>

        <!-- Small Info -->
        <div class="absolute bottom-2 right-2">
          <div class="flex gap-x-1">
            <Tag class="text-sm" v-for="tag in manifestActivity.tags">
              {{ tag }}
            </Tag>

            <Tag class="text-sm">
              {{ manifestActivity.maxPlayers }} Players
            </Tag>
          </div>
        </div>

        <!-- Date -->
        <div class="absolute bottom-2 left-2 flex gap-4">

        </div>
      </div>

      <div class="flex flex-col divide-y divide-text_dull/70 px-4">
        <div class="pb-4">
          <StatsContainer name="Basic Information">
            <div class="col-span-full grid grid-cols-2 md:grid-cols-3 w-full gap-4">
              <div class="flex flex-col justify-center place-items-center">
                <div>
                  <CompletionIcon
                      :special="pgcrData.specialTags.length > 0"
                      :full="pgcrData.completed && pgcrData.fresh"
                      :cp="pgcrData.completed"
                  />
                </div>
                <div class="font-medium italic text-sm text-text_dull mt-1">
                  {{ pgcrData.completionReason }}
                </div>
              </div>
              <ActivityStat name="Starting Checkpoint" :amount="pgcrData.fresh ? 'Fresh' : pgcr.startingPhaseIndex"/>
              <ActivityStat name="Score" :amount="pgcr.entries[0].values.teamScore.basic.value"/>

              <ActivityStat name="Duration" :amount="formatTime(pgcrData.duration)" time/>
              <ActivityStat name="Date" :amount="pgcrData.period.toLocaleDateString()" time/>
              <ActivityStat name="Time" :amount="pgcrData.period.toLocaleTimeString()" time/>
            </div>
          </StatsContainer>
        </div>

        <div class="pt-4">
          <StatsContainer name="Fireteam">
            <div class="col-span-full w-full flex flex-col gap-4">
              <Player
                  v-for="player in pgcr.entries"
                  :data="player"
                  :period="pgcrData.period"
                  :pgcr="pgcr"
                  :fresh="pgcrData.fresh"
                  :specialTags="pgcrData.specialTags"
              />
            </div>
          </StatsContainer>
        </div>
      </div>
    </div>
  </div>
</template>
