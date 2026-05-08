import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          © 2026 BookShop. Nhóm sinh viên CNW.
        </div>
      </footer>
    </div>
  )
}
