import api from './axios'
import type { ApiResponse, AuthResponse } from '../types'

export const authApi = {
  login: (username: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/api/auth/login', { username, password }),

  register: (data: { username: string; email: string; password: string; fullName: string }) =>
    api.post<ApiResponse<AuthResponse>>('/api/auth/register', data),

  logout: () =>
    api.post('/api/auth/logout'),
}
