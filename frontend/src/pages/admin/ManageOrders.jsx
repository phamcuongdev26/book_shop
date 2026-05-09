import { useEffect, useState } from 'react'
import { Plus, X, Search, Trash2, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { ordersApi } from '../../api/orders'
import { usersApi } from '../../api/users'
import { booksApi } from '../../api/books'
import { PageSpinner } from '../../components/ui/Spinner'

function fmt(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}
function fmtDate(s) {
  return new Date(s).toLocaleDateString('vi-VN')
}

const STATUS_LABEL = {
  PENDING:    'Chờ xác nhận',
  CONFIRMED:  'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING:   'Đang giao',
  DELIVERED:  'Đã giao',
  CANCELLED:  'Đã hủy',
  RETURNED:   'Đã hoàn trả',
}

const STATUS_COLOR = {
  PENDING:    'bg-yellow-100 text-yellow-700',
  CONFIRMED:  'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPING:   'bg-cyan-100 text-cyan-700',
  DELIVERED:  'bg-green-100 text-green-700',
  CANCELLED:  'bg-red-100 text-red-600',
  RETURNED:   'bg-gray-100 text-gray-600',
}

const PAYMENT_LABELS = {
  COD:           'Thanh toán khi nhận hàng (COD)',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  MOMO:          'Ví MoMo',
  VNPAY:         'VNPay',
}

const EMPTY_FORM = {
  username: '', recipientName: '', recipientPhone: '',
  shippingAddress: '', paymentMethod: 'COD', note: '',
}

// ── Modal tạo đơn hàng mới ──────────────────────────────────────
function CreateOrderModal({ onClose, onCreated, users }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [items, setItems] = useState([])           // [{book, quantity}]
  const [bookSearch, setBookSearch] = useState('')
  const [bookResults, setBookResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSelectUser = (username) => {
    const user = users.find(u => u.username === username)
    setForm(f => ({
      ...f,
      username,
      recipientName: user?.fullName || '',
      recipientPhone: user?.phoneNumber || '',
      shippingAddress: user?.address || '',
    }))
  }

  const searchBooks = async (q) => {
    if (!q.trim()) { setBookResults([]); return }
    setSearching(true)
    try {
      const res = await booksApi.search({ keyword: q, size: 8 })
      setBookResults(res.data.result?.content || [])
    } catch { setBookResults([]) }
    finally { setSearching(false) }
  }

  const addBook = (book) => {
    const existing = items.find(i => i.book.id === book.id)
    if (existing) {
      setItems(items.map(i => i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      setItems([...items, { book, quantity: 1 }])
    }
    setBookSearch('')
    setBookResults([])
  }

  const changeQty = (bookId, qty) => {
    const n = Number(qty)
    if (n < 1) return
    setItems(items.map(i => i.book.id === bookId ? { ...i, quantity: n } : i))
  }

  const removeItem = (bookId) => setItems(items.filter(i => i.book.id !== bookId))

  const total = items.reduce((sum, i) => {
    const price = i.book.discountPrice ?? i.book.price
    return sum + price * i.quantity
  }, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim()) { toast.error('Vui lòng nhập username khách hàng'); return }
    if (items.length === 0) { toast.error('Vui lòng thêm ít nhất 1 sản phẩm'); return }
    if (!form.recipientName.trim()) { toast.error('Vui lòng nhập tên người nhận'); return }
    if (!form.recipientPhone.trim()) { toast.error('Vui lòng nhập số điện thoại'); return }
    if (!form.shippingAddress.trim()) { toast.error('Vui lòng nhập địa chỉ giao hàng'); return }

    setSubmitting(true)
    try {
      await ordersApi.createOrder({
        username: form.username,
        items: items.map(i => ({ bookId: i.book.id, quantity: i.quantity })),
        shippingAddress: form.shippingAddress,
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        paymentMethod: form.paymentMethod,
        note: form.note,
      })
      toast.success('Tạo đơn hàng thành công!')
      onCreated()
      onClose()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-y-auto max-h-[95dvh]">

        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900 text-lg">Tạo đơn hàng mới</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">

          {/* Chọn khách hàng */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Khách hàng <span className="text-rose-500">*</span>
            </label>
            <select value={form.username} onChange={e => handleSelectUser(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="">-- Chọn khách hàng --</option>
              {users.map(u => (
                <option key={u.id} value={u.username}>
                  {u.fullName ? `${u.fullName} (${u.username})` : u.username}
                </option>
              ))}
            </select>
          </div>

          {/* Tìm và thêm sách */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Sản phẩm <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={bookSearch}
                onChange={e => { setBookSearch(e.target.value); searchBooks(e.target.value) }}
                placeholder="Tìm tên sách, tác giả..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {(searching || bookResults.length > 0) && (
                <div className="mt-1 border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {searching && <p className="px-3 py-2 text-xs text-gray-400">Đang tìm...</p>}
                  {bookResults.map(b => {
                    const price = b.discountPrice ?? b.price
                    return (
                      <button key={b.id} type="button" onClick={() => addBook(b)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-indigo-50 text-left transition-colors">
                        <img src={b.imageUrl || 'https://placehold.co/40x54?text=?'} alt={b.title}
                          className="w-8 h-10 object-cover rounded border border-gray-100 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{b.title}</p>
                          <p className="text-xs text-gray-400">{b.author}</p>
                        </div>
                        <span className="text-xs font-semibold text-indigo-600 shrink-0">{fmt(price)}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Danh sách sản phẩm đã thêm */}
            {items.length > 0 && (
              <div className="mt-2 border border-gray-100 rounded-xl overflow-hidden">
                {items.map(({ book, quantity }) => {
                  const price = book.discountPrice ?? book.price
                  return (
                    <div key={book.id} className="flex items-center gap-3 px-3 py-2 border-b border-gray-50 last:border-0">
                      <img src={book.imageUrl || 'https://placehold.co/40x54?text=?'} alt={book.title}
                        className="w-8 h-10 object-cover rounded border border-gray-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{book.title}</p>
                        <p className="text-xs text-indigo-600 font-semibold">{fmt(price)}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button type="button" onClick={() => changeQty(book.id, quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 text-sm">−</button>
                        <input type="number" min={1} value={quantity} onChange={e => changeQty(book.id, e.target.value)}
                          className="w-10 text-center text-sm border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                        <button type="button" onClick={() => changeQty(book.id, quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 text-sm">+</button>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-24 text-right shrink-0">
                        {fmt(price * quantity)}
                      </span>
                      <button type="button" onClick={() => removeItem(book.id)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
                <div className="px-3 py-2 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Tổng cộng</span>
                  <span className="font-bold text-indigo-600">{fmt(total)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Thông tin giao hàng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Tên người nhận <span className="text-rose-500">*</span>
              </label>
              <input value={form.recipientName} onChange={set('recipientName')} placeholder="Nguyễn Văn A"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Số điện thoại <span className="text-rose-500">*</span>
              </label>
              <input value={form.recipientPhone} onChange={set('recipientPhone')} placeholder="0912345678"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Địa chỉ giao hàng <span className="text-rose-500">*</span>
            </label>
            <textarea value={form.shippingAddress} onChange={set('shippingAddress')} rows={2}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phương thức thanh toán</label>
              <select value={form.paymentMethod} onChange={set('paymentMethod')}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {Object.entries(PAYMENT_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi chú</label>
              <input value={form.note} onChange={set('note')} placeholder="Tuỳ chọn..."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-sm font-bold transition-colors">
              {submitting ? 'Đang tạo...' : 'Tạo đơn hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Trang chính ─────────────────────────────────────────────────
export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [users, setUsers] = useState([])

  const fetchOrders = () => {
    setLoading(true)
    ordersApi.getAllOrders()
      .then((res) => setOrders(res.data.result || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
    usersApi.getAll().then(res => setUsers(res.data.result || []))
  }, [])

  const updateStatus = async (orderId, status) => {
    try {
      await ordersApi.updateStatus(orderId, status)
      toast.success('Cập nhật trạng thái thành công!')
      fetchOrders()
    } catch {
      toast.error('Cập nhật thất bại')
    }
  }

  const displayed = filterStatus ? orders.filter(o => o.status === filterStatus) : orders

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} đơn hàng</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Tạo đơn hàng
        </button>
      </div>

      {/* Filter trạng thái */}
      <div className="flex gap-2 flex-wrap mb-4">
        <button onClick={() => setFilterStatus('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${!filterStatus ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
          Tất cả ({orders.length})
        </button>
        {Object.entries(STATUS_LABEL).map(([key, label]) => {
          const count = orders.filter(o => o.status === key).length
          return (
            <button key={key} onClick={() => setFilterStatus(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filterStatus === key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
              {label} ({count})
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100">
            <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">Mã đơn</th>
              <th className="px-4 py-3">Ngày đặt</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Người nhận</th>
              <th className="px-4 py-3">Tổng tiền</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Cập nhật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-gray-400">
                  <Package className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : displayed.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{order.orderCode}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{fmtDate(order.createdAt)}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{order.username}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{order.recipientName}</p>
                  <p className="text-gray-400 text-xs">{order.recipientPhone}</p>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">{fmt(order.totalAmount)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    {Object.entries(STATUS_LABEL).map(([s, label]) => (
                      <option key={s} value={s}>{label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreateOrderModal onClose={() => setShowCreate(false)} onCreated={fetchOrders} users={users} />
      )}
    </div>
  )
}
