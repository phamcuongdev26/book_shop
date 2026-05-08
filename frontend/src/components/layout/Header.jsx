import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, BookOpen, Search, Menu, X, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'

export function Header() {
  const { user, logout, isAuthenticated, hasRole } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const { unreadCount } = useNotifications()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchQ.trim())}`)
      setSearchQ('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base">Book<span className="text-indigo-600">Shop</span></span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 hidden sm:flex max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Tìm sách, tác giả..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
              />
            </div>
          </form>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-1">
            <NavLink to="/books" className={({ isActive }) =>
              `hidden sm:block px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`
            }>
              Sách
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/notifications" className={({ isActive }) =>
                  `relative p-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`
                }>
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </NavLink>

                <NavLink to="/cart" className={({ isActive }) =>
                  `p-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`
                }>
                  <ShoppingCart className="h-5 w-5" />
                </NavLink>

                <div className="relative group">
                  <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block max-w-24 truncate">{user?.fullName || user?.username}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900 truncate">{user?.fullName}</p>
                      <p className="text-xs text-gray-400">{user?.role}</p>
                    </div>
                    <NavLink to="/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Đơn hàng của tôi
                    </NavLink>
                    {hasRole('SELLER', 'ADMIN') && (
                      <Link to="/seller/books" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Quản lý sách
                      </Link>
                    )}
                    {hasRole('ADMIN') && (
                      <Link to="/admin/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Quản trị đơn hàng
                      </Link>
                    )}
                    {hasRole('ADMIN') && (
                      <Link to="/admin/users" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Quản lý tài khoản
                      </Link>
                    )}
                    {hasRole('ADMIN') && (
                      <Link to="/admin/categories" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Quản lý danh mục
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Đăng xuất
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline px-3 py-1.5 text-sm">Đăng nhập</Link>
                <Link to="/register" className="btn-primary px-3 py-1.5 text-sm hidden sm:inline-flex">Đăng ký</Link>
              </div>
            )}

            <button className="sm:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden py-3 border-t border-gray-100 space-y-1">
            <form onSubmit={handleSearch} className="mb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Tìm sách..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none bg-gray-50"
                />
              </div>
            </form>
            <NavLink to="/books" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Sách</NavLink>
            {isAuthenticated && (
              <NavLink to="/orders" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Đơn hàng</NavLink>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
