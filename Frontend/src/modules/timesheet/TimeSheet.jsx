import { useState, useMemo } from 'react'
import './TimeSheet.css'

export default function TimeSheet({ user }) {
  const [tasks, setTasks] = useState([
    { id: 1, project: 'Сайт', activity: 'Frontend', type: 'Разработка', time: '3 часа', description: 'Разработка интерфейса учёта рабочего времени', date: '01.06.2026', status: 'Черновик' },
    { id: 2, project: 'Сайт', activity: 'Backend', type: 'Разработка', time: '3 часа', description: 'Разработка интерфейса учёта рабочего времени', date: '02.06.2026', status: 'Утверждено' },
    { id: 3, project: 'Сайт', activity: 'Testing', type: 'Разработка', time: '3 часа', description: 'Разработка интерфейса учёта рабочего времени', date: '03.06.2026', status: 'Отправлено' },
    { id: 4, project: 'Мобильное приложение', activity: 'Design', type: 'Дизайн', time: '2 часа', description: 'Дизайн интерфейса приложения', date: '05.06.2026', status: 'Утверждено' },
    { id: 5, project: 'Система отчетности', activity: 'Database', type: 'Разработка', time: '4 часа', description: 'Проектирование базы данных', date: '06.06.2026', status: 'Черновик' },
    { id: 6, project: 'Сайт', activity: 'API', type: 'Разработка', time: '3 часа', description: 'Разработка REST API', date: '08.06.2026', status: 'Утверждено' },
    { id: 7, project: 'Мобильное приложение', activity: 'Frontend', type: 'Разработка', time: '3 часа', description: 'Разработка мобильного интерфейса', date: '09.06.2026', status: 'Отправлено' },
  ])

  const [selectedRows, setSelectedRows] = useState(new Set())
  const [employee, setEmployee] = useState('Никита Аминов')
  const [project, setProject] = useState('Все')
  const [status, setStatus] = useState('Все')
  const [periodType, setPeriodType] = useState('Месяц')
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1))
  const [editingTask, setEditingTask] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Helper functions for date operations
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.').map(Number)
    return new Date(year, month - 1, day)
  }

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const getDateRange = (periodType, baseDate) => {
    const date = new Date(baseDate)
    let start, end

    switch (periodType) {
      case 'День':
        start = new Date(date)
        end = new Date(date)
        break
      case 'Неделя':
        start = new Date(date)
        const day = start.getDay()
        const diff = start.getDate() - day + (day === 0 ? -6 : 1)
        start.setDate(diff)
        end = new Date(start)
        end.setDate(end.getDate() + 6)
        break
      case 'Месяц':
        start = new Date(date.getFullYear(), date.getMonth(), 1)
        end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        break
      default:
        start = new Date(date)
        end = new Date(date)
    }

    return { start, end }
  }

  const { start: startDate, end: endDate } = getDateRange(periodType, currentDate)

  const handlePeriodChange = (newPeriodType) => {
    setPeriodType(newPeriodType)
  }

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    switch (periodType) {
      case 'День':
        newDate.setDate(newDate.getDate() - 1)
        break
      case 'Неделя':
        newDate.setDate(newDate.getDate() - 7)
        break
      case 'Месяц':
        newDate.setMonth(newDate.getMonth() - 1)
        break
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    switch (periodType) {
      case 'День':
        newDate.setDate(newDate.getDate() + 1)
        break
      case 'Неделя':
        newDate.setDate(newDate.getDate() + 7)
        break
      case 'Месяц':
        newDate.setMonth(newDate.getMonth() + 1)
        break
    }
    setCurrentDate(newDate)
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = parseDate(task.date)
      const statusMatch = status === 'Все' || task.status === status
      const projectMatch = project === 'Все' || task.project === project
      const dateMatch = taskDate >= startDate && taskDate <= endDate
      return statusMatch && projectMatch && dateMatch
    })
  }, [tasks, status, project, startDate, endDate])

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
      setSelectedRows(new Set(filteredTasks.map(t => t.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleDelete = () => {
    if (selectedRows.size === 0) {
      alert('Выберите задачи для удаления')
      return
    }
    const confirmed = confirm(`Вы уверены? Будет удалено ${selectedRows.size} записи(ей)`)
    if (confirmed) {
      setTasks(tasks.filter(t => !selectedRows.has(t.id)))
      setSelectedRows(new Set())
      alert('Задачи удалены')
    }
  }

  const handleEdit = () => {
    if (selectedRows.size !== 1) {
      alert('Выберите одну задачу для редактирования')
      return
    }
    const taskId = Array.from(selectedRows)[0]
    const task = tasks.find(t => t.id === taskId)
    setEditingTask({ ...task })
    setShowModal(true)
  }

  const handleNew = () => {
    setEditingTask({
      id: null,
      project: '',
      activity: '',
      type: '',
      time: '',
      description: '',
      date: formatDate(new Date()),
      status: 'Черновик'
    })
    setShowModal(true)
  }

  const handleSaveEdit = () => {
    if (!editingTask.project || !editingTask.activity) {
      alert('Заполните Проект и Деятельность')
      return
    }
    if (editingTask.id) {
      setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t))
      alert('Задача обновлена')
    } else {
      const newTask = { ...editingTask, id: Date.now() }
      setTasks([newTask, ...tasks])
      alert('Задача добавлена')
    }
    setShowModal(false)
    setEditingTask(null)
    setSelectedRows(new Set())
  }

  const handleApprove = () => {
    if (selectedRows.size === 0) {
      alert('Выберите задачи для отправки')
      return
    }
    setTasks(tasks.map(t => 
      selectedRows.has(t.id) ? { ...t, status: 'Отправлено' } : t
    ))
    setSelectedRows(new Set())
    alert('Выбранные задачи отправлены на утверждение')
  }

  const totalTime = filteredTasks.reduce((sum, task) => {
    const hours = parseInt(task.time) || 0
    return sum + hours
  }, 0)

  return (
    <div className="timesheet-container">
      <div className="timesheet-header">
        <div className="header-title">
          <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Clipboard */}
            <rect x="15" y="20" width="70" height="75" rx="3" fill="none" stroke="#667eea" strokeWidth="3"/>
            <rect x="35" y="10" width="30" height="15" rx="2" fill="#667eea"/>
            {/* Time entries bars */}
            <rect x="25" y="35" width="8" height="20" fill="#667eea"/>
            <rect x="37" y="30" width="8" height="25" fill="#667eea"/>
            <rect x="49" y="38" width="8" height="17" fill="#667eea"/>
            <rect x="61" y="32" width="8" height="23" fill="#667eea"/>
            {/* Checkmark */}
            <circle cx="75" cy="65" r="8" fill="#4CAF50"/>
            <path d="M72 65L74 67L78 63" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <h2>Учет времени</h2>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Сотрудник</label>
          <select value={employee} onChange={(e) => setEmployee(e.target.value)}>
            <option>Никита Аминов</option>
            <option>Иван Петров</option>
            <option>Мария Сидорова</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Проект</label>
          <select value={project} onChange={(e) => setProject(e.target.value)}>
            <option>Все</option>
            <option>Сайт</option>
            <option>Мобильное приложение</option>
            <option>Система отчетности</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Статус</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Все</option>
            <option>Черновик</option>
            <option>Отправлено</option>
            <option>Утверждено</option>
          </select>
        </div>

        <div className="period-controls">
          <button className={periodType === 'День' ? 'active' : ''} onClick={() => handlePeriodChange('День')}>День</button>
          <button className={periodType === 'Неделя' ? 'active' : ''} onClick={() => handlePeriodChange('Неделя')}>Неделя</button>
          <button className={periodType === 'Месяц' ? 'active' : ''} onClick={() => handlePeriodChange('Месяц')}>Месяц</button>
        </div>

        <div className="date-range">
          <input type="text" value={formatDate(startDate)} readOnly />
          <span>-</span>
          <input type="text" value={formatDate(endDate)} readOnly />
          <button className="btn-nav" onClick={handlePrevious}>◀</button>
          <button className="btn-nav" onClick={handleNext}>▶</button>
        </div>

        <button className="btn-add" onClick={handleNew}>+</button>
      </div>

      <div className="table-wrapper">
        <table className="timesheet-table">
          <thead>
            <tr>
              <th style={{ width: '30px' }}>
                <input type="checkbox" onChange={selectAll} checked={selectedRows.size === filteredTasks.length && filteredTasks.length > 0} />
              </th>
              <th>Проект</th>
              <th>Деятельность</th>
              <th>Тип задачи</th>
              <th>Время</th>
              <th>Описание</th>
              <th>Дата</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id} className={selectedRows.has(task.id) ? 'selected' : ''}>
                <td>
                  <input type="checkbox" checked={selectedRows.has(task.id)} onChange={() => toggleRowSelection(task.id)} />
                </td>
                <td>{task.project}</td>
                <td>{task.activity}</td>
                <td>{task.type}</td>
                <td>{task.time}</td>
                <td className="description">{task.description}</td>
                <td>{task.date}</td>
                <td>
                  <span className={`status-badge status-${task.status.toLowerCase().replace(/\s/g, '-')}`}>
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>Общее время: {totalTime}/40 ч.</p>
        <div className="action-buttons">
          <button className="btn-action btn-delete" onClick={handleDelete}>Удалить</button>
          <button className="btn-action btn-edit" onClick={handleEdit}>Редактировать</button>
          <button className="btn-action btn-approve" onClick={handleApprove}>Отправить на утверждение</button>
        </div>
      </div>

      {showModal && editingTask && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTask.id ? 'Редактировать задачу' : 'Создать задачу'}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Проект</label>
                <input type="text" value={editingTask.project} onChange={(e) => setEditingTask({ ...editingTask, project: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Деятельность</label>
                <input type="text" value={editingTask.activity} onChange={(e) => setEditingTask({ ...editingTask, activity: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Тип задачи</label>
                <input type="text" value={editingTask.type} onChange={(e) => setEditingTask({ ...editingTask, type: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Время</label>
                <input type="text" value={editingTask.time} onChange={(e) => setEditingTask({ ...editingTask, time: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} rows="4" />
              </div>
              <div className="form-group">
                <label>Дата</label>
                <input type="text" value={editingTask.date} onChange={(e) => setEditingTask({ ...editingTask, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Статус</label>
                <select value={editingTask.status} onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}>
                  <option>Черновик</option>
                  <option>Отправлено</option>
                  <option>Утверждено</option>
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
