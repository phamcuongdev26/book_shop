import api from './axios'
import type { ApiResponse, CategoryResponse } from '../types'

export const categoriesApi = {
  getAll: () =>
    api.get<ApiResponse<CategoryResponse[]>>('/api/categories'),

  getById: (id: number) =>
    api.get<ApiResponse<CategoryResponse>>(`/api/categories/${id}`),

  // Admin
  create: (data: Partial<CategoryResponse>) =>
    api.post<ApiResponse<CategoryResponse>>('/api/admin/categories', data),

  update: (id: number, data: Partial<CategoryResponse>) =>
    api.put<ApiResponse<CategoryResponse>>(`/api/admin/categories/${id}`, data),

  delete: (id: number) =>
    api.delete(`/api/admin/categories/${id}`),
}
