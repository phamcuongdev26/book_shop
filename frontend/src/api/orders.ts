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

export interface AdminCreateOrderItemPayload {
  bookId: number
  quantity: number
}

export interface AdminCreateOrderPayload {
  username: string
  items: AdminCreateOrderItemPayload[]
  shippingAddress: string
  recipientName: string
  recipientPhone: string
  paymentMethod: PaymentMethod
  note?: string
}

export const ordersApi = {
  checkout: (data: CheckoutPayload) =>
    api.post<ApiResponse<OrderResponse>>('/api/orders/checkout', data),

  getMyOrders: () =>
    api.get<ApiResponse<OrderResponse[]>>('/api/orders'),

  // Admin
  getAllOrders: () =>
    api.get<ApiResponse<OrderResponse[]>>('/api/admin/orders'),

  updateStatus: (orderId: number, status: string) =>
    api.patch<ApiResponse<OrderResponse>>(`/api/admin/orders/${orderId}/status`, { status }),

  createOrder: (data: AdminCreateOrderPayload) =>
    api.post<ApiResponse<OrderResponse>>('/api/admin/orders', data),
}
