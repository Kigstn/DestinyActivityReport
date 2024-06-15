<script setup lang="ts">
import {
  specialTags,
  getActivities,
  type ManifestActivity,
  getPlayerInfo,
  type PlayerProfile, type ActivityStats, type PlayedActivities,
} from "@/funcs/bungie";
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import {useLocalStorage, useWindowScroll, useElementSize} from "@vueuse/core";
import Activity from "@/components/UserView/Activities/Activity.vue";
import MultipleItems from "@/components/UserView/Sidebar/Filters/MultipleItems.vue";
import {RadioGroupRoot} from 'radix-vue'
import {reactive, type Ref, ref, watch} from "vue";
import TopicBar from "@/components/UserView/TopicBar.vue";
import Sidebar from "@/components/UserView/Sidebar/Sidebar.vue";
import SidebarSection from "@/components/UserView/Sidebar/SidebarSection.vue";
import BetweenValue from "@/components/UserView/Sidebar/Filters/BetweenValue.vue";
import TextFilter from "@/components/UserView/Sidebar/Filters/TextFilter.vue";
import SingleItem from "@/components/UserView/Sidebar/Filters/SingleItem.vue";
import {
  useFilterStore,
  useDestinyManifestStore,
  useSharedData,
  useSortingStore
} from "@/funcs/store";
import UserSummary from "@/components/UserView/UserSummary/UserSummary.vue";
import LoadingDiv from "@/components/LoadingDiv.vue";
import ErrorDiv from "@/components/ErrorDiv.vue";

type ActivityType = [string, ManifestActivity]

const route = useRoute()

const userLoading = ref(true)
const loading = ref(true)
const error = ref(null)
const statsByActivity: Ref<{ [p: string]: ActivityStats }> = ref({})
const currentMembershipId: Ref<string | null> = ref(null)

// use stores
const destinyManifest = useDestinyManifestStore()
const filterStore = useFilterStore()
const sortingStore = useSortingStore()
const sharedDataStore = useSharedData()

// vars we need
const favoriteAccounts: Ref<{ [membershipId: string]: PlayerProfile }> = useLocalStorage("favoriteAccounts", {})

const aggregatedClears = ref(0)
const aggregatedSpecialClears = ref(0)
const aggregatedTimeSpent = ref(0)
const aggregatedKills = ref(0)
const aggregatedDeaths = ref(0)
const aggregatedAssists = ref(0)

const initialData: Ref<ActivityType[]> = ref([])
let loadingData: ActivityType[] = []

const {x, y} = useWindowScroll()
const allActivitiesDiv = ref(null)
const activitiesDivSize = reactive(useElementSize(allActivitiesDiv))
const cutoffHeight = 1500
let currentlyLoadingMore = false

// tracked what is pinned (by name)
let currentTab: Ref<string>
if (sharedDataStore.pinnedActivities.size > 0) {
  currentTab = ref("Pinned")
} else {
  currentTab = ref("All Activities")
}

// --------------------------------------------

// load data on page change
watch(() => route.params, fetchData, {immediate: true})

async function fetchData(newRoute: any) {
  const membershipType = route.params.membershipType
  const membershipId = route.params.membershipId.toString()

  if (route.params.activityName != undefined) {
    return
  }

  if (!loading.value && currentMembershipId.value == membershipId) {
    console.log("DestinyData: Ignoring Router change due to unchanged params")
    return
  }

  console.log("DestinyData: Router change, getting new user data")

  error.value = null
  currentMembershipId.value = null
  loading.value = true
  userLoading.value = true

  try {
    // get player info
    sharedDataStore.currentAccount = await getPlayerInfo(membershipId, membershipType)
    document.title = `${sharedDataStore.currentAccount.name} | Activity Report`

    if (sharedDataStore.currentAccount.membershipId in favoriteAccounts.value) {
      favoriteAccounts.value[sharedDataStore.currentAccount.membershipId] = sharedDataStore.currentAccount
    }
    userLoading.value = false

    // get activities of player
    const data = await getActivities(membershipId, membershipType)
    statsByActivity.value = prepareData(data)
    resetActivitiesOnFilterChange()
  } catch (err: any) {
    error.value = err.message
    throw err
  } finally {
    loading.value = false
    currentMembershipId.value = membershipId
  }
}

