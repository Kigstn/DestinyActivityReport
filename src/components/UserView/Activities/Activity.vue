<script setup lang="ts">
import {type ManifestActivity} from "@/funcs/bungie";
import type {DestinyHistoricalStatsPeriodGroup} from "bungie-api-ts/destiny2";
import {
  AspectRatio,
  Separator,
  Toggle, TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger
} from "radix-vue";
import {Icon} from "@iconify/vue";
import {ref} from "vue";
import Tag from "@/components/Tag.vue";
import Clears from "@/components/UserView/Activities/Clears.vue";
import TimeSpent from "@/components/UserView/Activities/TimeSpent.vue";
import BoxClickable from "@/components/TagClickable.vue";
import ClearMarkers from "@/components/UserView/Activities/ClearMarkers/ClearMarkers.vue";

const props = defineProps<{
  manifestActivity: ManifestActivity,
  activities: DestinyHistoricalStatsPeriodGroup[]
}>()

const toggleState = ref(false)


const activities = [
  {
    datetime: new Date(),
    lengthSeconds: 1633,
    completed: true,
    special: false,
  },
  {
    datetime: new Date(1995, 11, 17),
    lengthSeconds: 400,
    completed: false,
    special: false,
  },
  {
    datetime: new Date(1990, 11, 17),
    lengthSeconds: 600,
    completed: true,
    special: true,
  },
  {
    datetime: new Date(1985, 11, 1),
    lengthSeconds: 5000,
    completed: true,
    special: true,
  },
  {
    datetime: new Date(1994, 11, 17),
    lengthSeconds: 12,
    completed: true,
    special: false,
  },
    {
    datetime: new Date(),
    lengthSeconds: 1633,
    completed: true,
    special: false,
  },
  {
    datetime: new Date(1995, 11, 17),
    lengthSeconds: 400,
    completed: false,
    special: false,
  },
  {
    datetime: new Date(1990, 11, 17),
    lengthSeconds: 600,
    completed: true,
    special: true,
  },
  {
    datetime: new Date(1985, 11, 1),
    lengthSeconds: 5000,
    completed: true,
    special: true,
  },
  {
    datetime: new Date(1994, 11, 17),
    lengthSeconds: 12,
    completed: true,
    special: false,
  },
    {
    datetime: new Date(),
    lengthSeconds: 1633,
    completed: true,
    special: false,
  },
  {
    datetime: new Date(1995, 11, 17),
    lengthSeconds: 400,
    completed: false,
    special: false,
  },
  {
    datetime: new Date(1990, 11, 17),
    lengthSeconds: 600,
    completed: true,
    special: true,
  },
  {
    datetime: new Date(1985, 11, 1),
    lengthSeconds: 5000,
    completed: true,
    special: true,
  },
  {
    datetime: new Date(1994, 11, 17),
    lengthSeconds: 12,
    completed: true,
    special: false,
  }
]
</script>

