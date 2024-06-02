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
          <!-- todo logo -->
          <svg width="32" height="32" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12.0697 1.76746C12.4807 1.21947 11.4605 0.454311 11.0495 1.0023C10.6385 1.55028 11.6588 2.31544 12.0697 1.76746ZM8.39263 1.07811C7.15585 0.950602 5.7823 1.16348 4.58433 1.70937C3.38552 2.25563 2.32735 3.15309 1.78844 4.41832C1.37574 5.38724 1.01715 6.28113 1.00088 7.44354C0.984724 8.59844 1.30522 9.96898 2.13174 11.928C2.61142 13.0649 4.03963 13.5446 5.13895 13.8079C6.40836 14.1119 7.80857 14.1914 8.6644 14.0742C9.36515 13.9782 10.1448 13.8284 10.7987 13.297C11.8977 12.4039 12.9009 11.3955 13.4994 10.3393C14.104 9.27221 14.3256 8.09207 13.7216 6.95324C13.5628 6.65373 13.316 6.57734 13.0412 6.4923C12.9374 6.46016 12.8295 6.42678 12.7209 6.37966C11.6211 5.90234 10.9646 5.34963 10.9135 5.02876C10.8656 4.72808 10.9221 4.51463 10.9811 4.29181C11.0129 4.17199 11.0453 4.04947 11.0626 3.90922C11.0838 3.73737 11.0814 3.33319 10.6996 3.12761C10.4048 2.96888 10.2164 2.65843 10.0407 2.36904C9.99742 2.29775 9.95492 2.22773 9.9118 2.16158C9.62634 1.72367 9.20769 1.16213 8.39263 1.07811ZM4.99899 2.61935C3.96483 3.09058 3.12554 3.83097 2.70846 4.81018C2.29808 5.77368 2.01406 6.50873 2.00079 7.45753C1.98741 8.41385 2.25043 9.6368 3.0531 11.5393C3.39181 12.3421 4.62167 12.6557 5.37186 12.8354C6.5493 13.1174 7.822 13.1802 8.52868 13.0834C9.21271 12.9897 9.74568 12.8642 10.1681 12.5209C11.229 11.6587 12.121 10.7435 12.6293 9.84635C12.9349 9.30709 13.5141 7.7028 12.6292 7.3873C10.7539 6.71875 10.262 6.06669 9.99011 5.41268C9.80915 4.97744 9.82868 4.52282 9.95741 4.07885L9.95741 4.07884C9.97662 4.0126 9.99538 3.94791 10.0334 3.88882C9.81857 3.73676 9.6515 3.55195 9.51464 3.3715C9.42876 3.25828 9.3469 3.12099 9.26197 2.97856C9.01866 2.57052 8.75018 2.12027 8.29008 2.07283C7.22889 1.96343 6.03398 2.14772 4.99899 2.61935ZM13.2081 3.77471C13.441 3.22671 12.4547 2.63606 12.0822 3.10163C11.5817 3.72732 12.9029 4.49281 13.2081 3.77471ZM14.3672 2.26031C14.9668 2.27493 15.1551 1.11603 14.5718 0.949371C13.8076 0.731026 13.5918 2.24139 14.3672 2.26031ZM14.2857 5.09098C14.8644 5.10004 15.0462 4.38222 14.4832 4.27899C13.7455 4.14375 13.5373 5.07927 14.2857 5.09098ZM6.9075 4.28672C6.46898 4.66754 6.0522 4.15185 5.97983 3.7365C5.86848 3.09744 6.33696 2.56856 6.94823 2.91156C7.43344 3.18382 7.26678 3.97471 6.9075 4.28672ZM4.94455 5.88184C5.40885 5.41754 4.59567 4.57013 4.11425 5.05154C3.83338 5.33242 4.00936 5.65376 4.23744 5.88184C4.43271 6.0771 4.74929 6.0771 4.94455 5.88184ZM6.97716 6.71984C7.31181 7.38914 8.48804 6.79159 7.99413 6.14788C7.86519 5.97983 7.68657 5.9494 7.62145 5.94207C7.21217 5.89601 6.76349 6.2925 6.97716 6.71984ZM6.98798 8.72461C7.14066 9.1188 7.51122 9.3187 7.91915 9.1633C8.27434 9.02799 8.33186 8.39689 8.17175 8.07427C8.02331 7.77514 7.63956 7.67793 7.33747 7.79417C6.98512 7.92976 6.85672 8.38708 6.98576 8.71889L6.98798 8.72461ZM10.3885 8.84081C10.7575 8.6566 11.4617 8.82771 11.4617 9.31199C11.4617 9.71286 10.9587 10.2165 10.5634 10.2826C10.1813 10.3465 9.70515 9.97581 9.76648 9.57718C9.81445 9.26539 10.1217 8.97401 10.3885 8.84081ZM7.56704 10.8432C7.33461 10.7502 7.14353 10.8601 7.11437 10.8769L7.11279 10.8778C6.90782 10.9949 6.71383 11.2439 6.6747 11.4842C6.59018 12.0034 7.13199 12.1239 7.52661 12.0987C8.2074 12.0553 8.06547 11.0426 7.56704 10.8432ZM4.8805 10.8932C5.0674 10.7723 5.15658 10.5363 5.08293 10.3153C4.93046 9.79687 4.3246 9.71252 3.96561 10.1297C3.79336 10.3299 3.80749 10.6274 3.99214 10.8105L3.99495 10.814L3.9979 10.8176C4.22025 11.0942 4.63624 11.1857 4.8805 10.8932ZM3.04695 7.81318C3.33147 8.0977 3.60077 8.15067 3.98443 8.05859C4.60826 7.90887 4.13814 6.24299 3.047 6.87296C2.70939 7.06788 2.86716 7.63339 3.04695 7.81318Z"
                fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>

          <p class="hidden md:flex">
            Destiny2 Activity Report
          </p>
          <p class="flex md:hidden">
            Activity Report
          </p>
        </RouterLink>

        <!-- Search Bar-->
        <UserSearch/>

        <!-- Favorite Accounts-->
        <div class="flex flex-row-reverse gap-2 w-[184px] shrink-0">
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
        <RouterView/>
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
