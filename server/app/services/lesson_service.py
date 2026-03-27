from extension import db
from app.models import Course, Lesson
from app.services.log_service import log_activity


def add_lesson_to_course(course_id, title, content_type, content, admin_user):
    course = Course.query.get(course_id)
    if not course:
        return None, "Course not found"

    lesson = Lesson(
        course_id=course_id,
        title=title.strip(),
        content_type=content_type.strip(),
        content=content.strip(),
    )

    db.session.add(lesson)
    db.session.commit()

    log_activity(
        admin_user.id,
        "Lesson Added",
        f"Added lesson '{lesson.title}' to course '{course.title}'",
    )

    return lesson, None


def get_course_lessons(course_id):
    return Lesson.query.filter_by(course_id=course_id).order_by(Lesson.id.asc()).all()