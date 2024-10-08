<script setup lang="ts">
import {formatTime} from "@/funcs/utils";
import type {PlayerProfile} from "@/funcs/bungie";
import LoadingDiv from "@/components/Misc/LoadingDiv.vue";
import LinkToOtherPlayer from "@/components/LinkToOtherPlayer.vue";

defineProps<{
  user: PlayerProfile | null,
  loading: boolean,
}>()
</script>

<template>
  <!-- Loading State-->
  <div v-if="loading" class="h-20 w-[395px]">
    <LoadingDiv/>
  </div>

  <!-- Everything Loaded-->
  <LinkToOtherPlayer v-else-if="user" :membership-type="user.membershipType" :membership-id="user.membershipId">
    <div class="relative text-clickable group/clickable">
      <img :src="user.emblemUrl" alt="User Emblem" class="h-20 rounded-lg">
      <div class="absolute w-full h-full top-0 py-1 flex items-center text-shadow-xs shadow-bg_box">
        <div class="ml-20 mr-2 w-full h-full flex flex-col justify-between">
          <p class="text-text_bright text-2xl font-bold text-ellipsis overflow-hidden group-hover/clickable:underline">
            {{ user.name }}#{{ user.code }}
          </p>

          <div class="flex gap-4 justify-between items-center">
            <div class="flex gap-1 items-center">
              <svg class="text-accent" width="20" height="20" viewBox="0 0 32 32" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M22.962 8.863c-2.628-2.576-4.988-5.407-7.045-8.458l-0.123-0.193c-2.234 3.193-4.556 5.993-7.083 8.592l0.015-0.016c-2.645 2.742-5.496 5.245-8.542 7.499l-0.184 0.13c3.341 2.271 6.262 4.682 8.943 7.335l-0.005-0.005c2.459 2.429 4.71 5.055 6.731 7.858l0.125 0.182c4.324-6.341 9.724-11.606 15.986-15.649l0.219-0.133c-3.401-2.168-6.359-4.524-9.048-7.153l0.010 0.010zM18.761 18.998c-1.036 1.024-1.971 2.145-2.792 3.35l-0.050 0.078c-0.884-1.215-1.8-2.285-2.793-3.279l0 0c-1.090-1.075-2.28-2.055-3.552-2.923l-0.088-0.057c1.326-0.969 2.495-1.988 3.571-3.097l0.007-0.007c1.010-1.051 1.947-2.191 2.794-3.399l0.061-0.092c0.882 1.32 1.842 2.471 2.912 3.51l0.005 0.005c1.089 1.072 2.293 2.034 3.589 2.864l0.088 0.053c-1.412 0.905-2.641 1.891-3.754 2.994l0.002-0.002z"
                    fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
              </svg>
              <p>
                {{ user.light }}
              </p>
            </div>

            <div class="flex gap-1 items-center">
              <svg class="text-accent" width="20" height="20" viewBox="0 0 15 15" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M5.49998 0.5C5.49998 0.223858 5.72383 0 5.99998 0H7.49998H8.99998C9.27612 0 9.49998 0.223858 9.49998 0.5C9.49998 0.776142 9.27612 1 8.99998 1H7.99998V2.11922C9.09832 2.20409 10.119 2.56622 10.992 3.13572C11.0116 3.10851 11.0336 3.08252 11.058 3.05806L12.058 2.05806C12.3021 1.81398 12.6978 1.81398 12.9419 2.05806C13.186 2.30214 13.186 2.69786 12.9419 2.94194L11.967 3.91682C13.1595 5.07925 13.9 6.70314 13.9 8.49998C13.9 12.0346 11.0346 14.9 7.49998 14.9C3.96535 14.9 1.09998 12.0346 1.09998 8.49998C1.09998 5.13361 3.69904 2.3743 6.99998 2.11922V1H5.99998C5.72383 1 5.49998 0.776142 5.49998 0.5ZM2.09998 8.49998C2.09998 5.51764 4.51764 3.09998 7.49998 3.09998C10.4823 3.09998 12.9 5.51764 12.9 8.49998C12.9 11.4823 10.4823 13.9 7.49998 13.9C4.51764 13.9 2.09998 11.4823 2.09998 8.49998ZM7.49998 8.49998V4.09998C5.06992 4.09998 3.09998 6.06992 3.09998 8.49998C3.09998 10.93 5.06992 12.9 7.49998 12.9C8.715 12.9 9.815 12.4075 10.6112 11.6112L7.49998 8.49998Z"
                    fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
              </svg>
              <p>
                {{ formatTime(user.totalMinutesPlayed * 60) }}
              </p>
            </div>

            <div class="flex text-xs items-center gap-1">
              <div class="">
                <svg class="text-accent" width="20" height="20" viewBox="0 0 15 15" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7ZM11 7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8C11.2239 8 11 7.77614 11 7.5ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM9 9.5C9 9.22386 9.22386 9 9.5 9C9.77614 9 10 9.22386 10 9.5C10 9.77614 9.77614 10 9.5 10C9.22386 10 9 9.77614 9 9.5ZM7.5 9C7.22386 9 7 9.22386 7 9.5C7 9.77614 7.22386 10 7.5 10C7.77614 10 8 9.77614 8 9.5C8 9.22386 7.77614 9 7.5 9ZM5 9.5C5 9.22386 5.22386 9 5.5 9C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10C5.22386 10 5 9.77614 5 9.5ZM3.5 9C3.22386 9 3 9.22386 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 9.22386 3.77614 9 3.5 9ZM3 11.5C3 11.2239 3.22386 11 3.5 11C3.77614 11 4 11.2239 4 11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 11.2239 5.77614 11 5.5 11ZM7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5C10 11.2239 9.77614 11 9.5 11Z"
                      fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="text-right">
                <p>
                  {{ user.lastPlayed.toLocaleDateString() }}
                </p>
                <p>
                  {{ user.lastPlayed.toLocaleTimeString() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LinkToOtherPlayer>
</template>
