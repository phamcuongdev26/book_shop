import api from './axios'

export const cartApi = {
  get: () =>
    api.get('/api/cart'),

  add: (bookId, quantity) =>
    api.post('/api/cart', { bookId, quantity }),

  // quantity là @RequestParam nên truyền qua query string
  updateItem: (cartItemId, quantity) =>
    api.put(`/api/cart/${cartItemId}?quantity=${quantity}`),

  removeItem: (cartItemId) =>
    api.delete(`/api/cart/${cartItemId}`),

  clear: () =>
    api.delete('/api/cart'),
}
