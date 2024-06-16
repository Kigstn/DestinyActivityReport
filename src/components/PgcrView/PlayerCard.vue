<script setup lang="ts">
import type {PlayerProfile} from "@/funcs/bungie";
import Tooltip from "@/components/UserView/Tooltip.vue";

const props = defineProps<{
  teammate: PlayerProfile,
  hint?: string,
  hintTooltip?: string,
}>()
</script>

<template>
  <!-- Player Info -->
  <RouterLink :to="`/${teammate.membershipType}/${teammate.membershipId}`">
    <div class="flex group/clickable">
      <!-- Icon -->
      <div class="shrink-0 text-clickable">
        <img
            class="rounded-tl-lg object-cover h-16 w-16"
            :src="teammate.iconUrl"
            alt="icon"
        />
      </div>

      <!-- Name -->
      <div class="pl-2 h-16 w-full truncate flex flex-col justify-center border-b border-text_dull">
        <div class="text-text_bright font-bold text-clickable">
          {{ teammate.name }}#{{ teammate.code }}
        </div>

        <div class="text-xs text-accent font-bold text-left">
          <div class="flex place-items-center">
            <slot/>
          </div>

          <div v-if="hint" class="flex">
            <Tooltip v-if="hintTooltip">
              <template v-slot:hoverable>
                <div class="cursor-help">
                  {{ hint }}
                </div>
              </template>

              <template v-slot:content>
                {{ hintTooltip }}
              </template>
            </Tooltip>

            <div v-else class="cursor-help">
              {{ hint }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
