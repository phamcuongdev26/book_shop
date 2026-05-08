import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ArrowRight, ShoppingBag, Truck, CheckCircle, Clock, BookOpen, Wallet } from 'lucide-react'
import { ordersApi } from '../api/orders'
import { PageSpinner } from '../components/ui/Spinner'

const PLACEHOLDER = 'https://placehold.co/60x80?text=Book'

function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}
function formatDate(s) {
  return new Date(s).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const STATUS_STYLE = {
  PENDING:    'bg-yellow-50  text-yellow-700  border-yellow-200',
  CONFIRMED:  'bg-blue-50    text-blue-700    border-blue-200',
  PROCESSING: 'bg-blue-50    text-blue-700    border-blue-200',
  SHIPPING:   'bg-violet-50  text-violet-700  border-violet-200',
  DELIVERED:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED:  'bg-gray-100   text-gray-500    border-gray-200',
  RETURNED:   'bg-red-50     text-red-600     border-red-200',
}
const STATUS_LABEL = {
  PENDING:    'Chờ xác nhận',
  CONFIRMED:  'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING:   'Đang giao hàng',
  DELIVERED:  'Đã giao',
  CANCELLED:  'Đã hủy',
  RETURNED:   'Đã hoàn trả',
}
const STATUS_ICON = {
  PENDING:    Clock,
  CONFIRMED:  CheckCircle,
  PROCESSING: Package,
  SHIPPING:   Truck,
  DELIVERED:  CheckCircle,
  CANCELLED:  Package,
  RETURNED:   Package,
}

const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING']

export default function Orders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('ALL')

  useEffect(() => {
    ordersApi.getMyOrders()
      .then((res) => setOrders(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  // Stats
  const totalBooks   = orders.reduce((s, o) => s + (o.items?.reduce((ss, i) => ss + i.quantity, 0) ?? 0), 0)
  const totalSpent   = orders.filter(o => o.status !== 'CANCELLED' && o.status !== 'RETURNED')
                             .reduce((s, o) => s + Number(o.totalAmount), 0)
  const inProgress   = orders.filter(o => ACTIVE_STATUSES.includes(o.status)).length
  const delivered    = orders.filter(o => o.status === 'DELIVERED').length
  const shipping     = orders.filter(o => o.status === 'SHIPPING').length

  const TABS = [
    { key: 'ALL',       label: 'Tất cả',      count: orders.length },
    { key: 'ACTIVE',    label: 'Đang xử lý',  count: inProgress },
    { key: 'DELIVERED', label: 'Đã giao',      count: delivered },
    { key: 'CANCELLED', label: 'Đã hủy',       count: orders.filter(o => o.status === 'CANCELLED').length },
  ]

  const filtered = orders.filter((o) => {
    if (filter === 'ALL')       return true
    if (filter === 'ACTIVE')    return ACTIVE_STATUSES.includes(o.status)
    if (filter === 'DELIVERED') return o.status === 'DELIVERED'
    if (filter === 'CANCELLED') return o.status === 'CANCELLED'
    return true
  })

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
        <>
          {/* Stats overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { icon: ShoppingBag, label: 'Tổng đơn',       value: orders.length,       color: 'bg-indigo-50  text-indigo-600'  },
              { icon: BookOpen,    label: 'Sách đã mua',     value: `${totalBooks} cuốn`, color: 'bg-violet-50  text-violet-600'  },
              { icon: Truck,       label: 'Đang giao',       value: `${shipping} đơn`,   color: 'bg-amber-50   text-amber-600'   },
              { icon: Wallet,      label: 'Đã chi tiêu',     value: formatPrice(totalSpent), color: 'bg-emerald-50 text-emerald-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="card p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 truncate">{label}</p>
                  <p className="font-bold text-gray-900 text-sm leading-snug">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 mb-5 border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  filter === tab.key
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    filter === tab.key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center py-10 text-gray-400">Không có đơn hàng nào.</p>
          ) : (
            <div className="space-y-4">
              {filtered.map((order) => {
                const StatusIcon = STATUS_ICON[order.status] || Package
                return (
                  <div key={order.id} className="card overflow-hidden">
                    {/* Order header */}
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className={`badge border px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${STATUS_STYLE[order.status]}`}>
                          <StatusIcon className="h-3 w-3" />
                          {STATUS_LABEL[order.status]}
                        </span>
                        <span className="font-mono text-sm font-semibold text-gray-900">{order.orderCode}</span>
                      </div>
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <img
                              src={item.bookImage || PLACEHOLDER}
                              alt={item.bookTitle}
                              className="w-12 h-16 object-cover rounded-lg border border-gray-100 shrink-0"
                              onError={(e) => { e.target.src = PLACEHOLDER }}
                            />
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/books/${item.bookId}`}
                                className="text-sm font-medium text-gray-900 hover:text-indigo-700 line-clamp-1"
                              >
                                {item.bookTitle}
                              </Link>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {item.quantity} cuốn × {formatPrice(item.unitPrice)}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-indigo-600 shrink-0">
                              {formatPrice(item.totalPrice)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gray-100 pt-3 flex flex-wrap items-end justify-between gap-3">
                        <div className="text-xs text-gray-500 space-y-0.5">
                          <p>
                            Giao tới:{' '}
                            <span className="text-gray-800 font-medium">{order.recipientName}</span>
                          </p>
                          <p className="text-gray-400">{order.shippingAddress}</p>
                          <p className="mt-1 text-gray-500">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} cuốn sách
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Tổng đơn</p>
                          <p className="font-bold text-gray-900 text-base">{formatPrice(order.totalAmount)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
