import api from './axios'
import type { ApiResponse, CartResponse } from '../types'

export const cartApi = {
  get: () =>
    api.get<ApiResponse<CartResponse>>('/api/cart'),

  add: (bookId: number, quantity: number) =>
    api.post<ApiResponse<CartResponse>>('/api/cart', { bookId, quantity }),

  updateItem: (cartItemId: number, quantity: number) =>
    api.put<ApiResponse<CartResponse>>(`/api/cart/${cartItemId}`, { quantity }),

  removeItem: (cartItemId: number) =>
    api.delete<ApiResponse<CartResponse>>(`/api/cart/${cartItemId}`),

  clear: () =>
    api.delete('/api/cart'),
}
