<script setup lang="ts">

import {getActivities, getManifestActivities} from "@/funcs/bungie";
import {useRoute} from "vue-router";
import {useLocalStorage} from "@vueuse/core";
import {vInfiniteScroll} from '@vueuse/components'
import {getDestinyManifest} from "bungie-api-ts/destiny2";
import {bungieClient} from "@/funcs/bungieClient";
import Activity from "@/components/UserView/Activities/Activity.vue";
import ActivitySearch from "@/components/UserView/Activities/ActivitySearch.vue";
import {Separator} from "radix-vue";
import {ref} from "vue";

const route = useRoute()

const membershipType = route.params.membershipType
const membershipId = route.params.membershipId

const data = await getActivities(membershipId, membershipType)

// get the manifest data for the activities
// make sure to check if the version changed - else do not re-download
const destinyManifest = useLocalStorage("destinyManifest", {version: "empty", activities: [["emptyKey", {}]]})

  const manifest = await getDestinyManifest(bungieClient)
  if (manifest.Response.version != destinyManifest.value.version) {
    destinyManifest.value.activities = await getManifestActivities(manifest.Response)
    destinyManifest.value.version = manifest.Response.version
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
</script>

<template>
  <ActivitySearch/>
  <Separator class="p-4"/>

  <div class="h-[400px]">
    <div
        v-infinite-scroll="[onLoadMore, { distance: 1000 }]"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-scroll max-h-full"
    >
      <Activity
          v-for="entry in initialData"
          :key="entry[0]"
          :activities="dataByActivities[entry[0]]"
          :manifest-activity="entry[1]"
      />
    </div>
  </div>

</template>
