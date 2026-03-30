// src/store/auth.store.js
import { create } from 'zustand';
import { setAccessToken, clearAccessToken } from '../api/axios.js';
import { authApi } from '../api/auth.api.js';

const useAuthStore = create((set) => ({
  user:            null,
  isAuthenticated: false,
  isLoading:       true,

  initialize: async () => {
    // Only runs once on app start.
    // Tries to get a new access token using the refresh token cookie.
    // If it fails (no cookie / expired), just go to login — no retry.
    try {
      const refreshRes = await authApi.refresh();
      setAccessToken(refreshRes.data.accessToken);

      const meRes = await authApi.getMe();
      set({
        user:            meRes.data.user,
        isAuthenticated: true,
        isLoading:       false,
      });
    } catch {
      clearAccessToken();
      set({
        user:            null,
        isAuthenticated: false,
        isLoading:       false,  // ← stops the loading screen
      });
    }
  },

  login: async (credentials) => {
    const { data } = await authApi.login(credentials);
    setAccessToken(data.accessToken);
    set({ user: data.user, isAuthenticated: true });
    return data.user;
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      clearAccessToken();
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;