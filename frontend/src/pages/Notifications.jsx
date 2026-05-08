import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CheckCheck, Package, ShoppingBag, Info, ChevronRight } from 'lucide-react'
import { notificationsApi } from '../api/notifications'
import { useNotifications } from '../context/NotificationContext'

const TYPE_ICON = {
  ORDER_PLACED: <ShoppingBag className="h-5 w-5 text-indigo-500" />,
  ORDER_STATUS_CHANGED: <Package className="h-5 w-5 text-emerald-500" />,
  SYSTEM: <Info className="h-5 w-5 text-gray-400" />,
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now - d
  const diffMin = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffMin < 1) return 'Vừa xong'
  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffH < 24) return `${diffH} giờ trước`
  if (diffD < 7) return `${diffD} ngày trước`
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function Notifications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { refresh: refreshCount } = useNotifications()

  const load = async () => {
    setLoading(true)
    try {
      const res = await notificationsApi.getAll()
      setItems(res.data?.data ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleRead = async (id) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    try {
      await notificationsApi.markAsRead(id)
      refreshCount()
    } catch { load() }
  }

  const handleReadAll = async () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })))
    try {
      await notificationsApi.markAllAsRead()
      refreshCount()
    } catch { load() }
  }

  const unread = items.filter(n => !n.read).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Bell className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Thông báo</h1>
            {unread > 0 && (
              <p className="text-sm text-gray-500">{unread} chưa đọc</p>
            )}
          </div>
        </div>
        {unread > 0 && (
          <button
            onClick={handleReadAll}
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <CheckCheck className="h-4 w-4" />
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Chưa có thông báo nào</p>
          <p className="text-sm text-gray-400 mt-1">Các thông báo về đơn hàng sẽ hiện ở đây</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(n => (
            <div
              key={n.id}
              onClick={() => !n.read && handleRead(n.id)}
              className={`relative flex gap-3 p-4 rounded-xl border transition-colors cursor-pointer
                ${n.read
                  ? 'bg-white border-gray-100 hover:border-gray-200'
                  : 'bg-indigo-50 border-indigo-100 hover:border-indigo-200'
                }`}
            >
              {/* unread dot */}
              {!n.read && (
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-500" />
              )}

              {/* icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${n.read ? 'bg-gray-100' : 'bg-white shadow-sm'}`}>
                {TYPE_ICON[n.type] ?? TYPE_ICON.SYSTEM}
              </div>

              {/* content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>
                  {n.title}
                </p>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-gray-400">{formatDate(n.createdAt)}</span>
                  {n.relatedOrderId && (
                    <Link
                      to="/orders"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-0.5 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                    >
                      Xem đơn hàng <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
