import { ref } from 'vue';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const activeNotifications = ref<string[]>([]);

  const showNotification = async (
    title: string,
    message: string,
    priority?: 0 | 1 | 2
  ) => {
    const id = await notificationService.create({
      title,
      message,
      priority
    });
    
    activeNotifications.value.push(id);
    return id;
  };

  const clearNotification = async (id: string) => {
    await notificationService.clear(id);
    activeNotifications.value = activeNotifications.value.filter(
      notifId => notifId !== id
    );
  };

  const clearAllNotifications = () => {
    activeNotifications.value.forEach(id => {
      notificationService.clear(id);
    });
    activeNotifications.value = [];
  };

  return {
    activeNotifications,
    showNotification,
    clearNotification,
    clearAllNotifications
  };
}; 