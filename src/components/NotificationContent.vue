<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import type { Notification } from '../services/supabaseService'

const props = defineProps<{
  notification: Notification
}>()

Chart.register(...registerables)

const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const createChart = () => {
  if (
    !chartRef.value ||
    !props.notification.extra_data ||
    props.notification.extra_data.type !== 'chart'
  )
    return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const chartData = props.notification.extra_data.data

  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy()
  }

  // Check if dark mode is enabled
  const isDarkMode =
    document.documentElement.classList.contains('dark') ||
    window.matchMedia('(prefers-color-scheme: dark)').matches

  // Set colors based on theme
  const textColor = isDarkMode
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(0, 0, 0, 0.8)'
  const gridColor = isDarkMode
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'

  chart = new Chart(ctx, {
    type: chartData.type,
    data: {
      labels: chartData.labels,
      datasets: chartData.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            usePointStyle: false,
            boxWidth: 20,
            boxHeight: 4,
            padding: 15,
            lineWidth: 0,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: isDarkMode
            ? 'rgba(0, 0, 0, 0.8)'
            : 'rgba(255, 255, 255, 0.9)',
          titleColor: isDarkMode ? '#fff' : '#000',
          bodyColor: isDarkMode ? '#fff' : '#000',
          borderColor: gridColor,
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
            weight: 'bold',
          },
          bodyFont: {
            size: 13,
          },
          displayColors: true,
          boxPadding: 6,
        },
      },
      scales:
        chartData.type === 'line' || chartData.type === 'bar'
          ? {
              x: {
                grid: {
                  color: gridColor,
                  borderColor: gridColor,
                  tickColor: gridColor,
                },
                ticks: {
                  color: textColor,
                  padding: 8,
                  font: {
                    size: 11,
                  },
                },
              },
              y: {
                grid: {
                  color: gridColor,
                  borderColor: gridColor,
                  tickColor: gridColor,
                },
                ticks: {
                  color: textColor,
                  padding: 8,
                  font: {
                    size: 11,
                  },
                },
                beginAtZero: true,
              },
            }
          : undefined,
    },
  })
}

// Create or update chart when notification changes
watch(
  () => props.notification.extra_data,
  () => {
    if (props.notification.extra_data?.type === 'chart') {
      createChart()
    }
  },
  { deep: true }
)

// Watch for theme changes
const observer = new MutationObserver(() => {
  if (props.notification.extra_data?.type === 'chart') {
    createChart()
  }
})

onMounted(() => {
  if (props.notification.extra_data?.type === 'chart') {
    createChart()
  }

  // Observe theme changes
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})

// Clean up observer
onUnmounted(() => {
  observer.disconnect()
})
</script>

<template>
  <div class="notification-content">
    <!-- Stats Display -->
    <div
      v-if="notification.extra_data?.type === 'stats'"
      class="stats shadow bg-base-200 rounded-lg"
    >
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="(value, index) in notification.extra_data.data.values"
          :key="index"
          class="stat"
        >
          <div class="stat-title text-xs">
            {{ notification.extra_data.data.labels[index] }}
          </div>
          <div class="stat-value text-primary">
            {{ value }}
          </div>
          <div
            v-if="notification.extra_data.data.trend"
            class="stat-desc flex items-center gap-1"
          >
            <span
              v-if="notification.extra_data.data.change"
              :class="{
                'text-success': notification.extra_data.data.trend === 'up',
                'text-error': notification.extra_data.data.trend === 'down',
              }"
            >
              {{ notification.extra_data.data.change > 0 ? '+' : ''
              }}{{ notification.extra_data.data.change }}%
            </span>
            <svg
              v-if="notification.extra_data.data.trend === 'up'"
              class="w-4 h-4 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <svg
              v-if="notification.extra_data.data.trend === 'down'"
              class="w-4 h-4 text-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Display -->
    <div
      v-else-if="notification.extra_data?.type === 'chart'"
      class="chart-container bg-base-200 p-4 rounded-lg"
    >
      <canvas ref="chartRef" />
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  height: 200px;
  width: 100%;
}
</style>
