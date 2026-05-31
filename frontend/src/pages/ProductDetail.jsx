import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Star, ShoppingCart, Gift, CheckCircle,
  Zap, Tag, Shield, Truck, Check, X, MapPin, Phone, User, CreditCard, FileText
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { cartApi } from '../api/cart'
import { ordersApi } from '../api/orders'

const PLACEHOLDER = 'https://placehold.co/320x420?text=No+Image'

const PAYMENT_LABELS = {
  COD:           'Thanh toán khi nhận hàng (COD)',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  MOMO:          'Ví MoMo',
  VNPAY:         'VNPay',
}

function fmt(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s}
          className={`h-4 w-4 ${s <= Math.round(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  )
}

// ── Modal form đặt hàng ──────────────────────────────────────────
function OrderModal({ product, qty, onClose }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    recipientName: '', recipientPhone: '',
    shippingAddress: '', paymentMethod: 'COD', note: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const bookId = product.bookId

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(err => ({ ...err, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    const name = form.recipientName.trim()
    if (name.length < 2) e.recipientName = 'Vui lòng nhập họ tên (ít nhất 2 ký tự)'
    const phone = form.recipientPhone.replace(/\s/g, '')
    if (!/^0[0-9]{9}$/.test(phone)) e.recipientPhone = 'Số điện thoại không hợp lệ (10 số, bắt đầu 0)'
    if (form.shippingAddress.trim().length < 10) e.shippingAddress = 'Địa chỉ quá ngắn (ít nhất 10 ký tự)'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    try {
      // 1. Thêm vào giỏ
      const cartRes = await cartApi.add(bookId, qty)
      const cartItems = cartRes.data.result?.items ?? []
      const cartItem = cartItems.find(i => i.bookId === bookId)

      // 2. Checkout item vừa thêm
      await ordersApi.checkout({
        shippingAddress: form.shippingAddress,
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        paymentMethod: form.paymentMethod,
        note: form.note,
        selectedItemIds: cartItem ? [cartItem.id] : undefined,
      })

      onClose()
      toast.success('Đặt hàng thành công!', { duration: 4000 })
      navigate('/orders')
    } catch (err) {
      const msg = err?.response?.data?.message
      toast.error(msg || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  const salePrice = product.discountPrice ?? product.price
  const total = salePrice * qty

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-y-auto max-h-[92dvh]">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Thông tin đặt hàng</h2>
            <p className="text-xs text-gray-400 mt-0.5">Điền đầy đủ để chúng tôi giao hàng đúng địa chỉ</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tóm tắt sản phẩm */}
        <div className="mx-5 mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center gap-3">
          <img
            src={product.imageUrl || PLACEHOLDER}
            alt={product.title}
            className="w-12 h-16 object-cover rounded-lg border border-indigo-100"
            onError={e => { e.target.src = PLACEHOLDER }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 line-clamp-2">{product.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{product.brand} · SL: {qty}</p>
          </div>
          <p className="shrink-0 text-sm font-bold text-indigo-600">{fmt(total)}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Họ và tên người nhận <span className="text-rose-500">*</span></span>
            </label>
            <input
              value={form.recipientName}
              onChange={set('recipientName')}
              placeholder="Nguyễn Văn A"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors
                ${errors.recipientName
                  ? 'border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-200'
                  : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'}`}
            />
            {errors.recipientName && <p className="text-xs text-rose-500 mt-1">{errors.recipientName}</p>}
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Số điện thoại <span className="text-rose-500">*</span></span>
            </label>
            <input
              value={form.recipientPhone}
              onChange={set('recipientPhone')}
              placeholder="0912 345 678"
              inputMode="numeric"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors
                ${errors.recipientPhone
                  ? 'border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-200'
                  : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'}`}
            />
            {errors.recipientPhone && <p className="text-xs text-rose-500 mt-1">{errors.recipientPhone}</p>}
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Địa chỉ giao hàng <span className="text-rose-500">*</span></span>
            </label>
            <textarea
              value={form.shippingAddress}
              onChange={set('shippingAddress')}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
              rows={2}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none resize-none transition-colors
                ${errors.shippingAddress
                  ? 'border-rose-400 bg-rose-50 focus:ring-2 focus:ring-rose-200'
                  : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'}`}
            />
            {errors.shippingAddress && <p className="text-xs text-rose-500 mt-1">{errors.shippingAddress}</p>}
          </div>

          {/* Phương thức thanh toán */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Phương thức thanh toán</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PAYMENT_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, paymentMethod: key }))}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium text-left transition-all
                    ${form.paymentMethod === key
                      ? 'border-indigo-400 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Ghi chú (tuỳ chọn)</span>
            </label>
            <input
              value={form.note}
              onChange={set('note')}
              placeholder="Yêu cầu đặc biệt, thời gian giao hàng..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors"
            />
          </div>

          {/* Tổng tiền */}
          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">Tổng thanh toán</span>
            <span className="text-lg font-bold text-indigo-600">{fmt(total)}</span>
          </div>

          {/* Nút xác nhận */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md text-sm"
          >
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Đang xử lý...</>
            ) : (
              <><Check className="h-5 w-5" /> Xác nhận đặt hàng</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Trang chính ─────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const product = null
  const [qty, setQty] = useState(1)
  const [showModal, setShowModal] = useState(false)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg mb-4">Không tìm thấy sản phẩm.</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm">← Về trang chủ</Link>
      </div>
    )
  }

  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price
  const salePrice = product.discountPrice ?? product.price
  const discountPct = hasDiscount ? Math.round((1 - salePrice / product.price) * 100) : 0

  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để tiếp tục', { icon: '🔒' })
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }
    callback()
  }

  return (
    <>
      {showModal && (
        <OrderModal
          product={product}
          qty={qty}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-gray-600">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-500">{product.sectionTitle}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-48">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── Cột ảnh ── */}
          <div className="space-y-3">
            <div style={{ position: 'relative', width: '100%', paddingBottom: '133.33%', overflow: 'hidden', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
              <img
                src={product.imageUrl || PLACEHOLDER}
                alt={product.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.target.src = PLACEHOLDER }}
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-sm font-bold px-2.5 py-1.5 rounded-xl shadow-lg">
                  -{discountPct}%
                </span>
              )}
              {product.isGift && (
                <span className="absolute top-4 right-4 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1.5 rounded-xl shadow flex items-center gap-1">
                  <Gift className="h-3.5 w-3.5" /> Quà tặng
                </span>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Shield, label: 'Hàng chính hãng' },
                { icon: Truck,  label: 'Giao nhanh 2h' },
                { icon: Check,  label: 'Đổi trả 7 ngày' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-2.5 text-center">
                  <Icon className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs text-gray-500 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Cột thông tin ── */}
          <div className="space-y-5">

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              <Tag className="h-3 w-3" />{product.sectionTitle}
            </span>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{product.title}</h1>
              <p className="text-sm text-gray-500 mt-1">Thương hiệu: <span className="font-semibold text-gray-700">{product.brand}</span></p>
            </div>

            {product.avgRating > 0 && (
              <div className="flex items-center gap-2">
                <StarRow rating={product.avgRating} />
                <span className="text-sm font-semibold text-gray-800">{product.avgRating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">·</span>
                <span className="text-sm text-gray-500">{product.totalSold?.toLocaleString()} đã bán</span>
              </div>
            )}

            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-gray-900">{fmt(salePrice)}</span>
                {hasDiscount && (
                  <span className="text-lg text-gray-400 line-through mb-1">{fmt(product.price)}</span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-sm text-rose-600 font-medium mt-1">
                  Tiết kiệm {fmt(product.price - salePrice)} so với giá gốc
                </p>
              )}
            </div>

            {product.highlights?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">Điểm nổi bật</h3>
                <ul className="space-y-1.5">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.specs?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">Thông số</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.specs.map(({ label, value }) => (
                    <div key={label} className="bg-white border border-gray-100 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.isGift && product.giftCondition && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="h-5 w-5 text-amber-500 shrink-0" />
                  <h3 className="font-bold text-amber-800 text-sm">Điều kiện nhận quà tặng</h3>
                </div>
                <p className="text-amber-700 text-sm font-medium leading-relaxed">{product.giftCondition}</p>
                {product.giftMinBooks && (
                  <div className="mt-3 space-y-1.5">
                    {Array.from({ length: product.giftMinBooks }).map((_, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-amber-700">
                        <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 text-amber-800 font-bold text-xs">
                          {i + 1}
                        </div>
                        Sách {i + 1}: bất kỳ sách nào trong cửa hàng
                      </div>
                    ))}
                  </div>
                )}
                {product.giftMinAmount && (
                  <p className="mt-2 text-xs text-amber-600 bg-amber-100 rounded-lg px-3 py-1.5">
                    Giá trị đơn hàng tối thiểu: <strong>{fmt(product.giftMinAmount)}</strong>
                  </p>
                )}
              </div>
            )}

            {/* ── Nút mua ── */}
            <div className="border-t border-gray-100 pt-5 space-y-3">
              {product.isGift ? (
                <>
                  <Link
                    to="/"
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
                  >
                    <ShoppingCart className="h-5 w-5" /> Đi mua sách để nhận quà này
                  </Link>
                  <p className="text-xs text-center text-gray-400">
                    Quà được thêm tự động vào đơn khi đủ điều kiện
                  </p>
                </>
              ) : (
                <>
                  {/* Chọn số lượng */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-20">Số lượng</span>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-lg font-medium transition-colors"
                      >−</button>
                      <span className="w-12 text-center text-sm font-bold text-gray-800">{qty}</span>
                      <button
                        onClick={() => setQty(q => q + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-lg font-medium transition-colors"
                      >+</button>
                    </div>
                  </div>

                  <button
                    onClick={() => requireAuth(() => setShowModal(true))}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md"
                  >
                    <Zap className="h-5 w-5" /> Mua ngay
                  </button>
                  <button
                    onClick={() => requireAuth(async () => {
                      if (!product.bookId) { toast.error('Sản phẩm chưa liên kết với hệ thống'); return }
                      try {
                        await cartApi.add(product.bookId, qty)
                        toast.success('Đã thêm vào giỏ hàng!')
                      } catch (err) {
                        toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
                      }
                    })}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-3.5 rounded-xl transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" /> Thêm vào giỏ hàng
                  </button>

                  {!isAuthenticated && (
                    <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                      🔒 <Link to="/login" className="text-indigo-500 hover:underline">Đăng nhập</Link> để mua hàng
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mô tả chi tiết */}
        {product.description && (
          <div className="mt-12 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Mô tả chi tiết</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Quay lại trang chủ
          </Link>
        </div>
      </div>
    </>
  )
}
