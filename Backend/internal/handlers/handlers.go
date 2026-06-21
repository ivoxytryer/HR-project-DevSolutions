package handlers

import (
	"fmt"
	"hr-project/internal/models"
	"hr-project/internal/repository"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type Handler struct{ Repo *repository.Repository }

// ========== EMPLOYEES ==========
func (h *Handler) GetEmployees(c *gin.Context) {
	var list []models.Employee
	err := h.Repo.GetEntities("SELECT id, first_name, last_name, email, department_id, position, user_id FROM employees ORDER BY id", &list)
	if err != nil {
		fmt.Println("Error getting employees:", err)
		list = []models.Employee{} // Return empty array instead of null
	}
	c.JSON(http.StatusOK, list)
}

func (h *Handler) GetEmployeeByID(c *gin.Context) {
	id := c.Param("id")
	var employee models.Employee
	err := h.Repo.DB.Get(&employee, "SELECT id, first_name, last_name, email, department_id, position, user_id FROM employees WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}
	c.JSON(http.StatusOK, employee)
}

func (h *Handler) CreateEmployee(c *gin.Context) {
	var req models.CreateEmployeeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Only admin or HR manager can create employees
	roleI, _ := c.Get("role")
	role := ""
	if roleI != nil {
		role = roleI.(string)
	}
	switch role {
	case "admin", "hr_manager":
		// allowed
	default:
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to create employee"})
		return
	}

	var emp models.Employee

	// Convert empty email to NULL
	var email interface{} = nil
	if req.Email != "" {
		email = req.Email
	}

	err := h.Repo.DB.QueryRow(
		"INSERT INTO employees (first_name, last_name, email, department_id, position) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		req.FirstName, req.LastName, email, req.DeptID, req.Position,
	).Scan(&emp.ID)

	if err != nil {
		fmt.Println("Error creating employee:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create employee: %v", err)})
		return
	}

	emp.FirstName = req.FirstName
	emp.LastName = req.LastName
	if email != nil {
		emp.Email = &req.Email
	}
	if req.DeptID != 0 {
		emp.DeptID = &req.DeptID
	}
	emp.Position = req.Position

	c.JSON(http.StatusCreated, emp)
}

func (h *Handler) UpdateEmployee(c *gin.Context) {
	id := c.Param("id")
	var req models.UpdateEmployeeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Only admin or HR manager can update employees
	roleI, _ := c.Get("role")
	role := ""
	if roleI != nil {
		role = roleI.(string)
	}
	switch role {
	case "admin", "hr_manager":
		// allowed
	default:
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to update employee"})
		return
	}

	_, err := h.Repo.DB.Exec(
		"UPDATE employees SET first_name = $1, last_name = $2, email = $3, department_id = $4, position = $5 WHERE id = $6",
		req.FirstName, req.LastName, req.Email, req.DeptID, req.Position, id,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update employee"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee updated"})
}

func (h *Handler) DeleteEmployee(c *gin.Context) {
	id := c.Param("id")
	// Only admin or HR manager can delete employees
	roleI, _ := c.Get("role")
	role := ""
	if roleI != nil {
		role = roleI.(string)
	}
	switch role {
	case "admin", "hr_manager":
		// allowed
	default:
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to delete employee"})
		return
	}

	_, err := h.Repo.DB.Exec("DELETE FROM attendance WHERE employee_id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete dependent attendance records"})
		return
	}

	_, err = h.Repo.DB.Exec("DELETE FROM employees WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete employee"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted"})
}

// ========== DEPARTMENTS ==========
func (h *Handler) GetDepartments(c *gin.Context) {
	var list []models.Department
	err := h.Repo.GetEntities("SELECT id, name FROM departments", &list)
	if err != nil {
		list = []models.Department{}
	}
	c.JSON(http.StatusOK, list)
}

func (h *Handler) GetDepartmentByID(c *gin.Context) {
	id := c.Param("id")
	var dept models.Department
	err := h.Repo.DB.Get(&dept, "SELECT id, name FROM departments WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
		return
	}
	c.JSON(http.StatusOK, dept)
}

func (h *Handler) CreateDepartment(c *gin.Context) {
	var dept models.Department
	if err := c.ShouldBindJSON(&dept); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.Repo.DB.QueryRow(
		"INSERT INTO departments (name) VALUES ($1) RETURNING id",
		dept.Name,
	).Scan(&dept.ID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create department"})
		return
	}

	c.JSON(http.StatusCreated, dept)
}

