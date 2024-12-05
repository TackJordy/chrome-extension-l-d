<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useBadge } from '../composables/useBadge'
import { useNotifications } from '../composables/useNotifications'
import { useAppStore } from '../stores/app.store'

const store = useAppStore()
const { updateBadgeCount } = useBadge()
const { showNotification } = useNotifications()

// Update badge when notifications change
watch(
  () => store.count,
  (newCount) => {
    updateBadgeCount(newCount)
  }
)

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
  <div class="min-w-[350px] p-4 bg-base-100">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-primary">Notifications</h1>
      <div
        v-if="store.count"
        class="badge badge-primary badge-lg"
      >
        {{ store.count }}
      </div>
    </div>

    <!-- Add Notification Button -->
    <div class="flex justify-center mb-6">
      <button
        class="btn btn-primary w-full"
        @click="addTestNotification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Add Notification
      </button>
    </div>

    <!-- Notifications List -->
    <div class="space-y-4">
      <div
        v-if="!store.notifications.length"
        class="text-center py-8"
      >
        <div class="text-4xl mb-2">📬</div>
        <p class="text-base-content/60">No notifications yet</p>
      </div>

      <div
        v-for="notification in store.notifications"
        v-else
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
              @click="clearNotification(notification.id)"
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
              {{ new Date().toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear All Button (shown when there are notifications) -->
    <div
      v-if="store.notifications.length"
      class="mt-6 flex justify-center"
    >
      <button
        class="btn btn-ghost btn-sm"
        @click="store.clearNotifications"
      >
        Clear All
      </button>
    </div>
  </div>
</template>
