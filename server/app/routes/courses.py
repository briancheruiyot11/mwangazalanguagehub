from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.services.course_service import create_course, get_all_courses, get_course_by_id, get_admin_courses
from app.services.log_service import log_activity
from app.utils.auth import get_current_user
from app.utils.decorators import role_required
from app.utils.validators import validate_required_fields

courses_bp = Blueprint("courses", __name__, url_prefix="/api/courses")


@courses_bp.get("")
def list_courses():
    courses = get_all_courses()
    return jsonify([course.to_dict() for course in courses]), 200


@courses_bp.get("/<int:course_id>")
@jwt_required(optional=True)
def get_course(course_id):
    course = get_course_by_id(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404

    user = get_current_user()
    if user:
        log_activity(user.id, "Viewed Course", f"Viewed course '{course.title}'")

    return jsonify(course.to_dict(include_lessons=True)), 200


@courses_bp.post("")
@role_required("admin")
def create_new_course():
    data = request.get_json() or {}

    missing = validate_required_fields(data, ["title", "description", "category"])
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    admin_user = get_current_user()
    course = create_course(
        data["title"],
        data["description"],
        data["category"],
        admin_user,
    )

    return jsonify({
        "message": "Course created successfully",
        "course": course.to_dict()
    }), 201


@courses_bp.get("/mine")
@role_required("admin")
def my_courses():
    admin_user = get_current_user()
    courses = get_admin_courses(admin_user.id)
    return jsonify([course.to_dict() for course in courses]), 200