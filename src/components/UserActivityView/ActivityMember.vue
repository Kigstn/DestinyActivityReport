<script setup lang="ts">
import type {PgcrTeammate} from "@/funcs/pgcrStats";
import {getManifestWeapon, getPlayerInfo} from "@/funcs/bungie";
import ActivityClassStat from "@/components/UserActivityView/ActivityClassStat.vue";
import LoadingDiv from "@/components/LoadingDiv.vue";
import {type Ref, ref, watch} from "vue";
import {useRoute} from "vue-router";
import ActivityStat from "@/components/UserView/Activities/ActivityStat.vue";
import {formatPercent, formatTime} from "../../funcs/utils";
import Tooltip from "@/components/UserView/Tooltip.vue";

const props = defineProps<{
  data: PgcrTeammate,
}>()

const loading = ref(true)
const teammate: Ref<any> = ref(null)

const route = useRoute()
watch(() => route.params, fetchData, {immediate: true})

async function fetchData(newRoute: any) {
  teammate.value = null
  loading.value = true

  teammate.value = await getPlayerInfo(props.data.membershipId, props.data.membershipType)

  loading.value = false
}
</script>

<template>
  <div v-if="loading" class="w-64 h-[140px]">
    <LoadingDiv class="!bg-bg_site"/>
  </div>

  <div v-else class="flex flex-col justify-center w-64 bg-bg_site rounded-lg">
    <!-- Weapon Info -->
    <RouterLink :to="`/${teammate.membershipType}/${teammate.membershipId}`">
      <div class="flex">
        <!-- Icon -->
        <div class="shrink-0">
          <img
              class="rounded-tl-lg object-cover h-16 w-16"
              :src="teammate.iconUrl"
              alt="icon"
          />
        </div>

        <!-- Name -->
        <div class="pl-2 h-16 w-full truncate flex flex-col justify-center border-b border-text_dull">
          <div class="text-text_bright font-bold">
            {{ teammate.name }}#{{ teammate.code }}
          </div>

          <div class="flex">
            <Tooltip>
              <template v-slot:hoverable>
                <div class="text-xs text-accent font-bold text-left cursor-help">
                  {{ formatTime(data.totalTime) }}
                </div>
              </template>

              <template v-slot:content>
                How long you played together in this activity
              </template>
            </Tooltip>
          </div>
        </div>
      </div>
    </RouterLink>

    <!-- Stats -->
    <div class="grid grid-cols-3 place-items-center gap-2 px-1 p-4">
      <ActivityStat name="Full" :amount="data.fullClears" show-null/>
      <ActivityStat name="Checkpoint" :amount="data.cpClears" show-null/>
      <ActivityStat name="Failed" :amount="data.failedClears" show-null/>
    </div>
  </div>
</template>
