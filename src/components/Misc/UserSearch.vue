<script setup lang="ts">
import {useDebouncedRef} from "@/funcs/utils";
import {
  type BungieUserSearchResult,
  convertMembershipTypeToStr,
  getPlatformIcon,
  searchBungieUser
} from "@/funcs/bungie";
import {type Ref, ref} from "vue";
import {RouterLink} from "vue-router";

const userSearch = useDebouncedRef("", searchUser)
const userSearchResults: Ref<BungieUserSearchResult[]> = ref([])

const focus = ref(false)

function searchUser() {
  if (!userSearch.value) {
    userSearchResults.value = []
    return
  }

  const promise = searchBungieUser(userSearch.value)
  promise.then((data) => {
    userSearchResults.value = data
  })
}

function unFocus() {
  setTimeout(function() { focus.value = false }, 100)
}
// todo better endpoint - need to be able to search with tag: exiled#5500
</script>

<template>
  <div
      class="relative items-center text-text_bright my-1 gap-2 grow max-w-[40%]"
  >
    <div class="relative flex gap-2 grow p-1 px-2 bg-accent hover:bg-accent/80 text-xl rounded-lg ">
      <input
          type="text"
          v-model="userSearch"
          @keyup.enter="searchUser()"
          class="hover:text-text_bright peer w-full h-full bg-transparent font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 transition-all px-3 py-2.5 "
          placeholder=" "
          @focus="focus = true"
          @blur="unFocus()"
      />
      <label
          class="text-ellipsis flex text-text_normal peer-focus:text-text_normal peer-placeholder-shown:text-text_bright w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate leading-tight peer-focus:leading-tight transition-all -top-0.5 peer-placeholder-shown:text-base text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:w-2.5 before:h-0.5 before:mt-[6.5px] before:mr-1 before:rounded-tl-md  before:pointer-events-none before:transition-all after:content[' '] after:block after:flex-grow after:w-2.5 after:h-2 after:mt-[6.5px] after:ml-1 after:rounded-tr-md after:pointer-events-none after:transition-all  peer-placeholder-shown:leading-[3.75]"
      >
        Search Player...
      </label>
    </div>

    <div
        v-if="focus && userSearch != ''"
        class="absolute w-full min-w-72 right-0 flex flex-col overflow-y-scroll mt-2 max-h-[600px] bg-accent text-text_normal font-bold text-lg z-10 rounded-lg p-[5px]"
    >
      <div v-if="userSearchResults.length == 0" class="font-medium italic text-sm py-2">
        Nothing found :(
      </div>

      <RouterLink
          v-else
          v-for="user in userSearchResults"
          class="rounded-lg flex justify-between items-center p-2 select-none hover:bg-text_bright hover:text-bg_site"
          :to="`/${convertMembershipTypeToStr(user.mainMembershipType)}/${user.mainMembershipId}`"
      >
        <p>
          {{ user.bungieGlobalDisplayName }}<span class="text-text_dull">#{{ user.bungieGlobalDisplayNameCode.toString().padStart(4, '0') }}</span>
        </p>

        <div class="flex flex-row-reverse items-center gap-1">
          <div v-for="platform in user.destinyMemberships">
            <div
                v-if="platform.membershipType == user.mainMembershipType"
                class="border-2 border-text_bright rounded-xl"
            >
              <img
                  :src="getPlatformIcon(convertMembershipTypeToStr(platform.membershipType))"
                  alt="Platform"
                  class="h-5 w-5"
              />
            </div>
            <div v-else>
              <img
                  :src="getPlatformIcon(convertMembershipTypeToStr(platform.membershipType))"
                  alt="Platform"
                  class="h-3 w-3"
              />
            </div>
          </div>
        </div>

      </RouterLink>
    </div>

  </div>
</template>
