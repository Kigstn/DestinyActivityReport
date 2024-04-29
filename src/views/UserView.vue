<script setup lang="ts">

import DestinyData from "@/components/UserView/DestinyData.vue";
import {useRoute} from "vue-router";

const route = useRoute()

const membershipType = route.params.membershipType
const membershipId = route.params.membershipId


</script>


<template>
  <div>
    membershipType {{ membershipType }}
    membershipId {{ membershipId }}
  </div>

  <Suspense>
    <!-- main content -->
    <DestinyData/>

    <!-- loading state -->
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>
