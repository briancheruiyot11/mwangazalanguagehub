"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleGuard({ children, allowedRole }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.role !== allowedRole) {
      router.push(
        user.role === "admin"
          ? "/admin/dashboard"
          : "/learner/dashboard"
      );
      return;
    }

    setAllowed(true);
  }, [router, allowedRole]);

  if (!allowed) return null;

  return children;
}