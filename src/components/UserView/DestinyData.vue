<script setup lang="ts">

import {getActivities} from "@/funcs/bungie";
import {useRoute} from "vue-router";

const route = useRoute()

const membershipType = route.params.membershipType
const membershipId = route.params.membershipId

const data = await getActivities(membershipId, membershipType)


</script>

<template>
  <div>
    {{data}}
  </div>
</template>
