import api from './axios.js';

export const classesApi = {
  getAll:  (params)    => api.get('/classes', { params }),
  getById: (id)        => api.get(`/classes/${id}`),
  create:  (data)      => api.post('/classes', data),
  update:  (id, data)  => api.patch(`/classes/${id}`, data),
  delete:  (id)        => api.delete(`/classes/${id}`),
};