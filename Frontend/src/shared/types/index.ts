export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  department_id?: number;
  position: string;
  user_id?: number;
}

export interface Department {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface Attendance {
  id: number;
  employee_id: number;
  project_id: number;
  hours: number;
  date: string;
  status: string;
  description: string;
}