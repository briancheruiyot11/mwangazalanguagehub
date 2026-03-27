"use client";

import { useState } from "react";
import { BookOpen, Trophy, ChartColumn, Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";

export default function ProgressPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-xl font-bold mb-1">Your Progress</h1>
              <p className="text-white/70 text-sm">
                Track your learning journey across all courses
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {/* Courses Enrolled */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <BookOpen size={24} className="mb-3 text-[#F59E0B]" />
                <h3 className="text-2xl font-bold">0</h3>
                <p className="text-white/70 text-sm mt-2">
                  Courses Enrolled
                </p>
              </div>

              {/* Completed Lessons */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <Trophy size={24} className="mb-3 text-[#10B981]" />
                <h3 className="text-2xl font-bold">0</h3>
                <p className="text-white/70 text-sm mt-2">
                  Lessons Completed
                </p>
              </div>

              {/* Overall Progress */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-3">
                  <ChartColumn size={24} className="text-[#93C5FD]" />
                  <span className="text-lg font-semibold">0%</span>
                </div>

                <p className="text-white/70 text-sm mb-3">
                  Overall Progress
                </p>

                <div className="h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-white"
                    style={{ width: "0%" }}
                  />
                </div>
              </div>
            </div>

            {/* Progress Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">
                Course Progress Overview
              </h2>

              <p className="text-white/70 text-sm">
                Open a course from the Courses page to view detailed progress
                and track lesson completion.
              </p>
            </div>
          </main>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}