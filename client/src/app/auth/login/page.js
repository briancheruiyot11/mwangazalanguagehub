"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/learner/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1E3A8A] to-[#0A1A33] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-white mb-2">
          Mwangaza Language Hub
        </h1>

        <p className="text-center text-white/70 mb-8">
          Sign in to continue learning
        </p>

        {error && (
          <p className="mb-4 rounded-md bg-red-500/20 border border-red-400/30 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4 flex items-center gap-3 rounded-md border border-white/20 bg-white/10 px-4 py-3">
            <Mail size={18} className="text-white/70" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent text-white outline-none placeholder:text-white/50"
            />
          </div>

          <div className="mb-6 flex items-center gap-3 rounded-md border border-white/20 bg-white/10 px-4 py-3">
            <Lock size={18} className="text-white/70" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent text-white outline-none placeholder:text-white/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-white/70 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-white px-4 py-3 font-bold text-[#1E3A8A] transition hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/register"
            className="font-semibold text-white hover:underline"
          >
            Sign Up
          </a>
        </p>

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 text-sm font-medium text-white rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}