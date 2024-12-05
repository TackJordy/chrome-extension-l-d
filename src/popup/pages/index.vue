<script setup lang="ts">
import NotificationHandler from '../../components/NotificationHandler.vue'
import NotificationTester from '../../components/NotificationTester.vue'
import { ref } from 'vue'

const activeTab = ref('handler')
</script>

<template>
  <div class="p-4">
    <div class="tabs tabs-boxed w-full mb-4">
      <a 
        class="tab flex-1" 
        :class="{ 'tab-active': activeTab === 'handler' }"
        @click="activeTab = 'handler'"
      >
        Handler
      </a>
      <a 
        class="tab flex-1" 
        :class="{ 'tab-active': activeTab === 'tester' }"
        @click="activeTab = 'tester'"
      >
        Tester
      </a>
    </div>

    <div>
      <NotificationHandler v-if="activeTab === 'handler'" />
      <NotificationTester v-if="activeTab === 'tester'" />
    </div>
  </div>
</template>

<style scoped>
:deep(.tab-content) {
  min-width: 300px;
  min-height: 200px;
}
</style>
