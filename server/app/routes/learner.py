from flask import Blueprint, jsonify

from app.models import Progress
from app.utils.decorators import role_required
from app.utils.auth import get_current_user

learner_bp = Blueprint("learner", __name__, url_prefix="/api/learner")


@learner_bp.get("/dashboard")
@role_required("learner")
def learner_dashboard():
    learner = get_current_user()
    progress_count = Progress.query.filter_by(user_id=learner.id, completed=True).count()

    return jsonify({
        "message": f"Welcome, {learner.name}",
        "user": learner.to_dict(),
        "completed_lessons": progress_count
    }), 200