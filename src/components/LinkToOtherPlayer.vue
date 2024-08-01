<script setup lang="ts">
defineProps<{
  membershipType: string | number,
  membershipId: string,
}>()
</script>

<template>
  <RouterLink v-if="membershipType.toString() !== '0'" :to="`/${membershipType}/${membershipId}`">
    <slot />
  </RouterLink>

  <div v-else>
    <slot />
  </div>
</template>