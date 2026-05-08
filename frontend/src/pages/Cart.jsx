import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight, CheckSquare, Square, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { cartApi } from '../api/cart'
import { ordersApi } from '../api/orders'
import { PageSpinner, Spinner } from '../components/ui/Spinner'

const PLACEHOLDER = 'https://placehold.co/80x100/e8e8e8/555?text=Sach'
const PAYMENT_LABELS = {
  COD:           'Thanh toán khi nhận hàng (COD)',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  MOMO:          'Ví MoMo',
  VNPAY:         'VNPay',
}

function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

export default function Cart() {
  const navigate = useNavigate()
  const [cart, setCart]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [updatingId, setUpdatingId]   = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  // Checkbox selection — Set<cartItemId>
  const [selectedIds, setSelectedIds] = useState(new Set())

  const [form, setForm] = useState({
    shippingAddress: '',
    recipientName: '',
    recipientPhone: '',
    paymentMethod: 'COD',
    note: '',
  })

  const fetchCart = () => {
    cartApi.get()
      .then((res) => {
        const data = res.data.data
        setCart(data)
        // Mặc định chọn tất cả items
        setSelectedIds(new Set((data?.items ?? []).map((i) => i.cartItemId)))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCart() }, [])

  const updateQty = async (cartItemId, qty) => {
    if (qty < 1) return
    setUpdatingId(cartItemId)
    try {
      const res = await cartApi.updateItem(cartItemId, qty)
      setCart(res.data.data)
    } catch {
      toast.error('Không thể cập nhật số lượng')
    } finally {
      setUpdatingId(null)
    }
  }

  const removeItem = async (cartItemId) => {
    setUpdatingId(cartItemId)
    try {
      await cartApi.removeItem(cartItemId)
      setSelectedIds((prev) => { const s = new Set(prev); s.delete(cartItemId); return s })
      fetchCart()
      toast.success('Đã xóa khỏi giỏ hàng')
    } catch {
      toast.error('Không thể xóa')
    } finally {
      setUpdatingId(null)
    }
  }

  const toggleItem = (cartItemId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(cartItemId)) next.delete(cartItemId)
      else next.add(cartItemId)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === items.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(items.map((i) => i.cartItemId)))
  }

  const checkout = async (e) => {
    e.preventDefault()
    if (selectedIds.size === 0) { toast.error('Vui lòng chọn ít nhất 1 sản phẩm'); return }
    setCheckoutLoading(true)
    try {
      const payload = {
        ...form,
        // Nếu chọn tất cả thì không gửi selectedItemIds (checkout toàn bộ)
        selectedItemIds: selectedIds.size < items.length ? [...selectedIds] : undefined,
      }
      const res = await ordersApi.checkout(payload)
      toast.success(`Đặt hàng thành công! Mã: ${res.data.data.orderCode}`)
      navigate('/orders')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Đặt hàng thất bại')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) return <PageSpinner />

  const items = cart?.items ?? []
  const selectedItems = items.filter((i) => selectedIds.has(i.cartItemId))
  const selectedTotal = selectedItems.reduce((s, i) => s + Number(i.totalPrice), 0)
  const allSelected   = items.length > 0 && selectedIds.size === items.length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Giỏ hàng</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
          <Link to="/books" className="btn-primary px-6 py-2.5">
            Khám phá sách <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-2 space-y-3">
            {/* Chọn tất cả */}
            <div className="card px-4 py-3 flex items-center gap-3">
              <button onClick={toggleAll} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-700 transition-colors">
                {allSelected
                  ? <CheckSquare className="h-5 w-5 text-indigo-600" />
                  : <Square className="h-5 w-5 text-gray-400" />}
                Chọn tất cả ({items.length} sản phẩm)
              </button>
              {selectedIds.size > 0 && selectedIds.size < items.length && (
                <span className="ml-auto text-xs text-gray-400">Đã chọn {selectedIds.size}/{items.length}</span>
              )}
            </div>

            {items.map((item) => {
              const isSelected = selectedIds.has(item.cartItemId)
              const originalPrice = item.originalPrice  // may be undefined
              const hasDiscount = originalPrice && Number(originalPrice) > Number(item.unitPrice)

              return (
                <div
                  key={item.cartItemId}
                  className={`card p-4 flex gap-3 transition-all ${isSelected ? 'ring-2 ring-indigo-200' : 'opacity-60'}`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleItem(item.cartItemId)}
                    className="shrink-0 mt-1 text-indigo-600"
                  >
                    {isSelected
                      ? <CheckSquare className="h-5 w-5" />
                      : <Square className="h-5 w-5 text-gray-400" />}
                  </button>

                  {/* Ảnh */}
                  <img
                    src={item.bookImage || PLACEHOLDER}
                    alt={item.bookTitle}
                    className="w-16 h-20 object-cover rounded-lg border border-gray-100 shrink-0 bg-gray-50"
                    onError={(e) => { e.target.src = PLACEHOLDER }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <Link
                      to={`/books/${item.bookId}`}
                      className="text-sm font-semibold text-gray-900 hover:text-indigo-700 line-clamp-2 leading-snug"
                    >
                      {item.bookTitle}
                    </Link>

                    {/* Giá */}
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-indigo-600">
                        {formatPrice(item.unitPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Số lượng + Xóa */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.cartItemId, item.quantity - 1)}
                          disabled={updatingId === item.cartItemId || item.quantity <= 1}
                          className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-sm font-bold"
                        >−</button>
                        <span className="px-3 py-1.5 text-sm font-medium border-x border-gray-200 min-w-[36px] text-center">
                          {updatingId === item.cartItemId ? <Spinner size="sm" /> : item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.cartItemId, item.quantity + 1)}
                          disabled={updatingId === item.cartItemId}
                          className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 text-sm font-bold"
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        disabled={updatingId === item.cartItemId}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Thành tiền */}
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Thành tiền</p>
                    <p className="text-sm font-bold text-gray-900">{formatPrice(item.totalPrice)}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tóm tắt + Đặt hàng */}
          <div className="space-y-4">
            <div className="card p-5 space-y-3">
              <h2 className="font-bold text-gray-900">Tóm tắt đơn hàng</h2>

              {/* Selected items summary */}
              {selectedItems.map((i) => (
                <div key={i.cartItemId} className="flex items-start justify-between gap-2 text-xs text-gray-500">
                  <span className="line-clamp-1 flex-1">{i.bookTitle}</span>
                  <span className="shrink-0">×{i.quantity}</span>
                </div>
              ))}

              {selectedItems.length === 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  Chưa chọn sản phẩm nào
                </p>
              )}

              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{selectedItems.length} sản phẩm đã chọn</span>
                  <span>{formatPrice(selectedTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vận chuyển</span>
                  <span className="text-emerald-600 font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                  <span>Tổng thanh toán</span>
                  <span className="text-indigo-600 text-lg">{formatPrice(selectedTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(!showCheckout)}
                disabled={selectedIds.size === 0}
                className="btn-primary w-full py-2.5 disabled:opacity-50"
              >
                {showCheckout ? 'Ẩn form' : `Mua ngay (${selectedIds.size})`}
                <ArrowRight className="h-4 w-4" />
              </button>

              {selectedIds.size > 0 && selectedIds.size < items.length && (
                <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                  <Tag className="h-3 w-3" />
                  Chỉ thanh toán {selectedIds.size} sản phẩm đã chọn
                </p>
              )}
            </div>

            {showCheckout && (
              <form onSubmit={checkout} className="card p-5 space-y-4">
                <h2 className="font-bold text-gray-900">Thông tin giao hàng</h2>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Họ tên người nhận *</label>
                  <input
                    value={form.recipientName}
                    onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                    className="input text-sm" placeholder="Nguyễn Văn A" required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Số điện thoại *</label>
                  <input
                    value={form.recipientPhone}
                    onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
                    className="input text-sm" placeholder="0912 345 678" required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Địa chỉ giao hàng *</label>
                  <textarea
                    value={form.shippingAddress}
                    onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                    className="input text-sm resize-none" rows={2}
                    placeholder="Số nhà, đường, quận, tỉnh/thành phố..." required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phương thức thanh toán</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="input text-sm"
                  >
                    {Object.entries(PAYMENT_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ghi chú</label>
                  <input
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="input text-sm" placeholder="Yêu cầu đặc biệt..."
                  />
                </div>
                <button type="submit" disabled={checkoutLoading} className="btn-primary w-full py-2.5">
                  {checkoutLoading ? 'Đang đặt hàng...' : `Xác nhận đặt hàng (${formatPrice(selectedTotal)})`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
