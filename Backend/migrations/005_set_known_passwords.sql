-- Set known passwords for seeded manager and employee accounts
UPDATE users SET password = '$2a$10$NoSx5esAeePGY6STQ2GpQ.Egc8UzEAnqD6rQYJDGZmLj3e9a3Owa6' WHERE email = 'manager@example.com';
UPDATE users SET password = '$2a$10$3/uaZGD5HGhHvC1GuV8AJOY7Fi8DxM1jkY67TVgddSfAKDkBzRbWy' WHERE email = 'employee@example.com';
