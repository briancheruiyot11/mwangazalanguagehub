from flask import Blueprint, request, jsonify

from app.services.progress_service import mark_lesson_completed, get_course_progress
from app.utils.auth import get_current_user
from app.utils.decorators import role_required
from app.utils.validators import validate_required_fields

progress_bp = Blueprint("progress", __name__, url_prefix="/api/progress")


@progress_bp.post("/complete")
@role_required("learner")
def complete_lesson():
    data = request.get_json() or {}

    missing = validate_required_fields(data, ["lesson_id"])
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    learner = get_current_user()
    progress, error = mark_lesson_completed(learner, int(data["lesson_id"]))

    if error == "Lesson not found":
        return jsonify({"error": error}), 404

    if error == "Lesson already marked as completed":
        return jsonify({"message": error, "progress": progress.to_dict()}), 200

    return jsonify({
        "message": "Lesson marked as completed",
        "progress": progress.to_dict()
    }), 201


@progress_bp.get("/course/<int:course_id>")
@role_required("learner")
def course_progress(course_id):
    learner = get_current_user()
    result = get_course_progress(learner.id, course_id)
    return jsonify(result), 200