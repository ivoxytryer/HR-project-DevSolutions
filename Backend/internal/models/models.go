package models

type Department struct {
	ID   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}
type Employee struct {
	ID        int    `json:"id" db:"id"`
	FirstName string `json:"first_name" db:"first_name"`
	LastName  string `json:"last_name" db:"last_name"`
	DeptID    int    `json:"department_id" db:"department_id"`
}
type Project struct {
	ID     int    `json:"id" db:"id"`
	Name   string `json:"name" db:"name"`
	Status string `json:"status" db:"status"`
}
type Attendance struct {
	ID     int     `json:"id" db:"id"`
	EmpID  int     `json:"employee_id" db:"employee_id"`
	ProjID int     `json:"project_id" db:"project_id"`
	Hours  float64 `json:"hours" db:"hours"`
	Date   string  `json:"date" db:"date"`
}
