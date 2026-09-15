import { create } from 'zustand';
import API from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,
  
  // Basic setter
  setUser: (user) => set({ user }),
  
  // Optimistic updater for fields (e.g. availability toggle)
  updateUserField: (field, value) => {
    set((state) => {
      if (!state.user) return state;
      return { user: { ...state.user, [field]: value } };
    });
  },

  // Fetch the current user from backend and update store
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await API.get('/auth/me');
      set({ user: response.data.user, loading: false });
      return response.data.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      if (error.response?.status === 401) {
        set({ user: null });
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null });
  }
}));
