import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { notificationsApi } from '../api/notifications'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) { setUnreadCount(0); return }
    try {
      const res = await notificationsApi.getUnreadCount()
      setUnreadCount(res.data?.data ?? 0)
    } catch {
      setUnreadCount(0)
    }
  }, [isAuthenticated])

  useEffect(() => { refresh() }, [refresh])

  return (
    <NotificationContext.Provider value={{ unreadCount, refresh }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}
