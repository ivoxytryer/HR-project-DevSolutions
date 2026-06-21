package main

import (
	"fmt"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// Утилита для выполнения миграции БД
// Использование: go run ./cmd/migrate/
func main() {
	godotenv.Load()
	dbURL := os.Getenv("DATABASE_URL")

	if dbURL == "" {
		log.Fatal("DATABASE_URL не установлена в .env")
	}

	db, err := sqlx.Connect("postgres", dbURL)
	if err != nil {
		log.Fatalf("Ошибка подключения к БД: %v", err)
	}
	defer db.Close()

	// Создать таблицу для токенов сброса пароля
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS password_reset_tokens (
		id SERIAL PRIMARY KEY,
		user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
		token VARCHAR(255) UNIQUE NOT NULL,
		expires_at TIMESTAMP NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	`

	_, err = db.Exec(createTableSQL)
	if err != nil {
		log.Fatalf("Ошибка при создании таблицы: %v", err)
	}
	fmt.Println("✓ Таблица password_reset_tokens создана")

	// Add email and position fields to employees table
	addEmployeeFieldsSQL := `
	ALTER TABLE employees 
	ADD COLUMN IF NOT EXISTS email VARCHAR(255),
	ADD COLUMN IF NOT EXISTS position VARCHAR(50) DEFAULT 'employee';

	ALTER TABLE departments 
	ADD COLUMN IF NOT EXISTS type VARCHAR(100) DEFAULT 'основное';

	ALTER TABLE projects 
	ADD COLUMN IF NOT EXISTS start_date DATE,
	ADD COLUMN IF NOT EXISTS end_date DATE;
	`

	_, err = db.Exec(addEmployeeFieldsSQL)
	if err != nil {
		log.Fatalf("Ошибка при добавлении полей: %v", err)
	}
	fmt.Println("✓ Новые поля добавлены в таблицы")

	// Обновить пароль админа
	updatePasswordSQL := `
	UPDATE users 
	SET password = '$2a$10$YH.RWKSPX0Wdzo3U9KOlHOEq4C4JuSlaJaDuU2i7XGfk85HfxoVCK'
	WHERE email = 'admin@example.com';
	`

	result, err := db.Exec(updatePasswordSQL)
	if err != nil {
		log.Fatalf("Ошибка при обновлении пароля: %v", err)
	}

	rowsAffected, _ := result.RowsAffected()
	fmt.Printf("✓ Пароль админа обновлён (%d строк обновлено)\n", rowsAffected)

	// Вставить тестовые данные
	insertSampleData := `
	-- Insert sample departments
	INSERT INTO departments (id, name, type) VALUES (1, 'IT', 'основное') ON CONFLICT (id) DO NOTHING;
	INSERT INTO departments (id, name, type) VALUES (2, 'HR', 'основное') ON CONFLICT (id) DO NOTHING;
	INSERT INTO departments (id, name, type) VALUES (3, 'Finance', 'основное') ON CONFLICT (id) DO NOTHING;
	INSERT INTO departments (id, name, type) VALUES (4, 'IT', 'удаленное') ON CONFLICT (id) DO NOTHING;
	INSERT INTO departments (id, name, type) VALUES (5, 'HR', 'удаленное') ON CONFLICT (id) DO NOTHING;
	INSERT INTO departments (id, name, type) VALUES (6, 'Sales', 'удаленное') ON CONFLICT (id) DO NOTHING;

	-- Insert sample employees
	INSERT INTO employees (id, first_name, last_name, email, department_id, position) VALUES (1, 'Никита', 'Аминов', 'nikita.aminov@example.com', 1, 'project_manager') ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
	INSERT INTO employees (id, first_name, last_name, email, department_id, position) VALUES (2, 'Иван', 'Петров', 'ivan.petrov@example.com', 1, 'employee') ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
	INSERT INTO employees (id, first_name, last_name, email, department_id, position) VALUES (3, 'Мария', 'Сидорова', 'maria.sidorova@example.com', 2, 'hr_manager') ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
	INSERT INTO employees (id, first_name, last_name, email, department_id, position) VALUES (4, 'Алексей', 'Иванов', 'alexey.ivanov@example.com', 3, 'employee') ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
	INSERT INTO employees (id, first_name, last_name, email, department_id, position) VALUES (5, 'Евгений', 'Сидоров', 'eugene.sidorov@example.com', 4, 'project_manager') ON CONFLICT (id) DO NOTHING;

	-- Insert sample projects
	INSERT INTO projects (id, name, status, start_date, end_date) VALUES (1, 'Веб-сайт компании', 'В работе', '2026-06-01', '2026-08-31') ON CONFLICT (id) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;
	INSERT INTO projects (id, name, status, start_date, end_date) VALUES (2, 'Мобильное приложение', 'Планирование', '2026-06-15', '2026-09-30') ON CONFLICT (id) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;
	INSERT INTO projects (id, name, status, start_date, end_date) VALUES (3, 'Система отчетности', 'В работе', '2026-06-10', '2026-07-31') ON CONFLICT (id) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;
	INSERT INTO projects (id, name, status, start_date, end_date) VALUES (4, 'API интеграция', 'Завершено', '2026-05-01', '2026-06-01') ON CONFLICT (id) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;
	INSERT INTO projects (id, name, status, start_date, end_date) VALUES (5, 'Инфраструктура облака', 'В работе', '2026-05-15', '2026-07-15') ON CONFLICT (id) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;
	INSERT INTO projects (id, name, status, start_date, end_date) VALUES (6, 'Документирование проекта', 'В работе', '2026-06-20', '2026-08-20') ON CONFLICT (id) DO NOTHING;

	-- Insert sample attendance records
	INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES (1, 1, 8, '2026-06-15', 'Черновик', 'Разработка основных страниц сайта') ON CONFLICT DO NOTHING;
	INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES (2, 2, 6, '2026-06-15', 'Отправлено', 'Проектирование архитектуры мобильного приложения') ON CONFLICT DO NOTHING;
	INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES (3, 3, 4, '2026-06-15', 'Черновик', 'Сбор данных для отчётности') ON CONFLICT DO NOTHING;
	INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES (4, 5, 7, '2026-06-16', 'Утверждено', 'Настройка облачной инфраструктуры') ON CONFLICT DO NOTHING;
	INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES (5, 6, 5, '2026-06-16', 'Отправлено', 'Подготовка документации') ON CONFLICT DO NOTHING;
	INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES (1, 4, 6, '2026-06-17', 'Черновик', 'Завершение интеграции API') ON CONFLICT DO NOTHING;
	`

	_, err = db.Exec(insertSampleData)
	if err != nil {
		log.Fatalf("Ошибка при вставке тестовых данных: %v", err)
	}
	fmt.Println("✓ Тестовые данные вставлены")

	fmt.Println("\n=== МИГРАЦИЯ ЗАВЕРШЕНА ===")
	fmt.Println("Email: admin@example.com")
	fmt.Println("Пароль: admin123")
}
