<script setup lang="ts">

import {getActivities, getManifestActivities} from "@/funcs/bungie";
import {useRoute} from "vue-router";
import {useLocalStorage} from "@vueuse/core";
import {vInfiniteScroll} from '@vueuse/components'
import {getDestinyManifest} from "bungie-api-ts/destiny2";
import {bungieClient} from "@/funcs/bungieClient";
import Activity from "@/components/UserView/Activities/Activity.vue";
import ActivityFilter from "@/components/UserView/Activities/ActivityFilter.vue";
import {CollapsibleContent, CollapsibleRoot, Separator} from "radix-vue";
import {ref} from "vue";
import TopicBar from "@/components/UserView/TopicBar.vue";

const route = useRoute()

const membershipType = route.params.membershipType
const membershipId = route.params.membershipId

const data = await getActivities(membershipId, membershipType)

// get the manifest data for the activities
// make sure to check if the version changed - else do not re-download
const destinyManifest = useLocalStorage("destinyManifest", {version: "empty", activities: [["emptyKey", {}]]})
if (import.meta.env.DEV) {
  const manifest = await getDestinyManifest(bungieClient)
  if (manifest.Response.version != destinyManifest.value.version) {
    destinyManifest.value.activities = await getManifestActivities(manifest.Response)
    destinyManifest.value.version = manifest.Response.version
  }
}

// sort data by activities
const dataByActivities: { [id: string]: any[] } = {}
for (const entry of data) {
  if (!(entry.activityDetails.referenceId in dataByActivities)) {
    dataByActivities[entry.activityDetails.referenceId] = []
  }
  dataByActivities[entry.activityDetails.referenceId].push(entry)
}

// make this an infinite scroll
const initialData: any = ref([])
const loadingData: any = []
let i = 0
for (const entry of destinyManifest.value.activities) {
  i += 1

  if (i > 24) {
    loadingData.push(entry)
  } else {
    initialData.value.push(entry)
  }
}

function onLoadMore() {
  // load more
  for (let j = 1; j <= 4; j++) {
    const entry: any = loadingData.shift()
    if (entry == undefined) {
      break
    }
    initialData.value.push(entry)
  }
}

// collapsible triggers
const openPinned = ref(true)
const openAll = ref(true)
</script>

<template>
  <div class="flex flex-col justify-between h-full">
      <CollapsibleRoot v-model:open="openPinned">
        <TopicBar name="Pinned" :open="openPinned">
          <template #icon>
            <svg width="30" height="30" viewBox="0 0 15 15" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M9.62129 1.13607C9.81656 0.940808 10.1331 0.940809 10.3284 1.13607L11.3891 2.19673L12.8033 3.61094L13.8639 4.6716C14.0592 4.86687 14.0592 5.18345 13.8639 5.37871C13.6687 5.57397 13.3521 5.57397 13.1568 5.37871L12.5038 4.7257L8.86727 9.57443L9.97485 10.682C10.1701 10.8773 10.1701 11.1939 9.97485 11.3891C9.77959 11.5844 9.463 11.5844 9.26774 11.3891L7.85353 9.97491L6.79287 8.91425L3.5225 12.1846C3.32724 12.3799 3.01065 12.3799 2.81539 12.1846C2.62013 11.9894 2.62013 11.6728 2.81539 11.4775L6.08576 8.20714L5.0251 7.14648L3.61089 5.73226C3.41563 5.537 3.41562 5.22042 3.61089 5.02516C3.80615 4.8299 4.12273 4.8299 4.31799 5.02516L5.42557 6.13274L10.2743 2.49619L9.62129 1.84318C9.42603 1.64792 9.42603 1.33133 9.62129 1.13607Z"
                  fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
              <path
                  d="M9.62129 1.13607C9.81656 0.940808 10.1331 0.940809 10.3284 1.13607L11.3891 2.19673L12.8033 3.61094L13.8639 4.6716C14.0592 4.86687 14.0592 5.18345 13.8639 5.37871C13.6687 5.57397 13.3521 5.57397 13.1568 5.37871L12.5038 4.7257L8.86727 9.57443L9.97485 10.682C10.1701 10.8773 10.1701 11.1939 9.97485 11.3891C9.77959 11.5844 9.463 11.5844 9.26774 11.3891L7.85353 9.97491L6.79287 8.91425L3.5225 12.1846C3.32724 12.3799 3.01065 12.3799 2.81539 12.1846C2.62013 11.9894 2.62013 11.6728 2.81539 11.4775L6.08576 8.20714L5.0251 7.14648L3.61089 5.73226C3.41563 5.537 3.41562 5.22042 3.61089 5.02516C3.80615 4.8299 4.12273 4.8299 4.31799 5.02516L5.42557 6.13274L10.2743 2.49619L9.62129 1.84318C9.42603 1.64792 9.42603 1.33133 9.62129 1.13607Z"
                  fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
          </template>

          <div>
            adsasd
          </div>
          <div>
            asdasgjht6
          </div>
        </TopicBar>

        <CollapsibleContent
            class="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
            <div
                v-infinite-scroll="[onLoadMore, { distance: 1000 }]"
                class="grid justify-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-full h-[400px] overflow-y-auto"
            >
              <Activity
                  v-for="entry in initialData"
                  :key="entry[0]"
                  :activities="dataByActivities[entry[0]]"
                  :manifest-activity="entry[1]"
              />
          </div>
        </CollapsibleContent>
      </CollapsibleRoot>

      <CollapsibleRoot v-model:open="openAll">
        <TopicBar name="All Activities" :open="openAll">
          <template #icon>
            <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M7.85367 1.48956C7.65841 1.29429 7.34182 1.29429 7.14656 1.48956L1.48971 7.14641C1.29445 7.34167 1.29445 7.65825 1.48971 7.85352L7.14656 13.5104C7.34182 13.7056 7.65841 13.7056 7.85367 13.5104L13.5105 7.85352C13.7058 7.65825 13.7058 7.34167 13.5105 7.14641L7.85367 1.48956ZM7.5 2.55033L2.55037 7.49996L7.5 12.4496V2.55033Z"
                  fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
          </template>

          <!-- todo -->
          <!-- Filter by: Mode, Name, Tags (player amount, pvp, matchmade, playlist), special tags, clears > x, special clears > x -->
          <ActivityFilter placeholder="Activity Mode"/>

          <!-- todo -->
          <!-- Sort by: Clears, Special Clears, Time Spent, Fastest, Kills, Assists, Deaths -->

        </TopicBar>

        <CollapsibleContent
            class="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
          <div>
            Hi
          </div>
        </CollapsibleContent>
      </CollapsibleRoot>
  </div>
</template>
