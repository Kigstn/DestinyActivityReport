<script setup lang="ts">

import DestinyData from "@/components/UserView/DestinyData.vue";
import {useRoute} from "vue-router";

const route = useRoute()
</script>


<template>
  <Suspense>
    <!-- main content -->
    <DestinyData/>

    <!-- loading state -->
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>
