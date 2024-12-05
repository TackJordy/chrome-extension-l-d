interface BadgeConfig {
  text: string
  backgroundColor?: string
  textColor?: string
}

// Helper function to update the badge
const updateBadge = ({
  text,
  backgroundColor = '#FF0000',
  textColor = '#FFFFFF',
}: BadgeConfig) => {
  // Set badge text
  chrome.action.setBadgeText({ text })

  // Set badge background color
  chrome.action.setBadgeBackgroundColor({ color: backgroundColor })

  // Set badge text color (if supported by the browser)
  if (chrome.action.setBadgeTextColor) {
    chrome.action.setBadgeTextColor({ color: textColor })
  }
}

// Listen for messages from the content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_BADGE') {
    const { count } = message

    // If count is 0, clear the badge
    if (count === 0) {
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
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '/assets/logo.svg',
      title,
      message: notificationMessage,
      priority,
      requireInteraction: priority === 2
    })
  }
})

// Clear badge when extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
  updateBadge({ text: '' })
})
