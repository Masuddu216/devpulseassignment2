
-- Database Schema


CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CREATE TABLE IF NOT EXISTS issues (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(150) NOT NULL,
--     description TEXT NOT NULL CHECK (char_length(description) >= 20),
--     type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')),
--     status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
--     reporter_id INTEGER NOT NULL,
--     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_type ON issues(type);
CREATE INDEX IF NOT EXISTS idx_issues_reporter_id ON issues(reporter_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);