export type Role = 'USER' | 'SELLER' | 'ADMIN'
export type BookStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED' | 'RETURNED'
export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'MOMO' | 'VNPAY'
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED'

export interface ApiResponse<T> {
  code: number
  message: string
  result: T
}

export interface PageResult<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface AuthResponse {
  token: string
  userId: number
  username: string
  email: string
  fullName: string
  role: Role
}

export interface UserInfo {
  id: number
  username: string
  email: string
  fullName: string
  phoneNumber?: string
  address?: string
  avatarUrl?: string
  role: Role
  active: boolean
  createdAt: string
}

export interface CategoryResponse {
  id: number
  name: string
  description?: string
  imageUrl?: string
  slug: string
  active: boolean
}

export interface BookSummary {
  id: number
  title: string
  author: string
  price: number
  discountPrice?: number
  imageUrl?: string
  avgRating: number
  totalSold: number
  status: BookStatus
  categoryId: number
  categoryName: string
}

export interface BookDetail extends BookSummary {
  description?: string
  publisher?: string
  publishYear?: number
  isbn?: string
  pageCount?: number
  language?: string
  stockQuantity: number
  sellerId: number
  sellerName: string
}

export interface CartItemResponse {
  id: number
  bookId: number
  bookTitle: string
  bookImageUrl?: string
  bookPrice: number
  discountPrice?: number
  quantity: number
  subtotal: number
}

export interface CartResponse {
  id: number
  userId: number
  items: CartItemResponse[]
  totalAmount: number
}

export interface OrderItemResponse {
  id: number
  bookId: number
  bookTitle: string
  bookImageUrl?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface OrderResponse {
  id: number
  orderCode: string
  username: string
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  shippingAddress: string
  recipientName: string
  recipientPhone: string
  totalAmount: number
  note?: string
  createdAt: string
  items: OrderItemResponse[]
}
