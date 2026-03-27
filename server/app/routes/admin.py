from flask import Blueprint, jsonify

from app.models import User, Course, Lesson, ActivityLog
from app.utils.decorators import role_required
from app.utils.auth import get_current_user

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


@admin_bp.get("/overview")
@role_required("admin")
def admin_overview():
    admin = get_current_user()

    return jsonify({
        "message": f"Welcome, {admin.name}",
        "stats": {
            "my_courses": Course.query.filter_by(created_by=admin.id).count(),
            "total_lessons": Lesson.query.count(),
            "total_users": User.query.count(),
            "total_logs": ActivityLog.query.count(),
        }
    }), 200