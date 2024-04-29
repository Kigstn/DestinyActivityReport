<script setup lang="ts">

import {getActivities, getManifestActivities} from "@/funcs/bungie";
import {useRoute} from "vue-router";
import {useLocalStorage} from "@vueuse/core";
import {getDestinyManifest} from "bungie-api-ts/destiny2";
import {bungieClient} from "@/funcs/bungieClient";

const route = useRoute()

const membershipType = route.params.membershipType
const membershipId = route.params.membershipId

const data = await getActivities(membershipId, membershipType)

// get the manifest data for the activities
// make sure to check if the version changed - else do not re-download
const destinyManifest = useLocalStorage("destinyManifest", {version: "empty", activities: {}})

const manifest = await getDestinyManifest(bungieClient)
if (manifest.Response.version != destinyManifest.value.version) {
  destinyManifest.value.activities = await getManifestActivities(manifest.Response)
  destinyManifest.value.version = manifest.Response.version
}

</script>

<template>
  <div>
    {{data}}
  </div>
</template>
