package models

import (
	"time"
)

type User struct {
	ID        int       `json:"id" db:"id"`
	Email     string    `json:"email" db:"email"`
	Password  string    `json:"-" db:"password"` // Не отправляем пароль в JSON
	Name      string    `json:"name" db:"name"`
	Role      string    `json:"role" db:"role"` // "admin", "manager", "employee"
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type PasswordResetToken struct {
	ID        int       `json:"id" db:"id"`
	UserID    int       `json:"user_id" db:"user_id"`
	Token     string    `json:"token" db:"token"`
	ExpiresAt time.Time `json:"expires_at" db:"expires_at"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type Department struct {
	ID   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
	Type string `json:"type" db:"type"` // например, основное, удаленное
}

type Employee struct {
	ID        int     `json:"id" db:"id"`
	FirstName string  `json:"first_name" db:"first_name"`
	LastName  string  `json:"last_name" db:"last_name"`
	Email     *string `json:"email" db:"email"`
	DeptID    *int    `json:"department_id" db:"department_id"`
	Position  string  `json:"position" db:"position"` // employee, project_manager, hr_manager
	UserID    *int    `json:"user_id" db:"user_id"`
}

type CreateEmployeeRequest struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	DeptID    int    `json:"department_id" binding:"required"`
	Position  string `json:"position" binding:"required"`
}

type UpdateEmployeeRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	DeptID    int    `json:"department_id"`
	Position  string `json:"position"`
}

type CreateProjectRequest struct {
	Name      string `json:"name" binding:"required"`
	Status    string `json:"status" binding:"required"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}

type Project struct {
	ID        int     `json:"id" db:"id"`
	Name      string  `json:"name" db:"name"`
	Status    string  `json:"status" db:"status"`
	StartDate *string `json:"start_date" db:"start_date"`
	EndDate   *string `json:"end_date" db:"end_date"`
}
type Attendance struct {
	ID          int     `json:"id" db:"id"`
	EmpID       int     `json:"employee_id" db:"employee_id"`
	ProjID      int     `json:"project_id" db:"project_id"`
	Hours       float64 `json:"hours" db:"hours"`
	Date        string  `json:"date" db:"date"`
	Status      string  `json:"status" db:"status"`
	Description string  `json:"description" db:"description"`
}
