<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBadge } from '../composables/useBadge';
import { useNotifications } from '../composables/useNotifications';

const { updateBadgeCount } = useBadge();
const { showNotification, activeNotifications } = useNotifications();

// Example: Store for pending notifications
const pendingNotifications = ref<Array<{
  id: string;
  title: string;
  message: string;
  priority: 0 | 1 | 2;
}>>([]);

// Watch pending notifications and update badge
watch(() => pendingNotifications.value.length, (newCount) => {
  updateBadgeCount(newCount);
});

// Example: Handle new notification
const handleNewNotification = async (
  title: string,
  message: string,
  priority: 0 | 1 | 2 = 1
) => {
  // Show system notification
  const notificationId = await showNotification(title, message, priority);
  
  // Add to pending notifications
  pendingNotifications.value.push({
    id: notificationId,
    title,
    message,
    priority
  });
};

const addTestNotification = () => {
  const timestamp = new Date().toLocaleTimeString();
  handleNewNotification(
    'Test Notification',
    `This is a test notification created at ${timestamp}`,
    1
  );
};
</script>

<template>
  <div class="text-center m-4 flex flex-col gap-y-4">
    <h1 class="text-2xl font-bold">Notification Handler</h1>
    
    <!-- Add Notification Button -->
    <button 
      class="btn btn-primary"
      @click="addTestNotification"
    >
      Add Test Notification
    </button>

    <!-- Notifications Counter -->
    <div v-if="pendingNotifications.length" class="badge badge-primary">
      {{ pendingNotifications.length }} pending notifications
    </div>
    <div v-else class="text-gray-500">
      No pending notifications
    </div>

    <!-- List of Current Notifications -->
    <div v-if="pendingNotifications.length" class="flex flex-col gap-y-2">
      <div 
        v-for="notification in pendingNotifications" 
        :key="notification.id"
        class="card bg-base-200 shadow-sm"
      >
        <div class="card-body p-4">
          <h3 class="card-title text-lg">{{ notification.title }}</h3>
          <p class="text-sm">{{ notification.message }}</p>
          <div class="card-actions justify-end">
            <span class="badge badge-sm" :class="{
              'badge-error': notification.priority === 2,
              'badge-warning': notification.priority === 1,
              'badge-info': notification.priority === 0
            }">
              Priority {{ notification.priority }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 