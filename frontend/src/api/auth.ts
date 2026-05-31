import api from './axios'
import type { ApiResponse, AuthResponse } from '../types'

export const authApi = {
  login: (usernameOrEmail: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/api/auth/login', { usernameOrEmail, password }),

  register: (data: { username: string; email: string; password: string; fullName: string }) =>
    api.post<ApiResponse<AuthResponse>>('/api/auth/register', data),

  logout: () =>
    api.post('/api/auth/logout'),
}
