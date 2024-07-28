<script setup lang="ts">
import {useRoute} from "vue-router";
import {type Ref, ref, watch} from "vue";
import {getActivities, getPGCRs, getPlayerInfo, type ManifestActivity} from "@/funcs/bungie";
import {useDestinyManifestStore, useSharedData} from "@/funcs/store";
import Tag from "@/components/UserView/Tag.vue";
import LoadingDiv from "@/components/Misc/LoadingDiv.vue";
import type {DestinyPostGameCarnageReportData} from "bungie-api-ts/destiny2";
import ErrorDiv from "@/components/Misc/ErrorDiv.vue";
import {calcStats, type PgcrStats, type PgcrTeammate, type PgcrWeapon} from "@/funcs/pgcrStats";
import ClearMarkers from "@/components/UserView/Activities/ClearMarkers.vue";
import ActivityClassStat from "@/components/UserActivityView/ActivityClassStat.vue";
import StatsContainer from "@/components/UserActivityView/StatsContainer.vue";
import ActivityClearTime from "@/components/UserActivityView/ActivityClearTime.vue";
import BoxClickable from "@/components/UserView/TagClickable.vue";
import {formatTime} from "../../funcs/utils";
import Tooltip from "@/components/UserView/Tooltip.vue";
import ActivityWeapon from "@/components/ActivityWeapon.vue";
import ActivityMember from "@/components/UserActivityView/ActivityMember.vue";
import UserSummaryCard from "@/components/UserView/UserSummary/UserSummaryCard.vue";
import CompletionIcon from "@/components/PgcrView/CompletionIcon.vue";

// vars we need
const manifestLoading = ref(true)
const dataLoading = ref(true)
const error = ref(null)
// @ts-ignore
const manifestActivity: Ref<ManifestActivity> = ref(null)
const pgcrs: Ref<DestinyPostGameCarnageReportData[]> = ref([])
const sortedWeapons: Ref<PgcrWeapon[]> = ref([])
const sortedTeammates: Ref<PgcrTeammate[]> = ref([])
// @ts-ignore
const pgcrStats: Ref<PgcrStats> = ref({})
const currentMembershipId: Ref<string | null> = ref(null)
const currentActivityName: Ref<string | null> = ref(null)


const sharedDataStore = useSharedData()

// --------------------------------------------

// watch for route changes
const route = useRoute()
watch(() => route.params, fetchData, {immediate: true})

async function fetchData(newRoute: any) {
  const membershipType = route.params.membershipType
  const membershipId = route.params.membershipId.toString()
  const activityName: any = route.params.activityName

  if (activityName == undefined) {
    return
  }

  if (!dataLoading.value && currentMembershipId.value == membershipId && currentActivityName.value == activityName) {
    console.log("UserActivity: Ignoring Router change due to unchanged params")
    return
  }

  console.log("UserActivity: Router change, getting new user data")

  error.value = null
  manifestLoading.value = true
  dataLoading.value = true
  // @ts-ignore
  manifestActivity.value = null
  // @ts-ignore
  pgcrStats.value = {}
  sortedWeapons.value = []
  sortedTeammates.value = []
  currentMembershipId.value = null
  currentActivityName.value = null

  // use stores
  const destinyManifest = useDestinyManifestStore()

  try {
    // get player info
    sharedDataStore.currentAccount = await getPlayerInfo(membershipId, membershipType)
    document.title = `${sharedDataStore.currentAccount.name} | ${activityName}`

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
    pgcrStats.value = calcStats(pgcrs.value, membershipId)
    sortedWeapons.value = sortWeapons(Object.values(pgcrStats.value.weaponStats))
    sortedTeammates.value = sortTeammates(Object.values(pgcrStats.value.teammates))

  } catch (err: any) {
    console.log(err)
    error.value = err.message
    throw err
  } finally {
    currentMembershipId.value = membershipId
    currentActivityName.value = activityName
    dataLoading.value = false
  }
}

// todo custom scroll bar
// todo weapons / teammates need pages :D -> https://activities.report/3/4611686018467765462/All%20-%20Dungeon
// todo wenn ich über stats hovere, steht da undefined -> https://activities.report/3/4611686018467765462/All%20-%20Dungeon
// todo weapon stats seem wrong. No way I only have 300 weapon kills with my most used wepaon -> https://activities.report/3/4611686018467765462/All%20-%20Dungeon
// todo chartjs hat so ne eigne achse mit einheiten - why? Löschen
// todo make sure this doiesnt say personal flawless anymore
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

