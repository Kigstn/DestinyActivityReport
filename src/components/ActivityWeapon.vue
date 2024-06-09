<script setup lang="ts">
import type {PgcrWeapon} from "@/funcs/pgcrStats";
import {getManifestWeapon} from "@/funcs/bungie";
import ActivityClassStat from "@/components/UserActivityView/ActivityClassStat.vue";
import ErrorDiv from "@/components/ErrorDiv.vue";
import LoadingDiv from "@/components/LoadingDiv.vue";
import {type Ref, ref, watch} from "vue";
import {useRoute} from "vue-router";
import type {DestinyDefinition} from "bungie-api-ts/destiny2";

const props = defineProps<{
  data: PgcrWeapon,
}>()

const loading = ref(true)
const weapon: Ref<any> = ref(null)

const route = useRoute()
watch(() => route.params, fetchData, {immediate: true})

async function fetchData(newRoute: any) {
  weapon.value = null
  loading.value = true

  weapon.value = await getManifestWeapon(props.data.referenceId)

  loading.value = false
}

const ammoToImage = {
  1: "https://www.bungie.net/common/destiny2_content/icons/99f3733354862047493d8550e46a45ec.png",
  2: "https://www.bungie.net/common/destiny2_content/icons/d920203c4fd4571ae7f39eb5249eaecb.png",
  3: "https://www.bungie.net/common/destiny2_content/icons/78ef0e2b281de7b60c48920223e0f9b1.png",
}
</script>

<template>
  <div v-if="loading" class="w-64 h-[140px]">
    <LoadingDiv class="!bg-bg_site"/>
  </div>

  <div v-else class="flex flex-col justify-center w-64 bg-bg_site rounded-lg">
    <!-- Weapon Info -->
    <div class="flex">
      <!-- Icon -->
      <div class="relative shrink-0">
        <img
            class="rounded-tl-lg object-cover h-16 w-16"
            :src="'https://www.bungie.net' + weapon.displayProperties.icon"
            alt="icon"
        />

        <div class="absolute top-0 left-0">
          <img class="rounded-tl-lg" :src="'https://www.bungie.net' + weapon.iconWatermark"/>
        </div>
        <div class="absolute bottom-0 right-0 h-[40%] w-[40%]">
          <img :src="ammoToImage[weapon.equippingBlock.ammoType]"/>
        </div>
      </div>

      <!-- Name -->
      <div class="pl-2 h-16 w-full truncate flex flex-col justify-center border-b border-text_dull">
        <div class="text-text_bright font-bold">
          {{ weapon.displayProperties.name }}
        </div>

        <div class="text-xs italic text-text_dull">
          {{ weapon.itemTypeAndTierDisplayName }}
        </div>

      </div>
    </div>


    <!-- Stats -->
    <div class="grid grid-cols-5 place-items-center gap-2 px-1 p-4">
      <div class="col-span-2">
        <ActivityClassStat name="Kills" :amount="data.kills"/>
      </div>
      <div class="col-span-3">
        <ActivityClassStat name="Precision Kills" :amount="data.precisionKillsWithPercent"/>
      </div>
    </div>
  </div>
</template>
