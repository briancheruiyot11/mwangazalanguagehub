"use client";

import { useEffect, useState } from "react";
import { Bell, Clock3, Menu } from "lucide-react";
import { apiRequest } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";
import Loader from "@/components/Loader";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const displayName =
    storedUser?.name ||
    (storedUser?.email ? storedUser.email.split("@")[0] : "Admin");

  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : "A";

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await apiRequest("/logs");
        setLogs(data || []);
      } catch (err) {
        setError(err.message || "Failed to load logs");
      }
    }

    fetchLogs();
  }, []);

  const formatRelativeTime = (value) => {
    if (!value) return "Recently";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const inferActor = (log) => {
    const text = `${log.action || ""} ${log.details || ""}`.toLowerCase();

    if (text.includes("admin")) return "Admin";
    if (text.includes("system")) return "System";
    if (text.includes("learner")) return "Learner";

    return "System";
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
                  Activity Logs
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
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                  Activity Logs
                </h2>
                <p className="text-white/70 text-lg">
                  Recent platform activity
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {!logs.length && !error ? (
                <Loader />
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                          <Clock3 size={20} className="text-white/75" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold text-white">
                            {log.action}
                          </p>
                          <p className="truncate text-sm text-white/65">
                            {log.details}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-left sm:text-right">
                        <p className="text-sm text-white/80">
                          {inferActor(log)}
                        </p>
                        <p className="text-sm text-white/60">
                          {formatRelativeTime(log.created_at)}
                        </p>
                      </div>
                    </div>
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