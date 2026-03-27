from extension import db
from app.models import ActivityLog


def log_activity(user_id, action, details=None):
    log = ActivityLog(user_id=user_id, action=action, details=details)
    db.session.add(log)
    db.session.commit()
    return log


def get_all_logs():
    return ActivityLog.query.order_by(ActivityLog.created_at.desc()).all()