from flask_jwt_extended import get_jwt_identity
from app.models import User


def get_current_user():
    identity = get_jwt_identity()
    if not identity:
        return None
    return User.query.get(int(identity))