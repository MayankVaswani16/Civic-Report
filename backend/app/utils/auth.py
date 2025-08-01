from flask import request, jsonify, current_app
import jwt
from functools import wraps
from app.db.queries.users import get_user_by_id, is_admin
import time

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token missing"}), 401
        token = token.split(" ")[1]
        try:
            decoded = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            exp = decoded.get("exp")

            if exp and exp < time.time():
                return jsonify({"error": "Token expired"}), 401
            user = get_user_by_id(decoded["user_id"])
            if not user:
                return jsonify({"error": "Invalid user"}), 401
            request.user = user
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token missing"}), 401
        token = token.split(" ")[1]
        try:
            decoded = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"]) 
            user = get_user_by_id(decoded["user_id"])
            if not user:
                return jsonify({"error": "Invalid user"}), 401
            if not is_admin(user["id"]):
                return jsonify({"error": "Admin access required"}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated