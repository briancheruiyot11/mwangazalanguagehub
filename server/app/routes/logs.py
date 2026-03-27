from flask import Blueprint, jsonify

from app.services.log_service import get_all_logs
from app.utils.decorators import role_required

logs_bp = Blueprint("logs", __name__, url_prefix="/api/logs")


@logs_bp.get("")
@role_required("admin")
def list_logs():
    logs = get_all_logs()
    return jsonify([log.to_dict() for log in logs]), 200