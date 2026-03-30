// src/api/auth.api.js
import api from './axios.js';

export const authApi = {
  login:   (credentials) => api.post('/auth/login', credentials),
  logout:  ()            => api.post('/auth/logout'),
  refresh: ()            => api.post('/auth/refresh'),
  getMe:   ()            => api.get('/auth/me'),
};