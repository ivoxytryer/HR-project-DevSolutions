-- Add email and position fields to employees table
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS position VARCHAR(50) DEFAULT 'employee';

-- Add department column to store department type (e.g., основное, удаленное)
ALTER TABLE departments 
ADD COLUMN IF NOT EXISTS type VARCHAR(100) DEFAULT 'основное';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_position ON employees(position);

-- Update projects table to ensure start_date and end_date exist
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Create index for better performance on date queries
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);
