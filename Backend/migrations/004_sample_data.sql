-- Insert sample departments
INSERT INTO departments (id, name) VALUES (1, 'IT') ON CONFLICT (id) DO NOTHING;
INSERT INTO departments (id, name) VALUES (2, 'HR') ON CONFLICT (id) DO NOTHING;
INSERT INTO departments (id, name) VALUES (3, 'Finance') ON CONFLICT (id) DO NOTHING;
INSERT INTO departments (id, name) VALUES (4, 'IT') ON CONFLICT (id) DO NOTHING;
INSERT INTO departments (id, name) VALUES (5, 'HR') ON CONFLICT (id) DO NOTHING;
INSERT INTO departments (id, name) VALUES (6, 'Sales') ON CONFLICT (id) DO NOTHING;

-- Insert sample employees
INSERT INTO employees (id, first_name, last_name, department_id, user_id, email, position) VALUES (1, 'Никита', 'Аминов', 1, NULL, 'nikita.aminov@example.com', 'project_manager') ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, position = EXCLUDED.position;
INSERT INTO employees (id, first_name, last_name, department_id, user_id, email, position) VALUES (2, 'Иван', 'Петров', 1, NULL, 'ivan.petrov@example.com', 'employee') ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, position = EXCLUDED.position;
INSERT INTO employees (id, first_name, last_name, department_id, user_id, email, position) VALUES (3, 'Мария', 'Сидорова', 2, NULL, 'maria.sidorova@example.com', 'hr_manager') ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, position = EXCLUDED.position;
INSERT INTO employees (id, first_name, last_name, department_id, user_id, email, position) VALUES (4, 'Алексей', 'Иванов', 3, NULL, 'alexey.ivanov@example.com', 'employee') ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, position = EXCLUDED.position;
INSERT INTO employees (id, first_name, last_name, department_id, user_id, email, position) VALUES (5, 'Евгений', 'Сидоров', 4, NULL, 'eugene.sidorov@example.com', 'project_manager') ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, position = EXCLUDED.position;

-- Insert sample projects
INSERT INTO projects (id, name, status, description, start_date, end_date) VALUES (1, 'Веб-сайт компании', 'В работе', '', '2026-06-01', '2026-08-31') ON CONFLICT (id) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;
INSERT INTO projects (id, name, status, description, start_date, end_date) VALUES (2, 'Мобильное приложение', 'Планирование', '', '2026-06-15', '2026-09-30') ON CONFLICT (id) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;
INSERT INTO projects (id, name, status, description, start_date, end_date) VALUES (3, 'Система отчетности', 'В работе', '', '2026-06-10', '2026-07-31') ON CONFLICT (id) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;
INSERT INTO projects (id, name, status, description, start_date, end_date) VALUES (4, 'API интеграция', 'Завершено', '', '2026-05-01', '2026-06-01') ON CONFLICT (id) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;
INSERT INTO projects (id, name, status, description, start_date, end_date) VALUES (5, 'Инфраструктура облака', 'В работе', '', '2026-05-15', '2026-07-15') ON CONFLICT (id) DO UPDATE SET start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date;
INSERT INTO projects (id, name, status, description, start_date, end_date) VALUES (6, 'Документирование проекта', 'В работе', '', '2026-06-20', '2026-08-20') ON CONFLICT (id) DO NOTHING;

-- Insert sample attendance records
INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES (1, 1, 8, '2026-06-15', 'Черновик', 'Разработка основных страниц сайта') ON CONFLICT DO NOTHING;
INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES (2, 2, 6, '2026-06-15', 'Отправлено', 'Проектирование архитектуры мобильного приложения') ON CONFLICT DO NOTHING;
INSERT INTO attendance (employee_id, project_id, hours, date, status, description) VALUES (3, 3, 4, '2026-06-15', 'Черновик', 'Сбор данных для отчётности') ON CONFLICT DO NOTHING;
