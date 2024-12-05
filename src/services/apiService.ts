import { supabaseService, type Notification } from './supabaseService';

export interface NotificationResponse {
  unreadCount: number;
  notifications: Notification[];
}

class ApiService {
  private pollingInterval: number;

  constructor(pollingInterval: number = 30000) {
    this.pollingInterval = pollingInterval;
  }

  async fetchUnreadNotifications(): Promise<NotificationResponse> {
    try {
      const [unreadCount, notifications] = await Promise.all([
        supabaseService.getUnreadCount(),
        supabaseService.getUnreadNotifications()
      ]);

      return {
        unreadCount,
        notifications
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async createNotification(notification: Pick<Notification, 'title' | 'message' | 'priority'>): Promise<Notification> {
    return supabaseService.createNotification(notification);
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await supabaseService.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Subscribe to real-time notifications
  subscribeToNotifications(callback: (notification: Notification) => void): void {
    supabaseService.subscribeToNotifications(callback);
  }

  // Get Supabase client for testing purposes
  getClient() {
    return supabaseService.getClient();
  }
}

export const apiService = new ApiService();
export type { Notification }; 