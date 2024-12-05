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
    // Set badge text (using Chrome's action API for Manifest V3)
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

    console.log('badge updated with:', { text, backgroundColor, textColor })
  } catch (error) {
    console.error('Error updating badge:', error)
  }
}

// Listen for messages from the content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_BADGE') {
    const { count } = message

    // If count is 0 or undefined, clear the badge
    if (!count) {
      updateBadge({ text: '' })
      return
    }

    // Format count for display (99+ for numbers greater than 99)
    const displayText = count > 99 ? '99+' : count.toString()

    updateBadge({
      text: displayText,
      backgroundColor: '#FF0000', // Red background
      textColor: '#FFFFFF', // White text
    })
  }

  // Handle notification creation
  if (message.type === 'CREATE_NOTIFICATION') {
    const { title, message: notificationMessage, priority = 1 } = message

    // Check if the notifications API is available
    if (chrome.notifications && chrome.notifications.create) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: '/assets/logo.svg',
        title,
        message: notificationMessage,
        priority,
        requireInteraction: priority === 2,
      })
    } else {
      console.error('Notifications API is not available.')
    }
  }
})

// Set initial badge when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('extension installed, updating badge')
  // Set an initial badge text to test if it's working
  updateBadge({ text: '0' })
})
