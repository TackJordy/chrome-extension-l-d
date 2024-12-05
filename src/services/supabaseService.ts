import { createClient } from '@supabase/supabase-js';

// Types for notifications
export interface Notification {
  id: string;
  created_at: string;
  title: string;
  message: string;
  priority: number;
  read: boolean;
  user_id?: string;
}

class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL as string,
      import.meta.env.VITE_SUPABASE_ANON_KEY as string
    );
  }

  // Get unread notifications count
  async getUnreadCount(): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Get unread notifications
  async getUnreadNotifications(): Promise<Notification[]> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .select('*')
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      throw error;
    }
  }

  // Create a notification
  async createNotification(notification: Pick<Notification, 'title' | 'message' | 'priority'>): Promise<Notification> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .insert({
          ...notification,
          read: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Subscribe to new notifications
  subscribeToNotifications(callback: (notification: Notification) => void): void {
    this.supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();
  }

  // Get client for direct access if needed
  getClient() {
    return this.supabase;
  }
}

// Export a singleton instance
export const supabaseService = new SupabaseService(); 