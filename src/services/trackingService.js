import api from './api.js';
export const getTracking = (idPesanan) => api.get(`/tracking/${idPesanan}`);
export const createTracking = (data) => api.post('/tracking', data);
export const updateTracking = (id, data) => api.put(`/tracking/${id}`, data);
