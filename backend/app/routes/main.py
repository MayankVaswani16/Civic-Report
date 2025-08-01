from flask import Blueprint, jsonify

main_bp = Blueprint("main", __name__)

@main_bp.route("/", methods=["GET"])
def home():
    return jsonify({"message": "ok"})

@main_bp.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "message": "Civic Report API is running",
        "version": "1.0.0"
    })
