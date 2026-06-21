import { useState, useEffect } from 'react'
import { projectAPI } from '../../shared/services/api'

// Date formatting utilities
const parseDate = (dateStr) => {
  if (!dateStr) return null
  // Handle dot format: "15.06.2026"
  if (dateStr.includes('.')) {
    const [day, month, year] = dateStr.split('.')
    return new Date(year, month - 1, day)
  }
  // Handle ISO format: "2026-06-15" or "2026-06-16T00:00:00Z"
  return new Date(dateStr)
}

const formatDate = (date) => {
  if (!date) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

const formatDateForBackend = (dateStr) => {
  if (!dateStr) return ''
  const date = parseDate(dateStr)
  return date ? date.toISOString().slice(0, 10) : dateStr
}

const formatDisplayDate = (dateStr) => {
  const date = parseDate(dateStr)
  return formatDate(date) || dateStr
}

export default function Projects({ user, canEdit }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [projectName, setProjectName] = useState('')
  const [projectStatus, setProjectStatus] = useState('Планирование')
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProject, setEditingProject] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await projectAPI.getAll()
      setProjects(response.data || [])
      setError(null)
    } catch (err) {
      setError('Ошибка при загрузке проектов')
      setProjects([])
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(proj =>
    (proj.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
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

  const addProject = async () => {
    if (!projectName) {
      alert('Заполните название проекта')
      return
    }
    try {
      await projectAPI.create({ 
        name: projectName, 
        status: projectStatus,
        start_date: '',
        end_date: ''
      })
      setProjectName('')
      setProjectStatus('Планирование')
      alert('Проект добавлен')
      fetchProjects()
    } catch (err) {
      alert('Ошибка при добавлении проекта')
      console.error('Error adding project:', err)
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

  const handleSaveEdit = async () => {
    if (!editingProject.name) {
      alert('Заполните название проекта')
      return
    }
    try {
      await projectAPI.update(String(editingProject.id), { 
        name: editingProject.name, 
        status: editingProject.status,
        start_date: editingProject.start_date,
        end_date: editingProject.end_date
      })
      setShowModal(false)
      setEditingProject(null)
      setSelectedRows(new Set())
      alert('Проект обновлен')
      fetchProjects()
    } catch (err) {
      alert('Ошибка при обновлении проекта')
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (selectedRows.size === 0) {
      alert('Выберите проекты для удаления')
      return
    }
    const confirmed = confirm(`Вы уверены? Будет удалено ${selectedRows.size} проект(ов)`)
    if (confirmed) {
      try {
        for (const id of selectedRows) {
          await projectAPI.delete(String(id))
        }
        setSelectedRows(new Set())
        alert('Проекты удалены')
        fetchProjects()
      } catch (err) {
        alert('Ошибка при удалении проектов')
        console.error('Error deleting projects:', err)
      }
    }
  }

  if (loading) return <div className="loading">Загрузка проектов...</div>

  return (
    <div className="projects-container">
      <h2>Проекты</h2>
      {error && <div className="error-message">{error}</div>}

      {canEdit && (
        <div className="add-section">
          <div className="form-group">
            <input
              type="text"
              placeholder="Название проекта"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
              <option>Планирование</option>
              <option>В работе</option>
              <option>Завершено</option>
            </select>
          </div>
          <button onClick={addProject}>Добавить проект</button>
        </div>
      )}

      <div className="search-section">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <p>Проектов не найдено</p>
      ) : (
        <table>
          <thead>
            <tr>
              {canEdit && (
                <th>
                  <input type="checkbox" onChange={selectAll} checked={selectedRows.size === filteredProjects.length && filteredProjects.length > 0} />
                </th>
              )}
              <th>Название</th>
              <th>Дата начала</th>
              <th>Дата окончания</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((proj) => (
              <tr key={proj.id}>
                {canEdit && (
                  <td>
                    <input type="checkbox" checked={selectedRows.has(proj.id)} onChange={() => toggleRowSelection(proj.id)} />
                  </td>
                )}
                <td>{proj.name}</td>
                <td>{formatDisplayDate(proj.start_date) || '-'}</td>
                <td>{formatDisplayDate(proj.end_date) || '-'}</td>
                <td>{proj.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {canEdit && selectedRows.size > 0 && (
        <div className="action-buttons action-buttons--align">
          <button onClick={handleEdit} className="btn-edit btn-action">
            Редактировать
          </button>
          <button onClick={handleDelete} className="btn-delete btn-action">
            Удалить выбранные ({selectedRows.size})
          </button>
        </div>
      )}

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
                <label>Дата начала</label>
                <input type="date" value={editingProject.start_date || ''} onChange={(e) => setEditingProject({ ...editingProject, start_date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Дата окончания</label>
                <input type="date" value={editingProject.end_date || ''} onChange={(e) => setEditingProject({ ...editingProject, end_date: e.target.value })} />
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
