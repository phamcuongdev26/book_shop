import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AuthResponse, Role } from '../types'

interface AuthUser {
  token: string
  userId: number
  username: string
  email: string
  fullName: string
  role: Role
}

interface AuthContextType {
  user: AuthUser | null
  login: (data: AuthResponse) => void
  logout: () => void
  isAuthenticated: boolean
  hasRole: (...roles: Role[]) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser)

  const login = useCallback((data: AuthResponse) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const hasRole = useCallback((...roles: Role[]) => {
    return user ? roles.includes(user.role) : false
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
