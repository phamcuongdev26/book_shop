import { useEffect, useState } from 'react'
import { ordersApi } from '../../api/orders'
import { PageSpinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'
import type { OrderResponse, OrderStatus } from '../../types'

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy', RETURNED: 'Đã hoàn trả',
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}
function formatDate(s: string) {
  return new Date(s).toLocaleDateString('vi-VN')
}

export default function ManageOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = () => {
    ordersApi.getAllOrders({ size: 100 })
      .then((res) => setOrders(res.data.result.content as unknown as OrderResponse[]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await ordersApi.updateStatus(orderId, status)
      toast.success('Cập nhật trạng thái thành công')
      fetch()
    } catch {
      toast.error('Cập nhật thất bại')
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý đơn hàng</h1>
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
          </tbody>
        </table>
      </div>
    </div>
  )
}
