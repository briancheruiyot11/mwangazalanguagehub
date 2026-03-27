"use client";

import { useEffect, useState } from "react";
import { Search, Bell, BookOpen, Trophy, ChartColumn, Menu } from "lucide-react";
import { apiRequest } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";

export default function LearnerDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const result = await apiRequest("/learner/dashboard");
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchDashboard();
  }, []);

  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const displayName =
    storedUser?.name ||
    (storedUser?.email ? storedUser.email.split("@")[0] : "Learner");

  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : "L";

  const completedLessons = data?.completed_lessons || 0;
  const inProgressCourses = 0;
  const overallProgress = 0;

  return (
    <ProtectedRoute>
      <RoleGuard allowedRole="learner">
        <div className="flex min-h-screen bg-gradient-to-b from-[#1E3A8A] to-[#0A1A33] text-white">
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
                  className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
                >
                  <Menu size={22} />
                </button>

                <h1 className="text-xl font-bold tracking-wide">
                  Learning Dashboard
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
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#1E3A8A] to-blue-500 flex items-center justify-center text-white font-bold">
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
                Here&apos;s your learning overview
              </p>
            </div>

            <div className="p-4 sm:p-6">
              {error && (
                <div className="mb-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">
                  {error}
                </div>
              )}

              {!data && !error && (
                <p className="text-white/70 text-sm">Loading your dashboard...</p>
              )}

              {data && (
                <>
                  {/* Top Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* In Progress */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-40">
                      <p className="text-gray-400 text-sm mb-2">Courses In Progress</p>
                      <div className="mb-2">
                        <BookOpen size={22} className="text-[#F59E0B]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {inProgressCourses}
                      </h3>
                      <div className="mt-2 text-xs text-yellow-400">
                        Ongoing learning
                      </div>
                    </div>

                    {/* Completed */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-40">
                      <p className="text-gray-400 text-sm mb-2">Completed Lessons</p>
                      <div className="mb-2">
                        <Trophy size={22} className="text-[#10B981]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {completedLessons}
                      </h3>
                      <div className="mt-2 text-xs text-green-400">
                        Lessons finished
                      </div>
                    </div>

                    {/* Progress Count */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-40">
                      <p className="text-gray-400 text-sm mb-2">Overall Progress</p>
                      <div className="mb-2">
                        <ChartColumn size={22} className="text-[#93C5FD]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {overallProgress}%
                      </h3>
                      <div className="mt-2 text-xs text-blue-300">
                        Learning completion
                      </div>
                    </div>

                    {/* Snapshot */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-40 flex flex-col">
                      <p className="text-gray-400 text-sm mb-2">Progress Overview</p>
                      <div className="mt-auto">
                        <div className="h-3 w-full rounded-full bg-white/10">
                          <div
                            className="h-3 rounded-full bg-white"
                            style={{ width: `${overallProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Learning Summary */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4">
                        Learning Summary
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {data.message || `Welcome, ${displayName}`}
                      </p>
                    </div>

                    {/* Progress Snapshot */}
                    <div className="lg:col-span-2 bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-white font-semibold mb-4">
                        Progress Snapshot
                      </h3>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-gray-400 text-sm">
                              <th className="text-left pb-3">Metric</th>
                              <th className="text-left pb-3">Value</th>
                            </tr>
                          </thead>
                          <tbody className="text-white text-sm">
                            <tr className="border-t border-white/5">
                              <td className="py-3">Completed Lessons</td>
                              <td className="py-3">{completedLessons}</td>
                            </tr>
                            <tr className="border-t border-white/5">
                              <td className="py-3">Courses In Progress</td>
                              <td className="py-3">{inProgressCourses}</td>
                            </tr>
                            <tr className="border-t border-white/5">
                              <td className="py-3">Overall Progress</td>
                              <td className="py-3">{overallProgress}%</td>
                            </tr>
                          </tbody>
                        </table>
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