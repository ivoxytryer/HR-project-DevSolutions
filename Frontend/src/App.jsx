import { useState } from 'react'
import { useAuth } from './shared/context/AuthContext'
import Login from './modules/auth/Login'
import TimeSheet from './modules/timesheet/TimeSheet'
import Projects from './modules/projects/Projects'
import Employees from './modules/employees/Employees'
import './App.css'
import image1 from './shared/assets/image1.png'
import image2 from './shared/assets/image2.png'
import image3 from './shared/assets/image3.png'

export default function App() {
  const { user, isLoading, logout } = useAuth()
  const [page, setPage] = useState('timesheet')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const getRoleLabel = (role) => {
    const roleLabels = {
      'employee': 'Сотрудник',
      'manager': 'Менеджер проектов',
      'hr_manager': 'Менеджер сотрудников',
      'admin': 'Администратор'
    }
    return roleLabels[role] || 'Пользователь'
  }

  const canEdit = (pageName) => {
    if (!user) return false
    const editPermissions = {
      'timesheet': ['employee', 'manager', 'hr_manager', 'admin'],
      'projects': ['manager', 'admin'],
      'employees': ['admin', 'hr_manager']
    }
    return editPermissions[pageName]?.includes(user.role) ?? false
  }

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Загрузка...</div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <button className="btn-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <h1>DevSolutions HR</h1>
      </header>
      
      <div className="app-wrapper">
        <nav className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <h1>HR System</h1>
          <div className="user-card">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{getRoleLabel(user?.role)}</p>
          </div>
          <ul className="nav-menu">
            <li><button className={page === 'timesheet' ? 'active' : ''} onClick={() => setPage('timesheet')}><img src={image1} alt="Учет времени" /> Учет времени</button></li>
            {(user?.role === 'manager' || user?.role === 'admin') && (
              <li><button className={page === 'projects' ? 'active' : ''} onClick={() => setPage('projects')}><img src={image2} alt="Проекты" /> Проекты</button></li>
            )}
            {(user?.role === 'admin' || user?.role === 'hr_manager') && (
              <li><button className={page === 'employees' ? 'active' : ''} onClick={() => setPage('employees')}><img src={image3} alt="Сотрудники" /> Сотрудники</button></li>
            )}
          </ul>
          <button className="btn-logout" onClick={logout}>Выход</button>
        </nav>

        <main className="main-content">
          {page === 'timesheet' && <TimeSheet user={user} />}
          {page === 'projects' && <Projects user={user} canEdit={canEdit('projects')} />}
          {page === 'employees' && <Employees user={user} canEdit={canEdit('employees')} />}
        </main>
      </div>
    </div>
  )
}