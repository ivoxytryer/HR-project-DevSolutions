-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create departments table (before employees that references it)
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    department_id INTEGER REFERENCES departments(id),
    user_id INTEGER REFERENCES users(id)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    description TEXT,
    start_date DATE,
    end_date DATE
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    project_id INTEGER REFERENCES projects(id),
    hours DECIMAL(5,2),
    date DATE,
    status VARCHAR(50) DEFAULT 'Черновик',
    description TEXT
);

-- Insert sample users
INSERT INTO users (email, password, name, role) VALUES
    ('admin@example.com', '$2a$10$YH.RWKSPX0Wdzo3U9KOlHOEq4C4JuSlaJaDuU2i7XGfk85HfxoVCK', 'Admin User', 'admin'),
    ('manager@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj4FO', 'Manager User', 'manager'),
    ('employee@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj4FO', 'Employee User', 'employee')
ON CONFLICT DO NOTHING;
