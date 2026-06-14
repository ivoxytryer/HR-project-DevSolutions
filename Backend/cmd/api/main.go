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
	r.Use(cors.Default())
	api := r.Group("/api")
	{
		api.GET("/employees", h.GetEmployees)
		api.GET("/departments", h.GetDepartments)
		api.GET("/projects", h.GetProjects)
		api.GET("/attendance", h.GetAttendance)
	}
	r.Run(":8000")
}
