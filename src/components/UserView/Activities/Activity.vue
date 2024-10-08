<script setup lang="ts">
import {type ActivityStats, type ManifestActivity} from "@/funcs/bungie";
import type {DestinyHistoricalStatsPeriodGroup} from "bungie-api-ts/destiny2";
import {Toggle} from "radix-vue";
import {Icon} from "@iconify/vue";
import {reactive, ref} from "vue";
import Tag from "@/components/UserView/Tag.vue";
import Clears from "@/components/UserView/Activities/Clears.vue";
import ActivityStat from "@/components/UserView/Activities/ActivityStat.vue";
import BoxClickable from "@/components/UserView/TagClickable.vue";
import ClearMarkers from "@/components/UserView/Activities/ClearMarkers.vue";
import {type PlayedActivities} from "@/funcs/bungie";
import {formatTime} from "@/funcs/utils";
import Tooltip from "@/components/UserView/Tooltip.vue";
import {useLocalStorage} from "@vueuse/core";
import {useRoute} from "vue-router";
import {useSharedData} from "@/funcs/store";

const props = defineProps<{
  manifestActivity: ManifestActivity,
  activities: ActivityStats
}>()
defineEmits(["filterChange"])

const route = useRoute()
const sharedDataStore = useSharedData()

const toggleState = ref(sharedDataStore.pinnedActivities.has(props.manifestActivity.name))
</script>

