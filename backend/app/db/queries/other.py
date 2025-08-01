from app.db import get_db

# get all categories and their ids
def get_all_categories():
    db = get_db()
    return db.execute("SELECT id, name FROM categories").fetchall()

def get_all_statuses():
    db = get_db()
    return db.execute("SELECT id, name FROM statuses").fetchall()

# get stats: total reports, pending, resolved
def get_stats():
    db = get_db()
    # Get total, pending, and resolved report counts in a single query
    query = """
        SELECT
            COUNT(*) as total_reports,
            SUM(CASE WHEN status_id = (SELECT id FROM statuses WHERE name = 'Pending' LIMIT 1) THEN 1 ELSE 0 END) as pending_reports,
            SUM(CASE WHEN status_id = (SELECT id FROM statuses WHERE name = 'Resolved' LIMIT 1) THEN 1 ELSE 0 END) as resolved_reports
        FROM complaints
    """
    data = db.execute(query).fetchone()
    return {
        "total_reports": data["total_reports"],
        "pending_reports": data["pending_reports"],
        "resolved_reports": data["resolved_reports"],
    }
