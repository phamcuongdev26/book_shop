import api from './axios'

export const authApi = {
  login: (usernameOrEmail, password) =>
    api.post('/api/auth/login', { usernameOrEmail, password }),

  register: (data) =>
    api.post('/api/auth/register', data),
}
