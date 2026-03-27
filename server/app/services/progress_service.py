from extension import db
from app.models import Lesson, Progress
from app.services.log_service import log_activity


def mark_lesson_completed(user, lesson_id):
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return None, "Lesson not found"

    existing = Progress.query.filter_by(user_id=user.id, lesson_id=lesson_id).first()
    if existing:
        return existing, "Lesson already marked as completed"

    progress = Progress(
        user_id=user.id,
        course_id=lesson.course_id,
        lesson_id=lesson.id,
        completed=True,
    )

    db.session.add(progress)
    db.session.commit()

    log_activity(
        user.id,
        "Lesson Completed",
        f"Completed lesson '{lesson.title}' in course ID {lesson.course_id}",
    )

    return progress, None


def get_course_progress(user_id, course_id):
    total_lessons = Lesson.query.filter_by(course_id=course_id).count()
    completed_lessons = Progress.query.filter_by(
        user_id=user_id, course_id=course_id, completed=True
    ).count()

    return {
        "course_id": course_id,
        "completed_lessons": completed_lessons,
        "total_lessons": total_lessons,
        "progress_text": f"{completed_lessons}/{total_lessons} lessons completed",
    }