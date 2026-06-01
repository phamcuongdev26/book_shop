import api from './axios'

export const reviewsApi = {
  getBookReviews: (bookId) =>
    api.get(`/api/reviews/book/${bookId}`),

  getMyStatus: (bookId) =>
    api.get(`/api/reviews/book/${bookId}/my-status`),

  createReview: (bookId, data) =>
    api.post(`/api/reviews/book/${bookId}`, data),
}
