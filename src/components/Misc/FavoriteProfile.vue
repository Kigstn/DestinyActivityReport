<script setup lang="ts">
import Tooltip from "@/components/UserView/Tooltip.vue";
import {RouterLink} from "vue-router";
import {convertMembershipTypeToStr, getPlatformIcon} from "@/funcs/bungie";
import LinkToOtherPlayer from "@/components/LinkToOtherPlayer.vue";

const props = defineProps<{
  membershipType: string | number,
  membershipId: string,
  iconUrl: string,
  name: string,
  code: string,
}>()
defineEmits(["unpin"])

const membershipTypeStr = convertMembershipTypeToStr(props.membershipType)
const platformIcon = getPlatformIcon(membershipTypeStr)
</script>

<template>
  <Tooltip>
    <template v-slot:hoverable>
      <LinkToOtherPlayer :membership-type="membershipType" :membership-id="membershipId">
        <div class="relative">
          <img
              :src="iconUrl"
              alt="Profile Picture"
              class="h-14 w-14 relative clickable"
          />
          <img
              :src="platformIcon"
              alt="Platform"
              class="h-3 w-3 absolute bottom-1 right-1"
          />
        </div>

      </LinkToOtherPlayer>
    </template>

    <template v-slot:content>
      <div class="flex flex-col gap-4">
        <p class="text-lg">
          {{ name }}#{{ code }}
        </p>

        <div class="flex justify-center">
          <button class="clickable p-2" @click="$emit('unpin')">
            Unpin
          </button>
        </div>
      </div>
    </template>
  </Tooltip>
</template>
