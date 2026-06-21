# Система управления паролями

## 🔐 Реализованные функции

### 1. Login - вход в систему
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Ответ:**
```json
{
  "token": "eyJ...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 2. Register - регистрация нового пользователя
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123"
}
```

---

### 3. Forgot Password - запрос на сброс пароля
Если пользователь забыл пароль, отправляет запрос сброса:

```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "admin@example.com"
}
```

**Ответ:**
```json
{
  "message": "Password reset link sent to email"
}
```

**В консоли сервера выведется:**
```
=== PASSWORD RESET ===
Email: admin@example.com
Reset Link: http://localhost:5173/reset-password?token=abc123...
Token: abc123...
===================
```

---

### 4. Reset Password - сброс пароля по токену
После получения токена (из письма или консоли), пользователь вводит новый пароль:

```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "abc123...",
  "new_password": "newpassword123"
}
```

---

### 5. Change Password - смена пароля авторизованным пользователем
Авторизованный пользователь может сменить свой пароль:

```
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "old_password": "admin123",
  "new_password": "newpassword456"
}
```

---

## 🧪 Тестирование

### Логин с учётными данными по умолчанию:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Доступные пользователи:
- `admin@example.com` / `admin123` (админ)
- `manager@example.com` / `password` (менеджер)
- `employee@example.com` / `password` (сотрудник)

---

## 🔧 Утилиты

### Генерация bcrypt хеша пароля
```bash
go run cmd/setup/password_hash.go <пароль>
```

Пример:
```bash
go run cmd/setup/password_hash.go admin123
```

### Выполнение миграции БД
```bash
go run cmd/setup/migrate.go
```

---

## 📌 Примечания

- Токены сброса пароля действительны **24 часа**
- Минимальная длина пароля: **6 символов**
- На данный момент письма отправляются в консоль (для разработки)
- В production нужна интеграция с email сервисом (SendGrid, AWS SES, и т.д.)

---

## 🚀 Следующие шаги

1. **Frontend** - создать страницу "Забыли пароль"
2. **Email интеграция** - подключить SMTP сервис для отправки писем
3. **JWT refresh** - реализовать refresh tokens для большей безопасности
4. **Admin panel** - панель управления пользователями для администратора
