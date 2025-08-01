from flask import Blueprint, request, jsonify
from app.db.queries import complaints as complaints_queries, other as other_queries
from app.utils.auth import login_required, admin_required


complaints_bp = Blueprint("complaints", __name__, url_prefix="/api/complaints")


@complaints_bp.route("/create", methods=["POST"])
@login_required
def create_complaint():
    data = request.json
    user_id = request.user["id"]
    category_id = data.get("category_id")
    title = data.get("title")
    description = data.get("description")
    image_url = data.get("image_url")
    location = data.get("location")

    complaint_id = complaints_queries.create_complaint(
        user_id, category_id, title, description, image_url, location
    )
    return jsonify({
        "message": "Complaint created successfully",
        "complaint_id": complaint_id
    }), 201


@complaints_bp.route("/get", methods=["GET"])
@login_required
def get_complaints():
    user_id = request.user["id"]
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    status = request.args.get("status")

    complaints = complaints_queries.get_complaints_by_user_id(
        user_id, page, per_page, status
    )
    complaints = [dict(complaint) for complaint in complaints]
    return jsonify({"complaints": complaints}), 200


@complaints_bp.route("/get/<int:complaint_id>", methods=["GET"])
@login_required
def get_complaint(complaint_id):
    user_id = request.user["id"]
    complaint = complaints_queries.get_complaint_by_user_id_and_complaint_id(
        user_id, complaint_id
    )
    complaint = dict(complaint)
    return jsonify({"complaint": complaint}), 200


@complaints_bp.route("/search", methods=["GET"])
@login_required
def search_complaints():
    query = request.args.get("query")
    user_id = request.user["id"]
    complaints = complaints_queries.search_complaints(query, user_id)
    complaints = [dict(complaint) for complaint in complaints]
    return jsonify({"complaints": complaints}), 200

# update complaint
@complaints_bp.route("/update/<int:complaint_id>", methods=["PUT"])
@login_required
@admin_required # temporary
def update_complaint(complaint_id):
    data = request.json
    status = data.get("status")
    complaints_queries.update_complaint(complaint_id, status)
    return jsonify({"message": "Complaint updated successfully"}), 200