// todo this is obv wrong too -> https://activities.report/3/4611686018467205801/Crown%20of%20Sorrow:%20Normal
// todo I'm sure exiled doesnt have 15k forge clears lol -> https://activities.report/3/4611686018468433098
// todo this times out - improve timeout code -> https://activities.report/3/4611686018468433098/All%20-%20Forge%20Ignition
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
        <div class="absolute top-0 h-full w-full flex flex-col items-center gap-2 px-2">
          <!-- User -->
          <div v-if="!manifestLoading" class="rounded-lg border-b-2 border-x-2 border-text_bright">
            <UserSummaryCard :user="sharedDataStore.currentAccount" :loading="manifestLoading"/>
          </div>

          <!-- Activity Name -->
          <div
              class="text-text_bright text-center font-extrabold text-2xl sm:text-3xl md:text-5xl text-shadow shadow-bg_box">
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
          <div class="hidden md:block text-text_dull text-md italic text-shadow-xs shadow-bg_box pt-4">
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

        <div class="absolute bottom-2 left-2">
          <div class="flex gap-4">
            <!-- Playtime -->
            <div v-if="dataLoading" class="w-16 h-12">
              <LoadingDiv class="!bg-bg_site"/>
            </div>
            <ActivityClassStat v-else name="Playtime" :amount="pgcrStats.totalTime" time/>

            <!-- Completion % -->
            <div v-if="dataLoading" class="w-16 h-12">
              <LoadingDiv class="!bg-bg_site"/>
            </div>
            <ActivityClassStat v-else name="Successful Clears" :amount="pgcrStats.percentageClears" percent show-null/>
          </div>
        </div>
      </div>

      <div v-if="dataLoading" class="p-4 w-full h-40">
        <LoadingDiv text="Requesting in-depth data from bungie, this can take a while..." class="!bg-bg_site"/>
      </div>
      <div v-else>
        <!-- Special Tags -->
        <div v-if="Object.keys(pgcrStats.specialTags).length > 0" class="h-10 flex space-x-1 py-1 px-2">
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
            <div class="hidden md:block">
              <StatsContainer name="Clears">
                <ActivityClassStat name="Combined" :amount="pgcrStats.combinedClears.amount" show-null/>
                <ActivityClassStat name="Special Full" :amount="pgcrStats.specialFullClears.amount" show-null big/>
                <ActivityClassStat name="Full" :amount="pgcrStats.fullClears.amount" show-null big/>
                <ActivityClassStat name="Checkpoint" :amount="pgcrStats.cpClears.amount" show-null big/>
                <ActivityClassStat name="Failed" :amount="pgcrStats.failedClears.amount" show-null/>

                <div class="col-span-full w-full pt-2 grid grid-cols-3 place-items-center gap-8">
                  <ActivityClearTime name="Special Full" :data="pgcrStats.specialFullClears"/>
                  <ActivityClearTime name="Full" :data="pgcrStats.fullClears"/>
                  <ActivityClearTime name="Checkpoint" :data="pgcrStats.cpClears"/>
                </div>
              </StatsContainer>
            </div>

            <div class="block md:hidden">
              <StatsContainer name="Clears" class-overwrite="grid-cols-3 md:grid-cols-5">
                <ActivityClassStat name="Special Full" :amount="pgcrStats.specialFullClears.amount" show-null big/>
                <ActivityClassStat name="Full" :amount="pgcrStats.fullClears.amount" show-null big/>
                <ActivityClassStat name="Checkpoint" :amount="pgcrStats.cpClears.amount" show-null big/>
                <div class="col-span-full grid grid-cols-2 gap-8">
                  <ActivityClassStat name="Combined" :amount="pgcrStats.combinedClears.amount" show-null/>
                  <ActivityClassStat name="Failed" :amount="pgcrStats.failedClears.amount" show-null/>
                </div>

                <div class="col-span-full w-full pt-12 grid grid-cols-1 place-items-center gap-8">
                  <ActivityClearTime name="Special Full" :data="pgcrStats.specialFullClears"/>
                  <ActivityClearTime name="Full" :data="pgcrStats.fullClears"/>
                  <ActivityClearTime name="Checkpoint" :data="pgcrStats.cpClears"/>
                </div>
              </StatsContainer>
            </div>

            <StatsContainer name="History">
              <div class="w-full col-span-full flex flex-col md:flex-row">
                <!-- Clear Markers -->
                <div v-if="pgcrStats.data.length > 0" class="pl-4 h-40 w-full md:w-[45%]">
                  <ClearMarkers :activities="pgcrStats"/>
                </div>
                <div v-else class="w-[45%] justify-center font-medium italic text-sm text-text_dull flex h-full">
                  <div class="flex flex-col justify-center h-full">
                    You have never run this
                  </div>
                </div>
                <div class="w-full md:w-[55%] max-h-40 overflow-y-scroll flex flex-col gap-1 py-1 pr-4">
                  <RouterLink v-for="data in pgcrStats.data" :to="`/pgcr/${data.instanceId}`">
                    <div class="text-center">
                      <div class="flex gap-2 items-center clickable px-2 py-1">
                        <CompletionIcon
                            :special="data.completed && Object.keys(data.specialTags).length > 0"
                            :full="data.completed && !data.cp"
                            :cp="data.completed"
                        />

                        <div
                            class="w-full grid grid-cols-3 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-5 gap-2 divide-x-2 divide-text_dull">
                          <div class="col-span-2">
                            <p v-if="data.completed && Object.keys(data.specialTags).length > 0"
                               class="text-text_bright">
                              Special
                              Full Clear</p>
                            <p v-else-if="data.completed && data.cp!">Full Clear</p>
                            <p v-else-if="data.completed" class="text-text_dull">Checkpoint Clear</p>
                            <p v-else class="text-text_dull">Failed Clear</p>
                          </div>

                          <div class="hidden sm:block md:hidden lg:block col-span-2">
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
              <div
                  class="w-full col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-4"
              >
                <ActivityWeapon v-for="weapon in sortedWeapons" :data="weapon" bg="bg-bg_site"/>
              </div>
            </StatsContainer>

            <StatsContainer name="Teammates">
              <div
                  class="w-full col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-4"
              >
                <ActivityMember v-for="teammate in sortedTeammates" :data="teammate"/>
              </div>
            </StatsContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
