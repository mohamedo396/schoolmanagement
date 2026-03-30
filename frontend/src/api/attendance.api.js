import api from './axios.js';

export const attendanceApi = {
  mark:       (data)      => api.post('/attendance', data),
  getAll:     (params)    => api.get('/attendance', { params }),
  getSummary: (studentId) => api.get(`/attendance/summary/${studentId}`),
};