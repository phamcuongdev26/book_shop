import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ArrowRight } from 'lucide-react'
import { ordersApi } from '../api/orders'
import { PageSpinner } from '../components/ui/Spinner'
import type { OrderResponse, OrderStatus } from '../types'

const PLACEHOLDER = 'https://placehold.co/60x80?text=Book'

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  CONFIRMED: 'bg-blue-50 text-blue-700',
  PROCESSING: 'bg-blue-50 text-blue-700',
  SHIPPING: 'bg-purple-50 text-purple-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
  RETURNED: 'bg-red-50 text-red-600',
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
  RETURNED: 'Đã hoàn trả',
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersApi.getMyOrders()
      .then((res) => setOrders(res.data.result))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
          <Link to="/books" className="btn-primary px-6 py-2.5">
            Mua sắm ngay <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-5 space-y-4">
              {/* Order header */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                  <p className="font-mono text-sm font-semibold text-gray-900 mt-0.5">{order.orderCode}</p>
                </div>
                <span className={`badge px-3 py-1 text-xs font-semibold ${STATUS_STYLE[order.status]}`}>
                  {STATUS_LABEL[order.status]}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.bookImageUrl || PLACEHOLDER}
                      alt={item.bookTitle}
                      className="w-12 h-16 object-cover rounded-lg border border-gray-100 shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/books/${item.bookId}`} className="text-sm font-medium text-gray-900 hover:text-gray-600 line-clamp-1 transition-colors">
                        {item.bookTitle}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">x{item.quantity} × {formatPrice(item.unitPrice)}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 shrink-0">{formatPrice(item.totalPrice)}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 pt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-gray-500 space-y-0.5">
                  <p>Giao tới: <span className="text-gray-700">{order.recipientName}</span> — {order.shippingAddress}</p>
                  <p>TT: <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-gray-700'}`}>{order.paymentStatus}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Tổng đơn</p>
                  <p className="font-bold text-gray-900 text-base">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
