from app.db import get_db

# Get user by username (for login or duplicate check)
def get_user_by_email(email):
    db = get_db()
    query = "SELECT * FROM users WHERE email = ?"
    return db.execute(query, (email,)).fetchone()


# Create new user (during registration)
def create_user(name, email, password_hash, role='user'):
    db = get_db()
    query = """
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES (?, ?, ?, (SELECT id FROM roles WHERE name = ? LIMIT 1))
    """
    db.execute(query, (name, email, password_hash, role))
    db.commit()

# Get user by ID (for protected routes)
def get_user_by_id(user_id):
    db = get_db()
    query = """
        SELECT users.*, roles.name as role
        FROM users
        JOIN roles ON users.role_id = roles.id
        WHERE users.id = ?
    """
    return db.execute(query, (user_id,)).fetchone()

def is_admin(user_id):
    db = get_db()
    query = """
        SELECT 1
        FROM users
        JOIN roles ON users.role_id = roles.id
        WHERE users.id = ? AND roles.name = 'admin'
        LIMIT 1
    """
    return db.execute(query, (user_id,)).fetchone() is not None