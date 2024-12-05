<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useBadge } from '../composables/useBadge'
import { useNotifications } from '../composables/useNotifications'
import { useAppStore } from '../stores/app.store'

const store = useAppStore()
const { updateBadgeCount } = useBadge()
const { showNotification } = useNotifications()

// Update badge when notifications change
watch(() => store.count, (newCount) => {
  updateBadgeCount(newCount)
})

// Handle new notification
const handleNewNotification = async (
  title: string,
  message: string,
  priority: 0 | 1 | 2 = 1
) => {
  try {
    await showNotification(title, message, priority)
    await store.addNotification({ title, message, priority })
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}

const addTestNotification = () => {
  const timestamp = new Date().toLocaleTimeString()
  handleNewNotification(
    'Test Notification',
    `This is a test notification created at ${timestamp}`,
    1
  )
}

// Handle notification clearing
const clearNotification = async (id: string) => {
  try {
    store.removeNotification(id)
  } catch (error) {
    console.error('Error clearing notification:', error)
  }
}
</script>

<template>
  <div class="text-center m-4 flex flex-col gap-y-4">
    <h1 class="text-2xl font-bold">Notification Handler</h1>
    
    <!-- Add Notification Button -->
    <button 
      class="btn btn-primary"
      @click="addTestNotification"
      :disabled="store.isLoading"
    >
      Add Test Notification
    </button>

    <!-- Loading State -->
    <div v-if="store.isLoading" class="loading loading-spinner"></div>

    <!-- Notifications Counter -->
    <div v-else-if="store.count" class="badge badge-primary">
      {{ store.count }} pending notifications
    </div>
    <div v-else class="text-gray-500">
      No pending notifications
    </div>

    <!-- List of Current Notifications -->
    <div v-if="store.notifications.length" class="flex flex-col gap-y-2">
      <div 
        v-for="notification in store.notifications" 
        :key="notification.id"
        class="card bg-base-200 shadow-sm"
      >
        <div class="card-body p-4">
          <h3 class="card-title text-lg">{{ notification.title }}</h3>
          <p class="text-sm">{{ notification.message }}</p>
          <div class="card-actions justify-end">
            <span class="badge badge-sm" :class="{
              'badge-error': notification.priority === 2,
              'badge-warning': notification.priority === 1,
              'badge-info': notification.priority === 0
            }">
              Priority {{ notification.priority }}
            </span>
            <button 
              class="btn btn-sm btn-ghost"
              @click="clearNotification(notification.id)"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 