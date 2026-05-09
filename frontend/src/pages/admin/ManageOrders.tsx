import { useEffect, useState } from 'react'
import { ordersApi, type AdminCreateOrderPayload } from '../../api/orders'
import { usersApi } from '../../api/users'
import { PageSpinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'
import type { OrderResponse, OrderStatus, PaymentMethod, UserInfo } from '../../types'

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy', RETURNED: 'Đã hoàn trả',
}

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  COD: 'COD', BANK_TRANSFER: 'Chuyển khoản', MOMO: 'MoMo', VNPAY: 'VNPay',
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}
function formatDate(s: string) {
  return new Date(s).toLocaleDateString('vi-VN')
}

const emptyForm = (): AdminCreateOrderPayload => ({
  username: '',
  items: [{ bookId: 0, quantity: 1 }],
  shippingAddress: '',
  recipientName: '',
  recipientPhone: '',
  paymentMethod: 'COD',
  note: '',
})

export default function ManageOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState<UserInfo[]>([])
  const [form, setForm] = useState<AdminCreateOrderPayload>(emptyForm())
  const [submitting, setSubmitting] = useState(false)

  const fetchOrders = () => {
    ordersApi.getAllOrders()
      .then((res) => setOrders(res.data.result))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const openModal = () => {
    usersApi.getAll().then((res) => {
      const data = res.data as { result?: UserInfo[] }
      setUsers(data.result ?? [])
    })
    setForm(emptyForm())
    setShowModal(true)
  }

  const handleSelectUser = (username: string) => {
    const user = users.find(u => u.username === username)
    setForm(f => ({
      ...f,
      username,
      recipientName: user?.fullName ?? '',
      recipientPhone: user?.phoneNumber ?? '',
      shippingAddress: user?.address ?? '',
    }))
  }

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await ordersApi.updateStatus(orderId, status)
      toast.success('Cập nhật trạng thái thành công')
      fetchOrders()
    } catch {
      toast.error('Cập nhật thất bại')
    }
  }

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { bookId: 0, quantity: 1 }] }))
  const removeItem = (i: number) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))
  const setItem = (i: number, key: 'bookId' | 'quantity', val: number) =>
    setForm(f => ({ ...f, items: f.items.map((it, idx) => idx === i ? { ...it, [key]: val } : it) }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.items.some(it => !it.bookId || it.quantity < 1)) {
      toast.error('Vui lòng nhập đầy đủ thông tin sản phẩm')
      return
    }
    setSubmitting(true)
    try {
      await ordersApi.createOrder(form)
      toast.success('Tạo đơn hàng thành công')
      setShowModal(false)
      fetchOrders()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Tạo đơn hàng thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <button onClick={openModal} className="btn btn-primary text-sm px-4 py-2">
          + Tạo đơn hàng
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100">
            <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">Mã đơn</th>
              <th className="px-4 py-3">Ngày đặt</th>
              <th className="px-4 py-3">Người nhận</th>
              <th className="px-4 py-3">Tổng tiền</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Cập nhật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{order.orderCode}</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{order.recipientName}</p>
                  <p className="text-gray-400 text-xs">{order.recipientPhone}</p>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(order.totalAmount)}</td>
                <td className="px-4 py-3 text-gray-600">{STATUS_LABEL[order.status]}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
                      <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Chưa có đơn hàng nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Tạo đơn hàng</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-4 space-y-4">

              {/* Chọn khách hàng */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Khách hàng *</label>
                <select
                  required
                  value={form.username}
                  onChange={e => handleSelectUser(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">-- Chọn khách hàng --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.username}>
                      {u.fullName ? `${u.fullName} (${u.username})` : u.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sản phẩm */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600">Sản phẩm *</label>
                  <button type="button" onClick={addItem} className="text-xs text-blue-600 hover:underline">+ Thêm</button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        type="number"
                        min={1}
                        required
                        value={item.bookId || ''}
                        onChange={e => setItem(i, 'bookId', Number(e.target.value))}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="ID sách"
                      />
                      <input
                        type="number"
                        min={1}
                        required
                        value={item.quantity}
                        onChange={e => setItem(i, 'quantity', Number(e.target.value))}
                        className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        placeholder="SL"
                      />
                      {form.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-lg leading-none">&times;</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Thông tin giao hàng — tự điền từ tài khoản, admin có thể sửa */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tên người nhận *</label>
                <input
                  required
                  value={form.recipientName}
                  onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Tự điền khi chọn khách hàng"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại *</label>
                <input
                  required
                  value={form.recipientPhone}
                  onChange={e => setForm(f => ({ ...f, recipientPhone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Tự điền khi chọn khách hàng"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Địa chỉ giao hàng *</label>
                <input
                  required
                  value={form.shippingAddress}
                  onChange={e => setForm(f => ({ ...f, shippingAddress: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Tự điền khi chọn khách hàng"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phương thức thanh toán *</label>
                <select
                  value={form.paymentMethod}
                  onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value as PaymentMethod }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {(Object.keys(PAYMENT_LABEL) as PaymentMethod[]).map(pm => (
                    <option key={pm} value={pm}>{PAYMENT_LABEL[pm]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi chú</label>
                <textarea
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  placeholder="Ghi chú (tuỳ chọn)"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gray-900 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Đang tạo...' : 'Tạo đơn hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
