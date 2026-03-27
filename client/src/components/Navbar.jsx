"use client";

import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-4">
      <Link href="/" className="text-xl font-bold">
        KBC LMS
      </Link>

      <div className="flex items-center gap-4">
        {!user && (
          <>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/register">Register</Link>
          </>
        )}

        {user && (
          <>
            <span className="text-sm text-gray-600">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}