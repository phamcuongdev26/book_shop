import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ArrowRight, ShoppingBag, Truck, CheckCircle, Clock, BookOpen, Wallet, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
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
  PROCESSING: 'bg-indigo-50  text-indigo-700  border-indigo-200',
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

const CANCEL_REASONS = [
  'Tôi muốn thay đổi địa chỉ giao hàng',
  'Tôi muốn thay đổi sản phẩm trong đơn',
  'Tôi tìm được nơi mua với giá tốt hơn',
  'Thời gian giao hàng quá lâu',
  'Tôi không còn nhu cầu mua nữa',
  'Đặt hàng nhầm sản phẩm',
  'Lý do khác',
]

function CancelModal({ order, onClose, onCancelled }) {
  const [reason, setReason] = useState(CANCEL_REASONS[0])
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await ordersApi.cancelOrder(order.id, reason)
      toast.success('Đã hủy đơn hàng!')
      onCancelled()
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Hủy đơn thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-bold text-gray-900">Hủy đơn hàng</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600">
            Bạn sắp hủy đơn <span className="font-semibold text-gray-900">{order.orderCode}</span>.
            Vui lòng chọn lý do:
          </p>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            {CANCEL_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Giữ lại
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl text-sm font-bold transition-colors"
            >
              {loading ? 'Đang hủy...' : 'Xác nhận hủy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ACTIVE_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING']

export default function Orders() {
  const [orders, setOrders]               = useState([])
  const [loading, setLoading]             = useState(true)
  const [filter, setFilter]               = useState('ALL')
  const [cancelTarget, setCancelTarget]   = useState(null)
  const [confirmingId, setConfirmingId]   = useState(null)

  const handleConfirmReceived = async (orderId) => {
    setConfirmingId(orderId)
    try {
      await ordersApi.confirmReceived(orderId)
      toast.success('Xác nhận đã nhận hàng thành công!')
      fetchOrders()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setConfirmingId(null)
    }
  }

  const fetchOrders = () => {
    ordersApi.getMyOrders()
      .then((res) => setOrders(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  if (loading) return <PageSpinner />

  const totalBooks = orders.reduce((s, o) => s + (o.items?.reduce((ss, i) => ss + i.quantity, 0) ?? 0), 0)
  const totalSpent = orders.filter(o => o.status !== 'CANCELLED' && o.status !== 'RETURNED')
                           .reduce((s, o) => s + Number(o.totalAmount), 0)
  const inProgress = orders.filter(o => ACTIVE_STATUSES.includes(o.status)).length
  const shipping   = orders.filter(o => o.status === 'SHIPPING').length

  const ALL_TABS = [
    { key: 'ALL',        label: 'Tất cả' },
    { key: 'PENDING',    label: STATUS_LABEL.PENDING },
    { key: 'CONFIRMED',  label: STATUS_LABEL.CONFIRMED },
    { key: 'PROCESSING', label: STATUS_LABEL.PROCESSING },
    { key: 'SHIPPING',   label: STATUS_LABEL.SHIPPING },
    { key: 'DELIVERED',  label: STATUS_LABEL.DELIVERED },
    { key: 'CANCELLED',  label: STATUS_LABEL.CANCELLED },
    { key: 'RETURNED',   label: STATUS_LABEL.RETURNED },
  ]

  const TABS = ALL_TABS

  const filtered = filter === 'ALL'
    ? orders
    : orders.filter(o => o.status === filter)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
          <Link to="/" className="btn-primary px-6 py-2.5">
            Mua sắm ngay <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Stats overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { icon: ShoppingBag, label: 'Tổng đơn',    value: orders.length,           color: 'bg-indigo-50  text-indigo-600'  },
              { icon: BookOpen,    label: 'Sách đã mua',  value: `${totalBooks} cuốn`,    color: 'bg-violet-50  text-violet-600'  },
              { icon: Truck,       label: 'Đang giao',    value: `${shipping} đơn`,       color: 'bg-amber-50   text-amber-600'   },
              { icon: Wallet,      label: 'Đã chi tiêu',  value: formatPrice(totalSpent), color: 'bg-emerald-50 text-emerald-600' },
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
          <div className="flex gap-1 mb-5 border-b border-gray-100 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {TABS.map((tab) => {
              const count = tab.key === 'ALL' ? orders.length : orders.filter(o => o.status === tab.key).length
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                    filter === tab.key
                      ? 'border-indigo-600 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      filter === tab.key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center py-10 text-gray-400">Không có đơn hàng nào.</p>
          ) : (
            <div className="space-y-4">
              {filtered.map((order) => {
                const StatusIcon = STATUS_ICON[order.status] || Package
                const canCancel = order.status === 'PENDING'
                const canConfirmReceived = order.status === 'SHIPPING'
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
                              onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER }}
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
                              {item.sellerName && (
                                <p className="text-xs text-indigo-500 mt-0.5">Shop: {item.sellerName}</p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <p className="text-sm font-semibold text-indigo-600">
                                {formatPrice(item.totalPrice)}
                              </p>
                              {canCancel && (
                                <button
                                  onClick={() => setCancelTarget(order)}
                                  className="text-xs font-medium text-rose-500 hover:text-rose-700 border border-rose-200 hover:border-rose-400 hover:bg-rose-50 px-2 py-0.5 rounded-lg transition-colors"
                                >
                                  Hủy đơn
                                </button>
                              )}
                              {canConfirmReceived && (
                                <button
                                  onClick={() => handleConfirmReceived(order.id)}
                                  disabled={confirmingId === order.id}
                                  className="text-xs font-medium text-emerald-600 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 px-2 py-0.5 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {confirmingId === order.id ? 'Đang xử lý...' : 'Đã nhận hàng'}
                                </button>
                              )}
                            </div>
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
                          {order.note && (
                            <p className="text-gray-400 italic">Ghi chú: {order.note}</p>
                          )}
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

      {cancelTarget && (
        <CancelModal
          order={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onCancelled={fetchOrders}
        />
      )}
    </div>
  )
}
