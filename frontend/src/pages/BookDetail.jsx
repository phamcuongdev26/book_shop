import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Star, Package, BookOpenCheck, Zap, X, User, Phone, MapPin, CreditCard, FileText, Check, MessageSquare, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { booksApi } from '../api/books'
import { cartApi } from '../api/cart'
import { ordersApi } from '../api/orders'
import { reviewsApi } from '../api/reviews'
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
            <input
              value={form.recipientPhone}
              onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 15); setForm(f => ({ ...f, recipientPhone: v })); setErrors(err => ({ ...err, recipientPhone: '' })) }}
              placeholder="0912 345 678"
              inputMode="numeric"
              maxLength={15}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${errors.recipientPhone ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-gray-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'}`}
            />
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

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 focus:outline-none">
          <Star className={`h-7 w-7 transition-colors ${(hover || value) >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-1 text-sm text-gray-500">
          {['', 'Tệ', 'Không thích', 'Bình thường', 'Tốt', 'Tuyệt vời'][value]}
        </span>
      )}
    </div>
  )
}

function ReviewSection({ bookId, isAuthenticated }) {
  const [reviews, setReviews] = useState([])
  const [status, setStatus] = useState(null)  // {reviewableItems, myReviews}
  const [form, setForm] = useState({ rating: 0, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ rating: 0, comment: '' })
  const [editSubmitting, setEditSubmitting] = useState(false)

  const loadAll = async () => {
    try {
      const r = await reviewsApi.getBookReviews(bookId)
      setReviews(r.data.result || [])
    } catch {}
    if (isAuthenticated) {
      try {
        const s = await reviewsApi.getMyStatus(bookId)
        setStatus(s.data.result)
      } catch {}
    }
  }

  useEffect(() => { loadAll() }, [bookId, isAuthenticated])

  const canReview = (status?.reviewableItems?.length ?? 0) > 0
  const hasBought = canReview || (status?.myReviews?.length ?? 0) > 0
  const fmtDate = (s) => s ? new Date(s).toLocaleDateString('vi-VN') : ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.rating === 0) { toast.error('Vui lòng chọn số sao đánh giá'); return }
    const orderItemId = status?.reviewableItems?.[0]?.orderItemId
    if (!orderItemId) return
    setSubmitting(true)
    try {
      await reviewsApi.createReview(bookId, { ...form, orderItemId })
      toast.success('Đã gửi đánh giá!')
      setForm({ rating: 0, comment: '' })
      await loadAll()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gửi đánh giá thất bại')
    } finally { setSubmitting(false) }
  }

  const startEdit = (review) => {
    setEditForm({ rating: review.rating, comment: review.comment || '' })
    setEditingId(review.id)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (editForm.rating === 0) { toast.error('Vui lòng chọn số sao'); return }
    setEditSubmitting(true)
    try {
      await reviewsApi.updateReview(editingId, editForm)
      toast.success('Đã cập nhật đánh giá!')
      setEditingId(null)
      await loadAll()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Cập nhật thất bại')
    } finally { setEditSubmitting(false) }
  }

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Xóa đánh giá này?')) return
    try {
      await reviewsApi.deleteReview(reviewId)
      toast.success('Đã xóa đánh giá')
      setEditingId(null)
      await loadAll()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Xóa thất bại')
    }
  }

  return (
    <div className="mt-12 border-t border-gray-100 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-bold text-gray-900">Đánh giá từ độc giả</h2>
        {reviews.length > 0 && (
          <span className="text-sm text-gray-400">({reviews.length} đánh giá)</span>
        )}
      </div>

      {/* Create form — shown for each unreviewed delivered order item */}
      {isAuthenticated && canReview && (
        <form onSubmit={handleSubmit} className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-indigo-700">Viết đánh giá của bạn</p>
            <span className="text-xs text-indigo-400">
              Đơn #{status.reviewableItems[0]?.orderCode}
              {status.reviewableItems.length > 1 && ` · còn ${status.reviewableItems.length - 1} đơn chờ đánh giá`}
            </span>
          </div>
          <StarPicker value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
          <textarea
            value={form.comment}
            onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
            placeholder="Chia sẻ cảm nhận về cuốn sách... (không bắt buộc)"
            maxLength={1000} rows={3}
            className="w-full px-3 py-2.5 text-sm border border-indigo-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{form.comment.length}/1000</span>
            <button type="submit" disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-colors">
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      )}

      {/* My reviews (one card per review) */}
      {status?.myReviews?.map(myReview => (
        <div key={myReview.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-amber-600">Đánh giá của bạn</p>
            {editingId !== myReview.id && (
              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(myReview)}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
                  <Pencil className="h-3 w-3" /> Sửa
                </button>
                <button onClick={() => handleDelete(myReview.id)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="h-3 w-3" /> Xóa
                </button>
              </div>
            )}
          </div>

          {editingId === myReview.id ? (
            <form onSubmit={handleUpdate} className="space-y-3">
              <StarPicker value={editForm.rating} onChange={r => setEditForm(f => ({ ...f, rating: r }))} />
              <textarea
                value={editForm.comment}
                onChange={e => setEditForm(f => ({ ...f, comment: e.target.value }))}
                maxLength={1000} rows={3}
                className="w-full px-3 py-2 text-sm border border-amber-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
              <div className="flex items-center gap-2 justify-end">
                <button type="button" onClick={() => setEditingId(null)}
                  className="px-4 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  Hủy
                </button>
                <button type="submit" disabled={editSubmitting}
                  className="px-4 py-1.5 text-sm bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold rounded-xl transition-colors">
                  {editSubmitting ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-0.5 mb-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`h-4 w-4 ${s <= myReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              {myReview.comment && <p className="text-sm text-gray-700 mt-1">{myReview.comment}</p>}
              <p className="text-xs text-gray-400 mt-1">{fmtDate(myReview.createdAt)}</p>
              {myReview.shopReply && (
                <div className="mt-3 bg-white border border-amber-100 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Phản hồi từ {myReview.shopName || 'Shop'}</p>
                  <p className="text-sm text-gray-600">{myReview.shopReply}</p>
                  <p className="text-xs text-gray-400 mt-1">{fmtDate(myReview.repliedAt)}</p>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {/* Not purchased prompt */}
      {isAuthenticated && status && !hasBought && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-500 text-center">
          Mua và nhận sách này để có thể viết đánh giá.
        </div>
      )}

      {/* All reviews list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                    {(r.fullName || r.username)[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{r.fullName || r.username}</span>
                </div>
                <span className="text-xs text-gray-400">{fmtDate(r.createdAt)}</span>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
              {r.shopReply && (
                <div className="mt-3 bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Phản hồi từ {r.shopName || 'Shop'}</p>
                  <p className="text-sm text-gray-600">{r.shopReply}</p>
                  {r.repliedAt && <p className="text-xs text-gray-400 mt-1">{fmtDate(r.repliedAt)}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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

        <ReviewSection bookId={book.id} isAuthenticated={isAuthenticated} />
      </div>
    </>
  )
}
