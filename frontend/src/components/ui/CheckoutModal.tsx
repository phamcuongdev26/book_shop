import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, User, Phone, MapPin, CreditCard, FileText, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { cartApi } from '../../api/cart'
import { ordersApi } from '../../api/orders'

const PLACEHOLDER = 'https://placehold.co/300x400?text=No+Image'

const PAYMENT_LABELS: Record<string, string> = {
  COD: 'Thanh toán khi nhận hàng (COD)',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  MOMO: 'Ví MoMo',
  VNPAY: 'VNPay',
}

function fmt(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

interface Props {
  bookId: number
  bookTitle: string
  bookImageUrl?: string
  author?: string
  effectivePrice: number
  qty?: number
  onClose: () => void
}

export function CheckoutModal({ bookId, bookTitle, bookImageUrl, author, effectivePrice, qty = 1, onClose }: Props) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ recipientName: '', recipientPhone: '', shippingAddress: '', paymentMethod: 'COD', note: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(err => ({ ...err, [field]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (form.recipientName.trim().length < 2) e.recipientName = 'Vui lòng nhập họ tên (ít nhất 2 ký tự)'
    if (!form.recipientPhone.trim()) e.recipientPhone = 'Vui lòng nhập số điện thoại'
    if (form.shippingAddress.trim().length < 10) e.shippingAddress = 'Địa chỉ quá ngắn (ít nhất 10 ký tự)'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    try {
      const cartRes = await cartApi.add(bookId, qty)
      const cartItems: any[] = (cartRes.data as any).result?.items ?? []
      const cartItem = cartItems.find((i: any) => i.bookId === bookId)
      await ordersApi.checkout({
        shippingAddress: form.shippingAddress,
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        paymentMethod: form.paymentMethod as any,
        note: form.note,
        selectedItemIds: cartItem ? [cartItem.id] : undefined,
      })
      onClose()
      toast.success('Đặt hàng thành công!')
      navigate('/orders')
    } catch (err: unknown) {
      toast.error((err as any)?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-y-auto max-h-[92dvh]">

        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Thông tin đặt hàng</h2>
            <p className="text-xs text-gray-400 mt-0.5">Điền đầy đủ để chúng tôi giao đúng địa chỉ</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-5 mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center gap-3">
          <img src={bookImageUrl || PLACEHOLDER} alt={bookTitle}
            className="w-12 h-16 object-cover rounded-lg border border-indigo-100"
            onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = PLACEHOLDER }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 line-clamp-2">{bookTitle}</p>
            {author && <p className="text-xs text-gray-500 mt-0.5">{author} · SL: {qty}</p>}
          </div>
          <p className="shrink-0 text-sm font-bold text-indigo-600">{fmt(effectivePrice * qty)}</p>
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
            <span className="text-lg font-bold text-indigo-600">{fmt(effectivePrice * qty)}</span>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md text-sm">
            {submitting
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Đang xử lý...</>
              : <><Check className="h-5 w-5" /> Xác nhận đặt hàng</>}
          </button>
        </form>
      </div>
    </div>
  )
}
