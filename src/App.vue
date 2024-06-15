<script setup lang="ts">
import {RouterLink, RouterView, useRoute} from 'vue-router'
import {version} from '../package.json'
import {type Ref, ref} from "vue";
import {useLocalStorage} from "@vueuse/core";
import FavoriteProfile from "@/components/FavoriteProfile.vue";
import Tooltip from "@/components/UserView/Tooltip.vue";
import type {PlayerProfile} from "@/funcs/bungie";
import {useSharedData} from "@/funcs/store";
import UserSearch from "@/components/UserSearch.vue";

const route = useRoute()

const sharedDataStore = useSharedData()

const favoriteAccounts: Ref<{ [membershipId: string]: PlayerProfile }> = useLocalStorage("favoriteAccounts", {})

function addToFavorites() {
  favoriteAccounts.value[sharedDataStore.currentAccount.membershipId] = sharedDataStore.currentAccount
}
</script>

<template>
  <div class="h-dvh flex flex-col bg-gradient-to-b from-bg_site_light to-bg_site">
    <header class="w-screen bg-gradient-to-r from-text_bright to-text_bright_duller flex justify-center z-40">
      <div class="grow h-16 max-w-[2000px] flex justify-between px-6 items-center gap-4 text-ellipsis">
        <!-- Home Button-->
        <RouterLink
            to="/"
            class="flex gap-4 items-center text-accent font-bold text-xl"
        >
          <img src="/favicon.png" alt="Logo" class="h-12 w-12"/>

          <p class="hidden md:flex">
            Destiny Activity Report
          </p>
          <p class="flex md:hidden">
            Activity Report
          </p>
        </RouterLink>

        <!-- Search Bar-->
        <UserSearch/>

        <!-- Favorite Accounts-->
        <div class="hidden sm:flex flex-row-reverse gap-2 w-[184px] shrink-0">
          <FavoriteProfile
              v-for="entry in favoriteAccounts"
              :membershipId="entry.membershipId"
              :membershipType="entry.membershipType"
              :name="entry.name"
              :code="entry.code"
              :icon-url="entry.iconUrl"

              @unpin="delete favoriteAccounts[entry.membershipId]"
          />

          <Tooltip
              v-if="Object.keys(favoriteAccounts).length < 3 && route.meta.canPinUser && sharedDataStore.currentAccount && !(sharedDataStore.currentAccount.membershipId in favoriteAccounts)">
            <template v-slot:hoverable>
              <div class="h-14 w-14 flex justify-center">
                <div class="flex-col flex justify-center">
                  <button
                      class="text-accent h-10 w-10 text-sm clickable flex justify-center items-center"
                      @click="addToFavorites"
                  >
                    <svg width="28" height="28" viewBox="0 0 15 15" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path
                          d="M10.3285 1.13607C10.1332 0.940809 9.81662 0.940808 9.62136 1.13607C9.42609 1.33133 9.42609 1.64792 9.62136 1.84318L10.2744 2.49619L5.42563 6.13274L4.31805 5.02516C4.12279 4.8299 3.80621 4.8299 3.61095 5.02516C3.41569 5.22042 3.41569 5.537 3.61095 5.73226L5.02516 7.14648L6.08582 8.20714L2.81545 11.4775C2.62019 11.6728 2.62019 11.9894 2.81545 12.1846C3.01072 12.3799 3.3273 12.3799 3.52256 12.1846L6.79293 8.91425L7.85359 9.97491L9.2678 11.3891C9.46306 11.5844 9.77965 11.5844 9.97491 11.3891C10.1702 11.1939 10.1702 10.8773 9.97491 10.682L8.86733 9.57443L12.5039 4.7257L13.1569 5.37871C13.3522 5.57397 13.6687 5.57397 13.864 5.37871C14.0593 5.18345 14.0593 4.86687 13.864 4.6716L12.8033 3.61094L11.3891 2.19673L10.3285 1.13607ZM6.13992 6.84702L10.9887 3.21047L11.7896 4.01142L8.15305 8.86015L6.13992 6.84702Z"
                          fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </template>

            <template v-slot:content>
              <p class="text-lg">
                Pin Current User
              </p>
            </template>
          </Tooltip>
        </div>
      </div>
    </header>

    <div class="h-full grow flex flex-col">
      <main class="grow flex justify-around w-full py-4">
        <router-view v-slot="{ Component }">
          <transition>
            <keep-alive>
              <component :is="Component"/>
            </keep-alive>
          </transition>
        </router-view>
      </main>

      <footer class="bottom-0 h-10 p-2 text-text_bright/50 flex divide-x divide-text_bright/50 justify-end">
        <h4 class="px-2">
          {{ version }}
        </h4>
        <h4 class="px-2">
          <a href="https://ko-fi.com/kigstn" class="hover:text-text_bright flex gap-2 items-center">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M4.89346 2.35248C3.49195 2.35248 2.35248 3.49359 2.35248 4.90532C2.35248 6.38164 3.20954 7.9168 4.37255 9.33522C5.39396 10.581 6.59464 11.6702 7.50002 12.4778C8.4054 11.6702 9.60608 10.581 10.6275 9.33522C11.7905 7.9168 12.6476 6.38164 12.6476 4.90532C12.6476 3.49359 11.5081 2.35248 10.1066 2.35248C9.27059 2.35248 8.81894 2.64323 8.5397 2.95843C8.27877 3.25295 8.14623 3.58566 8.02501 3.88993C8.00391 3.9429 7.98315 3.99501 7.96211 4.04591C7.88482 4.23294 7.7024 4.35494 7.50002 4.35494C7.29765 4.35494 7.11523 4.23295 7.03793 4.04592C7.01689 3.99501 6.99612 3.94289 6.97502 3.8899C6.8538 3.58564 6.72126 3.25294 6.46034 2.95843C6.18109 2.64323 5.72945 2.35248 4.89346 2.35248ZM1.35248 4.90532C1.35248 2.94498 2.936 1.35248 4.89346 1.35248C6.0084 1.35248 6.73504 1.76049 7.20884 2.2953C7.32062 2.42147 7.41686 2.55382 7.50002 2.68545C7.58318 2.55382 7.67941 2.42147 7.79119 2.2953C8.265 1.76049 8.99164 1.35248 10.1066 1.35248C12.064 1.35248 13.6476 2.94498 13.6476 4.90532C13.6476 6.74041 12.6013 8.50508 11.4008 9.96927C10.2636 11.3562 8.92194 12.5508 8.00601 13.3664C7.94645 13.4194 7.88869 13.4709 7.83291 13.5206C7.64324 13.6899 7.3568 13.6899 7.16713 13.5206C7.11135 13.4709 7.05359 13.4194 6.99403 13.3664C6.0781 12.5508 4.73641 11.3562 3.59926 9.96927C2.39872 8.50508 1.35248 6.74041 1.35248 4.90532Z"
                  fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
            Support Me
          </a>
        </h4>
        <h4 class="px-2">
          <a href="mailto:mail@activities.report?subject=Feedback:%20Activities.Report"
             class="hover:text-text_bright flex gap-2 items-center">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M1 2C0.447715 2 0 2.44772 0 3V12C0 12.5523 0.447715 13 1 13H14C14.5523 13 15 12.5523 15 12V3C15 2.44772 14.5523 2 14 2H1ZM1 3L14 3V3.92494C13.9174 3.92486 13.8338 3.94751 13.7589 3.99505L7.5 7.96703L1.24112 3.99505C1.16621 3.94751 1.0826 3.92486 1 3.92494V3ZM1 4.90797V12H14V4.90797L7.74112 8.87995C7.59394 8.97335 7.40606 8.97335 7.25888 8.87995L1 4.90797Z"
                  fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
            Contact Me
          </a>
        </h4>
        <h4 class="px-2">
          <a href="https://github.com/Kigstn/DestinyActivityReport" class="hover:text-text_bright">
            © 2024 Kigstn
          </a>
        </h4>
      </footer>
    </div>
  </div>
</template>
