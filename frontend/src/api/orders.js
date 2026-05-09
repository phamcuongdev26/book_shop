import api from './axios'

export const ordersApi = {
  checkout: (data) =>
    api.post('/api/orders/checkout', data),

  getMyOrders: () =>
    api.get('/api/orders'),

  getAllOrders: (params) =>
    api.get('/api/admin/orders', { params }),

  updateStatus: (orderId, status) =>
    api.patch(`/api/admin/orders/${orderId}/status`, { status }),

  adminCreateOrder: (data) =>
    api.post('/api/admin/orders', data),

  createOrder: (data) =>
    api.post('/api/admin/orders', data),
}
