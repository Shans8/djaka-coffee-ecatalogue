import api from './api.js';
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getUserOrders = (idUser) => api.get(`/orders/user/${idUser}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrderStatus = (id, status_pesanan, keterangan = '') => api.put(`/orders/${id}/status`, { status_pesanan, keterangan });
