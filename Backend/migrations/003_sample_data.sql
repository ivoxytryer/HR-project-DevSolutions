-- Insert sample departments with type
UPDATE departments SET type = 'основное' WHERE id = 1;
UPDATE departments SET type = 'основное' WHERE id = 2;
UPDATE departments SET type = 'основное' WHERE id = 3;

-- Update sample employees with email and position
UPDATE employees SET email = 'nikita.aminov@example.com', position = 'project_manager' WHERE id = 1;
UPDATE employees SET email = 'ivan.petrov@example.com', position = 'employee' WHERE id = 2;
UPDATE employees SET email = 'maria.sidorova@example.com', position = 'hr_manager' WHERE id = 3;
UPDATE employees SET email = 'alexey.ivanov@example.com', position = 'employee' WHERE id = 4;

-- Update sample projects with dates
UPDATE projects SET start_date = '2026-06-01', end_date = '2026-08-31' WHERE id = 1;
UPDATE projects SET start_date = '2026-06-15', end_date = '2026-09-30' WHERE id = 2;
UPDATE projects SET start_date = '2026-06-10', end_date = '2026-07-31' WHERE id = 3;
UPDATE projects SET start_date = '2026-05-01', end_date = '2026-06-01' WHERE id = 4;

-- Insert sample attendance records
INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES (1, 1, 8, '2026-06-15', 'Черновик', 'Разработка основных страниц сайта') ON CONFLICT DO NOTHING;
INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES (2, 2, 6, '2026-06-15', 'Отправлено', 'Проектирование архитектуры мобильного приложения') ON CONFLICT DO NOTHING;
INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES (3, 3, 4, '2026-06-15', 'Черновик', 'Сбор данных для отчётности') ON CONFLICT DO NOTHING;
