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

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Content Type</span>
          </label>
          <select v-model="contentType" class="select select-bordered w-full">
            <option value="none">None</option>
            <option value="stats">Stats</option>
            <option value="lineChart">Line Chart</option>
            <option value="barChart">Bar Chart</option>
            <option value="pieChart">Pie Chart</option>
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

    <!-- Preview -->
    <div v-if="previewNotification.extra_data" class="card bg-base-200">
      <div class="card-body">
        <h2 class="card-title">Preview</h2>
        <NotificationContent :notification="previewNotification" />
      </div>
    </div>

    <!-- Debug Info -->
    <div class="card bg-base-200">
      <div class="card-body">
        <h2 class="card-title">Debug Info</h2>
        <div class="space-y-2">
          <p>Last Error: {{ lastError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { apiService } from '../services/apiService'
import type { Notification, NotificationStats, NotificationChart } from '../services/supabaseService'
import NotificationContent from './NotificationContent.vue'

const isLoading = ref(false)
const lastError = ref('')
const contentType = ref('none')

const newNotification = ref({
  title: '',
  message: '',
  priority: 1
})

// Example data for different content types
const contentExamples: Record<string, NotificationStats | NotificationChart> = {
  stats: {
    type: 'stats',
    data: {
      values: [98.5, 245, 12.3],
      labels: ['Uptime %', 'Requests/sec', 'Latency ms'],
      change: 5.2,
      trend: 'up'
    }
  },
  lineChart: {
    type: 'chart',
    data: {
      type: 'line',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        label: 'Requests',
        data: [1200, 1900, 3000, 5000, 2000],
        borderColor: '#36A2EB',
        fill: false
      }]
    }
  },
  barChart: {
    type: 'chart',
    data: {
      type: 'bar',
      labels: ['CPU', 'Memory', 'Disk', 'Network'],
      datasets: [{
        label: 'Usage %',
        data: [45, 82, 35, 28],
        backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0', '#FFCE56']
      }]
    }
  },
  pieChart: {
    type: 'chart',
    data: {
      type: 'pie',
      labels: ['404', '500', '403', 'Other'],
      datasets: [{
        label: 'Errors',
        data: [45, 25, 20, 10],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    }
  }
}

// Preview notification with extra data
const previewNotification = computed<Notification>(() => ({
  ...newNotification.value,
  id: 'preview',
  created_at: new Date().toISOString(),
  read: false,
  extra_data: contentType.value !== 'none' ? contentExamples[contentType.value] : undefined
}))

// Create a test notification
const createNotification = async () => {
  try {
    isLoading.value = true
    await apiService.createNotification({
      ...newNotification.value,
      extra_data: contentType.value !== 'none' ? contentExamples[contentType.value] : undefined
    })

    // Reset form
    newNotification.value = {
      title: '',
      message: '',
      priority: 1
    }
    contentType.value = 'none'
  } catch (error) {
    lastError.value = error instanceof Error ? error.message : 'Unknown error'
  } finally {
    isLoading.value = false
  }
}
</script> 