// --------------------------------------------

// sort data by activities
function prepareData(data: PlayedActivities[]) {
  const dataByActivities: { [name: string]: any[] } = {}
  for (const entry of data) {
    if (!(entry.activityDetails.referenceId in dataByActivities)) {
      dataByActivities[entry.activityDetails.referenceId] = []
    }
    dataByActivities[entry.activityDetails.referenceId].push(entry)
  }

  const statsByActivity: { [id: string]: ActivityStats } = {}
  for (const entry of destinyManifest.manifest.activities) {
    const data: ManifestActivity | any = entry[1]

    // get relevant activities
    const activityData = []
    for (const hash of data.hash) {
      if (hash in dataByActivities) {
        activityData.push(...dataByActivities[hash])
      }
    }

    // calculate stats for activity
    let activityClears = 0
    let activitySpecial = 0
    let activityKills = 0
    let activityAssists = 0
    let activityDeaths = 0
    let activitySpecials: { [id: string]: { instanceId: string, amount: number } } = {}
    const activityTimes: number[] = []
    for (const x of activityData) {
      activityKills += x.values.kills.basic.value
      activityAssists += x.values.assists.basic.value
      activityDeaths += x.values.deaths.basic.value

      if (x.completed) {
        activityTimes.push(x.lengthSeconds)
      }
      if (x.specialTags) {
        activitySpecial += 1
        for (const specialTag of x.specialTags) {
          if (!(specialTag in activitySpecials)) {
            activitySpecials[specialTag] = {amount: 0, instanceId: x.instanceId}
          }
          activitySpecials[specialTag].amount += 1
          activitySpecials[specialTag].instanceId = x.instanceId
        }
      }
      if (x.completed) {
        activityClears += 1
      }
    }
    let activityTimeMax: number | null = null
    let activityTimeMin: number | null = null
    let activityTimeAvg: number | null = null
    let activityTimeSum = 0
    if (activityTimes.length != 0) {
      for (let i = 0; i < activityTimes.length; i++) {
        activityTimeSum += activityTimes[i];
      }
      activityTimeMax = Math.max(...activityTimes)
      activityTimeMin = Math.min(...activityTimes)
      activityTimeAvg = activityTimeSum / activityTimes.length
    }

    statsByActivity[data.name] = {
      clears: activityClears,
      specialClears: activitySpecial,
      specialTags: activitySpecials,
      kills: activityKills,
      assists: activityAssists,
      deaths: activityDeaths,
      timeSum: activityTimeSum,
      timeMax: activityTimeMax,
      timeMin: activityTimeMin,
      timeAvg: activityTimeAvg,

      data: activityData,
    }
  }

  return statsByActivity
}

// --------------------------------------------
// sorting
// todo - whenever we can filter by clears / special clears. for that the information needs to be calculated earlier than it currently is
// <!-- Sort by: Clears, Special Clears, Time Spent, Fastest, Kills, Assists, Deaths -->

function resetSorting() {
  sortingStore.resetSorting()
  resetActivitiesOnFilterChange()
}

function sortedActivities(data: ActivityType[]) {
  let sortedData: ActivityType[] = []

  switch (sortingStore.activitySortingType) {
    case "Activity Mode": {
      // sort them by mode and then by name
      const partlySorted = data.sort((a: ActivityType, b: ActivityType) => {
            if (a[1].activityMode > b[1].activityMode) {
              return 1
            } else if (a[1].activityMode == b[1].activityMode) {
              return 0
            } else {
              return -1
            }
          }
      )
      // if mode is same check name
      sortedData = partlySorted.sort((a, b) => {
        // check mode - if same check name
        if (a[1].activityMode == b[1].activityMode) {
          if (a[1].name > b[1].name) {
            return 1
          } else if (a[1].name == b[1].name) {
            return 0
          } else {
            return -1
          }
        } else {
          return -1
        }
      })
      break
    }

    case "Activity Name": {
      sortedData = data.sort((a: ActivityType, b: ActivityType) => {
            if (a[1].name > b[1].name) {
              return 1
            } else if (a[1].name == b[1].name) {
              return 0
            } else {
              return -1
            }
          }
      )
      break
    }

    default: {
      console.log("Sorting is fucked! :)")
    }
  }

  if (sortingStore.activitySortingMode == "Asc.") {
    return sortedData
  } else {
    return sortedData.reverse()
  }
}

