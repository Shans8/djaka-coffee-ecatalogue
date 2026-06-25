import api from './api.js';
export const getPromos = () => api.get('/promos');
export const createPromo = (data) => api.post('/promos', data);
export const updatePromo = (id, data) => api.put(`/promos/${id}`, data);
export const deletePromo = (id) => api.delete(`/promos/${id}`);
