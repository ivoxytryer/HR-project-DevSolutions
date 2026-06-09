import { useState } from 'react'

export default function Projects({ user, canEdit }) {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Сайт', status: 'В работе', lead: 'Иван Петров', type: 'Разработка', startDate: '2026-01-15', endDate: '2026-06-30' },
    { id: 2, name: 'Мобильное приложение', status: 'Планирование', lead: 'Мария Сидорова', type: 'Дизайн', startDate: '2026-03-01', endDate: '2026-09-30' },
    { id: 3, name: 'Система отчетности', status: 'Завершено', lead: 'Никита Аминов', type: 'Разработка', startDate: '2025-10-01', endDate: '2026-05-31' },
  ])
  const [projectName, setProjectName] = useState('')
  const [projectLead, setProjectLead] = useState('')
  const [projectStatus, setProjectStatus] = useState('Планирование')
  const [projectType, setProjectType] = useState('Разработка')
  const [projectStartDate, setProjectStartDate] = useState('')
  const [projectEndDate, setProjectEndDate] = useState('')
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
    if (!projectName || !projectLead || !projectType || !projectStartDate || !projectEndDate) {
      alert('Заполните все поля')
      return
    }
    setProjects([...projects, { id: Date.now(), name: projectName, status: projectStatus, lead: projectLead, type: projectType, startDate: projectStartDate, endDate: projectEndDate }])
    setProjectName('')
    setProjectLead('')
    setProjectStatus('Планирование')
    setProjectType('Разработка')
    setProjectStartDate('')
    setProjectEndDate('')
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
    if (!editingProject.name || !editingProject.lead || !editingProject.type || !editingProject.startDate || !editingProject.endDate) {
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
          <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
            <option>Разработка</option>
            <option>Дизайн</option>
            <option>Тестирование</option>
            <option>Консультация</option>
          </select>
          <input type="date" value={projectStartDate} onChange={(e) => setProjectStartDate(e.target.value)} title="Дата начала" />
          <input type="date" value={projectEndDate} onChange={(e) => setProjectEndDate(e.target.value)} title="Дата окончания" />
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
            <th>Тип</th>
            <th>Дата начала</th>
            <th>Дата окончания</th>
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
              <td>{proj.type}</td>
              <td>{proj.startDate}</td>
              <td>{proj.endDate}</td>
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
                <label>Тип</label>
                <select value={editingProject.type} onChange={(e) => setEditingProject({ ...editingProject, type: e.target.value })}>
                  <option>Разработка</option>
                  <option>Дизайн</option>
                  <option>Тестирование</option>
                  <option>Консультация</option>
                </select>
              </div>
              <div className="form-group">
                <label>Дата начала</label>
                <input type="date" value={editingProject.startDate} onChange={(e) => setEditingProject({ ...editingProject, startDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Дата окончания</label>
                <input type="date" value={editingProject.endDate} onChange={(e) => setEditingProject({ ...editingProject, endDate: e.target.value })} />
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
