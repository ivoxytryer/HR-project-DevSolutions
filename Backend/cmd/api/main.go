package main

import (
	"os"

	"hr-project/internal/handlers"
	"hr-project/internal/repository"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	godotenv.Load()
	dbURL := os.Getenv("DATABASE_URL")
	db := sqlx.MustConnect("postgres", dbURL)
	h := &handlers.Handler{Repo: &repository.Repository{DB: db}}

	r := gin.Default()

	// Configure CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3002", "http://localhost:5173", "http://localhost:3000", "http://localhost:3001"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "Accept", "Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 3600,
	}))

	// Public routes (без авторизации)
	auth := r.Group("/api/auth")
	{
		auth.POST("/login", h.Login)
		auth.POST("/register", h.Register)
		auth.POST("/forgot-password", h.ForgotPassword)
		auth.POST("/reset-password", h.ResetPassword)
	}

	// Protected routes (с авторизацией)
	api := r.Group("/api")
	api.Use(handlers.AuthMiddleware())
	{
		api.GET("/auth/me", h.GetCurrentUser)
		api.POST("/auth/change-password", h.ChangePassword)

		// Employees
		api.GET("/employees", h.GetEmployees)
		api.GET("/employees/:id", h.GetEmployeeByID)
		api.POST("/employees", h.CreateEmployee)
		api.PUT("/employees/:id", h.UpdateEmployee)
		api.DELETE("/employees/:id", h.DeleteEmployee)

		// Departments
		api.GET("/departments", h.GetDepartments)
		api.GET("/departments/:id", h.GetDepartmentByID)
		api.POST("/departments", h.CreateDepartment)
		api.PUT("/departments/:id", h.UpdateDepartment)
		api.DELETE("/departments/:id", h.DeleteDepartment)

		// Projects
		api.GET("/projects", h.GetProjects)
		api.GET("/projects/:id", h.GetProjectByID)
		api.POST("/projects", h.CreateProject)
		api.PUT("/projects/:id", h.UpdateProject)
		api.DELETE("/projects/:id", h.DeleteProject)

		// Attendance
		api.GET("/attendance", h.GetAttendance)
		api.GET("/attendance/:id", h.GetAttendanceByID)
		api.POST("/attendance", h.CreateAttendance)
		api.PUT("/attendance/:id", h.UpdateAttendance)
		api.DELETE("/attendance/:id", h.DeleteAttendance)
	}
	port := os.Getenv("API_PORT")
	if port == "" {
		port = "8000"
	}
	r.Run(":" + port)
}
