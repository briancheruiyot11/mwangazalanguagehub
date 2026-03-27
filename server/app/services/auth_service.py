from datetime import timedelta
from flask_jwt_extended import create_access_token

from extension import db, bcrypt
from app.models import User
from app.services.log_service import log_activity


def register_user(name, email, password, role="learner"):
    existing_user = User.query.filter_by(email=email.strip().lower()).first()
    if existing_user:
        return None, "Email already exists"

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    user = User(
        name=name.strip(),
        email=email.strip().lower(),
        password=hashed_password,
        role=role.strip().lower(),
    )

    db.session.add(user)
    db.session.commit()

    # Temporarily disable this line for testing
    # log_activity(user.id, "User Registered", f"{user.email} registered as {user.role}")

    return user, None


def authenticate_user(email, password):
    user = User.query.filter_by(email=email.strip().lower()).first()

    if not user:
        return None, "Invalid email or password"

    if not bcrypt.check_password_hash(user.password, password):
        return None, "Invalid email or password"

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "name": user.name},
        expires_delta=timedelta(days=1),
    )

    # Temporarily disable this line for testing
    # log_activity(user.id, "User Logged In", f"{user.email} logged in")

    return {"token": token, "user": user.to_dict()}, None