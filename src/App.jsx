import { useState } from 'react'
import Login from './components/Login'
import TimeSheet from './components/TimeSheet'
import './App.css'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('timesheet')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Function to get user role label
  const getRoleLabel = (role) => {
    const roleLabels = {
      'user': 'Обычный пользователь',
      'project_manager': 'Менеджер проектов',
      'hr_manager': 'HR менеджер'
    }
    return roleLabels[role] || 'Пользователь'
  }

  // Function to check if user can edit a page
  const canEditPage = (pageName, userRole) => {
    const editPermissions = {
      'timesheet': ['user', 'project_manager', 'hr_manager'], // Everyone can edit timesheet
      'projects': ['project_manager'], // Only project managers can edit projects
      'employees': ['hr_manager'] // Only HR managers can edit employees
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
            <li><button className={page === 'timesheet' ? 'active' : ''} onClick={() => setPage('timesheet')}>⏱️ Учет времени</button></li>
            <li><button className={page === 'projects' ? 'active' : ''} onClick={() => setPage('projects')}>📊 Проекты</button></li>
            <li><button className={page === 'employees' ? 'active' : ''} onClick={() => setPage('employees')}>👥 Сотрудники</button></li>
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

function Projects({ user, canEdit }) {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Сайт', status: 'В работе', lead: 'Иван Петров' },
    { id: 2, name: 'Мобильное приложение', status: 'Планирование', lead: 'Мария Сидорова' },
    { id: 3, name: 'Система отчетности', status: 'Завершено', lead: 'Никита Аминов' },
  ])
  const [projectName, setProjectName] = useState('')
  const [projectLead, setProjectLead] = useState('')
  const [projectStatus, setProjectStatus] = useState('Планирование')
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProject, setEditingProject] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const filteredProjects = projects.filter(proj =>
    proj.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleRowSelection = (id) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const selectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(filteredProjects.map(p => p.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const addProject = () => {
    if (!projectName || !projectLead) {
      alert('Заполните все поля')
      return
    }
    setProjects([...projects, { id: Date.now(), name: projectName, status: projectStatus, lead: projectLead }])
    setProjectName('')
    setProjectLead('')
    setProjectStatus('Планирование')
    alert('Проект добавлен')
  }

  const handleDelete = () => {
    if (selectedRows.size === 0) {
      alert('Выберите проекты для удаления')
      return
    }
    const confirmed = confirm(`Вы уверены? Будет удалено ${selectedRows.size} проект(ов)`)
    if (confirmed) {
      setProjects(projects.filter(p => !selectedRows.has(p.id)))
      setSelectedRows(new Set())
      alert('Проекты удалены')
    }
  }

  const handleEdit = () => {
    if (selectedRows.size !== 1) {
      alert('Выберите один проект для редактирования')
      return
    }
    const projectId = Array.from(selectedRows)[0]
    const project = projects.find(p => p.id === projectId)
    setEditingProject({ ...project })
    setShowModal(true)
  }

  const handleSaveEdit = () => {
    if (!editingProject.name || !editingProject.lead) {
      alert('Заполните все поля')
      return
    }
    setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p))
    setShowModal(false)
    setEditingProject(null)
    setSelectedRows(new Set())
    alert('Проект обновлен')
  }

  return (
    <div className="page">
      <h2>Проекты</h2>
      {canEdit && (
        <div className="add-form">
          <input type="text" placeholder="Название проекта" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
          <input type="text" placeholder="Руководитель" value={projectLead} onChange={(e) => setProjectLead(e.target.value)} />
          <select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
            <option>Планирование</option>
            <option>В работе</option>
            <option>Завершено</option>
          </select>
          <button onClick={addProject}>Добавить</button>
        </div>
      )}

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Поиск по названию проекта..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '30px' }}>
              <input type="checkbox" onChange={selectAll} checked={selectedRows.size === filteredProjects.length && filteredProjects.length > 0} />
            </th>
            <th>Название</th>
            <th>Статус</th>
            <th>Руководитель</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map(proj => (
            <tr key={proj.id} className={selectedRows.has(proj.id) ? 'selected' : ''}>
              <td>
                <input type="checkbox" checked={selectedRows.has(proj.id)} onChange={() => toggleRowSelection(proj.id)} />
              </td>
              <td>{proj.name}</td>
              <td>
                <span className={`status-badge status-${proj.status.toLowerCase().replace(/\s/g, '-')}`}>
                  {proj.status}
                </span>
              </td>
              <td>{proj.lead}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <p>Всего проектов: {filteredProjects.length}</p>
        {canEdit && (
          <div className="action-buttons">
            <button className="btn-action btn-delete" onClick={handleDelete}>Удалить</button>
            <button className="btn-action btn-edit" onClick={handleEdit}>Редактировать</button>
          </div>
        )}
      </div>

      {showModal && editingProject && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Редактировать проект</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Название проекта</label>
                <input type="text" value={editingProject.name} onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Руководитель</label>
                <input type="text" value={editingProject.lead} onChange={(e) => setEditingProject({ ...editingProject, lead: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Статус</label>
                <select value={editingProject.status} onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}>
                  <option>Планирование</option>
                  <option>В работе</option>
                  <option>Завершено</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Отмена</button>
              <button className="btn-save" onClick={handleSaveEdit}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Employees({ user, canEdit }) {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Иван Петров', position: 'Разработчик', dept: 'IT', email: 'ivan@example.com' },
    { id: 2, name: 'Мария Сидорова', position: 'HR менеджер', dept: 'HR', email: 'maria@example.com' },
  ])
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [dept, setDept] = useState('IT')
  const [email, setEmail] = useState('')
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleRowSelection = (id) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const selectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(filteredEmployees.map(e => e.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const addEmployee = () => {
    if (!name || !position || !email) {
      alert('Заполните ФИО, Должность и Email')
      return
    }
    if (!email.includes('@')) {
      alert('Введите корректный email')
      return
    }
    setEmployees([...employees, { id: Date.now(), name, position, dept, email }])
    setName('')
    setPosition('')
    setDept('IT')
    setEmail('')
    alert('Сотрудник добавлен')
  }

  const handleDelete = () => {
    if (selectedRows.size === 0) {
      alert('Выберите сотрудников для удаления')
      return
    }
    const confirmed = confirm(`Вы уверены? Будет удалено ${selectedRows.size} сотрудник(ов)`)
    if (confirmed) {
      setEmployees(employees.filter(e => !selectedRows.has(e.id)))
      setSelectedRows(new Set())
      alert('Сотрудники удалены')
    }
  }

  const handleEdit = () => {
    if (selectedRows.size !== 1) {
      alert('Выберите одного сотрудника для редактирования')
      return
    }
    const employeeId = Array.from(selectedRows)[0]
    const employee = employees.find(e => e.id === employeeId)
    setEditingEmployee({ ...employee })
    setShowModal(true)
  }

  const handleSaveEdit = () => {
    if (!editingEmployee.name || !editingEmployee.position || !editingEmployee.email) {
      alert('Заполните ФИО, Должность и Email')
      return
    }
    if (!editingEmployee.email.includes('@')) {
      alert('Введите корректный email')
      return
    }
    setEmployees(employees.map(e => e.id === editingEmployee.id ? editingEmployee : e))
    setShowModal(false)
    setEditingEmployee(null)
    setSelectedRows(new Set())
    alert('Сотрудник обновлен')
  }

  return (
    <div className="page">
      <h2>Сотрудники</h2>
      {canEdit && (
        <div className="add-form">
          <input type="text" placeholder="ФИО" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Должность" value={position} onChange={(e) => setPosition(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <select value={dept} onChange={(e) => setDept(e.target.value)}>
            <option>IT</option>
            <option>HR</option>
            <option>Продажи</option>
            <option>Финансы</option>
            <option>Маркетинг</option>
          </select>
          <button onClick={addEmployee}>Добавить</button>
        </div>
      )}

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Поиск по ФИО или должности..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '30px' }}>
              <input type="checkbox" onChange={selectAll} checked={selectedRows.size === filteredEmployees.length && filteredEmployees.length > 0} />
            </th>
            <th>ФИО</th>
            <th>Должность</th>
            <th>Отдел</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.id} className={selectedRows.has(emp.id) ? 'selected' : ''}>
              <td>
                <input type="checkbox" checked={selectedRows.has(emp.id)} onChange={() => toggleRowSelection(emp.id)} />
              </td>
              <td>{emp.name}</td>
              <td>{emp.position}</td>
              <td>{emp.dept}</td>
              <td>{emp.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <p>Всего сотрудников: {filteredEmployees.length}</p>
        {canEdit && (
          <div className="action-buttons">
            <button className="btn-action btn-delete" onClick={handleDelete}>Удалить</button>
            <button className="btn-action btn-edit" onClick={handleEdit}>Редактировать</button>
          </div>
        )}
      </div>

      {showModal && editingEmployee && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Редактировать сотрудника</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>ФИО</label>
                <input type="text" value={editingEmployee.name} onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Должность</label>
                <input type="text" value={editingEmployee.position} onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={editingEmployee.email} onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Отдел</label>
                <select value={editingEmployee.dept} onChange={(e) => setEditingEmployee({ ...editingEmployee, dept: e.target.value })}>
                  <option>IT</option>
                  <option>HR</option>
                  <option>Продажи</option>
                  <option>Финансы</option>
                  <option>Маркетинг</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Отмена</button>
              <button className="btn-save" onClick={handleSaveEdit}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
