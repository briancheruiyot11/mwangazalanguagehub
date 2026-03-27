import CourseCard from "./CourseCard";

export default function CourseList({ courses = [], admin = false }) {
  if (!courses.length) {
    return <p className="text-white/70">No courses found.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} admin={admin} />
      ))}
    </div>
  );
}