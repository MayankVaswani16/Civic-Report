from flask import Flask
from app.db import get_db, close_db
from app.routes import auth, complaints, main, other

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object("app.config.Config")

    app.secret_key = app.config["SECRET_KEY"]

    app.teardown_appcontext(close_db)
    
    # Register blueprints
    app.register_blueprint(auth.auth_bp)
    app.register_blueprint(complaints.complaints_bp)
    app.register_blueprint(main.main_bp)
    app.register_blueprint(other.other_bp)
    
    # Initialize DB with schema
    with app.app_context():
        db = get_db()
        with open("app/db/schema.sql") as f:
            db.executescript(f.read())

    return app
