import { useState, useEffect, useMemo } from 'react'
import { attendanceAPI, employeeAPI, projectAPI } from '../../shared/services/api'
import './TimeSheet.css'

export default function TimeSheet({ user }) {
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedRows, setSelectedRows] = useState(new Set())
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedProject, setSelectedProject] = useState('Все')
  const [status, setStatus] = useState('Все')
  const [startDate, setStartDate] = useState(new Date(2026, 5, 1).toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(new Date(2026, 5, 30).toISOString().slice(0, 10))
  const [editingTask, setEditingTask] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [hours, setHours] = useState('')
  const [taskDate, setTaskDate] = useState(new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState('')

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(NaN)

    if (dateStr.includes('.')) {
      const parts = dateStr.split('.').map(Number)
      if (parts.length !== 3) return new Date(NaN)
      const [day, month, year] = parts
      return new Date(year, month - 1, day)
    }

    return new Date(dateStr)
  }

  const formatDate = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const formatDateForBackend = (dateStr) => {
    const date = parseDate(dateStr)
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''
    return date.toISOString().slice(0, 10)
  }

  const formatDisplayDate = (dateStr) => {
    const date = parseDate(dateStr)
    return formatDate(date) || dateStr
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [tasksRes, employeesRes, projectsRes] = await Promise.all([
        attendanceAPI.getAll().catch(() => ({ data: [] })),
        employeeAPI.getAll().catch(() => ({ data: [] })),
        projectAPI.getAll().catch(() => ({ data: [] }))
      ])
      
      setTasks(tasksRes.data || [])
      const emps = employeesRes.data || []
      setEmployees(emps)
      setProjects(projectsRes.data || [])
      
      setSelectedEmployee(null)
      setError(null)
    } catch (err) {
      setError('Ошибка при загрузке данных')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // When employees load, if current user is employee, auto-select their record
  useEffect(() => {
    if (!user) return
    if (user.role === 'employee' && employees.length > 0) {
      const mine = employees.find(e => e.user_id === user.id)
      if (mine) setSelectedEmployee(mine.id)
    }
  }, [user, employees])

  const start = parseDate(startDate)
  const end = parseDate(endDate)

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = parseDate(task.date)
      const statusMatch = status === 'Все' || task.status === status
      const projectMatch = selectedProject === 'Все' || task.project_id === parseInt(selectedProject)
      const employeeMatch = !selectedEmployee || task.employee_id === selectedEmployee
      const dateMatch = taskDate >= start && taskDate <= end
      return statusMatch && projectMatch && employeeMatch && dateMatch
    })
  }, [tasks, status, selectedProject, selectedEmployee, start, end])

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

  const handleDelete = async () => {
    if (selectedRows.size === 0) {
      alert('Выберите записи для удаления')
      return
    }
    const confirmed = confirm(`Вы уверены? Будет удалено ${selectedRows.size} запись(ей)`)
    if (confirmed) {
      try {
        for (const id of selectedRows) {
          await attendanceAPI.delete(String(id))
        }
        setSelectedRows(new Set())
        alert('Записи удалены')
        fetchAllData()
      } catch (err) {
        alert('Ошибка при удалении')
        console.error(err)
      }
    }
  }

  const handleNew = () => {
    const isoDate = startDate
    setEditingTask({
      id: null,
      employee_id: selectedEmployee || employees[0]?.id || 1,
      project_id: selectedProject !== 'Все' ? parseInt(selectedProject) : (projects[0]?.id || 1),
      hours: '',
      date: isoDate,
      status: 'Черновик',
      description: ''
    })
    setHours('')
    setTaskDate(isoDate)
    setDescription('')
    setShowModal(true)
  }

  const handleEdit = (task) => {
    const isoDate = formatDateForBackend(task.date) || new Date().toISOString().slice(0, 10)
    setEditingTask(task)
    setHours(String(task.hours || ''))
    setTaskDate(isoDate)
    setDescription(task.description || '')
    setShowModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingTask.employee_id || !editingTask.project_id || !hours) {
      alert('Заполните все поля')
      return
    }

    try {
      const formattedDate = formatDateForBackend(taskDate)
      if (!formattedDate) {
        alert('Укажите корректную дату в формате YYYY-MM-DD или DD.MM.YYYY')
        return
      }

      const data = {
        employee_id: editingTask.employee_id,
        project_id: editingTask.project_id,
        hours: parseFloat(hours),
        date: formattedDate,
        description
      }

      if (editingTask.id) {
        await attendanceAPI.update(String(editingTask.id), data)
        alert('Запись обновлена')
      } else {
        await attendanceAPI.create(data)
        alert('Запись добавлена')
      }
      setShowModal(false)
      setEditingTask(null)
      setSelectedRows(new Set())
      fetchAllData()
    } catch (err) {
      alert('Ошибка при сохранении')
      console.error(err)
    }
  }

  const getEmployeeName = (empId) => {
    const emp = employees.find(e => e.id === empId)
    return emp ? `${emp.first_name} ${emp.last_name}` : `ID: ${empId}`
  }

  const getProjectName = (projId) => {
    const proj = projects.find(p => p.id === projId)
    return proj ? proj.name : `ID: ${projId}`
  }

  const totalHours = filteredTasks.reduce((sum, task) => sum + (parseFloat(task.hours) || 0), 0)

  if (loading) return <div className="loading">Загрузка данных...</div>

  return (
    <div className="timesheet-container">
      <h2>Учет времени</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-section">
        <div className="filter-group">
          <label>Сотрудник</label>
          {user?.role === 'employee' ? (
            <select value={selectedEmployee || ''} disabled>
              {employees
                .filter(emp => emp.user_id === user.id)
                .map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
            </select>
          ) : (
            <select value={selectedEmployee || ''} onChange={(e) => setSelectedEmployee(parseInt(e.target.value) || null)}>
              <option value="">Все</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="filter-group">
          <label>Проект</label>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option>Все</option>
            {projects.map(proj => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
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

        <div className="date-range">
          <label>Дата начала:</label>
          <div className="date-wrapper">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10h5v5H7z" opacity=".0"></path><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <label>Дата окончания:</label>
          <div className="date-wrapper">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10h5v5H7z" opacity=".0"></path><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <button className="btn-add" onClick={handleNew}>+ Добавить</button>
      </div>

      {filteredTasks.length === 0 ? (
        <p>Нет записей для выбранных критериев</p>
      ) : (
        <div className="table-wrapper">
          <table className="timesheet-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" onChange={selectAll} checked={selectedRows.size === filteredTasks.length && filteredTasks.length > 0} />
                </th>
                <th>Сотрудник</th>
                <th>Проект</th>
                <th>Часы</th>
                <th>Описание</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <input type="checkbox" checked={selectedRows.has(task.id)} onChange={() => toggleRowSelection(task.id)} />
                  </td>
                  <td>{getEmployeeName(task.employee_id)}</td>
                  <td>{getProjectName(task.project_id)}</td>
                  <td>{task.hours}</td>
                  <td>{task.description}</td>
                  <td>{formatDisplayDate(task.date)}</td>
                  <td>{task.status}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(task)}>✎</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-hours">Всего часов: {totalHours.toFixed(2)}</div>
        </div>
      )}

      {selectedRows.size > 0 && (
        <button onClick={handleDelete} className="delete-btn">
          Удалить ({selectedRows.size})
        </button>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingTask.id ? 'Редактировать' : 'Новая запись'}</h3>
            
            <div className="form-group">
              <label>Сотрудник</label>
              <select value={editingTask.employee_id || ''} onChange={(e) => setEditingTask({...editingTask, employee_id: parseInt(e.target.value)})}>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Проект</label>
              <select value={editingTask.project_id || ''} onChange={(e) => setEditingTask({...editingTask, project_id: parseInt(e.target.value)})}>
                {projects.map(proj => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Часы</label>
              <input type="number" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="0" />
            </div>

            <div className="form-group">
              <label>Дата</label>
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Описание</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Опишите сделанную работу" rows="3" />
            </div>

            <div className="modal-buttons">
              <button onClick={handleSaveEdit} className="btn-save">Сохранить</button>
              <button onClick={() => setShowModal(false)} className="btn-cancel">Отмена</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 90%;
        }
        
        .form-group {
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
        }
        
        .form-group label {
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .form-group input,
        .form-group select {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .modal-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        .btn-save,
        .btn-cancel {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
        
        .btn-save {
          background-color: #4CAF50;
          color: white;
        }
        
        .btn-cancel {
          background-color: #f44336;
          color: white;
        }
      `}</style>
    </div>
  )
}