func (h *Handler) UpdateDepartment(c *gin.Context) {
	id := c.Param("id")
	var dept models.Department
	if err := c.ShouldBindJSON(&dept); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.Repo.DB.Exec("UPDATE departments SET name = $1 WHERE id = $2", dept.Name, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update department"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Department updated"})
}

func (h *Handler) DeleteDepartment(c *gin.Context) {
	id := c.Param("id")
	_, err := h.Repo.DB.Exec("DELETE FROM departments WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete department"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Department deleted"})
}

// ========== PROJECTS ==========
func (h *Handler) GetProjects(c *gin.Context) {
	var list []models.Project
	err := h.Repo.GetEntities("SELECT id, name, status, start_date, end_date FROM projects", &list)
	if err != nil {
		list = []models.Project{}
	}
	c.JSON(http.StatusOK, list)
}

func (h *Handler) GetProjectByID(c *gin.Context) {
	id := c.Param("id")
	var project models.Project
	err := h.Repo.DB.Get(&project, "SELECT id, name, status, start_date, end_date FROM projects WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}
	c.JSON(http.StatusOK, project)
}

func (h *Handler) CreateProject(c *gin.Context) {
	var req models.CreateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Only admins and project managers can create projects
	roleI, _ := c.Get("role")
	role := ""
	if roleI != nil {
		role = roleI.(string)
	}
	switch role {
	case "admin", "manager":
		// allowed
	default:
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to create project"})
		return
	}

	// First, check and fix the sequence if needed
	var maxID int
	err := h.Repo.DB.QueryRow("SELECT COALESCE(MAX(id), 0) FROM projects").Scan(&maxID)
	if err == nil && maxID > 0 {
		// Update the sequence to be at least maxID + 1
		h.Repo.DB.QueryRow(fmt.Sprintf("SELECT setval('projects_id_seq', %d, true)", maxID))
	}

	var proj models.Project

	// Convert empty strings to NULL for date fields
	var startDate interface{} = nil
	var endDate interface{} = nil
	if req.StartDate != "" {
		startDate = req.StartDate
	}
	if req.EndDate != "" {
		endDate = req.EndDate
	}

	err = h.Repo.DB.QueryRow(
		"INSERT INTO projects (name, status, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING id",
		req.Name, req.Status, startDate, endDate,
	).Scan(&proj.ID)

	if err != nil {
		fmt.Println("Error creating project:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create project: %v", err)})
		return
	}

	proj.Name = req.Name
	proj.Status = req.Status
	if startDate != nil {
		proj.StartDate = &req.StartDate
	}
	if endDate != nil {
		proj.EndDate = &req.EndDate
	}

	c.JSON(http.StatusCreated, proj)
}

func (h *Handler) UpdateProject(c *gin.Context) {
	id := c.Param("id")
	var proj models.Project
	if err := c.ShouldBindJSON(&proj); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Only admins and project managers can update projects
	roleI, _ := c.Get("role")
	role := ""
	if roleI != nil {
		role = roleI.(string)
	}
	switch role {
	case "admin", "manager":
		// allowed
	default:
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to update project"})
		return
	}

	// Convert nil/empty pointers to NULL for date fields
	var startDate interface{} = nil
	var endDate interface{} = nil
	if proj.StartDate != nil && *proj.StartDate != "" {
		startDate = *proj.StartDate
	}
	if proj.EndDate != nil && *proj.EndDate != "" {
		endDate = *proj.EndDate
	}

	_, err := h.Repo.DB.Exec(
		"UPDATE projects SET name = $1, status = $2, start_date = $3, end_date = $4 WHERE id = $5",
		proj.Name, proj.Status, startDate, endDate, id,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project updated"})
}

func (h *Handler) DeleteProject(c *gin.Context) {
	id := c.Param("id")
	// Only admins and project managers can delete projects
	roleI, _ := c.Get("role")
	role := ""
	if roleI != nil {
		role = roleI.(string)
	}
	switch role {
	case "admin", "manager":
		// allowed
	default:
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to delete project"})
		return
	}

	_, err := h.Repo.DB.Exec("DELETE FROM attendance WHERE project_id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete dependent attendance records"})
		return
	}

	_, err = h.Repo.DB.Exec("DELETE FROM projects WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete project"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Project deleted"})
}

// ========== ATTENDANCE ==========
func (h *Handler) GetAttendance(c *gin.Context) {
	var list []models.Attendance
	err := h.Repo.GetEntities("SELECT id, employee_id, project_id, hours, date, status, COALESCE(description, '') AS description FROM attendance", &list)
	if err != nil {
		fmt.Println("GetAttendance error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load attendance records"})
		return
	}
	logContent := fmt.Sprintf("GetAttendance: %d rows\n", len(list))
	for _, item := range list {
		logContent += fmt.Sprintf("row: %+v\n", item)
	}
	_ = os.WriteFile("attendance_get.log", []byte(logContent), 0644)
	c.JSON(http.StatusOK, list)
}

