import { useState } from 'react'
import { Leave } from '../types'

const mockLeaves: Leave[] = [
  {
    id: '1',
    employeeId: '1',
    leaveType: 'vacation',
    startDate: '2024-06-15',
    endDate: '2024-06-22',
    reason: 'Family vacation',
    status: 'approved',
  },
  {
    id: '2',
    employeeId: '2',
    leaveType: 'sick',
    startDate: '2024-06-10',
    endDate: '2024-06-10',
    reason: 'Medical appointment',
    status: 'pending',
  },
  {
    id: '3',
    employeeId: '3',
    leaveType: 'personal',
    startDate: '2024-06-20',
    endDate: '2024-06-21',
    reason: 'Personal matters',
    status: 'rejected',
  },
]

export default function Leave() {
  const [leaves, setLeaves] = useState<Leave[]>(mockLeaves)
  const [showForm, setShowForm] = useState(false)
  const [newLeave, setNewLeave] = useState<Partial<Leave>>({})

  const handleAddLeave = () => {
    if (newLeave.employeeId && newLeave.startDate) {
      const leave: Leave = {
        id: Date.now().toString(),
        employeeId: newLeave.employeeId || '',
        leaveType: newLeave.leaveType || 'personal',
        startDate: newLeave.startDate || '',
        endDate: newLeave.endDate || newLeave.startDate || '',
        reason: newLeave.reason || '',
        status: 'pending',
      }
      setLeaves([...leaves, leave])
      setNewLeave({})
      setShowForm(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#d1fae5'
      case 'pending':
        return '#fef3c7'
      case 'rejected':
        return '#fee2e2'
      default:
        return '#f3f4f6'
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#065f46'
      case 'pending':
        return '#92400e'
      case 'rejected':
        return '#991b1b'
      default:
        return '#374151'
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Leave Requests</h2>
        <p>Manage employee leave applications</p>
      </div>

      <div>
        <button className="button" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Request Leave'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h3>Request Leave</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
            <input
              type="text"
              placeholder="Employee ID"
              value={newLeave.employeeId || ''}
              onChange={(e) => setNewLeave({ ...newLeave, employeeId: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              value={newLeave.leaveType || 'personal'}
              onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value as any })}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="personal">Personal</option>
              <option value="sick">Sick</option>
              <option value="vacation">Vacation</option>
              <option value="other">Other</option>
            </select>
            <input
              type="date"
              placeholder="Start Date"
              value={newLeave.startDate || ''}
              onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="date"
              placeholder="End Date"
              value={newLeave.endDate || ''}
              onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <textarea
              placeholder="Reason"
              value={newLeave.reason || ''}
              onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', gridColumn: '1 / -1' }}
              rows={3}
            />
          </div>
          <button className="button" onClick={handleAddLeave} style={{ marginTop: '15px' }}>
            Submit Request
          </button>
        </div>
      )}

      <div className="card" style={{ marginTop: '20px' }}>
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.employeeId}</td>
                <td style={{ textTransform: 'capitalize' }}>{leave.leaveType}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.reason}</td>
                <td>
                  <span
                    style={{
                      padding: '5px 10px',
                      borderRadius: '4px',
                      backgroundColor: getStatusColor(leave.status),
                      color: getStatusTextColor(leave.status),
                      textTransform: 'capitalize',
                    }}
                  >
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
