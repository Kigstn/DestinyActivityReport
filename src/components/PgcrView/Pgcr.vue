<script setup lang="ts">
import {useRoute} from "vue-router";
import {type Ref, ref, watch} from "vue";
import {getActivities, getPGCRs, getPlayerInfo, getSinglePgcr, type ManifestActivity} from "@/funcs/bungie";
import {useDestinyManifestStore, useSharedData} from "@/funcs/store";
import Tag from "@/components/UserView/Tag.vue";
import LoadingDiv from "@/components/LoadingDiv.vue";
import type {DestinyPostGameCarnageReportData} from "bungie-api-ts/destiny2";
import ErrorDiv from "@/components/ErrorDiv.vue";
import {calcStats, type PgcrStats, type PgcrTeammate, type PgcrWeapon} from "@/funcs/pgcrStats";
import ClearMarkers from "@/components/UserView/Activities/ClearMarkers.vue";
import ActivityClassStat from "@/components/UserActivityView/ActivityClassStat.vue";
import UserSummaryCard from "@/components/UserView/UserSummary/UserSummaryCard.vue";
import ActivityStat from "@/components/UserView/Activities/ActivityStat.vue";
import Player from "@/components/PgcrView/Player.vue";

// vars we need
const dataLoading = ref(true)
const error = ref(null)
// @ts-ignore
const manifestActivity: Ref<ManifestActivity> = ref(null)
// @ts-ignore
const pgcr: Ref<DestinyPostGameCarnageReportData> = ref(null)
const currentPgcrId: Ref<string | null> = ref(null)


const sharedDataStore = useSharedData()

// --------------------------------------------

// watch for route changes
const route = useRoute()
watch(() => route.params, fetchData, {immediate: true})

async function fetchData(newRoute: any) {
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
  currentPgcrId.value = null

  // use stores
  const destinyManifest = useDestinyManifestStore()

  try {
    pgcr.value = await getSinglePgcr(pgcrId)
    const activityId = pgcr.value.activityDetails.referenceId.toString()

    // get the correct manifest activity
    for (const entry of destinyManifest.manifest.activities) {
      // @ts-ignore
      if (entry[1].hash.includes(activityId)) {
        console.log("Found")
        // @ts-ignore
        manifestActivity.value = entry[1]
        break
      }
    }
    if (manifestActivity.value === null) {
      throw Error("This activity does not exist! Make sure there are no typos in your URL :)")
    }

    // todo     document.title = `${sharedDataStore.currentAccount.name} | ${activityName}`


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
          <ActivityStat name="Date" :amount="new Date(pgcr.period).toLocaleDateString()" time/>
          <ActivityStat name="Time" :amount="new Date(pgcr.period).toLocaleTimeString()" time/>
        </div>
      </div>

      <div>
        Was fresh
                Startingphaseindex

        Duration
        CP/Special/Full/Fail
      </div>

      <div class="flex flex-col gap-4 p-4">
        <Transition mode="out-in" v-for="player in pgcr.entries">
          <KeepAlive>
            <Suspense>
              <Player :data="player" :period="new Date(pgcr.period)" :pgcr="pgcr"/>

              <!-- loading state -->
              <template #fallback>
                <LoadingDiv class="!h-36 w-full !bg-bg_site"/>
              </template>
            </Suspense>
          </KeepAlive>
        </Transition>
      </div>
    </div>
  </div>
</template>
