-- ROLES --

CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Users --

CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Categories --

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 4. Statuses
CREATE TABLE IF NOT EXISTS statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE 
);


-- 5. Complaints
CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT, 
    location TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (status_id) REFERENCES statuses(id)
);

-- FTS table for complaints search
CREATE VIRTUAL TABLE IF NOT EXISTS complaint_search USING fts5(
    title,
    description,
    content='complaints',
    content_rowid='id'
);

-- Triggers to sync complaints <--> FTS table
CREATE TRIGGER IF NOT EXISTS complaints_ai AFTER INSERT ON complaints BEGIN
    INSERT INTO complaint_search(rowid, title, description)
    VALUES (new.id, new.title, new.description);
END;

CREATE TRIGGER IF NOT EXISTS complaints_ad AFTER DELETE ON complaints BEGIN
    DELETE FROM complaint_search WHERE rowid = old.id;
END;

CREATE TRIGGER IF NOT EXISTS complaints_au AFTER UPDATE ON complaints BEGIN
    UPDATE complaint_search SET title = new.title, description = new.description
    WHERE rowid = old.id;
END;

-- index on user id
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status_id ON complaints(status_id);