import axios from 'axios'
import { Employee, Department, Project, Attendance, User, LoginRequest, LoginResponse } from '../types'

const API_BASE_URL = 'http://localhost:8000/api'

// Create axios instance with interceptor for token
const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  login: (data: LoginRequest) => 
    axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, data),
  register: (data: LoginRequest) => 
    axios.post<LoginResponse>(`${API_BASE_URL}/auth/register`, data),
  getCurrentUser: () => 
    apiClient.get<User>(`/auth/me`),
}

export const employeeAPI = {
  getAll: () => apiClient.get<Employee[]>(`/employees`),
  getById: (id: string) => apiClient.get<Employee>(`/employees/${id}`),
  create: (data: Partial<Employee>) => apiClient.post<Employee>(`/employees`, data),
  update: (id: string, data: Partial<Employee>) => apiClient.put<Employee>(`/employees/${id}`, data),
  delete: (id: string) => apiClient.delete(`/employees/${id}`),
}

export const departmentAPI = {
  getAll: () => apiClient.get<Department[]>(`/departments`),
  getById: (id: string) => apiClient.get<Department>(`/departments/${id}`),
  create: (data: Partial<Department>) => apiClient.post<Department>(`/departments`, data),
  update: (id: string, data: Partial<Department>) => apiClient.put<Department>(`/departments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/departments/${id}`),
}

export const projectAPI = {
  getAll: () => apiClient.get<Project[]>(`/projects`),
  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) => apiClient.post<Project>(`/projects`, data),
  update: (id: string, data: Partial<Project>) => apiClient.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
}

export const attendanceAPI = {
  getAll: () => apiClient.get<Attendance[]>(`/attendance`),
  getById: (id: string) => apiClient.get<Attendance>(`/attendance/${id}`),
  create: (data: Partial<Attendance>) => apiClient.post<Attendance>(`/attendance`, data),
  update: (id: string, data: Partial<Attendance>) => apiClient.put<Attendance>(`/attendance/${id}`, data),
  delete: (id: string) => apiClient.delete(`/attendance/${id}`),
}
