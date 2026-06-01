import api from './axios'

export const ordersApi = {
  checkout: (data) =>
    api.post('/api/orders/checkout', data),

  getMyOrders: () =>
    api.get('/api/orders'),

  getAllOrders: (params) =>
    api.get('/api/admin/orders', { params }),

  getSellerOrders: (params) =>
    api.get('/api/seller/orders', { params }),

  updateStatus: (orderId, status) =>
    api.patch(`/api/admin/orders/${orderId}/status`, { status }),

  updateSellerStatus: (orderId, status) =>
    api.patch(`/api/seller/orders/${orderId}/status`, { status }),

  adminCreateOrder: (data) =>
    api.post('/api/admin/orders', data),

  cancelOrder: (orderId, reason) =>
    api.patch(`/api/orders/${orderId}/cancel`, null, { params: { reason } }),

  confirmReceived: (orderId) =>
    api.patch(`/api/orders/${orderId}/confirm-received`),

  getOrderById: (orderId) =>
    api.get(`/api/orders/${orderId}`),

  checkoutAll: (data) =>
    api.post('/api/orders/checkout-all', data),
}
