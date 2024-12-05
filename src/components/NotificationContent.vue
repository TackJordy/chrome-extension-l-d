<template>
  <div class="notification-content">
    <!-- Stats Display -->
    <div v-if="notification.extra_data?.type === 'stats'" class="stats shadow bg-base-200 rounded-lg">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="(value, index) in notification.extra_data.data.values" :key="index" class="stat">
          <div class="stat-title text-xs">{{ notification.extra_data.data.labels[index] }}</div>
          <div class="stat-value text-primary">{{ value }}</div>
          <div v-if="notification.extra_data.data.trend" class="stat-desc flex items-center gap-1">
            <span v-if="notification.extra_data.data.change" :class="{
              'text-success': notification.extra_data.data.trend === 'up',
              'text-error': notification.extra_data.data.trend === 'down'
            }">
              {{ notification.extra_data.data.change > 0 ? '+' : '' }}{{ notification.extra_data.data.change }}%
            </span>
            <svg v-if="notification.extra_data.data.trend === 'up'" class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <svg v-if="notification.extra_data.data.trend === 'down'" class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Display -->
    <div v-else-if="notification.extra_data?.type === 'chart'" class="chart-container bg-base-200 p-4 rounded-lg">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import type { Notification } from '../services/supabaseService'

Chart.register(...registerables)

const props = defineProps<{
  notification: Notification
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const createChart = () => {
  if (!chartRef.value || !props.notification.extra_data || props.notification.extra_data.type !== 'chart') return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const chartData = props.notification.extra_data.data

  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy()
  }

  chart = new Chart(ctx, {
    type: chartData.type,
    data: {
      labels: chartData.labels,
      datasets: chartData.datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

// Create or update chart when notification changes
watch(() => props.notification.extra_data, () => {
  if (props.notification.extra_data?.type === 'chart') {
    createChart()
  }
}, { deep: true })

onMounted(() => {
  if (props.notification.extra_data?.type === 'chart') {
    createChart()
  }
})
</script>

<style scoped>
.chart-container {
  height: 200px;
  width: 100%;
}
</style> 