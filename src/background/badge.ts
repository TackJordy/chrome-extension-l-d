import { createPollingService } from '../services/pollingService'

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

// Handle badge updates
const handleBadgeUpdate = (count: number) => {
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

// Create polling service
const pollingService = createPollingService(handleBadgeUpdate, handleError)

// Start polling when the service worker starts
pollingService.start()

// Listen for messages from the content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'UPDATE_BADGE':
      const { count = 0 } = message
      handleBadgeUpdate(count)
      break

    case 'CREATE_NOTIFICATION':
      const { title, message: notificationMessage, priority = 1 } = message
      if (chrome.notifications?.create) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: chrome.runtime.getURL('src/assets/logo.png'),
          title,
          message: notificationMessage,
          priority,
          requireInteraction: priority === 2,
        })
      }
      break

    case 'REFRESH_BADGE':
      pollingService.refresh()
      break

    case 'START_POLLING':
      pollingService.start()
      break

    case 'STOP_POLLING':
      pollingService.stop()
      break
  }

  // Return true to indicate we will send a response asynchronously
  return true
})

// Clean up when the service worker is terminated
self.addEventListener('unload', () => {
  pollingService.stop()
})
