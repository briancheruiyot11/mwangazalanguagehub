"use client";

import { use, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  GraduationCap,
  CheckCircle2,
  Circle,
  Video,
  FileText,
  Menu,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";
import Link from "next/link";

export default function LearnerCourseDetailsPage({ params }) {
  const { id } = use(params);

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [completingLessonId, setCompletingLessonId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const courseData = await apiRequest(`/courses/${id}`);
        setCourse(courseData);

        try {
          const progressData = await apiRequest(`/progress/course/${id}`);
          setProgress(progressData);
        } catch {
          setProgress(null);
        }
      } catch (err) {
        setError(err.message);
      }
    }

    fetchData();
  }, [id]);

  const completedLessonCount = progress?.completed_lessons || 0;
  const totalLessons =
    progress?.total_lessons || course?.lessons?.length || 0;

  const percent =
    totalLessons > 0
      ? Math.round((completedLessonCount / totalLessons) * 100)
      : 0;

  const completedIds = useMemo(() => {
    return new Set(progress?.completed_lesson_ids || []);
  }, [progress]);

  const handleCompleteLesson = async (lessonId) => {
    try {
      setCompletingLessonId(lessonId);

      await apiRequest("/progress/complete", {
        method: "POST",
        body: JSON.stringify({ lesson_id: lessonId }),
      });

      const progressData = await apiRequest(`/progress/course/${id}`);
      setProgress(progressData);
    } catch (err) {
      setError(err.message);
    } finally {
      setCompletingLessonId(null);
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRole="learner">
        <div className="min-h-screen flex bg-gradient-to-b from-[#1E3A8A] to-[#0A1A33] text-white">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="flex-1 lg:ml-64 p-4 sm:p-6">
            <div className="mb-4 lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/15 transition"
              >
                <Menu size={20} className="text-white" />
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            {!course ? (
              <div className="text-white/70 text-sm">Loading course...</div>
            ) : (
              <>
                {/* HERO */}
                <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="h-28 sm:h-36 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6]" />

                  <div className="p-6">
                    <Link
                      href="/learner/courses"
                      className="mb-4 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
                    >
                      <ArrowLeft size={16} />
                      All Courses
                    </Link>

                    <div className="mb-3">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                        {course.category}
                      </span>
                    </div>

                    <h1 className="text-2xl font-semibold mb-3">
                      {course.title}
                    </h1>

                    <p className="text-white/70 text-sm max-w-3xl mb-5">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={16} />
                        <span>Instructor not assigned</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <BookOpen size={16} />
                        <span>{totalLessons} lessons</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>Self paced</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
                  {/* Lessons */}
                  <section>
                    <h2 className="text-xl font-semibold mb-4">Lessons</h2>

                    <div className="space-y-4">
                      {course.lessons?.length ? (
                        course.lessons.map((lesson, index) => (
                          <div
                            key={lesson.id}
                            className="rounded-xl border border-white/10 bg-white/5 p-5"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                              <div className="flex gap-4">
                                <div className="pt-1">
                                  {completedIds.has(lesson.id) ? (
                                    <CheckCircle2
                                      className="text-green-400"
                                      size={22}
                                    />
                                  ) : (
                                    <Circle
                                      className="text-white/40"
                                      size={22}
                                    />
                                  )}
                                </div>

                                <div>
                                  <p className="text-white/40 text-xs mb-1">
                                    {String(index + 1).padStart(2, "0")}
                                  </p>

                                  <h3 className="text-lg font-medium mb-1">
                                    {lesson.title}
                                  </h3>

                                  <p className="text-white/70 text-sm">
                                    {lesson.content}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col items-start sm:items-end gap-2">
                                <div className="flex items-center gap-2 text-white/50 text-xs">
                                  {lesson.content_type === "video" ? (
                                    <Video size={14} />
                                  ) : (
                                    <FileText size={14} />
                                  )}
                                  {lesson.content_type}
                                </div>

                                <button
                                  onClick={() =>
                                    handleCompleteLesson(lesson.id)
                                  }
                                  disabled={
                                    completingLessonId === lesson.id ||
                                    completedIds.has(lesson.id)
                                  }
                                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                                    completedIds.has(lesson.id)
                                      ? "bg-green-600"
                                      : "bg-[#1E3A8A] hover:bg-[#2749ad]"
                                  }`}
                                >
                                  {completedIds.has(lesson.id)
                                    ? "Completed"
                                    : "Complete"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-white/60 text-sm">
                          No lessons added yet.
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Progress */}
                  <aside>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <h3 className="text-lg font-semibold mb-4">
                        Your Progress
                      </h3>

                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-white/60">
                          {completedLessonCount} / {totalLessons}
                        </span>
                        <span className="font-medium">{percent}%</span>
                      </div>

                      <div className="h-2 w-full rounded-full bg-white/10 mb-5">
                        <div
                          className="h-2 rounded-full bg-[#1E3A8A]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Level:</span>{" "}
                          <span className="text-white/70">Beginner</span>
                        </p>

                        <p>
                          <span className="font-medium">Category:</span>{" "}
                          <span className="text-white/70">
                            {course.category}
                          </span>
                        </p>

                        <p>
                          <span className="font-medium">Duration:</span>{" "}
                          <span className="text-white/70">Self paced</span>
                        </p>
                      </div>
                    </div>
                  </aside>
                </div>
              </>
            )}
          </main>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}