import axios from 'axios'
import { Employee, Department, Project, Attendance } from '../types'

const API_BASE_URL = 'http://localhost:8000/api'

export const employeeAPI = {
  getAll: () => axios.get<Employee[]>(`${API_BASE_URL}/employees`),
  getById: (id: string) => axios.get<Employee>(`${API_BASE_URL}/employees/${id}`),
  create: (data: Partial<Employee>) => axios.post<Employee>(`${API_BASE_URL}/employees`, data),
  update: (id: string, data: Partial<Employee>) => axios.put<Employee>(`${API_BASE_URL}/employees/${id}`, data),
  delete: (id: string) => axios.delete(`${API_BASE_URL}/employees/${id}`),
}

export const departmentAPI = {
  getAll: () => axios.get<Department[]>(`${API_BASE_URL}/departments`),
  getById: (id: string) => axios.get<Department>(`${API_BASE_URL}/departments/${id}`),
  create: (data: Partial<Department>) => axios.post<Department>(`${API_BASE_URL}/departments`, data),
  update: (id: string, data: Partial<Department>) => axios.put<Department>(`${API_BASE_URL}/departments/${id}`, data),
  delete: (id: string) => axios.delete(`${API_BASE_URL}/departments/${id}`),
}

export const projectAPI = {
  getAll: () => axios.get<Project[]>(`${API_BASE_URL}/projects`),
  getById: (id: string) => axios.get<Project>(`${API_BASE_URL}/projects/${id}`),
  create: (data: Partial<Project>) => axios.post<Project>(`${API_BASE_URL}/projects`, data),
  update: (id: string, data: Partial<Project>) => axios.put<Project>(`${API_BASE_URL}/projects/${id}`, data),
  delete: (id: string) => axios.delete(`${API_BASE_URL}/projects/${id}`),
}

export const attendanceAPI = {
  getAll: () => axios.get<Attendance[]>(`${API_BASE_URL}/attendance`),
  getById: (id: string) => axios.get<Attendance>(`${API_BASE_URL}/attendance/${id}`),
  create: (data: Partial<Attendance>) => axios.post<Attendance>(`${API_BASE_URL}/attendance`, data),
  update: (id: string, data: Partial<Attendance>) => axios.put<Attendance>(`${API_BASE_URL}/attendance/${id}`, data),
  delete: (id: string) => axios.delete(`${API_BASE_URL}/attendance/${id}`),
}
