import { apiService, type Notification } from './apiService';

export class PollingService {
  private intervalId?: ReturnType<typeof setInterval>;
  private pollingInterval: number;
  private onUpdate: (count: number) => void;
  private onError: (error: Error) => void;
  private onNewNotification?: (notification: Notification) => void;
  private lastNotificationCount: number = 0;

  constructor(
    onUpdate: (count: number) => void,
    onError: (error: Error) => void,
    pollingInterval: number = 30000,
    onNewNotification?: (notification: Notification) => void
  ) {
    this.pollingInterval = pollingInterval;
    this.onUpdate = onUpdate;
    this.onError = onError;
    this.onNewNotification = onNewNotification;

    // Set up real-time subscription
    this.setupRealtimeSubscription();
  }

  private setupRealtimeSubscription(): void {
    apiService.subscribeToNotifications((notification: Notification) => {
      // When a new notification arrives, fetch the latest count
      this.fetchAndUpdate();
      // Call notification callback if provided
      if (this.onNewNotification) {
        this.onNewNotification(notification);
      }
    });
  }

  async fetchAndUpdate(): Promise<void> {
    try {
      const data = await apiService.fetchUnreadNotifications();
      
      // Check for new notifications
      if (data.notifications.length > this.lastNotificationCount) {
        // Get new notifications
        const newNotifications = data.notifications.slice(0, data.notifications.length - this.lastNotificationCount);
        // Call notification callback for each new notification if provided
        if (this.onNewNotification) {
          newNotifications.forEach(this.onNewNotification);
        }
      }

      this.lastNotificationCount = data.notifications.length;
      this.onUpdate(data.unreadCount);
    } catch (error) {
      this.onError(error as Error);
    }
  }

  start(): void {
    // Initial fetch
    this.fetchAndUpdate();
    
    // Set up polling as a fallback
    this.intervalId = setInterval(() => {
      this.fetchAndUpdate();
    }, this.pollingInterval);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  // Force an immediate update
  refresh(): void {
    this.fetchAndUpdate();
  }
}

export const createPollingService = (
  onUpdate: (count: number) => void,
  onError: (error: Error) => void,
  pollingInterval?: number,
  onNewNotification?: (notification: Notification) => void
) => {
  return new PollingService(onUpdate, onError, pollingInterval, onNewNotification);
}; 