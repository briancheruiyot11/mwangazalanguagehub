from flask import Blueprint, request, jsonify

from app.services.lesson_service import add_lesson_to_course, get_course_lessons
from app.utils.auth import get_current_user
from app.utils.decorators import role_required
from app.utils.validators import validate_required_fields, validate_content_type

lessons_bp = Blueprint("lessons", __name__, url_prefix="/api/lessons")


@lessons_bp.post("")
@role_required("admin")
def add_lesson():
    data = request.get_json() or {}

    missing = validate_required_fields(data, ["course_id", "title", "content_type", "content"])
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    if not validate_content_type(data["content_type"]):
        return jsonify({"error": "content_type must be 'text' or 'video'"}), 400

    admin_user = get_current_user()
    lesson, error = add_lesson_to_course(
        int(data["course_id"]),
        data["title"],
        data["content_type"],
        data["content"],
        admin_user,
    )

    if error:
        return jsonify({"error": error}), 404

    return jsonify({
        "message": "Lesson added successfully",
        "lesson": lesson.to_dict()
    }), 201


@lessons_bp.get("/course/<int:course_id>")
def list_course_lessons(course_id):
    lessons = get_course_lessons(course_id)
    return jsonify([lesson.to_dict() for lesson in lessons]), 200