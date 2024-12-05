import { createPollingService } from '../services/pollingService'
import { apiService, type Notification } from '../services/apiService'

interface BadgeConfig {
  text: string
  backgroundColor?: string
  textColor?: string
  tabId?: number
}

// Helper function to update the badge
const updateBadge = ({
  text,
  backgroundColor = '#FF0000',
  textColor = '#FFFFFF',
  tabId,
}: BadgeConfig) => {
  try {
    // Set badge text
    if (typeof text === 'string') {
      chrome.action.setBadgeText({ text })
    }

    // Set badge background color
    if (backgroundColor) {
      chrome.action.setBadgeBackgroundColor({ color: backgroundColor })
    }

    // Set badge text color
    if (textColor && chrome.action.setBadgeTextColor) {
      chrome.action.setBadgeTextColor({ color: textColor })
    }

    console.log('Badge updated:', { text, backgroundColor, textColor })
  } catch (error) {
    console.error('Error updating badge:', error)
  }
}

// Show system notification
const showSystemNotification = (notification: Notification) => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('src/assets/logo.png'),
    title: notification.title,
    message: notification.message,
    priority: notification.priority,
    requireInteraction: notification.priority === 2,
  })
}

// Handle badge updates
const handleBadgeUpdate = (count: number) => {
  console.log('Received count update:', count)
  const displayText = count > 99 ? '99+' : count.toString()
  updateBadge({
    text: count === 0 ? '' : displayText,
    backgroundColor: '#FF0000',
    textColor: '#FFFFFF',
  })
}

// Handle errors
const handleError = (error: Error) => {
  console.error('Polling error:', error)
  updateBadge({ text: '!' })
}

// Create polling service with 30-second interval
const pollingService = createPollingService(
  handleBadgeUpdate, 
  handleError, 
  30000,
  // Pass notification callback
  showSystemNotification
)

// Track polling status
let isPolling = false

// Start polling when the service worker starts
console.log('Starting polling service...')
pollingService.start()
isPolling = true

// Set up real-time subscription
apiService.subscribeToNotifications((notification) => {
  console.log('Received real-time notification:', notification)
  showSystemNotification(notification)
  // Refresh badge count
  pollingService.refresh()
})

// Listen for messages from the content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message)

  switch (message.type) {
    case 'UPDATE_BADGE':
      const { count = 0 } = message
      handleBadgeUpdate(count)
      break

    case 'REFRESH_BADGE':
      console.log('Manual refresh requested')
      pollingService.refresh()
      break

    case 'START_POLLING':
      console.log('Starting polling')
      pollingService.start()
      isPolling = true
      break

    case 'STOP_POLLING':
      console.log('Stopping polling')
      pollingService.stop()
      isPolling = false
      break

    case 'IS_POLLING':
      console.log('Polling status requested')
      sendResponse({ isPolling })
      break
  }

  // Return true to indicate we will send a response asynchronously
  return true
})

// Clean up when the service worker is terminated
self.addEventListener('unload', () => {
  console.log('Service worker unloading, stopping polling')
  pollingService.stop()
  isPolling = false
})
