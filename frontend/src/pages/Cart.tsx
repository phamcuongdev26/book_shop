import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { cartApi } from '../api/cart'
import { ordersApi, type CheckoutPayload } from '../api/orders'
import { PageSpinner, Spinner } from '../components/ui/Spinner'
import type { CartResponse, PaymentMethod } from '../types'

const PLACEHOLDER = 'https://placehold.co/80x100?text=Book'

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  COD: 'Thanh toán khi nhận hàng (COD)',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  MOMO: 'Ví MoMo',
  VNPAY: 'VNPay',
}

export default function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState<CartResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [form, setForm] = useState<CheckoutPayload>({
    shippingAddress: '',
    recipientName: '',
    recipientPhone: '',
    paymentMethod: 'COD',
    note: '',
  })

  const fetchCart = () => {
    cartApi.get().then((res) => setCart(res.data.result)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchCart() }, [])

  const updateQty = async (itemId: number, qty: number) => {
    if (qty < 1) return
    setUpdatingId(itemId)
    try {
      const res = await cartApi.updateItem(itemId, qty)
      setCart(res.data.result)
    } catch {
      toast.error('Không thể cập nhật')
    } finally {
      setUpdatingId(null)
    }
  }

  const removeItem = async (itemId: number) => {
    setUpdatingId(itemId)
    try {
      await cartApi.removeItem(itemId)
      fetchCart()
      toast.success('Đã xóa khỏi giỏ')
    } catch {
      toast.error('Không thể xóa')
    } finally {
      setUpdatingId(null)
    }
  }

  const checkout = async (e: React.FormEvent) => {
    e.preventDefault()
    setCheckoutLoading(true)
    try {
      const res = await ordersApi.checkout(form)
      toast.success(`Đặt hàng thành công! Mã: ${res.data.result.orderCode}`)
      navigate('/orders')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Đặt hàng thất bại')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) return <PageSpinner />

  const items = cart?.items ?? []
  const empty = items.length === 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Giỏ hàng</h1>

      {empty ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
          <Link to="/books" className="btn-primary px-6 py-2.5">Khám phá sách <ArrowRight className="h-4 w-4" /></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="card p-4 flex gap-4">
                <img
                  src={item.bookImageUrl || PLACEHOLDER}
                  alt={item.bookTitle}
                  className="w-16 h-20 object-cover rounded-lg border border-gray-100 shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
                />
                <div className="flex-1 min-w-0 space-y-2">
                  <Link to={`/books/${item.bookId}`} className="text-sm font-medium text-gray-900 hover:text-gray-600 line-clamp-2 transition-colors">
                    {item.bookTitle}
                  </Link>
                  <p className="text-sm font-semibold text-gray-900">{formatPrice(item.discountPrice ?? item.bookPrice)}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        disabled={updatingId === item.id || item.quantity <= 1}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors text-sm"
                      >−</button>
                      <span className="px-3 py-1 text-sm border-x border-gray-200 min-w-8 text-center">
                        {updatingId === item.id ? <Spinner size="sm" /> : item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        disabled={updatingId === item.id}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors text-sm"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={updatingId === item.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 shrink-0">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>

          {/* Summary + Checkout */}
          <div className="space-y-4">
            <div className="card p-5 space-y-3">
              <h2 className="font-bold text-gray-900">Tóm tắt đơn hàng</h2>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{items.length} sản phẩm</span>
                <span>{formatPrice(cart!.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                <span>Tổng cộng</span>
                <span>{formatPrice(cart!.totalAmount)}</span>
              </div>
              <button onClick={() => setShowCheckout(!showCheckout)} className="btn-primary w-full py-2.5">
                {showCheckout ? 'Ẩn form đặt hàng' : 'Đặt hàng ngay'} <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Checkout form */}
            {showCheckout && (
              <form onSubmit={checkout} className="card p-5 space-y-4">
                <h2 className="font-bold text-gray-900">Thông tin giao hàng</h2>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Họ tên người nhận</label>
                  <input value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                    className="input text-sm" placeholder="Nguyễn Văn A" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Số điện thoại</label>
                  <input value={form.recipientPhone} onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
                    className="input text-sm" placeholder="0912345678" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Địa chỉ giao hàng</label>
                  <textarea value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                    className="input text-sm resize-none" rows={2} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phương thức thanh toán</label>
                  <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as PaymentMethod })}
                    className="input text-sm">
                    {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((k) => (
                      <option key={k} value={k}>{PAYMENT_LABELS[k]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ghi chú (tùy chọn)</label>
                  <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="input text-sm" placeholder="Yêu cầu đặc biệt..." />
                </div>
                <button type="submit" disabled={checkoutLoading} className="btn-primary w-full py-2.5">
                  {checkoutLoading ? 'Đang đặt hàng...' : 'Xác nhận đặt hàng'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
