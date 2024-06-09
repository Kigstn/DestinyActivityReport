<script setup lang="ts">
import {useRoute} from "vue-router";
import {type Ref, ref, watch} from "vue";
import {getActivities, getPGCRs, getPlayerInfo, type ManifestActivity} from "@/funcs/bungie";
import {useDestinyManifestStore, useSharedData} from "@/funcs/store";
import Tag from "@/components/UserView/Tag.vue";
import LoadingDiv from "@/components/LoadingDiv.vue";
import type {DestinyPostGameCarnageReportData} from "bungie-api-ts/destiny2";
import ErrorDiv from "@/components/ErrorDiv.vue";
import {calcStats, type PgcrStats} from "@/funcs/pgcrStats";
import ClearMarkers from "@/components/UserView/Activities/ClearMarkers.vue";
import ActivityClassStat from "@/components/UserActivityView/ActivityClassStat.vue";
import StatsContainer from "@/components/UserActivityView/StatsContainer.vue";
import ActivityClearTime from "@/components/UserActivityView/ActivityClearTime.vue";
import BoxClickable from "@/components/UserView/TagClickable.vue";
import {formatTime} from "../../funcs/utils";
import Tooltip from "@/components/UserView/Tooltip.vue";
import ActivityWeapon from "@/components/ActivityWeapon.vue";

