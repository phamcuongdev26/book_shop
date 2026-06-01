import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Star, Package, BookOpenCheck, Zap, X, User, Phone, MapPin, CreditCard, FileText, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { booksApi } from '../api/books'
import { cartApi } from '../api/cart'
import { ordersApi } from '../api/orders'
import { PageSpinner } from '../components/ui/Spinner'
import { useAuth } from '../context/AuthContext'

const PLACEHOLDER = 'https://placehold.co/300x400?text=No+Image'

const PAYMENT_LABELS = {
  COD: 'Thanh toán khi nhận hàng (COD)',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  MOMO: 'Ví MoMo',
  VNPAY: 'VNPay',
}

function formatPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

function CheckoutModal({ book, qty, onClose }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ recipientName: '', recipientPhone: '', shippingAddress: '', paymentMethod: 'COD', note: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(err => ({ ...err, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (form.recipientName.trim().length < 2) e.recipientName = 'Vui lòng nhập họ tên (ít nhất 2 ký tự)'
    if (!form.recipientPhone.trim()) e.recipientPhone = 'Vui lòng nhập số điện thoại'
    if (form.shippingAddress.trim().length < 10) e.shippingAddress = 'Địa chỉ quá ngắn (ít nhất 10 ký tự)'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    try {
      const cartRes = await cartApi.add(book.id, qty)
      const cartItems = cartRes.data.result?.items ?? []
      const cartItem = cartItems.find(i => i.bookId === book.id)
      await ordersApi.checkout({
        shippingAddress: form.shippingAddress,
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        paymentMethod: form.paymentMethod,
        note: form.note,
        selectedItemIds: cartItem ? [cartItem.cartItemId] : undefined,
      })
      onClose()
      toast.success('Đặt hàng thành công!')
      navigate('/orders')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  const effectivePrice = book.discountPrice ?? book.price

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-y-auto max-h-[92dvh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Thông tin đặt hàng</h2>
            <p className="text-xs text-gray-400 mt-0.5">Điền đầy đủ để chúng tôi giao đúng địa chỉ</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-5 mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center gap-3">
          <img src={book.imageUrl || PLACEHOLDER} alt={book.title}
            className="w-12 h-16 object-cover rounded-lg border border-indigo-100"
            onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 line-clamp-2">{book.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{book.author} · SL: {qty}</p>
          </div>
          <p className="shrink-0 text-sm font-bold text-indigo-600">{formatPrice(effectivePrice * qty)}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Họ và tên người nhận <span className="text-rose-500">*</span></span>
            </label>
            <input value={form.recipientName} onChange={set('recipientName')} placeholder="Nguyễn Văn A"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${errors.recipientName ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'}`} />
            {errors.recipientName && <p className="text-xs text-rose-500 mt-1">{errors.recipientName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Số điện thoại <span className="text-rose-500">*</span></span>
            </label>
            <input value={form.recipientPhone} onChange={set('recipientPhone')} placeholder="0912 345 678" inputMode="numeric"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${errors.recipientPhone ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'}`} />
            {errors.recipientPhone && <p className="text-xs text-rose-500 mt-1">{errors.recipientPhone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Địa chỉ giao hàng <span className="text-rose-500">*</span></span>
            </label>
            <textarea value={form.shippingAddress} onChange={set('shippingAddress')}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..." rows={2}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none resize-none transition-colors ${errors.shippingAddress ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'}`} />
            {errors.shippingAddress && <p className="text-xs text-rose-500 mt-1">{errors.shippingAddress}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Phương thức thanh toán</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(PAYMENT_LABELS).map(([key, label]) => (
                <button key={key} type="button" onClick={() => setForm(f => ({ ...f, paymentMethod: key }))}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium text-left transition-all ${form.paymentMethod === key ? 'border-indigo-400 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Ghi chú (tuỳ chọn)</span>
            </label>
            <input value={form.note} onChange={set('note')} placeholder="Yêu cầu đặc biệt, thời gian giao hàng..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-colors" />
          </div>

          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">Tổng thanh toán</span>
            <span className="text-lg font-bold text-indigo-600">{formatPrice(effectivePrice * qty)}</span>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md text-sm">
            {submitting
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Đang xử lý...</>
              : <><Check className="h-5 w-5" />Xác nhận đặt hàng</>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    booksApi.getById(Number(id))
      .then((res) => setBook(res.data.result ?? res.data.data))
      .catch(() => navigate('/books'))
      .finally(() => setLoading(false))
  }, [id])

  const requireAuth = (cb) => {
    if (!isAuthenticated) { navigate('/login'); return }
    cb()
  }

  const addToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setAdding(true)
    try {
      await cartApi.add(book.id, qty)
      toast.success('Đã thêm vào giỏ hàng!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <PageSpinner />
  if (!book) return null

  const effectivePrice = book.discountPrice ?? book.price
  const hasDiscount = book.discountPrice != null && book.discountPrice < book.price
  const outOfStock = book.status === 'OUT_OF_STOCK'

  return (
    <>
      {showModal && (
        <CheckoutModal book={book} qty={qty} onClose={() => setShowModal(false)} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <div className="flex justify-center">
            <div className="w-full max-w-xs rounded-xl overflow-hidden border border-gray-200 bg-[#f5f5f5]" style={{ aspectRatio: '2/3', position: 'relative' }}>
              <img src={book.imageUrl || PLACEHOLDER} alt={book.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER }} />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <Link to={`/books?categoryId=${book.categoryId}`} className="text-sm text-gray-400 hover:text-gray-700">
                {book.categoryName}
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 leading-tight">{book.title}</h1>
              <p className="text-gray-500 mt-1">bởi <span className="font-medium text-gray-700">{book.author}</span></p>
            </div>

            {book.avgRating > 0 && (
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`h-4 w-4 ${s <= Math.round(book.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
                <span className="text-sm text-gray-500 ml-1">{book.avgRating.toFixed(1)}</span>
              </div>
            )}

            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(effectivePrice)}</span>
              {hasDiscount && <span className="text-lg text-gray-400 line-through mb-0.5">{formatPrice(book.price)}</span>}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {book.publisher && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-0.5">NXB</p>
                  <p className="font-medium text-gray-700">{book.publisher}</p>
                </div>
              )}
              {book.publishYear && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-0.5">Năm xuất bản</p>
                  <p className="font-medium text-gray-700">{book.publishYear}</p>
                </div>
              )}
              {book.pageCount && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-0.5">Số trang</p>
                  <p className="font-medium text-gray-700">{book.pageCount}</p>
                </div>
              )}
              {book.language && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-0.5">Ngôn ngữ</p>
                  <p className="font-medium text-gray-700">{book.language}</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-5 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                {outOfStock
                  ? <span className="flex items-center gap-1.5 text-red-500"><Package className="h-4 w-4" /> Hết hàng</span>
                  : <span className="flex items-center gap-1.5 text-green-600"><BookOpenCheck className="h-4 w-4" /> Còn {book.stockQuantity} cuốn</span>
                }
              </div>

              {!outOfStock && (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Số lượng</span>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50">−</button>
                      <span className="px-4 py-2 text-sm font-medium border-x border-gray-200">{qty}</span>
                      <button onClick={() => setQty(Math.min(book.stockQuantity, qty + 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50">+</button>
                    </div>
                  </div>

                  <button onClick={() => requireAuth(() => setShowModal(true))}
                    className="btn-primary w-full py-3">
                    <Zap className="h-4 w-4" /> Mua ngay
                  </button>

                  <button onClick={addToCart} disabled={adding}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-colors text-sm disabled:opacity-50">
                    <ShoppingCart className="h-4 w-4" />
                    {adding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {book.description && (
          <div className="mt-12 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Giới thiệu sách</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{book.description}</p>
          </div>
        )}
      </div>
    </>
  )
}