// --------------------------------------------
// filters

function resetFilters() {
  filterStore.resetFilters()
  resetActivitiesOnFilterChange()
}

// whenever the filter changes, load the activities
function resetActivitiesOnFilterChange() {
  let filteredData: ActivityType[] = []
  let filteredActivityData: { [p: string]: ActivityStats } = {}
  if (Object.keys(statsByActivity.value).length == 0) {
    return
  }
  for (const entry of destinyManifest.manifest.activities) {
    const data: ManifestActivity | any = entry[1]
    const activityData = getDataByActivities(data)

    // show all, or show pinned activities?
    if (currentTab.value == "Pinned") {
      if (!sharedDataStore.pinnedActivities.has(data.name)) {
        continue
      }
    }

    // make sure the filters are respected
    // activity name
    if (filterStore.activityNameFilter) {
      if (!data.name.toLowerCase().includes(filterStore.activityNameFilter.toLowerCase())) {
        continue
      }
    }

    // activity mode
    if (filterStore.activityModeFilter.length > 0) {
      if (!filterStore.activityModeFilter.includes(data.activityMode)) {
        continue
      }
    }

    // achievement tags
    if (filterStore.achievementTagsFilter.length > 0) {
      if (activityData) {
        const founds = []
        for (const tag of filterStore.achievementTagsFilter) {
          founds.push(activityData.specialTags[tag] != undefined)
        }
        if (!founds.every(v => v === true)) {
          continue
        }
      } else {
        continue
      }
    }

    // activity tags
    if (filterStore.activityTagsFilter.length > 0) {
      const founds = []
      for (const tag of filterStore.activityTagsFilter) {
        founds.push(data.tags.includes(tag))
      }
      if (!founds.every(v => v === true)) {
        continue
      }
    }

    // activity max players
    if (data.maxPlayers > filterStore.activityMaxPlayerCountFilter) {
      continue
    }

    // @ts-ignore
    filteredData.push(entry)
    filteredActivityData[data.name] = activityData
  }

  // calc the global stats
  let clears = 0
  let specialClears = 0
  let timeSpent = 0
  let kills = 0
  let deaths = 0
  let assists = 0
  for (const [name, value] of Object.entries(filteredActivityData)) {
    clears += value.clears
    specialClears += value.specialClears
    timeSpent += value.timeSum
    kills += value.kills
    deaths += value.deaths
    assists += value.assists
  }
  aggregatedClears.value = clears
  aggregatedSpecialClears.value = specialClears
  aggregatedTimeSpent.value = timeSpent
  aggregatedKills.value = kills
  aggregatedDeaths.value = deaths
  aggregatedAssists.value = assists

  // sort and split into parts
  filteredData = sortedActivities(filteredData)
  splitActivities(filteredData)
}

// --------------------------------------------

// make this an infinite scroll
// read the window position
watch(
    y,
    (newY, oldY) => {
      if (!currentlyLoadingMore) {
        if (newY > oldY) {
          if ((newY + cutoffHeight) >= activitiesDivSize.height) {
            onLoadMore()
          }
        }
      }
    },
)


// split the entries between the ones to load instantly and the backup
function splitActivities(data: ActivityType[]) {
  const results: ActivityType[] = []
  const resultsLoading: ActivityType[] = []
  let i = 0
  for (const entry of data) {
    i += 1
    if (i > 12) {
      resultsLoading.push(entry)
    } else {
      results.push(entry)
    }
  }

  loadingData = resultsLoading
  initialData.value = results
}

// load more activities if scrolled down
function onLoadMore() {
  currentlyLoadingMore = true
  for (let j = 1; j <= 4; j++) {
    const entry: any = loadingData.shift()
    if (entry == undefined) {
      break
    }
    initialData.value.push(entry)
  }
  currentlyLoadingMore = false
}

function getDataByActivities(activity: ManifestActivity): ActivityStats {
  return statsByActivity.value[activity.name]
}

