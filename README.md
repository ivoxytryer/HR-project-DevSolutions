# DevSolutions HR System

Полный стек HR-системы для управления сотрудниками, проектами и учетом рабочего времени.

## О проекте

Проект включает:
- **Backend** на Go + Gin + PostgreSQL
- **Frontend** на React + Vite + Axios
- **База данных** с миграциями и начальными тестовыми данными

## Основные задачи

- Управление сотрудниками и отделами
- Управление проектами
- Учет рабочего времени и статусов записей
- Аутентификация и роли (admin/manager/employee)
- CRUD операции для всех основных сущностей

## Структура проекта

```
HR-project-DevSolutions/
├── Backend/          # Серверная часть на Go
│   ├── cmd/api/      # HTTP-сервер
│   ├── cmd/migrate/  # Миграции и инициализация БД
│   ├── cmd/hash-password/ # Утилита генерации bcrypt-хеша
│   ├── internal/     # Модели, хендлеры, репозитории
│   ├── migrations/   # SQL-скрипты создания схемы и данных
│   └── .env          # конфигурация БД
├── Frontend/         # Веб-приложение на React
│   ├── src/          # Исходный код фронтенда
│   ├── package.json
│   └── vite.config.js
├── README.md         # Общая документация
└── PRACTICE_REPORT.md# Отчет по практике
```

## Быстрый запуск

### Backend

```bash
cd Backend

# Настройте подключение к БД в .env
# Пример .env:
# DATABASE_URL=postgres://postgres:123@localhost:5432/hr_db?sslmode=disable

go run ./cmd/migrate/

go run ./cmd/api/main.go
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Откройте приложение в браузере: `http://localhost:5173`

## Пользовательские данные

- Email: `admin@example.com`
- Пароль: `admin123`

## API Endpoints

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

## Технологии

- **Go** и **Gin**: API и бизнес-логика
- **PostgreSQL**: хранение данных
- **React**: фронтенд интерфейс
- **Vite**: сборка и dev сервер
- **Axios**: HTTP-запросы

## Примечания

- `Backend/cmd/migrate/` запускает миграции и наполняет базу тестовыми данными
- `Backend/cmd/api/main.go` поднимает API сервер на `http://localhost:8000`
- `Frontend/src/shared/services/api.ts` содержит фронтенд-клиент для работы с API

Для подробного отчета по практике см. `PRACTICE_REPORT.md`.
