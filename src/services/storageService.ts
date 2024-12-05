type StoredNotification = {
  id: string
  title: string
  message: string
  priority: 0 | 1 | 2
}

export const storageService = {
  async getNotifications(): Promise<StoredNotification[]> {
    try {
      const result = await chrome.storage.local.get('pendingNotifications')
      return Array.isArray(result.pendingNotifications) ? result.pendingNotifications : []
    } catch (error) {
      console.error('Error getting notifications from storage:', error)
      return []
    }
  },

  async setNotifications(notifications: StoredNotification[]): Promise<void> {
    try {
      await chrome.storage.local.set({ 
        pendingNotifications: Array.isArray(notifications) ? notifications : [] 
      })
    } catch (error) {
      console.error('Error setting notifications in storage:', error)
    }
  },

  async addNotification(notification: StoredNotification): Promise<void> {
    const current = await this.getNotifications()
    await this.setNotifications([...current, notification])
  },

  async removeNotification(id: string): Promise<void> {
    const current = await this.getNotifications()
    await this.setNotifications(current.filter(n => n.id !== id))
  }
} 