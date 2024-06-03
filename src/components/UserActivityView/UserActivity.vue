<script setup lang="ts">
import {useRoute} from "vue-router";
import {type Ref, ref, watch} from "vue";
import {getActivities, getPGCRs, getPlayerInfo, type ManifestActivity} from "@/funcs/bungie";
import {useDestinyManifestStore, useSharedData} from "@/funcs/store";
import Tag from "@/components/UserView/Tag.vue";
import LoadingDiv from "@/components/LoadingDiv.vue";
import type {DestinyPostGameCarnageReportData} from "bungie-api-ts/destiny2";
import ErrorDiv from "@/components/ErrorDiv.vue";
import {calcStats} from "@/funcs/pgcrStats";
import ClearMarkers from "@/components/UserView/Activities/ClearMarkers.vue";


// vars we need
const manifestLoading = ref(true)
const dataLoading = ref(true)
const error = ref(null)
// @ts-ignore
const manifestActivity: Ref<ManifestActivity> = ref(null)
const pgcrs: Ref<DestinyPostGameCarnageReportData[]> = ref([])
const pgcrStats = ref({})

// --------------------------------------------

// watch for route changes
const route = useRoute()
watch(() => route.params, fetchData, {immediate: true})

async function fetchData(newRoute: any) {
  console.log("Router change, getting new user data")

  const membershipType = route.params.membershipType
  const membershipId = route.params.membershipId
  const activityName: any = route.params.activityName

  error.value = null
  manifestLoading.value = true
  dataLoading.value = true
  // @ts-ignore
  manifestActivity.value = null
  // @ts-ignore
  pgcrStats.value = {}

  // use stores
  const destinyManifest = useDestinyManifestStore()
  const sharedDataStore = useSharedData()

  try {
    // get the correct manifest activity
    for (const entry of destinyManifest.manifest.activities) {
      if (entry[0] == activityName) {
        // @ts-ignore
        manifestActivity.value = entry[1]
        break
      }
    }
    if (manifestActivity.value === null) {
      throw Error("This activity does not exist! Make sure there are no typos in your URL :)")
    }
    manifestLoading.value = false

    pgcrs.value = await getPGCRs(manifestActivity.value, membershipId, membershipType)
    pgcrStats.value = calcStats(pgcrs.value, membershipId.toString())

  } catch (err: any) {
    error.value = err.message
    console.log(err.toString())
  } finally {
    dataLoading.value = false
  }
}
</script>

<template>
  <div>
    <ErrorDiv v-if="error">
      {{ error }}
    </ErrorDiv>

    <div v-else-if="manifestLoading" class="mx-4 rounded-2xl h-60">
      <LoadingDiv/>
    </div>

    <div v-else class="mx-4 rounded-2xl bg-bg_box flex flex-col" :id="manifestActivity.hash">
      <div class="relative">
        <img
            class="h-60 w-full rounded-t-2xl object-cover "
            :src=manifestActivity.imageUrl
            :alt="`${manifestActivity.name} Image`"
        >
        <div class="absolute top-0 h-full w-full flex flex-col items-center gap-2">
          <!-- Activity Name -->
          <div class="text-text_bright font-extrabold text-5xl text-shadow shadow-bg_box pt-8">
            {{ manifestActivity.name }}
          </div>

          <!-- Activity Mode -->
          <div class="flex gap-1 text-lg font-medium text-shadow shadow-bg_box">
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
          <div class="text-text_dull text-md italic text-shadow shadow-bg_box pt-8">
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
      </div>

      <div v-if="dataLoading" class="p-4 w-full h-80">
        <LoadingDiv class="!bg-bg_site"/>
      </div>
      <div v-else>
        <!-- Special Tags -->
        <div class="bg-orange-400 h-10 flex space-x-1 py-1 px-2">
          Special Tags
        </div>

        <div class="flex flex-col divide-y px-4 pb-2 divide-text_dull/70">
          <div class="grid grid-cols-2 py-4">
            <!-- Clear Markers -->
            <ClearMarkers :activities="pgcrStats" v-if="pgcrStats.data.length > 0"/>
            <div v-else class="justify-center font-medium italic text-sm text-text_dull flex h-full">
              <div class="flex flex-col justify-center h-full">
                You have never run this
              </div>
            </div>
            <div class="bg-blue-500">
              Scrollable List of Activity Entries
            </div>
          </div>

          <div class="py-4 w-full grid grid-cols-3 place-items-center">
            <div class="bg-green-400">
              Full Clears + show fastest / avg / max / total there as well. for each of the 3
            </div>
            <div class="bg-green-100">
              Special Clears
            </div>
            <div class="bg-green-900">
              CP Clears
            </div>
          </div>

          <div class="py-4 w-full grid grid-cols-3 place-items-center">
            <div class="bg-violet-400">
              Kills
            </div>
            <div class="bg-violet-100">
              Deaths
            </div>
            <div class="bg-violet-900">
              Assist + much more stats that we now have thankls to pgcr
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>

</template>
