import { useState, useEffect } from 'react'
import { employeeAPI } from '../../shared/services/api'

const DEPARTMENTS = {
  1: { name: 'IT', type: 'основное' },
  2: { name: 'HR', type: 'основное' },
  3: { name: 'Finance', type: 'основное' },
  4: { name: 'IT', type: 'удаленное' },
  5: { name: 'HR', type: 'удаленное' },
  6: { name: 'Sales', type: 'удаленное' }
}

const getDepartmentDisplay = (deptId) => {
  const dept = DEPARTMENTS[deptId]
  return dept ? `${dept.name} (${dept.type})` : `Отдел ${deptId}`
}

export default function Employees({ user, canEdit }) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [deptId, setDeptId] = useState(1)
  const [position, setPosition] = useState('employee')
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await employeeAPI.getAll()
      setEmployees(response.data || [])
      setError(null)
    } catch (err) {
      setError('Ошибка при загрузке сотрудников')
      setEmployees([])
      console.error('Error fetching employees:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredEmployees = employees.filter(emp =>
    (emp.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (emp.last_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
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

  const addEmployee = async () => {
    if (!firstName || !lastName || !email) {
      alert('Заполните имя, фамилию и email')
      return
    }
    try {
      await employeeAPI.create({ 
        first_name: firstName, 
        last_name: lastName, 
        email: email,
        department_id: deptId,
        position: position
      })
      setFirstName('')
      setLastName('')
      setEmail('')
      setDeptId(1)
      setPosition('employee')
      alert('Сотрудник добавлен')
      fetchEmployees()
    } catch (err) {
      alert('Ошибка при добавлении сотрудника')
      console.error('Error adding employee:', err)
    }
  }

  const handleDelete = async () => {
    if (selectedRows.size === 0) {
      alert('Выберите сотрудников для удаления')
      return
    }
    const confirmed = confirm(`Вы уверены? Будет удалено ${selectedRows.size} сотрудник(ов)`)
    if (confirmed) {
      try {
        for (const id of selectedRows) {
          await employeeAPI.delete(String(id))
        }
        setSelectedRows(new Set())
        alert('Сотрудники удалены')
        fetchEmployees()
      } catch (err) {
        alert('Ошибка при удалении сотрудников')
        console.error('Error deleting employees:', err)
      }
    }
  }

  const handleEdit = () => {
    if (selectedRows.size !== 1) {
      alert('Выберите одного сотрудника для редактирования')
      return
    }
    const employeeId = Array.from(selectedRows)[0]
    const employee = employees.find(e => e.id === employeeId)
    setEditingEmployee({ 
      ...employee,
      department_id: employee.department_id || 1
    })
    setShowModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingEmployee.first_name || !editingEmployee.last_name || !editingEmployee.email) {
      alert('Заполните имя, фамилию и email')
      return
    }
    try {
      await employeeAPI.update(String(editingEmployee.id), { 
        first_name: editingEmployee.first_name, 
        last_name: editingEmployee.last_name, 
        email: editingEmployee.email,
        department_id: editingEmployee.department_id,
        position: editingEmployee.position
      })
      setShowModal(false)
      setEditingEmployee(null)
      setSelectedRows(new Set())
      alert('Сотрудник обновлен')
      fetchEmployees()
    } catch (err) {
      alert('Ошибка при обновлении сотрудника')
      console.error(err)
    }
  }

  if (loading) return <div className="loading">Загрузка сотрудников...</div>

  return (
    <div className="employees-container">
      <h2>Сотрудники</h2>
      {error && <div className="error-message">{error}</div>}

      {canEdit && (
        <div className="add-section">
          <div className="form-group">
            <input
              type="text"
              placeholder="Имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <select value={deptId} onChange={(e) => setDeptId(parseInt(e.target.value))}>
              {Object.entries(DEPARTMENTS).map(([id, dept]) => (
                <option key={id} value={id}>{dept.name} ({dept.type})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <select value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="employee">Сотрудник</option>
              <option value="project_manager">Менеджер проектов</option>
              <option value="hr_manager">Менеджер сотрудников</option>
            </select>
          </div>
          <button onClick={addEmployee}>Добавить сотрудника</button>
        </div>
      )}

      <div className="search-section">
        <input
          type="text"
          placeholder="Поиск по имени или фамилии..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredEmployees.length === 0 ? (
        <p>Сотрудников не найдено</p>
      ) : (
        <table>
          <thead>
            <tr>
              {canEdit && (
                <th>
                  <input type="checkbox" onChange={selectAll} checked={selectedRows.size === filteredEmployees.length && filteredEmployees.length > 0} />
                </th>
              )}
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Email</th>
              <th>Подразделение</th>
              <th>Должность</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                {canEdit && (
                  <td>
                    <input type="checkbox" checked={selectedRows.has(emp.id)} onChange={() => toggleRowSelection(emp.id)} />
                  </td>
                )}
                <td>{emp.first_name}</td>
                <td>{emp.last_name}</td>
                <td>{emp.email}</td>
                <td>{getDepartmentDisplay(emp.department_id)}</td>
                <td>
                  {emp.position === 'employee' ? 'Сотрудник' : 
                   emp.position === 'project_manager' ? 'Менеджер проектов' : 
                   emp.position === 'hr_manager' ? 'Менеджер сотрудников' : emp.position}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {canEdit && selectedRows.size > 0 && (
        <div className="action-buttons">
          <button onClick={handleEdit} className="btn-edit btn-action">
            Редактировать
          </button>
          <button onClick={handleDelete} className="btn-delete btn-action">
            Удалить выбранные ({selectedRows.size})
          </button>
        </div>
      )}

      {showModal && editingEmployee && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Редактировать сотрудника</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Имя</label>
                <input type="text" value={editingEmployee.first_name} onChange={(e) => setEditingEmployee({ ...editingEmployee, first_name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Фамилия</label>
                <input type="text" value={editingEmployee.last_name} onChange={(e) => setEditingEmployee({ ...editingEmployee, last_name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={editingEmployee.email} onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Подразделение</label>
                <select value={editingEmployee.department_id || 1} onChange={(e) => setEditingEmployee({ ...editingEmployee, department_id: parseInt(e.target.value) })}>
                  {Object.entries(DEPARTMENTS).map(([id, dept]) => (
                    <option key={id} value={id}>{dept.name} ({dept.type})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Должность</label>
                <select value={editingEmployee.position || 'employee'} onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}>
                  <option value="employee">Сотрудник</option>
                  <option value="project_manager">Менеджер проектов</option>
                  <option value="hr_manager">Менеджер сотрудников</option>
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
