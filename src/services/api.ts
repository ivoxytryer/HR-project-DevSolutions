import axios from 'axios'
import { Employee, Department, Attendance, Leave } from '../types'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api'

// Employee endpoints
export const employeeAPI = {
  getAll: () => axios.get<Employee[]>(`${API_BASE_URL}/employees`),
  getById: (id: string) => axios.get<Employee>(`${API_BASE_URL}/employees/${id}`),
  create: (data: Partial<Employee>) => axios.post<Employee>(`${API_BASE_URL}/employees`, data),
  update: (id: string, data: Partial<Employee>) => axios.put<Employee>(`${API_BASE_URL}/employees/${id}`, data),
  delete: (id: string) => axios.delete(`${API_BASE_URL}/employees/${id}`),
}

// Department endpoints
export const departmentAPI = {
  getAll: () => axios.get<Department[]>(`${API_BASE_URL}/departments`),
  getById: (id: string) => axios.get<Department>(`${API_BASE_URL}/departments/${id}`),
  create: (data: Partial<Department>) => axios.post<Department>(`${API_BASE_URL}/departments`, data),
  update: (id: string, data: Partial<Department>) => axios.put<Department>(`${API_BASE_URL}/departments/${id}`, data),
  delete: (id: string) => axios.delete(`${API_BASE_URL}/departments/${id}`),
}

// Attendance endpoints
export const attendanceAPI = {
  getAll: () => axios.get<Attendance[]>(`${API_BASE_URL}/attendance`),
  getByDate: (date: string) => axios.get<Attendance[]>(`${API_BASE_URL}/attendance?date=${date}`),
  create: (data: Partial<Attendance>) => axios.post<Attendance>(`${API_BASE_URL}/attendance`, data),
  update: (id: string, data: Partial<Attendance>) => axios.put<Attendance>(`${API_BASE_URL}/attendance/${id}`, data),
  delete: (id: string) => axios.delete(`${API_BASE_URL}/attendance/${id}`),
}

// Leave endpoints
export const leaveAPI = {
  getAll: () => axios.get<Leave[]>(`${API_BASE_URL}/leaves`),
  getByEmployee: (employeeId: string) => axios.get<Leave[]>(`${API_BASE_URL}/leaves?employeeId=${employeeId}`),
  create: (data: Partial<Leave>) => axios.post<Leave>(`${API_BASE_URL}/leaves`, data),
  update: (id: string, data: Partial<Leave>) => axios.put<Leave>(`${API_BASE_URL}/leaves/${id}`, data),
  delete: (id: string) => axios.delete(`${API_BASE_URL}/leaves/${id}`),
}
