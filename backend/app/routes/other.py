from flask import Blueprint, jsonify
from app.db.queries import other as other_queries


other_bp = Blueprint("other", __name__, url_prefix="/api/other")


@other_bp.route("/categories", methods=["GET"])
def get_categories():
    categories = other_queries.get_all_categories()
    categories = [{"id": category[0], "name": category[1]} for category in categories]
    return jsonify({"categories": categories}), 200


@other_bp.route("/statuses", methods=["GET"])
def get_statuses():
    statuses = other_queries.get_all_statuses()
    statuses = [{"id": status[0], "name": status[1]} for status in statuses]
    return jsonify({"statuses": statuses}), 200


@other_bp.route("/stats", methods=["GET"])
def get_stats():
    stats = other_queries.get_stats()
    return jsonify({"stats": stats}), 200
