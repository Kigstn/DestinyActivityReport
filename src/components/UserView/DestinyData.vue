<script setup lang="ts">

import {getActivities, getManifestActivities} from "@/funcs/bungie";
import {useRoute} from "vue-router";
import {useLocalStorage} from "@vueuse/core";
import {getDestinyManifest} from "bungie-api-ts/destiny2";
import {bungieClient} from "@/funcs/bungieClient";
import Activity from "@/components/UserView/Activities/Activity.vue";
import ActivitySearch from "@/components/UserView/Activities/ActivitySearch.vue";
import {Separator} from "radix-vue";

const route = useRoute()

const membershipType = route.params.membershipType
const membershipId = route.params.membershipId

const data = await getActivities(membershipId, membershipType)

// get the manifest data for the activities
// make sure to check if the version changed - else do not re-download
const destinyManifest = useLocalStorage("destinyManifest", {version: "empty", activities: {}})

if (!import.meta.env.DEV) {
  const manifest = await getDestinyManifest(bungieClient)
  if (manifest.Response.version != destinyManifest.value.version) {
    destinyManifest.value.activities = await getManifestActivities(manifest.Response)
    destinyManifest.value.version = manifest.Response.version
  }
}

// sort data by activities
const dataByActivities: {[id: string]: {}[]} = {}
for (const entry of data) {
  if (!(entry.activityDetails.referenceId in dataByActivities)) {
    dataByActivities[entry.activityDetails.referenceId] = []
  }
  dataByActivities[entry.activityDetails.referenceId].push(entry)
}


// const MYID = '283043'
const MYID = '28778404'

</script>

<template>
  <ActivitySearch/>
  <Separator class="p-4"/>

  <div class="grid grid-cols-4 gap-4">
    <Activity :activities="dataByActivities[MYID]" :manifest-activity="destinyManifest.activities[MYID]"/>
  </div>

</template>
