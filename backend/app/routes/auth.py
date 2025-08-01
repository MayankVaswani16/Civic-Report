from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import time
from app.db.queries import users as auth_queries
from app.utils.auth import login_required, admin_required


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if auth_queries.get_user_by_email(email):
        return jsonify({"error": "Email already exists"}), 400

    hashed_pw = generate_password_hash(password)
    auth_queries.create_user(name, email, hashed_pw)
    return jsonify({"message": "User registered successfully"}), 201



@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = auth_queries.get_user_by_email(email)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode(
        {
            "user_id": user["id"],
            "exp": time.time() + 60 * 60 * 24,
        },
        current_app.config["SECRET_KEY"],
        algorithm="HS256",
    )

    return jsonify({"token": token}), 200


@auth_bp.route("/profile", methods=["GET"])
@login_required
def profile():
    user_id = request.user["id"]
    user = auth_queries.get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_dict = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
    }
    return jsonify({"user": user_dict}), 200


# get user by id
@auth_bp.route("/user/<int:user_id>", methods=["GET"])
@admin_required # temporary
@login_required
def get_user(user_id):
    user = auth_queries.get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user_dict = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
    }   
    return jsonify({"user": user_dict}), 200