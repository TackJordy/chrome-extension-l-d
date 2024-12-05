<script setup lang="ts">
import NotificationHandler from '../../components/NotificationHandler.vue'
import { useAppStore } from '@/stores/app.store'
</script>

<template>
  <div class="text-center m-4 flex flex-col gap-y-2">
    <NotificationHandler />
  </div>
</template>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md bg-blue-500 text-white;
}


</style>
