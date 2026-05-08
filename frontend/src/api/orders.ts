import api from './axios'
import type { ApiResponse, OrderResponse, PaymentMethod } from '../types'

export interface CheckoutPayload {
  shippingAddress: string
  recipientName: string
  recipientPhone: string
  paymentMethod: PaymentMethod
  note?: string
  selectedItemIds?: number[]
}

export const ordersApi = {
  checkout: (data: CheckoutPayload) =>
    api.post<ApiResponse<OrderResponse>>('/api/orders/checkout', data),

  getMyOrders: () =>
    api.get<ApiResponse<OrderResponse[]>>('/api/orders'),

  // Admin
  getAllOrders: (params?: { page?: number; size?: number }) =>
    api.get<ApiResponse<{ content: OrderResponse[]; totalPages: number }>>('/api/admin/orders', { params }),

  updateStatus: (orderId: number, status: string) =>
    api.put(`/api/admin/orders/${orderId}/status`, { status }),
}
