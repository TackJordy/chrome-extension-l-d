type NotificationOptions = {
  title: string;
  message: string;
  icon?: string;
  priority?: 0 | 1 | 2;  // 0: low, 1: normal, 2: high
}

export const notificationService = {
  create: async ({ title, message, priority = 1 }: NotificationOptions) => {
    const notificationId = crypto.randomUUID();
    
    // Send message to background script to create notification
    chrome.runtime.sendMessage({
      type: 'CREATE_NOTIFICATION',
      title,
      message,
      priority,
      notificationId
    });

    return notificationId;
  },

  clear: async (notificationId: string) => {
    await chrome.notifications.clear(notificationId);
  },

  // Optional: Handle notification clicks
  onClick: (callback: (notificationId: string) => void) => {
    chrome.notifications.onClicked.addListener(callback);
  },

  // Optional: Handle notification close
  onClose: (callback: (notificationId: string) => void) => {
    chrome.notifications.onClosed.addListener(callback);
  }
}; 