HR Management System - Frontend (Система управления персоналом - Фронтенд)
Современное фронтенд-приложение на React и TypeScript для управления персоналом.

Функционал
 Управление сотрудниками - добавление, редактирование и управление профилями сотрудников.
 Департаменты (Отделы) - организация сотрудников по отделам.
 Учет посещаемости - отслеживание посещаемости и рабочего времени сотрудников.
 Управление отпусками - обработка запросов на отпуск и их утверждение.
 Панель управления (Dashboard) - обзор статистики компании.

Стек технологий
React 18 - UI-библиотека
TypeScript - типизация для безопасности кода
Vite - инструмент сборки и сервер для разработки
React Router - навигация
Axios - HTTP-клиент
CSS - стилизация
## Getting Started

### Системные требования

- Node.js 16+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open automatically at `http://localhost:3000`.

## Project Structure

```
src/
├── pages/           # Page components (Dashboard, Employees, etc.)
├── services/        # API services
├── types/           # TypeScript types
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## API Integration

Приложение настроено на подключение к бэкенд-API. Задайте базовый URL-адрес API с помощью переменной окружения REACT_APP_API_URL
```bash
export REACT_APP_API_URL=http://your-api.com/api
```

## Обзор компонентов
Dashboard - статистика и обзор последних действий.
Employees - список сотрудников с поддержкой операций CRUD (создание, чтение, обновление, удаление).
Departments - управление отделами компании.
Attendance - ежедневный учет посещаемости и статистика.
Leave - управление запросами на отпуск.

## Разработка

Добавляйте новые страницы в папку src/pages/, а новые типы - в файл src/types/index.ts.

Все вызовы API централизованно находятся в файле src/services/api.ts.
