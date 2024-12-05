<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { apiService, type Notification } from '../services/apiService'

const notifications = ref<Notification[]>([])

// Fetch notifications
const fetchNotifications = async () => {
  try {
    const response = await apiService.fetchUnreadNotifications()
    notifications.value = response.notifications

    // Update badge count
    chrome.runtime.sendMessage({
      type: 'UPDATE_BADGE',
      count: response.unreadCount,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}

// Mark notification as read
const markAsRead = async (id: string) => {
  try {
    await apiService.markAsRead(id)
    await fetchNotifications()
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

// Initialize
onMounted(() => {
  // Initial fetch
  fetchNotifications()

  // Subscribe to real-time updates
  apiService.subscribeToNotifications(() => {
    console.log('Received real-time notification update')
    fetchNotifications()
  })
})
</script>

<template>
  <div class="min-w-[350px] p-4 bg-base-100">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-primary">Notifications</h1>
      <div
        v-if="notifications.length"
        class="badge badge-primary badge-lg"
      >
        {{ notifications.length }}
      </div>
    </div>

    <!-- Notifications List -->
    <div class="space-y-4">
      <div
        v-if="!notifications.length"
        class="text-center py-8"
      >
        <div class="text-4xl mb-2">📬</div>
        <p class="text-base-content/60">No notifications yet</p>
      </div>

      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="card-body p-4">
          <div class="flex items-start justify-between">
            <h3 class="card-title text-lg">
              {{ notification.title }}
            </h3>
            <button
              class="btn btn-ghost btn-sm btn-circle"
              @click="markAsRead(notification.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <p class="text-sm text-base-content/70">
            {{ notification.message }}
          </p>

          <div class="flex justify-between items-center mt-2">
            <span
              class="badge badge-sm"
              :class="{
                'badge-error': notification.priority === 2,
                'badge-warning': notification.priority === 1,
                'badge-info': notification.priority === 0,
              }"
            >
              Priority {{ notification.priority }}
            </span>
            <span class="text-xs text-base-content/50">
              {{ new Date(notification.created_at).toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
