import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

type StoredNotification = {
  id: string
  title: string
  message: string
  priority: 0 | 1 | 2
}

export const useAppStore = defineStore('app', () => {
  const notifications = useStorage<StoredNotification[]>('notifications', [])

  // Add a new notification
  const addNotification = async (notification: Omit<StoredNotification, 'id'>) => {
    const id = crypto.randomUUID()
    notifications.value.push({
      ...notification,
      id
    })
    return id
  }

  // Remove a notification
  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  // Clear all notifications
  const clearNotifications = () => {
    notifications.value = []
  }

  // Get notification count
  const count = computed(() => notifications.value.length)

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    count
  }
})
