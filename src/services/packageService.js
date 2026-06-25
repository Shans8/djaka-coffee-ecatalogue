import api from './api.js';
export const getPackages = () => api.get('/packages');
export const getPackage = (id) => api.get(`/packages/${id}`);
export const recommendPackages = (params) => api.get('/packages/recommendation', { params });
export const comparePackages = (packageIds) => api.post('/packages/compare', { packageIds });
export const createPackage = (data) => api.post('/packages', data);
export const updatePackage = (id, data) => api.put(`/packages/${id}`, data);
export const deletePackage = (id) => api.delete(`/packages/${id}`);
