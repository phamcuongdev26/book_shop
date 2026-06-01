import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'
import BookList from './pages/BookList'
import BookDetail from './pages/BookDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import ManageBooks from './pages/seller/ManageBooks'
import SellerDashboard from './pages/seller/SellerDashboard'
import ManageOrders from './pages/admin/ManageOrders'
import ManageUsers from './pages/admin/ManageUsers'
import ManageCategories from './pages/admin/ManageCategories'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageSellers from './pages/admin/ManageSellers'
import ManageAdminBooks from './pages/admin/ManageAdminBooks'
import AdminAuditLog from './pages/admin/AdminAuditLog'
import ProductDetail from './pages/ProductDetail'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import ManageProfileRequests from './pages/admin/ManageProfileRequests'


function RequireAuth({ children, roles }) {
  const { isAuthenticated, hasRole } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  if (roles && !hasRole(...roles)) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
        <Toaster position="top-right" toastOptions={{ className: 'text-sm', duration: 4000, error: { duration: 10000 } }} />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="books" element={<BookList />} />
            <Route path="books/:id" element={<BookDetail />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="cart" element={
              <RequireAuth><Cart /></RequireAuth>
            } />
            <Route path="orders" element={
              <RequireAuth><Orders /></RequireAuth>
            } />
            <Route path="notifications" element={
              <RequireAuth><Notifications /></RequireAuth>
            } />
            <Route path="profile" element={
              <RequireAuth><Profile /></RequireAuth>
            } />
            <Route path="seller/dashboard" element={
              <RequireAuth roles={['SELLER', 'ADMIN']}><SellerDashboard /></RequireAuth>
            } />
            <Route path="seller/books" element={
              <RequireAuth roles={['SELLER', 'ADMIN']}><ManageBooks /></RequireAuth>
            } />
            <Route path="seller/orders" element={
              <RequireAuth roles={['SELLER', 'ADMIN']}><ManageOrders /></RequireAuth>
            } />
            <Route path="admin" element={
              <RequireAuth roles={['ADMIN']}><AdminDashboard /></RequireAuth>
            } />
            <Route path="admin/users" element={
              <RequireAuth roles={['ADMIN']}><ManageUsers /></RequireAuth>
            } />
            <Route path="admin/sellers" element={
              <RequireAuth roles={['ADMIN']}><ManageSellers /></RequireAuth>
            } />
            <Route path="admin/categories" element={
              <RequireAuth roles={['ADMIN']}><ManageCategories /></RequireAuth>
            } />
            <Route path="admin/books" element={
              <RequireAuth roles={['ADMIN']}><ManageAdminBooks /></RequireAuth>
            } />
            <Route path="admin/audit-logs" element={
              <RequireAuth roles={['ADMIN']}><AdminAuditLog /></RequireAuth>
            } />
            <Route path="admin/profile-requests" element={
              <RequireAuth roles={['ADMIN']}><ManageProfileRequests /></RequireAuth>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
