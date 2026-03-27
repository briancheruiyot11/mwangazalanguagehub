"use client";

import Link from "next/link";
import { BookOpen, Globe, BarChart2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-[#1E3A8A] to-[#0A1A33] text-white px-4">

      {/* Navbar */}
      <nav className="flex justify-between items-center py-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-extrabold">
          Mwangaza Language Hub
        </h1>

        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="px-6 py-2 rounded-md border border-white font-semibold hover:bg-white/10 transition-all"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 rounded-md bg-white text-[#1E3A8A] font-bold hover:bg-gray-100 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-20 max-w-3xl mx-auto">
        <h2 className="text-5xl font-extrabold mb-4">
          Learn Kenyan Languages Easily
        </h2>

        <p className="text-white/80 text-lg mb-8">
          Discover, learn, and track your progress in Kenyan languages like Kikuyu, Luo,
          Kalenjin, Luhya, Kamba, and more all in one platform.
        </p>

        <div className="flex gap-4">
          <Link
            href="/auth/register"
            className="px-6 py-3 rounded-md bg-white text-[#1E3A8A] font-bold hover:bg-gray-100 transform hover:scale-[1.02] transition-all"
          >
            Get Started
          </Link>

          <a
            href="#features"
            className="px-6 py-3 rounded-md border border-white font-semibold hover:bg-white/10 transition-all"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="mt-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Feature 1 */}
        <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all">
          <BookOpen size={36} className="mb-4" />
          <h3 className="text-xl font-bold mb-2">Structured Courses</h3>
          <p className="text-white/80">
            Learn step-by-step with organized lessons including text and video content.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all">
          <Globe size={36} className="mb-4" />
          <h3 className="text-xl font-bold mb-2">Kenyan Languages</h3>
          <p className="text-white/80">
            Explore languages like Kikuyu, Luo, Kalenjin, Luhya, Kamba, and Meru.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all">
          <BarChart2 size={36} className="mb-4" />
          <h3 className="text-xl font-bold mb-2">Track Progress</h3>
          <p className="text-white/80">
            Monitor your learning journey and see how many lessons you’ve completed.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 py-6 text-center text-white/60">
        &copy; {new Date().getFullYear()} Mwangaza Language Hub. All rights reserved.
      </footer>
    </div>
  );
}