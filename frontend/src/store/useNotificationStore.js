import { create } from 'zustand';
import API from '../services/api';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  setNotifications: (notifications) => {
    set({
      notifications,
      unreadCount: notifications.filter(n => !n.read).length
    });
  },

  addNotification: (notification) => {
    set((state) => {
      const newNotifications = [notification, ...state.notifications];
      return {
        notifications: newNotifications,
        unreadCount: state.unreadCount + 1
      };
    });
  },

  markAsRead: async (id) => {
    // Optimistic update
    set((state) => {
      const updated = state.notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    });
    
    // Background API call
    try {
      await API.patch(`/notifications/${id}/read`);
    } catch (error) {
      console.error("Failed to mark as read in backend:", error);
      // Revert optimistic update on failure
      get().fetchNotifications();
    }
  },

  markAllAsRead: async () => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }));

    // Background API call
    try {
      await API.patch('/notifications/read-all');
    } catch (error) {
      console.error("Failed to mark all as read in backend:", error);
      get().fetchNotifications();
    }
  },

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await API.get('/notifications');
      get().setNotifications(res.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      set({ loading: false });
    }
  }
}));
