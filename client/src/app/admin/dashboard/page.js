"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Menu,
  BookOpen,
  FileText,
  Users,
  ScrollText,
  Plus,
  ClipboardList,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const result = await apiRequest("/admin/overview");
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchOverview();
  }, []);

  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const displayName =
    storedUser?.name ||
    (storedUser?.email ? storedUser.email.split("@")[0] : "Admin");

  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : "A";

  return (
    <ProtectedRoute>
      <RoleGuard allowedRole="admin">
        <div className="min-h-screen flex bg-linear-to-b from-[#1E3A8A] to-[#0A1A33] text-white">
          <Sidebar admin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div className="flex-1 lg:ml-64 overflow-auto min-h-screen">
            {/* Top Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
                >
                  <Menu size={22} />
                </button>

                <h1 className="text-xl font-bold tracking-wide">
                  Admin Dashboard
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
                  <Bell size={20} className="text-gray-300" />
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

            {/* Welcome */}
            <div className="px-4 sm:px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-medium text-white mb-1">
                Karibu, {displayName}!
              </h2>
              <p className="text-gray-400 text-sm">
                Manage your language courses and monitor platform activity.
              </p>
            </div>

            <div className="p-4 sm:p-6">
              {error && (
                <div className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">
                  {error}
                </div>
              )}

              {!data && !error && (
                <p className="text-white/70 text-sm">Loading dashboard...</p>
              )}

              {data && (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-40">
                      <p className="text-gray-400 text-sm mb-2">My Courses</p>
                      <div className="mb-2">
                        <BookOpen size={22} className="text-[#F59E0B]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {data.stats.my_courses}
                      </h3>
                      <div className="mt-2 text-xs text-yellow-400">
                        Courses created
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-40">
                      <p className="text-gray-400 text-sm mb-2">Total Lessons</p>
                      <div className="mb-2">
                        <FileText size={22} className="text-[#93C5FD]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {data.stats.total_lessons}
                      </h3>
                      <div className="mt-2 text-xs text-blue-300">
                        Lessons on platform
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-40">
                      <p className="text-gray-400 text-sm mb-2">Total Users</p>
                      <div className="mb-2">
                        <Users size={22} className="text-[#10B981]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {data.stats.total_users}
                      </h3>
                      <div className="mt-2 text-xs text-green-400">
                        Registered users
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-40">
                      <p className="text-gray-400 text-sm mb-2">Total Logs</p>
                      <div className="mb-2">
                        <ScrollText size={22} className="text-[#F87171]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {data.stats.total_logs}
                      </h3>
                      <div className="mt-2 text-xs text-red-300">
                        Activity records
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                      <button
                        onClick={() => router.push("/admin/courses")}
                        className="text-left bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition"
                      >
                        <Plus size={22} className="text-[#F59E0B] mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Create Course</h3>
                        <p className="text-sm text-white/65">
                          Add a new language course
                        </p>
                      </button>

                      <button
                        onClick={() => router.push("/admin/lessons")}
                        className="text-left bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition"
                      >
                        <FileText size={22} className="text-[#93C5FD] mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Add Lesson</h3>
                        <p className="text-sm text-white/65">
                          Add lessons to a course
                        </p>
                      </button>

                      <button
                        onClick={() => router.push("/admin/courses")}
                        className="text-left bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition"
                      >
                        <BookOpen size={22} className="text-[#10B981] mb-4" />
                        <h3 className="text-lg font-semibold mb-2">View Courses</h3>
                        <p className="text-sm text-white/65">
                          Manage existing courses
                        </p>
                      </button>

                      <button
                        onClick={() => router.push("/admin/logs")}
                        className="text-left bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition"
                      >
                        <ClipboardList size={22} className="text-[#F87171] mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Activity Logs</h3>
                        <p className="text-sm text-white/65">
                          View platform activity
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4">
                        Admin Summary
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {data.message || "Manage courses, lessons, and learner activity from one dashboard."}
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4">
                        Platform Snapshot
                      </h3>

                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between text-gray-300">
                          <span>My Courses</span>
                          <span className="text-white font-medium">
                            {data.stats.my_courses}
                          </span>
                        </div>

                        <div className="flex justify-between text-gray-300">
                          <span>Total Lessons</span>
                          <span className="text-white font-medium">
                            {data.stats.total_lessons}
                          </span>
                        </div>

                        <div className="flex justify-between text-gray-300">
                          <span>Total Users</span>
                          <span className="text-white font-medium">
                            {data.stats.total_users}
                          </span>
                        </div>

                        <div className="flex justify-between text-gray-300">
                          <span>Total Logs</span>
                          <span className="text-white font-medium">
                            {data.stats.total_logs}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}