import { useState } from 'react'
import Login from './modules/auth/Login'
import TimeSheet from './modules/timesheet/TimeSheet'
import Projects from './modules/projects/Projects'
import Employees from './modules/employees/Employees'
import './App.css'
import image1 from './shared/assets/image1.png'
import image2 from './shared/assets/image2.png'
import image3 from './shared/assets/image3.png'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('timesheet')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const getRoleLabel = (role) => {
    const roleLabels = {
      'user': 'Обычный пользователь',
      'project_manager': 'Менеджер проектов',
      'hr_manager': 'HR менеджер'
    }
    return roleLabels[role] || 'Пользователь'
  }

  const canEditPage = (pageName, userRole) => {
    const editPermissions = {
      'timesheet': ['user', 'project_manager', 'hr_manager'],
      'projects': ['project_manager'],
      'employees': ['hr_manager']
    }
    return editPermissions[pageName]?.includes(userRole) ?? false
  }

  if (!isLoggedIn) {
    return <Login onLogin={(data) => {
      setUser(data)
      setIsLoggedIn(true)
    }} />
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <button className="btn-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <h1>DevSolutions</h1>
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
            <li><button className={page === 'projects' ? 'active' : ''} onClick={() => setPage('projects')}><img src={image2} alt="Проекты" /> Проекты</button></li>
            <li><button className={page === 'employees' ? 'active' : ''} onClick={() => setPage('employees')}><img src={image3} alt="Сотрудники" /> Сотрудники</button></li>
          </ul>
          <button className="btn-logout" onClick={() => setIsLoggedIn(false)}>Выход</button>
        </nav>

        <main className="main-content">
          {page === 'timesheet' && <TimeSheet user={user} />}
          {page === 'projects' && <Projects user={user} canEdit={canEditPage('projects', user?.role)} />}
          {page === 'employees' && <Employees user={user} canEdit={canEditPage('employees', user?.role)} />}
        </main>
      </div>
    </div>
  )
}