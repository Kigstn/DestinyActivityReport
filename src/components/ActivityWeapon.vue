<script setup lang="ts">
import type {PgcrWeapon} from "@/funcs/pgcrStats";

defineProps<{
  data: PgcrWeapon,
}>()

// todo divide by slot - primary / energy / heavy
</script>

<template>
  <div>
    {{data}}
  </div>
</template>
