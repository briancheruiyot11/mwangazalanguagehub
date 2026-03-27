"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  FilePlus2,
  ScrollText,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react";

export default function Sidebar({ admin = false, isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();
  const router = useRouter();

  const learnerLinks = [
    {
      href: "/learner/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/learner/courses",
      label: "Courses",
      icon: BookOpen,
    },
    {
      href: "/learner/progress",
      label: "Progress",
      icon: TrendingUp,
    },
  ];

  const adminLinks = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/courses",
      label: "Courses",
      icon: BookOpen,
    },
    {
      href: "/admin/lessons",
      label: "Add Lesson",
      icon: FilePlus2,
    },
    {
      href: "/admin/logs",
      label: "Activity Logs",
      icon: ScrollText,
    },
  ];

  const links = admin ? adminLinks : learnerLinks;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/10
          bg-linear-to-b from-[#1E3A8A] to-[#0A1A33] text-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="p-6">
          {/* Mobile Close Button */}
          <div className="flex items-start justify-between lg:block">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-linear-to-b from-[#1E3A8A] to-blue-500 rounded-xl flex items-center justify-center">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold leading-none">Mwangaza</h1>
                <p className="text-white/75 text-sm">Language Hub</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10"
            >
              <X size={22} />
            </button>
          </div>

          <div className="space-y-1 mb-6">
            <p className="text-gray-400 text-xs uppercase mb-3">MAIN MENU</p>

            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-white/15 text-white shadow-md"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {admin && (
            <div className="space-y-1 mb-6">
              {/* <p className="text-gray-400 text-xs uppercase mb-3">MANAGEMENT</p> */}

              {/* <Link
                href="/admin/logs"
                onClick={handleLinkClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  pathname.startsWith("/admin/logs")
                    ? "bg-white/15 text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <ScrollText size={20} />
                <span className="text-sm font-medium">Logs</span>
              </Link> */}
            </div>
          )}

          <div className="space-y-1">
            <p className="text-gray-400 text-xs uppercase mb-3">ACCOUNT</p>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}