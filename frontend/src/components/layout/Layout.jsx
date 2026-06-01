import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            {/* Dịch vụ */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Dịch vụ</h4>
              <ul className="space-y-2 text-sm">
                {['Điều khoản sử dụng', 'Chính sách bảo mật thông tin cá nhân', 'Chính sách bảo mật thanh toán', 'Giới thiệu BookShop', 'Hệ thống nhà sách'].map(s => (
                  <li key={s}><a href="#" className="hover:text-white transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>

            {/* Hỗ trợ */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm">
                {['Chính sách đổi - trả - hoàn tiền', 'Chính sách bảo hành - bồi hoàn', 'Chính sách vận chuyển', 'Chính sách khách sỉ', 'Câu hỏi thường gặp'].map(s => (
                  <li key={s}><a href="#" className="hover:text-white transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>

            {/* Tài khoản */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Tài khoản của tôi</h4>
              <ul className="space-y-2 text-sm">
                {['Đăng nhập / Tạo mới tài khoản', 'Thay đổi địa chỉ khách hàng', 'Chi tiết tài khoản', 'Lịch sử mua hàng', 'Theo dõi đơn hàng'].map(s => (
                  <li key={s}><a href="#" className="hover:text-white transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>

            {/* Liên hệ */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Liên hệ</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">📍</span>
                  <span>45 Đinh Tiên Hoàng, P. Bến Nghé, Q.1, TP. Hồ Chí Minh</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✉️</span>
                  <a href="mailto:cskh@bookshop.vn" className="hover:text-white transition-colors">cskh@bookshop.vn</a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <a href="tel:19001234" className="hover:text-white transition-colors">1900 1234</a>
                </li>
                <li className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>7:30 – 21:00 (Thứ 2 – CN)</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© 2026 BookShop. Tất cả quyền được bảo lưu.</p>
            <div className="flex items-center gap-4">
              <span>Chấp nhận thanh toán:</span>
              <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">COD</span>
              <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">Chuyển khoản</span>
              <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">MoMo</span>
              <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">VNPay</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