// vars we need
const manifestLoading = ref(true)
const dataLoading = ref(true)
const error = ref(null)
// @ts-ignore
const manifestActivity: Ref<ManifestActivity> = ref(null)
const pgcrs: Ref<DestinyPostGameCarnageReportData[]> = ref([])
// @ts-ignore
const pgcrStats: Ref<PgcrStats> = ref({})

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
    console.log(pgcrStats.value)


  } catch (err: any) {
    error.value = err.message
    throw err
  } finally {
    dataLoading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-[1400px]">
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

        <!-- Playtime -->
        <div class="absolute bottom-2 left-2">
          <ActivityClassStat name="Playtime" :amount="pgcrStats.totalTime" time/>
        </div>
      </div>

      <div v-if="dataLoading" class="p-4 w-full h-80">
        <LoadingDiv class="!bg-bg_site"/>
      </div>
      <div v-else>
        <!-- Special Tags -->
        <div class="h-10 flex space-x-1 py-1 px-2">
          <div v-for="(data, name) in pgcrStats.specialTags">
            <RouterLink :to="`/pgcr/${data.instanceId}`">
              <BoxClickable>
                {{ name }} ({{ data.amount }})
              </BoxClickable>
            </RouterLink>
          </div>
        </div>

        <div class="px-4">
          <div class="flex flex-col divide-y pb-2 divide-text_dull/70">
            <StatsContainer name="History">
              <div class="w-full col-span-full flex">
                <!-- Clear Markers -->
                <div v-if="pgcrStats.data.length > 0" class="pl-4 h-40 w-[45%]">
                  <ClearMarkers :activities="pgcrStats"/>
                </div>
                <div v-else class="w-[45%] justify-center font-medium italic text-sm text-text_dull flex h-full">
                  <div class="flex flex-col justify-center h-full">
                    You have never run this
                  </div>
                </div>
                <div class="w-[55%] max-h-40 overflow-y-scroll flex flex-col gap-1 py-1 pr-2">
                  <RouterLink v-for="data in pgcrStats.data" :to="`/pgcr/${data.instanceId}`">
                    <div class="text-center">
                      <div class="flex gap-2 items-center clickable px-2 py-1">
                        <div v-if="data.completed && Object.keys(data.specialTags).length > 0"
                             class="w-5 h-5 rounded-xl border-2 border-text_dull bg-[#FFE629] "/>
                        <div v-else-if="data.completed && data.cp!"
                             class="w-5 h-5 rounded-xl border-2 border-text_dull bg-accent "/>
                        <div v-else-if="data.completed"
                             class="w-5 h-5 rounded-xl border-2 border-text_dull bg-[#75AAAA]"/>
                        <div v-else class="w-5 h-5 rounded-xl border-2 border-text_dull bg-[#E54D2E]"/>

                        <div
                            class="w-full grid grid-cols-5 gap-2 divide-x-2 divide-text_dull">
                          <div class="col-span-2">
                            <p v-if="data.completed && Object.keys(data.specialTags).length > 0"
                               class="text-text_bright">
                              Special
                              Full Clear</p>
                            <p v-else-if="data.completed && data.cp!">Full Clear</p>
                            <p v-else-if="data.completed" class="text-text_dull">Checkpoint Clear</p>
                            <p v-else class="text-text_dull">Failed Clear</p>
                          </div>

                          <div class="col-span-2">
                            {{ data.datetime.toLocaleString() }}
                          </div>

                          <div class="">
                            {{ formatTime(data.lengthSeconds) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </RouterLink>
                </div>
              </div>
            </StatsContainer>

            <StatsContainer name="Clears">
              <ActivityClassStat name="Combined" :amount="pgcrStats.combinedClears.amount"/>
              <ActivityClassStat name="Special Full" :amount="pgcrStats.specialFullClears.amount"/>
              <ActivityClassStat name="Full" :amount="pgcrStats.fullClears.amount"/>
              <ActivityClassStat name="Checkpoint" :amount="pgcrStats.cpClears.amount"/>
              <ActivityClassStat name="Failed" :amount="pgcrStats.failedClears.amount"/>

              <div class="col-span-full w-full pt-2 grid grid-cols-3 place-items-center gap-8">
                <ActivityClearTime name="Special Full" :data="pgcrStats.specialFullClears"/>
                <ActivityClearTime name="Full" :data="pgcrStats.fullClears"/>
                <ActivityClearTime name="Checkpoint" :data="pgcrStats.cpClears"/>
              </div>
            </StatsContainer>

            <StatsContainer name="Lifetime">
              <ActivityClassStat name="Kills" :amount="pgcrStats.kills"/>
              <ActivityClassStat name="Deaths" :amount="pgcrStats.deaths"/>
              <ActivityClassStat name="Assist" :amount="pgcrStats.assists"/>
              <ActivityClassStat name="K/D" :amount="pgcrStats.kd"/>
              <ActivityClassStat name="K/D/A" :amount="pgcrStats.kda"/>

              <ActivityClassStat name="Grenade Kills" :amount="pgcrStats.grenadeKills"/>
              <ActivityClassStat name="Melee Kills" :amount="pgcrStats.meleeKills"/>
              <ActivityClassStat name="Super Kills" :amount="pgcrStats.superKills"/>
              <ActivityClassStat name="Precision Kills" :amount="pgcrStats.precisionKills"/>
              <ActivityClassStat name="Precision Kills" :amount="pgcrStats.precisionKillsPercent" percent/>

              <ActivityClassStat name="Score" :amount="pgcrStats.score" v-if="pgcrStats.score.total != 0"/>
            </StatsContainer>

            <StatsContainer name="Best Full Clear Stats" v-if="pgcrStats.combinedClears.amount.total > 0">
              <ActivityClassStat name="Kills" :amount="pgcrStats.bestKills"
                                 :link="`/pgcr/${pgcrStats.bestKills.instanceId}`" show-null/>
              <ActivityClassStat name="Deaths" :amount="pgcrStats.bestDeaths"
                                 :link="`/pgcr/${pgcrStats.bestDeaths.instanceId}`" show-null/>
              <ActivityClassStat name="Assist" :amount="pgcrStats.bestAssists"
                                 :link="`/pgcr/${pgcrStats.bestAssists.instanceId}`" show-null/>
              <ActivityClassStat name="K/D" :amount="pgcrStats.bestKd"
                                 :link="`/pgcr/${pgcrStats.bestKd.instanceId}`" show-null/>
              <ActivityClassStat name="K/D/A" :amount="pgcrStats.bestKda"
                                 :link="`/pgcr/${pgcrStats.bestKda.instanceId}`" show-null/>

              <ActivityClassStat name="Grenade Kills" :amount="pgcrStats.bestGrenadeKills"
                                 :link="`/pgcr/${pgcrStats.bestGrenadeKills.instanceId}`" show-null/>
              <ActivityClassStat name="Melee Kills" :amount="pgcrStats.bestMeleeKills"
                                 :link="`/pgcr/${pgcrStats.bestMeleeKills.instanceId}`" show-null/>
              <ActivityClassStat name="Super Kills" :amount="pgcrStats.bestSuperKills"
                                 :link="`/pgcr/${pgcrStats.bestSuperKills.instanceId}`" show-null/>
              <ActivityClassStat name="Precision Kills" :amount="pgcrStats.bestPrecisionKills"
                                 :link="`/pgcr/${pgcrStats.bestPrecisionKills.instanceId}`" show-null/>
              <ActivityClassStat name="Precision Kills" :amount="pgcrStats.bestPrecisionKillsPercent"
                                 :link="`/pgcr/${pgcrStats.bestPrecisionKillsPercent.instanceId}`" percent show-null/>

              <ActivityClassStat v-if="pgcrStats.score.total != 0" name="Score" :amount="pgcrStats.bestScore"
                                 :link="`/pgcr/${pgcrStats.bestScore.instanceId}`"/>
            </StatsContainer>

            <StatsContainer name="Weapons">
              <ActivityWeapon v-for="(weapon, name) in pgcrStats.weaponStats" :data="weapon" />
            </StatsContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
