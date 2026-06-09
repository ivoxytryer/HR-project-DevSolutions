# HR Management System - Frontend

Modern React TypeScript frontend application for personnel management.

## Features

- 👥 **Employee Management** - Add, edit, and manage employee profiles
- 🏢 **Departments** - Organize employees by departments
- 📅 **Attendance Tracking** - Track employee attendance and working hours
- 🏖️ **Leave Management** - Handle leave requests and approvals
- 📊 **Dashboard** - Overview of company statistics

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS** - Styling

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

```bash
cd Frontend
npm install
npm run dev
```

### Backend

```bash
cd Backend
# TODO: инструкции по запуску backend
```

##  Основные технологии

### Frontend
- React 18+
- Vite (сборщик проектов)
- JavaScript/JSX

### Backend
- TODO

##  Workflow

1. **Разработка** - работайте в соответствующем модуле
2. **Общие утилиты** - помещайте в `Frontend/src/shared/`
3. **API** - обновляйте `Frontend/src/shared/services/api.ts`
4. **Backend** - разрабатывайте в папке `Backend/`

---

**Переструктурировано:** 2026-06-09
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

## Component Overview

- **Dashboard** - Statistics and recent activity overview
- **Employees** - Employee list with CRUD operations
- **Departments** - Department management
- **Attendance** - Daily attendance tracking and statistics
- **Leave** - Leave request management

## Development

Add new pages in `src/pages/` and new types in `src/types/index.ts`.

API calls are centralized in `src/services/api.ts`.

## License

MIT
