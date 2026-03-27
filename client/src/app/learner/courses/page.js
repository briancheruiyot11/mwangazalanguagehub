"use client";

import { useMemo, useState } from "react";
import { Search, BookOpen, Clock, Bell, Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";
import useCourses from "@/hooks/useCourses";
import Link from "next/link";

export default function LearnerCoursesPage() {
  const { courses, loading } = useCourses("/courses");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = useMemo(() => {
    const allCategories = courses.map((course) => course.category).filter(Boolean);
    return ["All", ...new Set(allCategories)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title?.toLowerCase().includes(search.toLowerCase()) ||
        course.description?.toLowerCase().includes(search.toLowerCase()) ||
        course.category?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [courses, search, selectedCategory]);

  return (
    <ProtectedRoute>
      <RoleGuard allowedRole="learner">
        <div className="flex h-screen bg-linear-to-b from-[#1E3A8A] to-[#0A1A33] text-white">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="flex-1 lg:ml-64 overflow-auto">
            {/* Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 bg-white/10 rounded-lg hover:bg-white/15 transition"
                >
                  <Menu size={20} className="text-white" />
                </button>

                <h1 className="text-xl font-bold tracking-wide">All Languages</h1>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative hidden sm:block">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white/5 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-white/20"
                  />
                </div>

                <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  <Bell size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Category filters */}
            <div className="px-4 sm:px-6 py-4 border-b border-white/10">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium border transition ${
                      selectedCategory === category
                        ? "bg-[#1E3A8A] border-[#1E3A8A] text-white"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {loading ? (
                <Loader />
              ) : filteredCourses.length === 0 ? (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-white/70">
                  No courses found yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/learner/courses/${course.id}`}
                      className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-md transition hover:-translate-y-1 hover:bg-white/10"
                    >
                      {/* Card banner */}
                      <div className="h-40 w-full bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
                        <span className="text-2xl font-bold text-white/90 px-3 text-center">
                          {course.category || "Language"}
                        </span>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                            Beginner
                          </span>
                          <span className="text-gray-400 text-xs">
                            {course.category}
                          </span>
                        </div>

                        <h2 className="text-white font-semibold text-base mb-2 leading-snug">
                          {course.title}
                        </h2>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="flex items-center gap-6 text-xs text-gray-400 border-t border-white/5 pt-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <BookOpen size={14} className="text-blue-400" />
                            <span>{course.lessons?.length || 0} lessons</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-blue-400" />
                            <span>Self paced</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}