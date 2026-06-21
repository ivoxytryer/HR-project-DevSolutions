package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"hr-project/internal/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("your-secret-key-change-in-production")

func (h *Handler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Найти пользователя по email
	var user models.User
	err := h.Repo.DB.Get(&user, "SELECT id, email, password, name, role, created_at FROM users WHERE email = $1", req.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Проверить пароль
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Создать JWT токен
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	user.Password = "" // Не отправляем пароль
	c.JSON(http.StatusOK, models.LoginResponse{
		Token: tokenString,
		User:  user,
	})
}

func (h *Handler) Register(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Проверить что email уникален
	var count int
	h.Repo.DB.Get(&count, "SELECT COUNT(*) FROM users WHERE email = $1", req.Email)
	if count > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return
	}

	// Захешировать пароль
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Создать пользователя с ролью "employee" по умолчанию
	user := models.User{
		Email:     req.Email,
		Password:  string(hashedPassword),
		Name:      req.Email, // Можно потом обновить
		Role:      "employee",
		CreatedAt: time.Now(),
	}

	result, err := h.Repo.DB.Exec(
		"INSERT INTO users (email, password, name, role, created_at) VALUES ($1, $2, $3, $4, $5)",
		user.Email, user.Password, user.Name, user.Role, user.CreatedAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user id"})
		return
	}

	user.ID = int(id)
	user.Password = ""

	// Создать токен
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	c.JSON(http.StatusOK, models.LoginResponse{
		Token: tokenString,
		User:  user,
	})
}

func (h *Handler) GetCurrentUser(c *gin.Context) {
	userId, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var user models.User
	err := h.Repo.DB.Get(&user, "SELECT id, email, name, role, created_at FROM users WHERE id = $1", userId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// ForgotPassword - генерирует токен для сброса пароля
func (h *Handler) ForgotPassword(c *gin.Context) {
	var req models.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Найти пользователя по email
	var user models.User
	err := h.Repo.DB.Get(&user, "SELECT id, email FROM users WHERE email = $1", req.Email)
	if err != nil {
		// Не раскрываем информацию о существовании пользователя
		c.JSON(http.StatusOK, gin.H{"message": "If email exists, reset link has been sent"})
		return
	}

	// Генерируем токен
	token := generateRandomToken(32)
	expiresAt := time.Now().Add(time.Hour * 24) // Действителен 24 часа

	// Сохраняем токен в БД
	_, err = h.Repo.DB.Exec(
		"INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
		user.ID, token, expiresAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate reset token"})
		return
	}

	// TODO: Отправить email со ссылкой на сброс пароля
	// Для разработки выводим токен в консоль
	resetLink := fmt.Sprintf("http://localhost:5173/reset-password?token=%s", token)
	fmt.Printf("\n=== PASSWORD RESET ===\nEmail: %s\nReset Link: %s\nToken: %s\n===================\n", user.Email, resetLink, token)

	c.JSON(http.StatusOK, gin.H{"message": "Password reset link sent to email"})
}

// ResetPassword - сбрасывает пароль по токену
func (h *Handler) ResetPassword(c *gin.Context) {
	var req models.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Найти токен в БД
	var resetToken models.PasswordResetToken
	err := h.Repo.DB.Get(&resetToken, "SELECT id, user_id, expires_at FROM password_reset_tokens WHERE token = $1", req.Token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired reset token"})
		return
	}

	// Проверить, не истек ли токен
	if time.Now().After(resetToken.ExpiresAt) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Reset token has expired"})
		return
	}

	// Захешировать новый пароль
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Обновить пароль пользователя
	_, err = h.Repo.DB.Exec(
		"UPDATE users SET password = $1 WHERE id = $2",
		string(hashedPassword), resetToken.UserID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	// Удалить использованный токен
	_, err = h.Repo.DB.Exec("DELETE FROM password_reset_tokens WHERE id = $1", resetToken.ID)
	if err != nil {
		fmt.Printf("Warning: Failed to delete reset token: %v\n", err)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password has been reset successfully"})
}

// ChangePassword - меняет пароль для авторизованного пользователя
func (h *Handler) ChangePassword(c *gin.Context) {
	userId, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req models.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Получить текущий пароль пользователя
	var user models.User
	err := h.Repo.DB.Get(&user, "SELECT password FROM users WHERE id = $1", userId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Проверить старый пароль
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.OldPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Old password is incorrect"})
		return
	}

	// Захешировать новый пароль
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Обновить пароль
	_, err = h.Repo.DB.Exec(
		"UPDATE users SET password = $1 WHERE id = $2",
		string(hashedPassword), userId,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}

// generateRandomToken генерирует случайный токен
func generateRandomToken(length int) string {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		return ""
	}
	return hex.EncodeToString(bytes)
}
