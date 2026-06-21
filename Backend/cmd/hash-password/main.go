package main

import (
	"fmt"
	"log"
	"os"

	"golang.org/x/crypto/bcrypt"
)

// Утилита для генерации bcrypt хешей паролей
// Использование: go run ./cmd/hash-password/ <пароль>
// Пример: go run ./cmd/hash-password/ password123
func main() {
	if len(os.Args) < 2 {
		fmt.Println("Использование: go run ./cmd/hash-password/ <пароль>")
		fmt.Println("Пример: go run ./cmd/hash-password/ password123")
		os.Exit(1)
	}

	password := os.Args[1]

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Ошибка при хешировании:", err)
	}

	fmt.Println("Оригинальный пароль:", password)
	fmt.Println("Bcrypt хеш:")
	fmt.Println(string(hashedPassword))
}
