from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extension import db, migrate, bcrypt, jwt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/api/*": {"origins": [
            "https://mwangazalanguagehub.vercel.app",
            "https://www.mwangazalanguagehub.vercel.app",
        ]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    from app.models import User, Course, Lesson, Progress, ActivityLog
    from app.routes.auth import auth_bp
    from app.routes.admin import admin_bp
    from app.routes.learner import learner_bp
    from app.routes.courses import courses_bp
    from app.routes.lessons import lessons_bp
    from app.routes.progress import progress_bp
    from app.routes.logs import logs_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(learner_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(lessons_bp)
    app.register_blueprint(progress_bp)
    app.register_blueprint(logs_bp)

    @app.get("/")
    def home():
        return jsonify({"message": "Server is running"})

    with app.app_context():
        db.create_all()

    return app