import api from './axios.js';

export const gradesApi = {
  getAll:     (params)    => api.get('/grades', { params }),
  create:     (data)      => api.post('/grades', data),
  update:     (id, data)  => api.patch(`/grades/${id}`, data),
  delete:     (id)        => api.delete(`/grades/${id}`),
  getSummary: (studentId) => api.get(`/grades/summary/${studentId}`),
};