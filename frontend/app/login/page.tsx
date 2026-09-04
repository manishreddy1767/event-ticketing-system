"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { login, type ApiUser } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.");
      setLoading(false);
      return;
    }

    try {
      const response = await login({ email, password });
      await authLogin(response.access_token, response.role);

      // Redirect based on role
      switch (response.role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "organizer":
          router.push("/organizer/dashboard");
          break;
        case "student":
        default:
          router.push("/events");
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="campus-background min-h-screen">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Brand */}

          <div className="mb-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
                E
              </div>

              <span className="text-xl font-bold tracking-tight">
                Evently
              </span>
            </Link>

            <p className="mt-5 text-xs text-white/30">
              College event management platform
            </p>
          </div>

          {/* Card */}

          <div className="rounded-[1.5rem] border border-white/10 bg-[#0c101a]/95 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>

            <p className="mt-2 text-sm text-white/50">
              Sign in to your account to continue
            </p>

            {error && (
              <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Email */}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.02] pl-10 pr-4 text-sm outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                    placeholder="you@college.edu"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.02] pl-10 pr-12 text-sm outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-white/50 transition hover:text-white"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="group w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign in
                    <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider text-white/20">
                <span className="bg-[#0c101a]/95 px-2">Other options</span>
              </div>
            </div>

            {/* Register links */}

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/register"
                className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-medium text-center transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Student
              </Link>

              <Link
                href="/organizer/register"
                className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-medium text-center transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Organizer
              </Link>
            </div>

            <p className="mt-6 text-center text-xs text-white/30">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-white">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-white">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}