// todo clears / kills / ... for filters / sorting
</script>

<template>
  <ErrorDiv v-if="error">
    {{ error }}
  </ErrorDiv>

  <div v-else class="w-full flex flex-col justify-center gap-4">
    <UserSummary
        :user="sharedDataStore.currentAccount"
        :clears="aggregatedClears"
        :specialClears="aggregatedSpecialClears"
        :timeSpent="aggregatedTimeSpent"
        :kills="aggregatedKills"
        :deaths="aggregatedDeaths"
        :assists="aggregatedAssists"
        :loading="loading"
        :userLoading="userLoading"
    />

    <div class="flex w-full justify-between gap-4 h-full px-2 sm:px-4">
      <Sidebar name="Filter Activities">
        <template v-slot:icon>
          <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 5C3.01671 5 3.03323 4.99918 3.04952 4.99758C3.28022 6.1399 4.28967 7 5.5 7C6.71033 7 7.71978 6.1399 7.95048 4.99758C7.96677 4.99918 7.98329 5 8 5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H8C7.98329 4 7.96677 4.00082 7.95048 4.00242C7.71978 2.86009 6.71033 2 5.5 2C4.28967 2 3.28022 2.86009 3.04952 4.00242C3.03323 4.00082 3.01671 4 3 4H1.5C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H3ZM11.9505 10.9976C11.7198 12.1399 10.7103 13 9.5 13C8.28967 13 7.28022 12.1399 7.04952 10.9976C7.03323 10.9992 7.01671 11 7 11H1.5C1.22386 11 1 10.7761 1 10.5C1 10.2239 1.22386 10 1.5 10H7C7.01671 10 7.03323 10.0008 7.04952 10.0024C7.28022 8.8601 8.28967 8 9.5 8C10.7103 8 11.7198 8.8601 11.9505 10.0024C11.9668 10.0008 11.9833 10 12 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H12C11.9833 11 11.9668 10.9992 11.9505 10.9976ZM8 10.5C8 9.67157 8.67157 9 9.5 9C10.3284 9 11 9.67157 11 10.5C11 11.3284 10.3284 12 9.5 12C8.67157 12 8 11.3284 8 10.5Z"
                fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>
        </template>

        <SidebarSection name="General Filters">
          <!-- Filter by: Name -->
          <TextFilter
              :loading="loading"
              name="Activity Name"
              :content="filterStore.activityNameFilter"
              @filterChange="(n: string) => {
                filterStore.activityNameFilter = n
                resetActivitiesOnFilterChange()
              }"
          />

          <!-- Filter by: player amount -->
          <BetweenValue
              :loading="loading"
              name="Maximum Players"
              :min="1"
              :max="destinyManifest.manifest.maxPlayers"
              :content="filterStore.activityMaxPlayerCountFilter"
              @filterChange="(n: number) => {
                filterStore.activityMaxPlayerCountFilter = n
                resetActivitiesOnFilterChange()
              }"
          />
        </SidebarSection>

        <SidebarSection name="<OR> Filters">
          <!-- Filter by: Mode -->
          <MultipleItems
              :loading="loading"
              placeholder="Activity Mode"
              :options="destinyManifest.manifest.modes"
              :content="filterStore.activityModeFilter"
              @filterChange="resetActivitiesOnFilterChange()"
          />
        </SidebarSection>

        <SidebarSection name="<AND> Filters">
          <!-- Filter by: Achievements -->
          <MultipleItems
              :loading="loading"
              placeholder="Achievement Tags"
              :options="Object.keys(specialTags)"
              :content="filterStore.achievementTagsFilter"
              @filterChange="resetActivitiesOnFilterChange()"
          />

          <!-- Filter by: Tags -->
          <MultipleItems
              :loading="loading"
              placeholder="Activity Tags"
              :options="destinyManifest.manifest.tags"
              :content="filterStore.activityTagsFilter"
              @filterChange="resetActivitiesOnFilterChange()"
          />
        </SidebarSection>

        <!-- Reset Filters -->

        <div class="flex justify-center">
          <button
              class="clickable mt-4 p-2 shrink !text-text_bright"
              @click="resetFilters()"
          >
            Reset
          </button>
        </div>
      </Sidebar>

      <div class="flex flex-col max-w-[1600px] grow">
        <RadioGroupRoot
            v-model="currentTab"
            :default-value="currentTab"
            orientation="vertical"
            @update:modelValue="resetActivitiesOnFilterChange()"
            class="grid grid-cols-2 gap-2 text-text_bright font-bold xs:text-xl sm:text-2xl text-shadow shadow-bg_site"
        >
          <TopicBar name="Pinned">
            <svg width="30" height="30" viewBox="0 0 15 15" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M9.62129 1.13607C9.81656 0.940808 10.1331 0.940809 10.3284 1.13607L11.3891 2.19673L12.8033 3.61094L13.8639 4.6716C14.0592 4.86687 14.0592 5.18345 13.8639 5.37871C13.6687 5.57397 13.3521 5.57397 13.1568 5.37871L12.5038 4.7257L8.86727 9.57443L9.97485 10.682C10.1701 10.8773 10.1701 11.1939 9.97485 11.3891C9.77959 11.5844 9.463 11.5844 9.26774 11.3891L7.85353 9.97491L6.79287 8.91425L3.5225 12.1846C3.32724 12.3799 3.01065 12.3799 2.81539 12.1846C2.62013 11.9894 2.62013 11.6728 2.81539 11.4775L6.08576 8.20714L5.0251 7.14648L3.61089 5.73226C3.41563 5.537 3.41562 5.22042 3.61089 5.02516C3.80615 4.8299 4.12273 4.8299 4.31799 5.02516L5.42557 6.13274L10.2743 2.49619L9.62129 1.84318C9.42603 1.64792 9.42603 1.33133 9.62129 1.13607Z"
                  fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
              <path
                  d="M9.62129 1.13607C9.81656 0.940808 10.1331 0.940809 10.3284 1.13607L11.3891 2.19673L12.8033 3.61094L13.8639 4.6716C14.0592 4.86687 14.0592 5.18345 13.8639 5.37871C13.6687 5.57397 13.3521 5.57397 13.1568 5.37871L12.5038 4.7257L8.86727 9.57443L9.97485 10.682C10.1701 10.8773 10.1701 11.1939 9.97485 11.3891C9.77959 11.5844 9.463 11.5844 9.26774 11.3891L7.85353 9.97491L6.79287 8.91425L3.5225 12.1846C3.32724 12.3799 3.01065 12.3799 2.81539 12.1846C2.62013 11.9894 2.62013 11.6728 2.81539 11.4775L6.08576 8.20714L5.0251 7.14648L3.61089 5.73226C3.41563 5.537 3.41562 5.22042 3.61089 5.02516C3.80615 4.8299 4.12273 4.8299 4.31799 5.02516L5.42557 6.13274L10.2743 2.49619L9.62129 1.84318C9.42603 1.64792 9.42603 1.33133 9.62129 1.13607Z"
                  fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
          </TopicBar>

          <TopicBar name="All Activities">
            <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M7.85367 1.48956C7.65841 1.29429 7.34182 1.29429 7.14656 1.48956L1.48971 7.14641C1.29445 7.34167 1.29445 7.65825 1.48971 7.85352L7.14656 13.5104C7.34182 13.7056 7.65841 13.7056 7.85367 13.5104L13.5105 7.85352C13.7058 7.65825 13.7058 7.34167 13.5105 7.14641L7.85367 1.48956ZM7.5 2.55033L2.55037 7.49996L7.5 12.4496V2.55033Z"
                  fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
          </TopicBar>
        </RadioGroupRoot>

        <div v-if="loading" class="activities_grid">
          <div class="w-[320px] h-[533.333px]" v-for="x in [...Array(8).keys()]">
            <LoadingDiv/>
          </div>
        </div>

        <div
            v-else-if="initialData.length == 0"
            class="italic text-text_dull text-lg p-2 text-center pt-16 flex flex-col gap-2"
        >
          <p>Imagine some cool activity stats here...</p>
          <p>Sadly, nothing exists for your current filters (or you have nothing pinned)</p>
        </div>
        <div
            v-else
            ref="allActivitiesDiv"
            class="activities_grid"
        >
          <Activity
              v-for="entry in initialData"
              :key="entry[0]"
              :activities="getDataByActivities(entry[1])"
              :manifest-activity="entry[1]"
              @filterChange="(n: any) => {
                if (currentTab == 'Pinned') {
                  resetActivitiesOnFilterChange()
                }
              }"
          />
          <div
              class="col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-4 italic text-text_dull/50 text-sm p-2"
          >
            <div class="bg-text_dull/50 h-[1px]"/>
            <p class="pt-1 px-8">
              That's everything :)
            </p>
          </div>
        </div>
      </div>

      <Sidebar name="Sort Activities">
        <template v-slot:icon>
          <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.49999 3.09998C7.27907 3.09998 7.09999 3.27906 7.09999 3.49998C7.09999 3.72089 7.27907 3.89998 7.49999 3.89998H14.5C14.7209 3.89998 14.9 3.72089 14.9 3.49998C14.9 3.27906 14.7209 3.09998 14.5 3.09998H7.49999ZM7.49998 5.1C7.27907 5.1 7.09998 5.27908 7.09998 5.5C7.09998 5.72091 7.27907 5.9 7.49998 5.9H14.5C14.7209 5.9 14.9 5.72091 14.9 5.5C14.9 5.27908 14.7209 5.1 14.5 5.1H7.49998ZM7.1 7.5C7.1 7.27908 7.27909 7.1 7.5 7.1H14.5C14.7209 7.1 14.9 7.27908 14.9 7.5C14.9 7.72091 14.7209 7.9 14.5 7.9H7.5C7.27909 7.9 7.1 7.72091 7.1 7.5ZM7.49998 9.1C7.27907 9.1 7.09998 9.27908 7.09998 9.5C7.09998 9.72091 7.27907 9.9 7.49998 9.9H14.5C14.7209 9.9 14.9 9.72091 14.9 9.5C14.9 9.27908 14.7209 9.1 14.5 9.1H7.49998ZM7.09998 11.5C7.09998 11.2791 7.27907 11.1 7.49998 11.1H14.5C14.7209 11.1 14.9 11.2791 14.9 11.5C14.9 11.7209 14.7209 11.9 14.5 11.9H7.49998C7.27907 11.9 7.09998 11.7209 7.09998 11.5ZM2.5 9.25003L5 6.00003H0L2.5 9.25003Z"
                fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>
        </template>

        <SidebarSection name="Sort By" :right-side="true">
          <!-- Filter by: Tags -->
          <SingleItem
              :loading="loading"
              placeholder="Sorting Type"
              :content="sortingStore.activitySortingType"
              :options="sortingStore.activitySortingOptions"
              @filterChange="(n: any) => {
                sortingStore.activitySortingType = n
                resetActivitiesOnFilterChange()
              }"
          />
        </SidebarSection>

        <SidebarSection name="Direction" :right-side="true">
          <!-- Sort direction -->
          <RadioGroupRoot
              v-model="sortingStore.activitySortingMode"
              :default-value="sortingStore.activitySortingMode"
              orientation="vertical"
              @update:modelValue="resetActivitiesOnFilterChange()"
              class="grid grid-cols-2 gap-1 h-8"
          >
            <TopicBar
                class="!h-8"
                name="Asc."
            >
              <template v-slot:icon>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z"
                      fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>
              </template>
            </TopicBar>
            <TopicBar
                class="!h-8"
                name="Desc."
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 11.2929L11.1464 8.14645C11.3417 7.95118 11.6583 7.95118 11.8536 8.14645C12.0488 8.34171 12.0488 8.65829 11.8536 8.85355L7.85355 12.8536C7.75979 12.9473 7.63261 13 7.5 13C7.36739 13 7.24021 12.9473 7.14645 12.8536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645C3.34171 7.95118 3.65829 7.95118 3.85355 8.14645L7 11.2929L7 2.5C7 2.22386 7.22386 2 7.5 2Z"
                    fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
              </svg>
            </TopicBar>
          </RadioGroupRoot>
        </SidebarSection>

        <div class="flex justify-center">
          <button
              class="clickable mt-4 p-2 shrink !text-text_bright"
              @click="resetSorting()"
          >
            Reset
          </button>
        </div>
      </Sidebar>
    </div>
  </div>
</template>
