import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('authToken'))
  const [isLoading, setIsLoading] = useState(true)

  // Проверить авторизацию при загрузке
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      if (token) {
        const response = await authAPI.getCurrentUser()
        setUser(response.data)
      }
    } catch (err) {
      localStorage.removeItem('authToken')
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      const { token: newToken, user: newUser } = response.data
      
      localStorage.setItem('authToken', newToken)
      setToken(newToken)
      setUser(newUser)
    } catch (err) {
      throw new Error('Login failed')
    }
  }

  const register = async (email, password) => {
    try {
      const response = await authAPI.register({ email, password })
      const { token: newToken, user: newUser } = response.data
      
      localStorage.setItem('authToken', newToken)
      setToken(newToken)
      setUser(newUser)
    } catch (err) {
      throw new Error('Registration failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
