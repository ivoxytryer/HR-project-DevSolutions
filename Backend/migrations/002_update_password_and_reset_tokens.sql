-- Update admin password to 'admin123'
UPDATE users SET password = '$2a$10$YH.RWKSPX0Wdzo3U9KOlHOEq4C4JuSlaJaDuU2i7XGfk85HfxoVCK' WHERE email = 'admin@example.com';

-- Create password_reset_tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
