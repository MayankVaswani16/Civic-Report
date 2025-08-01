from app.db import get_db
from app.db.queries.users import is_admin


def create_complaint(
    user_id, category_id, title, description, image_url, location, status="Pending"
):
    # get Pending status id
    db = get_db()
    # insert complaint
    cursor = db.execute(
        """
        INSERT INTO complaints (
            user_id,
            category_id,
            title,
            description,
            image_url,
            location,
            status_id
        ) VALUES (
            ?, ?, ?, ?, ?, ?, 
            (SELECT id FROM statuses WHERE name = ? LIMIT 1)
        )
        """,
        (user_id, category_id, title, description, image_url, location, status),
    )
    db.commit()
    return cursor.lastrowid


# get complaints by user id and filter by status, view a specific complaint by user id and complaint id


def get_complaints_by_user_id(user_id, page=1, per_page=10, status=None):
    offset = (page - 1) * per_page
    db = get_db()
    is_user_admin = is_admin(user_id)

    select_clause = """
        SELECT 
            complaints.*, 
            statuses.name as status, 
            categories.name as category_name, 
            users.name as user_name
        FROM complaints
        JOIN statuses ON complaints.status_id = statuses.id
        JOIN categories ON complaints.category_id = categories.id
        JOIN users ON complaints.user_id = users.id
    """

    where_clauses = []
    params = []

    if not is_user_admin:
        where_clauses.append("complaints.user_id = ?")
        params.append(user_id)
    if status:
        where_clauses.append("statuses.name = ?")
        params.append(status)

    if where_clauses:
        select_clause += " WHERE " + " AND ".join(where_clauses)

    select_clause += " LIMIT ? OFFSET ?"
    params.extend([per_page, offset])

    return db.execute(select_clause, tuple(params)).fetchall()


def get_complaint_by_user_id_and_complaint_id(user_id, complaint_id):
    db = get_db()
    base_query = """
        SELECT complaints.*, statuses.name as status, categories.name as category_name, users.name as user_name
        FROM complaints
        JOIN statuses ON complaints.status_id = statuses.id
        JOIN categories ON complaints.category_id = categories.id
        JOIN users ON complaints.user_id = users.id
        WHERE complaints.id = ?
    """
    params = [complaint_id]
    if not is_admin(user_id):
        base_query += " AND complaints.user_id = ?"
        params.append(user_id)
    return db.execute(base_query, tuple(params)).fetchone()


def total_complaints(user_id=None, status=None):
    db = get_db()
    if user_id:
        query = """
            SELECT 
                COUNT(*) 
            FROM complaints 
            WHERE user_id = ?
        """
        return db.execute(query, (user_id,)).fetchone()[0]
    elif status:
        query = """
            SELECT 
                COUNT(*) 
            FROM complaints 
            WHERE status_id = (SELECT id FROM statuses WHERE name = ? LIMIT 1)
        """
        return db.execute(query, (status,)).fetchone()[0]
    else:
        query = """
            SELECT COUNT(*) FROM complaints
        """
        return db.execute(query).fetchone()[0]


def update_complaint(complaint_id, status):
    db = get_db()
    db.execute(
        "UPDATE complaints SET status_id = (SELECT id FROM statuses WHERE name = ? LIMIT 1) WHERE id = ?",
        (status, complaint_id),
    )
    db.commit()


def search_complaints(query, user_id=None):
    # add category name and user name to the query
    db = get_db()
    base_sql = """
        SELECT complaints.*, statuses.name as status, categories.name as category_name, users.name as user_name FROM complaint_search
        JOIN complaints ON complaint_search.rowid = complaints.id
        JOIN statuses ON complaints.status_id = statuses.id
        JOIN categories ON complaints.category_id = categories.id
        JOIN users ON complaints.user_id = users.id
        WHERE complaint_search MATCH ?
    """
    params = [query]
    if user_id is not None and not is_admin(user_id):
        base_sql += " AND complaints.user_id = ?"
        params.append(user_id)
    return db.execute(base_sql, params).fetchall()