func (h *Handler) GetAttendanceByID(c *gin.Context) {
	id := c.Param("id")
	var att models.Attendance
	err := h.Repo.DB.Get(&att, "SELECT id, employee_id, project_id, hours, date, status, COALESCE(description, '') AS description FROM attendance WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Attendance record not found"})
		return
	}
	c.JSON(http.StatusOK, att)
}

func (h *Handler) CreateAttendance(c *gin.Context) {
	var att models.Attendance
	if err := c.ShouldBindJSON(&att); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Role enforcement: employees can create only their own attendance; managers cannot create attendance
	roleI, _ := c.Get("role")
	userIDI, _ := c.Get("user_id")
	role := ""
	userID := 0
	if roleI != nil {
		role = roleI.(string)
	}
	if userIDI != nil {
		userID = userIDI.(int)
	}

	switch role {
	case "employee":
		var emp models.Employee
		if err := h.Repo.DB.Get(&emp, "SELECT id FROM employees WHERE user_id = $1", userID); err != nil {
			c.JSON(http.StatusForbidden, gin.H{"error": "No linked employee found for user"})
			return
		}
		att.EmpID = emp.ID
	case "manager":
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to create attendance"})
		return
	default:
		// admins allowed
	}

	err := h.Repo.DB.QueryRow(
		"INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
		att.EmpID, att.ProjID, att.Hours, att.Date, "Черновик", att.Description,
	).Scan(&att.ID)

	if err != nil {
		fmt.Println("CreateAttendance error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create attendance record: %v", err)})
		return
	}

	att.Status = "Черновик"
	c.JSON(http.StatusCreated, att)
}

func (h *Handler) UpdateAttendance(c *gin.Context) {
	id := c.Param("id")
	var att models.Attendance
	if err := c.ShouldBindJSON(&att); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Role enforcement: employees can update only their own records; managers cannot update attendance
	roleI, _ := c.Get("role")
	userIDI, _ := c.Get("user_id")
	role := ""
	userID := 0
	if roleI != nil {
		role = roleI.(string)
	}
	if userIDI != nil {
		userID = userIDI.(int)
	}

	var existing models.Attendance
	if err := h.Repo.DB.Get(&existing, "SELECT id, employee_id FROM attendance WHERE id = $1", id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Attendance record not found"})
		return
	}

	switch role {
	case "employee":
		var emp models.Employee
		if err := h.Repo.DB.Get(&emp, "SELECT id FROM employees WHERE user_id = $1", userID); err != nil {
			c.JSON(http.StatusForbidden, gin.H{"error": "No linked employee found for user"})
			return
		}
		if existing.EmpID != emp.ID {
			c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to modify this record"})
			return
		}
		// force employee id
		att.EmpID = emp.ID
	case "manager":
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to modify attendance"})
		return
	default:
		// admins allowed
	}

	_, err := h.Repo.DB.Exec(
		"UPDATE attendance SET employee_id = $1, project_id = $2, hours = $3, date = $4, description = $5 WHERE id = $6",
		att.EmpID, att.ProjID, att.Hours, att.Date, att.Description, id,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update attendance record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Attendance record updated"})
}

func (h *Handler) DeleteAttendance(c *gin.Context) {
	id := c.Param("id")
	// Role enforcement: employees can delete only their own records; managers cannot delete attendance
	roleI, _ := c.Get("role")
	userIDI, _ := c.Get("user_id")
	role := ""
	userID := 0
	if roleI != nil {
		role = roleI.(string)
	}
	if userIDI != nil {
		userID = userIDI.(int)
	}

	var existing models.Attendance
	if err := h.Repo.DB.Get(&existing, "SELECT id, employee_id FROM attendance WHERE id = $1", id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Attendance record not found"})
		return
	}

	switch role {
	case "employee":
		var emp models.Employee
		if err := h.Repo.DB.Get(&emp, "SELECT id FROM employees WHERE user_id = $1", userID); err != nil {
			c.JSON(http.StatusForbidden, gin.H{"error": "No linked employee found for user"})
			return
		}
		if existing.EmpID != emp.ID {
			c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to delete this record"})
			return
		}
	case "manager":
		c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions to delete attendance"})
		return
	default:
		// admins allowed
	}

	_, err := h.Repo.DB.Exec("DELETE FROM attendance WHERE id = $1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete attendance record"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Attendance record deleted"})
}
