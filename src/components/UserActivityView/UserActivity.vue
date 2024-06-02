<script setup lang="ts">
import {useRoute} from "vue-router";
import {type Ref, ref, watch} from "vue";
import {getActivities, getPlayerInfo, type ManifestActivity} from "@/funcs/bungie";
import {useDestinyManifestStore, useSharedData} from "@/funcs/store";
import Tag from "@/components/UserView/Tag.vue";


// use stores
const destinyManifest = useDestinyManifestStore()
const sharedDataStore = useSharedData()

// vars we need
const loading = ref(false)
const error = ref(null)
// @ts-ignore
const manifestActivity: Ref<ManifestActivity> = ref(null)

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
  loading.value = true

  try {
    for (const entry of destinyManifest.manifest.activities) {
      if (entry[0] == activityName) {
        // @ts-ignore
        manifestActivity.value = entry[1]
        break
      }
    }


  } catch (err: any) {
    error.value = err.message
    console.log(err.toString())
  } finally {
    loading.value = false
  }
}


// todo make sure that all
</script>

<template>
  <div class="mx-4 rounded-2xl bg-bg_box flex flex-col" :id="manifestActivity.hash">
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


    <div>{{ manifestActivity }}</div>
  </div>

</template>
