<template>
  <div class="p-4 space-y-4">
    <div class="card bg-base-200">
      <div class="card-body">
        <h2 class="card-title">Create Test Notification</h2>
        
        <!-- Notification Form -->
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Title</span>
          </label>
          <input 
            v-model="newNotification.title" 
            type="text" 
            placeholder="Notification title" 
            class="input input-bordered w-full"
          />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Message</span>
          </label>
          <textarea 
            v-model="newNotification.message" 
            placeholder="Notification message" 
            class="textarea textarea-bordered w-full"
          />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Priority</span>
          </label>
          <select v-model="newNotification.priority" class="select select-bordered w-full">
            <option :value="0">Low</option>
            <option :value="1">Normal</option>
            <option :value="2">High</option>
          </select>
        </div>

        <div class="card-actions justify-end mt-4">
          <button 
            @click="createNotification" 
            class="btn btn-primary"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Creating...' : 'Create Notification' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Current Notifications -->
    

    <!-- Debug Info -->
    <div class="card bg-base-200">
      <div class="card-body">
        <h2 class="card-title">Debug Info</h2>
        <div class="space-y-2">
          <p>Unread Count: {{ unreadCount }}</p>
          <p>Last Error: {{ lastError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiService, type Notification } from '../services/apiService'

const notifications = ref<Notification[]>([])
const unreadCount = ref(0)
const isLoading = ref(false)
const isRefreshing = ref(false)
const lastError = ref('')

const newNotification = ref({
  title: '',
  message: '',
  priority: 1
})

// Create a test notification
const createNotification = async () => {
  try {
    isLoading.value = true
    await apiService.createNotification({
      title: newNotification.value.title,
      message: newNotification.value.message,
      priority: newNotification.value.priority,
    })

    // Reset form
    newNotification.value = {
      title: '',
      message: '',
      priority: 1
    }

    // Refresh notifications
    await refreshNotifications()
  } catch (error) {
    lastError.value = error instanceof Error ? error.message : 'Unknown error'
  } finally {
    isLoading.value = false
  }
}

// Refresh notifications list
const refreshNotifications = async () => {
  try {
    isRefreshing.value = true
    const response = await apiService.fetchUnreadNotifications()
    notifications.value = response.notifications
    unreadCount.value = response.unreadCount
  } catch (error) {
    lastError.value = error instanceof Error ? error.message : 'Unknown error'
  } finally {
    isRefreshing.value = false
  }
}

// Mark notification as read
const markAsRead = async (id: string) => {
  try {
    await apiService.markAsRead(id)
    await refreshNotifications()
  } catch (error) {
    lastError.value = error instanceof Error ? error.message : 'Unknown error'
  }
}

// Get priority label
const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 0: return 'Low'
    case 1: return 'Normal'
    case 2: return 'High'
    default: return 'Unknown'
  }
}

// Subscribe to real-time updates
onMounted(() => {
  refreshNotifications()
  
  apiService.subscribeToNotifications(() => {
    refreshNotifications()
  })
})
</script> 