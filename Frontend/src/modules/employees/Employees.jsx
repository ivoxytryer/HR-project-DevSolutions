import { useState } from 'react'

export default function Employees({ user, canEdit }) {
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
