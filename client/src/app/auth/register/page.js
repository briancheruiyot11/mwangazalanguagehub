"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, Shield } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "learner",
    adminSecret: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN_SECRET = "Brian124";

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!form.name || !form.email || !form.password || !form.role) {
        throw new Error("Please fill in all required fields");
      }

      if (form.role === "admin" && form.adminSecret !== ADMIN_SECRET) {
        throw new Error("Invalid admin secret password");
      }

      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          adminSecret: form.adminSecret,
        }),
      });

      setSuccess(data.message || "Account created successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "learner",
        adminSecret: "",
      });

      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Registration failed");
      console.error("REGISTER ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1E3A8A] to-[#0A1A33] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-white mb-2">
          Mwangaza Language Hub
        </h1>

        <p className="text-center text-white/70 mb-8">
          Create your account to get started
        </p>

        {error && (
          <p className="mb-4 rounded-md bg-red-500/20 border border-red-400/30 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        {success && (
          <p className="mb-4 rounded-md bg-green-500/20 border border-green-400/30 px-4 py-3 text-sm text-green-200">
            {success}
          </p>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-4 flex items-center gap-3 rounded-md border border-white/20 bg-white/10 px-4 py-3">
            <User size={18} className="text-white/70" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-transparent text-white outline-none placeholder:text-white/50"
            />
          </div>

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

          <div className="mb-4 flex items-center gap-3 rounded-md border border-white/20 bg-white/10 px-4 py-3">
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

          <div className="mb-4">
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-white outline-none"
            >
              <option value="learner" className="text-black">
                Learner
              </option>
              <option value="admin" className="text-black">
                Admin
              </option>
            </select>
          </div>

          {form.role === "admin" && (
            <div className="mb-6 flex items-center gap-3 rounded-md border border-white/20 bg-white/10 px-4 py-3">
              <Shield size={18} className="text-white/70" />
              <input
                type="password"
                name="adminSecret"
                placeholder="Admin Secret Password"
                value={form.adminSecret}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-white outline-none placeholder:text-white/50"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-white px-4 py-3 font-bold text-[#1E3A8A] transition hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          Already have an account?{" "}
          <a href="/auth/login" className="font-semibold text-white hover:underline">
            Login
          </a>
        </p>

        {/* Back to Home BUTTON */}
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