# Backend API

Серверная часть HR-системы, реализованная на Go с фреймворком Gin и PostgreSQL.

## Структура

```
Backend/
├── cmd/api/        # Запуск API сервера
├── cmd/migrate/    # Миграции и инициализация базы данных
├── cmd/hash-password/ # Утилита генерации bcrypt-хеша
├── internal/
│   ├── handlers/   # HTTP-обработчики
│   ├── models/     # модели данных
│   └── repository/ # слой доступа к БД
├── migrations/     # SQL-скрипты для схемы и тестовых данных
└── .env            # конфигурация окружения (DATABASE_URL)
```

## Требования

- Go 1.26+
- PostgreSQL

## Настройка

1. Скопируйте или создайте файл `.env` в папке `Backend`:
   ```env
   DATABASE_URL=postgres://postgres:123@localhost:5432/hr_db?sslmode=disable
   ```
2. Запустите миграции и инициализацию данных:
   ```bash
   cd Backend
   go run ./cmd/migrate/
   ```

## Запуск сервера

```bash
cd Backend
go run ./cmd/api/main.go
```

По умолчанию API слушает на `http://localhost:8000`.

## Основные API-эндпойнты

### Аутентификация
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `POST /api/auth/change-password`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Сотрудники
- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

### Проекты
- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Учет времени
- `GET /api/attendance`
- `GET /api/attendance/:id`
- `POST /api/attendance`
- `PUT /api/attendance/:id`
- `DELETE /api/attendance/:id`

## Полезные команды

- `go run ./cmd/migrate/` — применить миграции и заполнить тестовые данные
- `go run ./cmd/api/main.go` — запустить API сервер
- `go run ./cmd/hash-password/ <пароль>` — сгенерировать bcrypt hash для пароля
