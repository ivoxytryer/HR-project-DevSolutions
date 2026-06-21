import { useState } from 'react'
import { useAuth } from '../../shared/context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
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

    try {
      if (isRegister) {
        // Registration
        // const { register } = useAuth()
        // await register(email, password)
        // For now, just login
        setError('Регистрация будет доступна позже')
        setLoading(false)
      } else {
        // Login
        await login(email, password)
        // App component will automatically redirect after user is set
      }
    } catch (err) {
      setError('Ошибка авторизации. Проверьте email и пароль')
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>DevSolutions HR</h1>
      </div>

      <div className="login-box">
        <h2>{isRegister ? 'Регистрация' : 'Вход'}</h2>

        <form onSubmit={handleSubmit}>
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
            {!isRegister && (
              <a href="#" onClick={(e) => { e.preventDefault() }} className="forgot-link">
                Забыли пароль?
              </a>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Загрузка...' : isRegister ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <div className="register-link">
          {isRegister ? (
            <>
              Уже есть аккаунт? <a onClick={() => setIsRegister(false)}>Войти</a>
            </>
          ) : (
            <>
              Нет аккаунта? <a onClick={() => setIsRegister(true)}>Зарегистрироваться</a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