<template>
  <div class="flex flex-col shadow-inner shadow-bg_site rounded-lg bg-bg_box w-80">
    <div class="">
      <div class="h-48 relative">
        <img
            class="h-full w-full rounded-t-lg object-cover "
            :src=props.manifestActivity.imageUrl
            :alt="`${props.manifestActivity.name} Image`"
        >

        <!-- todo -->
        <!-- Pin it -->
        <div class="absolute top-2 right-2">
          <TooltipProvider>
            <TooltipRoot>
              <TooltipTrigger>
                <Toggle
                    v-model:pressed="toggleState" aria-label="Pin Item"
                    class="clickable data-[state=on]:border-2 data-[state=on]:border-text_bright flex items-center justify-center rounded-lg w-8 h-8"
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
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent class="bg-text_bright text-accent rounded-lg p-2 font-bold">
                  <p v-if="toggleState">
                    Unpin
                  </p>
                  <p v-else>
                    Pin to top
                  </p>
                  <TooltipArrow class="fill-text_bright" :width="12"/>
                </TooltipContent>
              </TooltipPortal>
            </TooltipRoot>
          </TooltipProvider>
        </div>

        <div class="absolute top-2 left-2 space-y-1">
          <!-- Activity Name -->
          <div class="text-text_bright font-extrabold text-2xl text-shadow shadow-bg_box max-w-72">
            {{ props.manifestActivity.name }}
          </div>

          <!-- todo maybe icon of mode - if exists -->
          <!-- Activity Mode -->
          <div class="text-sm font-medium text-shadow shadow-bg_box">
            {{ props.manifestActivity.activityMode }}
          </div>
        </div>

        <!-- Small Info -->
        <div class="absolute bottom-1 right-2">
          <div class="flex space-x-1">
            <Tag class="text-xs" v-if=props.manifestActivity.isPlaylist>
              Playlist
            </Tag>

            <Tag class="text-xs" v-if=props.manifestActivity.isMatchmade>
              Matchmade
            </Tag>

            <Tag class="text-xs">
              {{ props.manifestActivity.maxPlayers }} Players
            </Tag>
          </div>
        </div>
      </div>

      <!-- todo -->
      <!-- Tags -->
      <div class="h-8 flex space-x-1 py-1 px-2">
        <button>
          <BoxClickable class="">
            Solo
          </BoxClickable>
        </button>

        <button>
          <BoxClickable class="">
            Solo
          </BoxClickable>
        </button>
      </div>

      <div class="flex flex-col divide-y px-4 divide-text_dull/70">
        <div class="pb-4 flex flex-col">
          <div class="h-24 row-span-2">
            <!-- todo -->
            <!-- Clear Markers -->
            <ClearMarkers :activities="activities"/>
          </div>

          <!-- todo -->
          <!-- Clears -->
          <div class="place-content-center grid grid-cols-2 space-x-2">
            <Clears :amount=5 name="Full Clears"/>
            <Clears :amount=1012 name="Checkpoints"/>
          </div>
        </div>

        <div class="py-4 grid grid-cols-3 place-content-center space-x-2">
          <!-- todo -->
          <!-- Fastest Clear -->
          <TimeSpent amount="2h 14m" name="Fastest"/>

          <!-- todo -->
          <!-- Average Clear -->
          <TimeSpent amount="1h 14m" name="Average"/>

          <!-- todo -->
          <!-- Total Time Spent -->
          <TimeSpent amount="2d 7h" name="Total"/>
        </div>

        <div class="py-4 grid grid-cols-3 place-content-center space-x-2">
          <!-- todo -->
          <!-- Kills -->
          <TimeSpent amount="15224" name="Kills"/>

          <!-- todo -->
          <!-- Assists -->
          <TimeSpent amount="420" name="Assists"/>

          <!-- todo -->
          <!-- Deaths -->
          <TimeSpent amount="0" name="Deaths"/>
        </div>

      </div>


    </div>

    <!-- todo -->
    <div class="flex justify-end pr-2 pb-2">
      <button class="clickable flex items-center justify-center rounded-lg w-8 h-8">
        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M14 7.5C14 7.66148 13.922 7.81301 13.7906 7.90687L6.79062 12.9069C6.63821 13.0157 6.43774 13.0303 6.27121 12.9446C6.10467 12.8589 6 12.6873 6 12.5L6 10L3.5 10C3.22386 10 3 9.77614 3 9.5L3 5.5C3 5.22386 3.22386 5 3.5 5L6 5L6 2.5C6 2.31271 6.10467 2.14112 6.27121 2.05542C6.43774 1.96972 6.63821 1.98427 6.79062 2.09313L13.7906 7.09314C13.922 7.18699 14 7.33853 14 7.5ZM7 3.4716L7 5.5C7 5.77614 6.77614 6 6.5 6L4 6L4 9L6.5 9C6.77614 9 7 9.22386 7 9.5L7 11.5284L12.6398 7.5L7 3.4716Z"
              fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  </div>
</template>