<template>
  <div
      class="flex flex-col shadow-inner shadow-bg_site rounded-lg bg-gradient-to-t from-bg_box to-bg_site w-80"
      :id="manifestActivity.hash.toString()"
  >
    <div class="">
      <div class="h-48 relative">
        <img
            class="h-full w-full rounded-t-lg object-cover "
            :src=props.manifestActivity.imageUrl
            :alt="`${props.manifestActivity.name} Image`"
        >

        <!-- Pin it -->
        <div class="absolute top-2 right-2">
          <Tooltip>
            <template v-slot:hoverable>
              <Toggle
                  v-model:pressed="toggleState"
                  aria-label="Pin Item"
                  class="clickable flex items-center justify-center w-8 h-8"
                  @click="() => {
                    if (toggleState) {
                      sharedDataStore.pinnedActivities.add(manifestActivity.name)
                    } else {
                      sharedDataStore.pinnedActivities.delete(manifestActivity.name)
                      $emit('filterChange', sharedDataStore.pinnedActivities)
                    }
                  }"
              >
                <svg v-if="toggleState" width="20" height="20" viewBox="0 0 15 15" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M9.62129 1.13607C9.81656 0.940808 10.1331 0.940809 10.3284 1.13607L11.3891 2.19673L12.8033 3.61094L13.8639 4.6716C14.0592 4.86687 14.0592 5.18345 13.8639 5.37871C13.6687 5.57397 13.3521 5.57397 13.1568 5.37871L12.5038 4.7257L8.86727 9.57443L9.97485 10.682C10.1701 10.8773 10.1701 11.1939 9.97485 11.3891C9.77959 11.5844 9.463 11.5844 9.26774 11.3891L7.85353 9.97491L6.79287 8.91425L3.5225 12.1846C3.32724 12.3799 3.01065 12.3799 2.81539 12.1846C2.62013 11.9894 2.62013 11.6728 2.81539 11.4775L6.08576 8.20714L5.0251 7.14648L3.61089 5.73226C3.41563 5.537 3.41562 5.22042 3.61089 5.02516C3.80615 4.8299 4.12273 4.8299 4.31799 5.02516L5.42557 6.13274L10.2743 2.49619L9.62129 1.84318C9.42603 1.64792 9.42603 1.33133 9.62129 1.13607Z"
                      fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                  <path
                      d="M9.62129 1.13607C9.81656 0.940808 10.1331 0.940809 10.3284 1.13607L11.3891 2.19673L12.8033 3.61094L13.8639 4.6716C14.0592 4.86687 14.0592 5.18345 13.8639 5.37871C13.6687 5.57397 13.3521 5.57397 13.1568 5.37871L12.5038 4.7257L8.86727 9.57443L9.97485 10.682C10.1701 10.8773 10.1701 11.1939 9.97485 11.3891C9.77959 11.5844 9.463 11.5844 9.26774 11.3891L7.85353 9.97491L6.79287 8.91425L3.5225 12.1846C3.32724 12.3799 3.01065 12.3799 2.81539 12.1846C2.62013 11.9894 2.62013 11.6728 2.81539 11.4775L6.08576 8.20714L5.0251 7.14648L3.61089 5.73226C3.41563 5.537 3.41562 5.22042 3.61089 5.02516C3.80615 4.8299 4.12273 4.8299 4.31799 5.02516L5.42557 6.13274L10.2743 2.49619L9.62129 1.84318C9.42603 1.64792 9.42603 1.33133 9.62129 1.13607Z"
                      fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>

                <svg v-else width="20" height="20" viewBox="0 0 15 15" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M10.3285 1.13607C10.1332 0.940809 9.81662 0.940808 9.62136 1.13607C9.42609 1.33133 9.42609 1.64792 9.62136 1.84318L10.2744 2.49619L5.42563 6.13274L4.31805 5.02516C4.12279 4.8299 3.80621 4.8299 3.61095 5.02516C3.41569 5.22042 3.41569 5.537 3.61095 5.73226L5.02516 7.14648L6.08582 8.20714L2.81545 11.4775C2.62019 11.6728 2.62019 11.9894 2.81545 12.1846C3.01072 12.3799 3.3273 12.3799 3.52256 12.1846L6.79293 8.91425L7.85359 9.97491L9.2678 11.3891C9.46306 11.5844 9.77965 11.5844 9.97491 11.3891C10.1702 11.1939 10.1702 10.8773 9.97491 10.682L8.86733 9.57443L12.5039 4.7257L13.1569 5.37871C13.3522 5.57397 13.6687 5.57397 13.864 5.37871C14.0593 5.18345 14.0593 4.86687 13.864 4.6716L12.8033 3.61094L11.3891 2.19673L10.3285 1.13607ZM6.13992 6.84702L10.9887 3.21047L11.7896 4.01142L8.15305 8.86015L6.13992 6.84702Z"
                      fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>
              </Toggle>
            </template>

            <template v-slot:content>
              <p v-if="toggleState">
                Unpin Activity
              </p>
              <p v-else>
                Pin Activity
              </p>
            </template>
          </Tooltip>
        </div>

        <div class="absolute top-2 left-2 space-y-1">
          <!-- Activity Name -->
          <RouterLink :to="`/${route.params.membershipType}/${route.params.membershipId}/${manifestActivity.name}`">
            <div
                class="text-clickable text-text_bright font-extrabold text-2xl text-shadow shadow-bg_box max-w-64 flex justify-center items-center gap-1">
              <div>{{ props.manifestActivity.name }}</div>
              <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M12 13C12.5523 13 13 12.5523 13 12V3C13 2.44771 12.5523 2 12 2H3C2.44771 2 2 2.44771 2 3V6.5C2 6.77614 2.22386 7 2.5 7C2.77614 7 3 6.77614 3 6.5V3H12V12H8.5C8.22386 12 8 12.2239 8 12.5C8 12.7761 8.22386 13 8.5 13H12ZM9 6.5C9 6.5001 9 6.50021 9 6.50031V6.50035V9.5C9 9.77614 8.77614 10 8.5 10C8.22386 10 8 9.77614 8 9.5V7.70711L2.85355 12.8536C2.65829 13.0488 2.34171 13.0488 2.14645 12.8536C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L7.29289 7H5.5C5.22386 7 5 6.77614 5 6.5C5 6.22386 5.22386 6 5.5 6H8.5C8.56779 6 8.63244 6.01349 8.69139 6.03794C8.74949 6.06198 8.80398 6.09744 8.85143 6.14433C8.94251 6.23434 8.9992 6.35909 8.99999 6.49708L8.99999 6.49738"
                      fill="currentColor"></path>
              </svg>
            </div>
          </RouterLink>

          <!-- Activity Mode -->
          <div class="flex gap-1 text-sm font-medium text-shadow-xs shadow-bg_box">
            <img
                class="h-5"
                :src="props.manifestActivity.modeIconUrl"
                alt="Icon"
            >
            <p>
              {{ props.manifestActivity.activityMode }}
            </p>
          </div>
        </div>

        <!-- Small Info -->
        <div class="absolute bottom-1 right-2">
          <div class="flex gap-x-1">
            <Tag class="text-xs" v-for="tag in props.manifestActivity.tags">
              {{ tag }}
            </Tag>

            <Tag class="text-xs">
              {{ props.manifestActivity.maxPlayers }} Players
            </Tag>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div class="h-12 flex space-x-1 py-1 px-2 scrollbar overflow-x-auto overflow-y-hidden scrollbar">
        <div v-for="(data, name) in activities.specialTags">
          <RouterLink :to="`/pgcr/${data.instanceId}`">
            <BoxClickable>
              {{ name }} ({{ data.amount }})
            </BoxClickable>
          </RouterLink>
        </div>
      </div>

      <div class="flex flex-col divide-y px-4 pb-2 divide-text_dull/70">
        <div class="pb-4 flex flex-col">
          <div class="h-24 row-span-2 pl-2">
            <!-- Clear Markers -->
            <ClearMarkers :activities="activities" v-if="activities.data.length > 0"/>
            <div v-else class="justify-center font-medium italic text-sm text-text_dull flex h-full">
              <div class="flex flex-col justify-center h-full">
                You have never run this
              </div>
            </div>
          </div>

          <!-- Clears -->
          <div class="place-content-center grid grid-cols-3 space-x-2">
            <Clears :amount="activities.clears" name="Clears"/>
            <Clears :amount="activities.specialClears" name="Special Clears"/>
            <Clears :amount="activities.failedClears" name="Failed Clears"/>
          </div>
        </div>

        <div class="py-4 grid grid-cols-3 place-items-center space-x-2">
          <!-- Fastest Clear -->
          <ActivityStat :amount="formatTime(activities.timeMin)" name="Fastest"/>

          <!-- Average Clear -->
          <ActivityStat :amount="formatTime(activities.timeAvg)" name="Average"/>

          <!-- Total Time Spent -->
          <ActivityStat :amount="formatTime(activities.timeSum)" name="Total"/>
        </div>

        <div class="py-4 grid grid-cols-3 place-content-center space-x-2">
          <!-- Kills -->
          <ActivityStat :amount="activities.kills" name="Kills"/>

          <!-- Assists -->
          <ActivityStat :amount="activities.assists" name="Assists"/>

          <!-- Deaths -->
          <ActivityStat :amount="activities.deaths" name="Deaths"/>
        </div>
      </div>
    </div>
  </div>
</template>
