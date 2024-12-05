import { apiService, type Notification } from './apiService';

export class PollingService {
  private intervalId?: ReturnType<typeof setInterval>;
  private pollingInterval: number;
  private onUpdate: (count: number) => void;
  private onError: (error: Error) => void;

  constructor(
    onUpdate: (count: number) => void,
    onError: (error: Error) => void,
    pollingInterval: number = 30000
  ) {
    this.pollingInterval = pollingInterval;
    this.onUpdate = onUpdate;
    this.onError = onError;

    // Set up real-time subscription
    this.setupRealtimeSubscription();
  }

  private setupRealtimeSubscription(): void {
    apiService.subscribeToNotifications((notification: Notification) => {
      // When a new notification arrives, fetch the latest count
      this.fetchAndUpdate();
    });
  }

  async fetchAndUpdate(): Promise<void> {
    try {
      const data = await apiService.fetchUnreadNotifications();
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
  pollingInterval?: number
) => {
  return new PollingService(onUpdate, onError, pollingInterval);
}; 