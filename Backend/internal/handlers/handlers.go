package handlers

import (
	"hr-project/internal/models"
	"hr-project/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct{ Repo *repository.Repository }

func (h *Handler) GetEmployees(c *gin.Context) {
	var list []models.Employee
	h.Repo.GetEntities("SELECT * FROM employees", &list)
	c.JSON(http.StatusOK, list)
}

func (h *Handler) GetDepartments(c *gin.Context) {
	var list []models.Department
	h.Repo.GetEntities("SELECT * FROM departments", &list)
	c.JSON(http.StatusOK, list)
}

func (h *Handler) GetProjects(c *gin.Context) {
	var list []models.Project
	h.Repo.GetEntities("SELECT * FROM projects", &list)
	c.JSON(http.StatusOK, list)
}

func (h *Handler) GetAttendance(c *gin.Context) {
	var list []models.Attendance
	h.Repo.GetEntities("SELECT * FROM attendance", &list)
	c.JSON(http.StatusOK, list)
}
