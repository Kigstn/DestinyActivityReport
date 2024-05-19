<script setup lang="ts">
import Tooltip from "@/components/UserView/Tooltip.vue";
import {RouterLink} from "vue-router";
import {convertMembershipTypeToStr} from "@/funcs/bungie";

const props = defineProps<{
  membershipType: string,
  membershipId: string,
  iconUrl: string,
  name: string,
  code: string,
}>()
defineEmits(["unpin"])

const membershipTypeStr = convertMembershipTypeToStr(props.membershipType)

const iconByPlatform = {
  "pc": "https://www.bungie.net/img/theme/bungienet/icons/steamLogo.png",
  "xb": "https://www.bungie.net/img/theme/bungienet/icons/xboxLiveLogo.png",
  "ps": "https://www.bungie.net/img/theme/bungienet/icons/psnLogo.png",
  "stadia": "https://www.bungie.net/img/theme/bungienet/icons/icon_egs.png",
  "egs": "https://www.bungie.net/img/theme/bungienet/icons/stadiaLogo.png",
}
let platformIcon: string = "https://www.bungie.net/img/misc/missing_icon_d2.png"
if (membershipTypeStr in iconByPlatform) {
  // @ts-ignore
  platformIcon = iconByPlatform[membershipTypeStr]
}

</script>

<template>
  <Tooltip>
    <template v-slot:hoverable>
      <RouterLink :to="`/${membershipType}/${membershipId}`">
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

      </RouterLink>
    </template>

    <template v-slot:content>
      <div class="flex flex-col gap-4">
        <p class="text-lg">
          {{name}}#{{code}}
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
