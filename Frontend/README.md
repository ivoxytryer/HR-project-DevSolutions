# Frontend Application

Веб-интерфейс для HR-системы на React и Vite.

## Возможности

- Просмотр и фильтрация записей учета времени
- Управление сотрудниками
- Управление проектами
- Аутентификация пользователей
- Фронтенд-запросы к API через Axios

## Стек технологий

- React 18
- JavaScript / JSX
- Vite
- Axios
- CSS

## Установка и запуск

### Требования

- Node.js 16+ 
- npm или yarn

### Команды

```bash
cd Frontend
npm install
npm run dev
```

По умолчанию приложение запускается на `http://localhost:3000`.

## Настройка API

По умолчанию фронтенд подключается к `http://localhost:8000/api`.
Если нужно изменить адрес, настройте прокси или `VITE` переменную окружения в `vite.config.js`.

## Структура проекта

```
Frontend/
├── src/
│   ├── modules/         # Бизнес-компоненты (Employees, Projects, TimeSheet)
│   ├── shared/
│   │   ├── context/     # Контекст авторизации
│   │   ├── services/    # API-клиент
│   │   └── types/       # Типы данных
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

## Рекомендуемый запуск

1. Запустите backend на `http://localhost:8000`
2. Запустите frontend командой `npm run dev`
3. Откройте приложение в браузере по адресу `http://localhost:5173`

## Полезные файлы

- `src/shared/services/api.ts` — реализация HTTP-клиента и API методов
- `src/modules/timesheet/TimeSheet.jsx` — основная логика учета времени
- `src/modules/employees/Employees.jsx` — управление сотрудниками
