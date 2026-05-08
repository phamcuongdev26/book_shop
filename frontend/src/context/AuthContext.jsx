import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

function loadUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  // data là AuthResponse trực tiếp: { accessToken, userId, username, email, role, ... }
  const login = useCallback((data) => {
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data))
    setUser(data)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const hasRole = useCallback((...roles) => {
    return user ? roles.includes(user.role) : false
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
