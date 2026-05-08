import api from './axios'
import type { ApiResponse, BookSummary, BookDetail, PageResult } from '../types'

export const booksApi = {
  getAll: (params?: { page?: number; size?: number; categoryId?: number; minPrice?: number; maxPrice?: number }) =>
    api.get<ApiResponse<PageResult<BookSummary>>>('/api/books', { params }),

  getById: (id: number) =>
    api.get<ApiResponse<BookDetail>>(`/api/books/${id}`),

  search: (params: { keyword: string; page?: number; size?: number }) =>
    api.get<ApiResponse<PageResult<BookSummary>>>('/api/books/search', { params }),

  getByCategory: (categoryId: number, params?: { page?: number; size?: number }) =>
    api.get<ApiResponse<PageResult<BookSummary>>>(`/api/books/category/${categoryId}`, { params }),

  // Seller
  createBook: (data: FormData) =>
    api.post<ApiResponse<BookDetail>>('/api/seller/books', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateBook: (id: number, data: Partial<BookDetail>) =>
    api.put<ApiResponse<BookDetail>>(`/api/seller/books/${id}`, data),

  deleteBook: (id: number) =>
    api.delete(`/api/seller/books/${id}`),
}
