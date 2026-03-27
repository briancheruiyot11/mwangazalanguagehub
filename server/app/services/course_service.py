from extension import db
from app.models import Course
from app.services.log_service import log_activity


def create_course(title, description, category, admin_user):
    course = Course(
        title=title.strip(),
        description=description.strip(),
        category=category.strip(),
        created_by=admin_user.id,
    )
    db.session.add(course)
    db.session.commit()

    log_activity(
        admin_user.id,
        "Course Created",
        f"Created course '{course.title}' in category '{course.category}'",
    )

    return course


def get_all_courses():
    return Course.query.order_by(Course.created_at.desc()).all()


def get_course_by_id(course_id):
    return Course.query.get(course_id)


def get_admin_courses(admin_id):
    return Course.query.filter_by(created_by=admin_id).order_by(Course.created_at.desc()).all()