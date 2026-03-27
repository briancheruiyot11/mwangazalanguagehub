from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, authenticate_user
from app.utils.validators import validate_required_fields

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

ADMIN_SECRET = "Brian124"


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}

    missing = validate_required_fields(data, ["name", "email", "password", "role"])
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    role = data["role"].strip().lower()

    if role not in ["admin", "learner"]:
        return jsonify({"error": "Role must be either 'admin' or 'learner'"}), 400

    if role == "admin":
        admin_secret = data.get("adminSecret", "")
        if admin_secret != ADMIN_SECRET:
            return jsonify({"error": "Invalid admin secret password"}), 403

    user, error = register_user(
        data["name"],
        data["email"],
        data["password"],
        role,
    )

    if error:
        return jsonify({"error": error}), 400

    return jsonify({
        "message": f"{role.capitalize()} registered successfully",
        "user": user.to_dict()
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}

    missing = validate_required_fields(data, ["email", "password"])
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    result, error = authenticate_user(data["email"], data["password"])
    if error:
        return jsonify({"error": error}), 401

    return jsonify(result), 200