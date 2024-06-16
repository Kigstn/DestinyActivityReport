<script setup lang="ts">
import type {DestinyPostGameCarnageReportData, DestinyPostGameCarnageReportEntry} from "bungie-api-ts/destiny2";
import ActivityMember from "@/components/UserActivityView/ActivityMember.vue";
import PlayerCard from "@/components/PgcrView/PlayerCard.vue";
import {useRoute} from "vue-router";
import {ref, watch} from "vue";
import {getPlayerInfo} from "@/funcs/bungie";
import {CollapsibleContent, CollapsibleRoot, CollapsibleTrigger} from "radix-vue";
import {Icon} from "@iconify/vue";
import ActivityStat from "@/components/UserView/Activities/ActivityStat.vue";
import {isFresh} from "@/funcs/pgcrStats";
import CompletionIcon from "@/components/PgcrView/CompletionIcon.vue";
import {formatTime} from "@/funcs/utils";

const props = defineProps<{
  period: Date,
  pgcr: DestinyPostGameCarnageReportData,
  data: DestinyPostGameCarnageReportEntry,
}>()

const teammate = await getPlayerInfo(props.data.player.destinyUserInfo.membershipId, props.data.player.destinyUserInfo.membershipType)
const open = ref(false)


const completed = props.data.values.completed.basic.value == 1 && props.data.values.completionReason.basic.value == 0
const fresh = isFresh(props.period, props.pgcr)
const specialTags = []
</script>

<template>
  <div class="flex flex-col bg-bg_site rounded-lg">
    <div class="">
      <PlayerCard :teammate="teammate">
        <svg width="10" height="10" viewBox="0 0 32 32" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path
              d="M22.962 8.863c-2.628-2.576-4.988-5.407-7.045-8.458l-0.123-0.193c-2.234 3.193-4.556 5.993-7.083 8.592l0.015-0.016c-2.645 2.742-5.496 5.245-8.542 7.499l-0.184 0.13c3.341 2.271 6.262 4.682 8.943 7.335l-0.005-0.005c2.459 2.429 4.71 5.055 6.731 7.858l0.125 0.182c4.324-6.341 9.724-11.606 15.986-15.649l0.219-0.133c-3.401-2.168-6.359-4.524-9.048-7.153l0.010 0.010zM18.761 18.998c-1.036 1.024-1.971 2.145-2.792 3.35l-0.050 0.078c-0.884-1.215-1.8-2.285-2.793-3.279l0 0c-1.090-1.075-2.28-2.055-3.552-2.923l-0.088-0.057c1.326-0.969 2.495-1.988 3.571-3.097l0.007-0.007c1.010-1.051 1.947-2.191 2.794-3.399l0.061-0.092c0.882 1.32 1.842 2.471 2.912 3.51l0.005 0.005c1.089 1.072 2.293 2.034 3.589 2.864l0.088 0.053c-1.412 0.905-2.641 1.891-3.754 2.994l0.002-0.002z"
              fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
        </svg>
        <p>
          {{ `${data.player.lightLevel} // ${data.player.characterClass}` }}
        </p>
      </PlayerCard>
    </div>

    <CollapsibleRoot v-model:open="open" class="p-4">
      <div class="flex gap-4">
        <div class="grid grid-cols-5 w-full place-items-center">
          <div class="flex flex-col justify-center place-items-center">
            <div>
              <CompletionIcon
                  :special="specialTags.length > 0"
                  :full="completed && fresh"
                  :cp="completed"
              />
            </div>
            <div class="font-medium italic text-sm text-text_dull mt-1">
              {{ completed ? "Completed" : "Failed" }}
            </div>
          </div>
          <ActivityStat name="Playtime" :amount="formatTime(data.values.timePlayedSeconds.basic.value)" show-null/>

          <ActivityStat name="Kills" :amount="data.values.kills.basic.value" show-null/>
          <ActivityStat name="Deaths" :amount="data.values.deaths.basic.value" show-null/>
          <ActivityStat name="Assists" :amount="data.values.assists.basic.value" show-null/>
        </div>

        <div class="flex flex-col justify-center w-12">
          <div class="flex justify-center">
            <CollapsibleTrigger class="clickable p-2">
              <Icon
                  v-if="open"
                  icon="radix-icons:cross-2"
                  class="h-4 w-4"
              />
              <Icon
                  v-else
                  icon="radix-icons:row-spacing"
                  class="h-4 w-4"
              />
            </CollapsibleTrigger>
          </div>
        </div>
      </div>

      <CollapsibleContent
          class="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
        <div>
          stats
          weapon stats
        </div>
      </CollapsibleContent>
    </CollapsibleRoot>
  </div>
</template>
