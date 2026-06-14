export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
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
  id: string;
  employeeId: string;
  date: string;
  status: string;
}