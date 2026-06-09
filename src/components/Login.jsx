import { useState } from 'react'
import './Login.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple validation
    if (!email || !password) {
      setError('Заполните все поля')
      setLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Некорректный email')
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      // Mock authentication with role assignment
      let role = 'user' // Default role for regular users
      
      // Check for special accounts
      if (email === 'project@mail.ru' && password === '123') {
        role = 'project_manager'
      } else if (email === 'employe@mail.ru' && password === '123') {
        role = 'hr_manager'
      } else if (email && password.length >= 3) {
        role = 'user'
      } else {
        setError('Неверные учетные данные')
        setLoading(false)
        return
      }
      
      onLogin({ 
        email, 
        name: email.split('@')[0],
        role: role
      })
      setLoading(false)
    }, 500)
  }

  const handleForgotPassword = () => {
    alert('Переход на страницу восстановления пароля')
    // TODO: Navigate to forgot password page
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>DevSolutions</h1>
      </div>

      <div className="login-box">
        <h2>Вход DevSolutions</h2>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <a href="#" onClick={(e) => { e.preventDefault(); handleForgotPassword() }} className="forgot-link">
              Забыли пароль?
            </a>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
