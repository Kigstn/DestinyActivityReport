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
import {reactive, ref} from "vue";
import Tag from "@/components/UserView/Tag.vue";
import Clears from "@/components/UserView/Activities/Clears.vue";
import TimeSpent from "@/components/UserView/Activities/TimeSpent.vue";
import BoxClickable from "@/components/UserView/TagClickable.vue";
import ClearMarkers from "@/components/UserView/Activities/ClearMarkers.vue";
import {type PlayedActivities} from "@/funcs/bungie";
import {formatTime} from "@/funcs/utils";

const props = defineProps<{
  manifestActivity: ManifestActivity,
  activities: PlayedActivities[] | undefined
}>()

const toggleState = ref(false)


// calculate with the activities for this
let activityClears = 0
let activitySpecial = 0
let activityKills = 0
let activityAssists = 0
let activityDeaths = 0
let activitySpecials: { [id: string]: number } = {}
const activityTimes: number[] = []
if (props.activities) {
  for (const x of props.activities) {
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
          activitySpecials[specialTag] = 0
        }
        activitySpecials[specialTag] += 1
      }
    }
    if (x.completed) {
      activityClears += 1
    }
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
</script>

<template>
  <div class="flex flex-col shadow-inner shadow-bg_site rounded-lg bg-gradient-to-t from-bg_box to-bg_site w-80" :id="manifestActivity.hash.toString()">
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
                    class="clickable flex items-center justify-center w-8 h-8"
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
                <TooltipContent class="tooltip">
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
          <div class="text-text_bright font-extrabold text-2xl text-shadow shadow-bg_box max-w-64">
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
          <div class="flex gap-x-1">
            <Tag class="text-xs" v-if=props.manifestActivity.isPvp>
              PvP
            </Tag>

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

      <!-- todo amount as hover -->
      <!-- Tags -->
      <div class="h-8 flex space-x-1 py-1 px-2">
        <button v-for="(amount, name) in activitySpecials">
          <BoxClickable>
            {{ name }}
          </BoxClickable>
        </button>
      </div>

      <div class="flex flex-col divide-y px-4 pb-2 divide-text_dull/70">
        <div class="pb-4 flex flex-col">
          <div class="h-24 row-span-2">
            <!-- Clear Markers -->
            <ClearMarkers :activities="activities" v-if="activities"/>
            <div v-else class="justify-center font-medium italic text-sm text-text_dull flex h-full">
              <div class="flex flex-col justify-center h-full">
                You have never run this
              </div>
            </div>
          </div>

          <!-- Clears -->
          <div class="place-content-center grid grid-cols-2 space-x-2">
            <Clears :amount="activityClears" name="Full Clears"/>
            <Clears :amount="activitySpecial" name="Special Clears"/>
          </div>
        </div>

        <div v-if="activityTimes" class="py-4 grid grid-cols-3 place-content-center space-x-2">
          <!-- Fastest Clear -->
          <TimeSpent :amount="formatTime(activityTimeMin)" name="Fastest"/>

          <!-- Average Clear -->
          <TimeSpent :amount="formatTime(activityTimeAvg)" name="Average"/>

          <!-- Total Time Spent -->
          <TimeSpent :amount="formatTime(activityTimeSum)" name="Total"/>
        </div>

        <div v-else class="py-4 grid grid-cols-3 place-content-center space-x-2">
          <!-- Fastest Clear -->
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.49985 0.877045C3.84216 0.877045 0.877014 3.84219 0.877014 7.49988C0.877014 9.1488 1.47963 10.657 2.47665 11.8162L1.64643 12.6464C1.45117 12.8417 1.45117 13.1583 1.64643 13.3535C1.8417 13.5488 2.15828 13.5488 2.35354 13.3535L3.18377 12.5233C4.34296 13.5202 5.85104 14.1227 7.49985 14.1227C11.1575 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 5.85107 13.5202 4.34299 12.5233 3.1838L13.3535 2.35354C13.5488 2.15827 13.5488 1.84169 13.3535 1.64643C13.1583 1.45117 12.8417 1.45117 12.6464 1.64643L11.8162 2.47668C10.657 1.47966 9.14877 0.877045 7.49985 0.877045ZM11.1422 3.15066C10.1567 2.32449 8.88639 1.82704 7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.88642 2.32446 10.1568 3.15063 11.1422L11.1422 3.15066ZM3.85776 11.8493C4.84317 12.6753 6.11343 13.1727 7.49985 13.1727C10.6328 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 6.11346 12.6753 4.8432 11.8493 3.85779L3.85776 11.8493Z"
                fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>

          <!-- Average Clear -->
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.49985 0.877045C3.84216 0.877045 0.877014 3.84219 0.877014 7.49988C0.877014 9.1488 1.47963 10.657 2.47665 11.8162L1.64643 12.6464C1.45117 12.8417 1.45117 13.1583 1.64643 13.3535C1.8417 13.5488 2.15828 13.5488 2.35354 13.3535L3.18377 12.5233C4.34296 13.5202 5.85104 14.1227 7.49985 14.1227C11.1575 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 5.85107 13.5202 4.34299 12.5233 3.1838L13.3535 2.35354C13.5488 2.15827 13.5488 1.84169 13.3535 1.64643C13.1583 1.45117 12.8417 1.45117 12.6464 1.64643L11.8162 2.47668C10.657 1.47966 9.14877 0.877045 7.49985 0.877045ZM11.1422 3.15066C10.1567 2.32449 8.88639 1.82704 7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.88642 2.32446 10.1568 3.15063 11.1422L11.1422 3.15066ZM3.85776 11.8493C4.84317 12.6753 6.11343 13.1727 7.49985 13.1727C10.6328 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 6.11346 12.6753 4.8432 11.8493 3.85779L3.85776 11.8493Z"
                fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>

          <!-- Total Time Spent -->
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.49985 0.877045C3.84216 0.877045 0.877014 3.84219 0.877014 7.49988C0.877014 9.1488 1.47963 10.657 2.47665 11.8162L1.64643 12.6464C1.45117 12.8417 1.45117 13.1583 1.64643 13.3535C1.8417 13.5488 2.15828 13.5488 2.35354 13.3535L3.18377 12.5233C4.34296 13.5202 5.85104 14.1227 7.49985 14.1227C11.1575 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 5.85107 13.5202 4.34299 12.5233 3.1838L13.3535 2.35354C13.5488 2.15827 13.5488 1.84169 13.3535 1.64643C13.1583 1.45117 12.8417 1.45117 12.6464 1.64643L11.8162 2.47668C10.657 1.47966 9.14877 0.877045 7.49985 0.877045ZM11.1422 3.15066C10.1567 2.32449 8.88639 1.82704 7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.88642 2.32446 10.1568 3.15063 11.1422L11.1422 3.15066ZM3.85776 11.8493C4.84317 12.6753 6.11343 13.1727 7.49985 13.1727C10.6328 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 6.11346 12.6753 4.8432 11.8493 3.85779L3.85776 11.8493Z"
                fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>
        </div>

        <div class="py-4 grid grid-cols-3 place-content-center space-x-2">
          <!-- Kills -->
          <TimeSpent :amount="activityKills" name="Kills"/>

          <!-- Assists -->
          <TimeSpent :amount="activityAssists" name="Assists"/>

          <!-- Deaths -->
          <TimeSpent :amount="activityDeaths" name="Deaths"/>
        </div>
      </div>
    </div>

    <!--    &lt;!&ndash; todo &ndash;&gt;-->
    <!--    <div class="flex justify-end pr-2 pb-2">-->
    <!--      <button class="clickable flex items-center justify-center rounded-lg w-8 h-8">-->
    <!--        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">-->
    <!--          <path-->
    <!--              d="M14 7.5C14 7.66148 13.922 7.81301 13.7906 7.90687L6.79062 12.9069C6.63821 13.0157 6.43774 13.0303 6.27121 12.9446C6.10467 12.8589 6 12.6873 6 12.5L6 10L3.5 10C3.22386 10 3 9.77614 3 9.5L3 5.5C3 5.22386 3.22386 5 3.5 5L6 5L6 2.5C6 2.31271 6.10467 2.14112 6.27121 2.05542C6.43774 1.96972 6.63821 1.98427 6.79062 2.09313L13.7906 7.09314C13.922 7.18699 14 7.33853 14 7.5ZM7 3.4716L7 5.5C7 5.77614 6.77614 6 6.5 6L4 6L4 9L6.5 9C6.77614 9 7 9.22386 7 9.5L7 11.5284L12.6398 7.5L7 3.4716Z"-->
    <!--              fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>-->
    <!--        </svg>-->
    <!--      </button>-->
    <!--    </div>-->
  </div>
</template>
