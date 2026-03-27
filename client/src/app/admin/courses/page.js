"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Clock,
  X,
  Bell,
  Menu,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";
import useCourses from "@/hooks/useCourses";
import { apiRequest } from "@/lib/api";
import Input from "@/components/Input";

export default function AdminCoursesPage() {
  const { courses, loading, setCourses } = useCourses("/courses/mine");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "",
    duration: "",
    level: "Beginner",
    image_url: "",
  });

  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const displayName =
    storedUser?.name ||
    (storedUser?.email ? storedUser.email.split("@")[0] : "Admin");

  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : "A";

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const q = search.toLowerCase();
      return (
        course.title?.toLowerCase().includes(q) ||
        course.description?.toLowerCase().includes(q) ||
        course.category?.toLowerCase().includes(q)
      );
    });
  }, [courses, search]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      instructor: "",
      category: "",
      duration: "",
      level: "Beginner",
      image_url: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        instructor: form.instructor,
        duration: form.duration,
        level: form.level,
        image_url: form.image_url,
      };

      const data = await apiRequest("/courses", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setCourses((prev) => [data.course, ...prev]);
      setMessage(data.message || "Course created successfully");
      resetForm();

      setTimeout(() => {
        setIsModalOpen(false);
        setMessage("");
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRole="admin">
        <div className="flex min-h-screen bg-linear-to-b from-[#1E3A8A] to-[#0A1A33] text-white">
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
                  Manage Courses
                </h1>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative hidden md:block">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-white/5 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/20"
                  />
                </div>

                <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  <Bell size={20} className="text-gray-400" />
                </button>

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-linear-to-r from-[#1E3A8A] to-blue-500 flex items-center justify-center text-white font-bold">
                    {avatarLetter}
                  </div>
                  <span className="hidden sm:block text-white text-sm font-medium">
                    {displayName}
                  </span>
                </div>
              </div>
            </div>

            
    

            <div className="p-4 sm:p-6">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-medium text-white mb-1">
                    Course Library
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {courses.length} courses available
                  </p>
                </div>

                <button
                  onClick={() => {
                    setError("");
                    setMessage("");
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-white text-sm font-medium hover:bg-white/15 transition-all"
                >
                  <Plus size={18} />
                  New Course
                </button>
              </div>

              <div className="mb-8 relative max-w-xl">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
                />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-white placeholder:text-white/50 outline-none focus:border-white/20"
                />
              </div>

              {loading ? (
                <Loader />
              ) : filteredCourses.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-gray-400 text-sm">
                  No courses found.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-24 overflow-hidden rounded-xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] shrink-0">
                          {course.image_url ? (
                            <img
                              src={course.image_url}
                              alt={course.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-white/90">
                              {course.category || "Course"}
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold leading-snug text-white">
                            {course.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-5 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                              <BookOpen size={16} />
                              <span>{course.lessons?.length || 0} lessons</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock size={16} />
                              <span>{course.duration || "Self paced"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="self-start md:self-center">
                        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white">
                          {course.category || "General"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-none"
                  onClick={() => setIsModalOpen(false)}
                />

                <div className="relative z-10 w-full max-w-xl rounded-xl border border-white/10 bg-[#10224f] p-5 sm:p-6 shadow-xl">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                      Create New Course
                    </h2>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {message && (
                    <div className="mb-3 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                      {message}
                    </div>
                  )}

                  {error && (
                    <div className="mb-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <Input
                      label="Course Title"
                      name="title"
                      placeholder="e.g. Learn Kikuyu — Gĩkũyũ Language"
                      value={form.title}
                      onChange={handleChange}
                      light
                    />

                    <div className="mb-3">
                      <label className="mb-2 block text-sm font-medium text-white">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the course..."
                        rows={3}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        label="Instructor"
                        name="instructor"
                        placeholder="Instructor name"
                        value={form.instructor}
                        onChange={handleChange}
                        light
                      />

                      <Input
                        label="Language / Category"
                        name="category"
                        placeholder="e.g. Kikuyu"
                        value={form.category}
                        onChange={handleChange}
                        light
                      />

                      <Input
                        label="Duration"
                        name="duration"
                        placeholder="e.g. 4h 30m"
                        value={form.duration}
                        onChange={handleChange}
                        light
                      />

                      <div className="mb-3">
                        <label className="mb-2 block text-sm font-medium text-white">
                          Level
                        </label>
                        <select
                          name="level"
                          value={form.level}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
                        >
                          <option value="Beginner" className="text-black">
                            Beginner
                          </option>
                          <option value="Intermediate" className="text-black">
                            Intermediate
                          </option>
                          <option value="Advanced" className="text-black">
                            Advanced
                          </option>
                        </select>
                      </div>
                    </div>

                    <Input
                      label="Image URL"
                      name="image_url"
                      placeholder="https://images.unsplash.com/..."
                      value={form.image_url}
                      onChange={handleChange}
                      light
                    />

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-2 w-full rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2849ad] disabled:opacity-50"
                    >
                      {submitting ? "Creating Course..." : "Create Course"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}