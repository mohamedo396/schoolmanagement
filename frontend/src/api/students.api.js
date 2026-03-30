import api from './axios.js';

export const studentsApi = {
  getAll:          (params) => api.get('/students', { params }),
  getById:         (id)     => api.get(`/students/${id}`),
  create:          (data)   => api.post('/students', data),
  update:          (id, data) => api.patch(`/students/${id}`, data),
  delete:          (id)     => api.delete(`/students/${id}`),
};