"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Menu, Bell } from "lucide-react";
import { apiRequest } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";

export default function AddLessonPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [form, setForm] = useState({
    course_id: "",
    title: "",
    content_type: "text",
    duration: "",
    content: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const displayName =
    storedUser?.name ||
    (storedUser?.email ? storedUser.email.split("@")[0] : "Admin");

  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : "A";

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await apiRequest("/courses/mine");
        setCourses(data || []);
      } catch (err) {
        setError(err.message || "Failed to load courses");
      } finally {
        setLoadingCourses(false);
      }
    }

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      course_id: "",
      title: "",
      content_type: "text",
      duration: "",
      content: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const data = await apiRequest("/lessons", {
        method: "POST",
        body: JSON.stringify({
          course_id: form.course_id,
          title: form.title,
          content_type: form.content_type,
          duration: form.duration,
          content: form.content,
        }),
      });

      setMessage(data.message || "Lesson added successfully");
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to add lesson");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRole="admin">
        <div className="flex min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#0A1A33] text-white">
          <Sidebar
            admin
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="flex-1 lg:ml-64 overflow-auto">
            {/* Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
                >
                  <Menu size={22} />
                </button>

                <h1 className="text-xl font-bold tracking-wide">
                  Add New Lesson
                </h1>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  <Bell size={20} className="text-gray-300" />
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#1E3A8A] to-blue-500 flex items-center justify-center text-white font-bold">
                    {avatarLetter}
                  </div>
                  <span className="hidden sm:block text-white text-sm font-medium">
                    {displayName}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-[#10224f] p-6 sm:p-8 shadow-xl">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Add New Lesson
                </h2>

                {message && (
                  <div className="mb-4 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Select Course */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-white">
                      Select Course
                    </label>

                    <div className="relative">
                      <select
                        name="course_id"
                        value={form.course_id}
                        onChange={handleChange}
                        disabled={loadingCourses}
                        className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white outline-none focus:border-white/20 disabled:opacity-60"
                        required
                      >
                        <option value="" className="text-black">
                          {loadingCourses ? "Loading courses..." : "Choose a course"}
                        </option>

                        {courses.map((course) => (
                          <option
                            key={course.id}
                            value={course.id}
                            className="text-black"
                          >
                            {course.title}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={18}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                      />
                    </div>
                  </div>

                  {/* Lesson Title */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-white">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Greetings & Introduction"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/20"
                      required
                    />
                  </div>

                  {/* Type + Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-white">
                        Type
                      </label>

                      <div className="relative">
                        <select
                          name="content_type"
                          value={form.content_type}
                          onChange={handleChange}
                          className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white outline-none focus:border-white/20"
                        >
                          <option value="text" className="text-black">
                            Text
                          </option>
                          <option value="video" className="text-black">
                            Video
                          </option>
                        </select>

                        <ChevronDown
                          size={18}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-white">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={form.duration}
                        onChange={handleChange}
                        placeholder="e.g. 30 min"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/20"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-white">
                      Content / Description
                    </label>
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      placeholder="Lesson content..."
                      rows={4}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/20"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || loadingCourses}
                    className="mt-2 w-full rounded-lg bg-[#1E3A8A] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#2849ad] disabled:opacity-50"
                  >
                    {submitting ? "Adding Lesson..." : "Add Lesson"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}