<script setup lang="ts">
import { computed, ref } from 'vue'
import { apiService } from '../services/apiService'
import type {
  Notification,
  NotificationChart,
  NotificationStats,
} from '../services/supabaseService'
import NotificationContent from './NotificationContent.vue'

const isLoading = ref(false)
const lastError = ref('')
const contentType = ref('none')

const newNotification = ref({
  title: '',
  message: '',
  priority: 1,
})

const action = ref({
  label: '',
  url: '',
})

// Example data for different content types
const contentExamples: Record<string, NotificationStats | NotificationChart> = {
  stats: {
    type: 'stats',
    data: {
      values: [98.5, 245, 12.3],
      labels: ['Uptime %', 'Requests/sec', 'Latency ms'],
      change: 5.2,
      trend: 'up',
    },
  },
  lineChart: {
    type: 'chart',
    data: {
      type: 'line',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [
        {
          label: 'Requests',
          data: [1200, 1900, 3000, 5000, 2000],
          borderColor: 'rgb(56, 189, 248)',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(56, 189, 248)',
          pointBorderColor: 'rgb(56, 189, 248)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(56, 189, 248)',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
          fill: true,
        },
      ],
    },
  },
  barChart: {
    type: 'chart',
    data: {
      type: 'bar',
      labels: ['CPU', 'Memory', 'Disk', 'Network'],
      datasets: [
        {
          label: 'Usage %',
          data: [45, 82, 35, 28],
          backgroundColor: [
            'rgba(56, 189, 248, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(52, 211, 153, 0.8)',
            'rgba(249, 115, 22, 0.8)',
          ],
        },
      ],
    },
  },
  pieChart: {
    type: 'chart',
    data: {
      type: 'pie',
      labels: ['404', '500', '403', 'Other'],
      datasets: [
        {
          label: 'Errors',
          data: [45, 25, 20, 10],
          backgroundColor: [
            'rgba(56, 189, 248, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(52, 211, 153, 0.8)',
            'rgba(249, 115, 22, 0.8)',
          ],
        },
      ],
    },
  },
}

// Preview notification with extra data
const previewNotification = computed<Notification>(() => ({
  ...newNotification.value,
  id: 'preview',
  created_at: new Date().toISOString(),
  read: false,
  extra_data:
    contentType.value !== 'none'
      ? contentExamples[contentType.value]
      : undefined,
  action: action.value.label && action.value.url ? action.value : undefined,
}))

// Create a test notification
const createNotification = async () => {
  try {
    isLoading.value = true
    const notificationData: Pick<
      Notification,
      'title' | 'message' | 'priority' | 'extra_data' | 'action'
    > = {
      ...newNotification.value,
      extra_data:
        contentType.value !== 'none'
          ? contentExamples[contentType.value]
          : undefined,
      action: action.value.label && action.value.url ? action.value : undefined,
    }
    await apiService.createNotification(notificationData)

    // Reset form
    newNotification.value = {
      title: '',
      message: '',
      priority: 1,
    }
    action.value = {
      label: '',
      url: '',
    }
    contentType.value = 'none'
  } catch (error) {
    lastError.value = error instanceof Error ? error.message : 'Unknown error'
  } finally {
    isLoading.value = false
  }
}
</script>

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
          <select
            v-model="newNotification.priority"
            class="select select-bordered w-full"
          >
            <option :value="0">Low</option>
            <option :value="1">Normal</option>
            <option :value="2">High</option>
          </select>
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Content Type</span>
          </label>
          <select
            v-model="contentType"
            class="select select-bordered w-full"
          >
            <option value="none">None</option>
            <option value="stats">Stats</option>
            <option value="lineChart">Line Chart</option>
            <option value="barChart">Bar Chart</option>
            <option value="pieChart">Pie Chart</option>
          </select>
        </div>

        <!-- Action Configuration -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Action Button (Optional)</span>
          </label>
          <div class="flex mb-2">
            <input
              v-model="action.label"
              placeholder="Button Label"
              class="input input-bordered w-full"
            />
          </div>
          <div>
            <input
              v-model="action.url"
              placeholder="URL"
              class="input input-bordered w-full"
            />
          </div>
        </div>

        <div class="card-actions justify-center mt-4">
          <button
            class="btn btn-primary"
            :disabled="isLoading"
            @click="createNotification"
          >
            {{ isLoading ? 'Creating...' : 'Create Notification' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div
      v-if="previewNotification.extra_data"
      class="card bg-base-200"
    >
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
