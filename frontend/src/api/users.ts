import api from './axios'

export interface UserPayload {
  username: string
  email: string
  password?: string
  fullName?: string
  phoneNumber?: string
  address?: string
  role?: string
  isActive?: boolean
}

export const usersApi = {
  getAll: () => api.get('/api/admin/users'),
  getById: (id: number) => api.get(`/api/admin/users/${id}`),
  create: (data: UserPayload) => api.post('/api/admin/users', data),
  update: (id: number, data: UserPayload) => api.put(`/api/admin/users/${id}`, data),
  delete: (id: number) => api.delete(`/api/admin/users/${id}`),
}
