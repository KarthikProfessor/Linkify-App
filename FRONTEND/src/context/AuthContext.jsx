import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/endpoints'
import { getToken, setToken, setUnauthorizedHandler } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(() => Boolean(getToken()))

  const clearSession = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  // Restore the session from a saved token
  useEffect(() => {
    setUnauthorizedHandler(clearSession)
    if (!getToken()) return

    let cancelled = false
    authApi
      .me()
      .then((me) => !cancelled && setUser(me))
      .catch(() => !cancelled && clearSession())
      .finally(() => !cancelled && setInitializing(false))

    return () => {
      cancelled = true
    }
  }, [clearSession])

  const login = useCallback(async (credentials) => {
    const { user, token } = await authApi.login(credentials)
    setToken(token)
    setUser(user)
    return user
  }, [])

  const register = useCallback(async (details) => {
    const { user, token } = await authApi.register(details)
    setToken(token)
    setUser(user)
    return user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      /* stateless JWT – clearing the token locally is what matters */
    }
    clearSession()
  }, [clearSession])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), initializing, login, register, logout }),
    [user, initializing, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
