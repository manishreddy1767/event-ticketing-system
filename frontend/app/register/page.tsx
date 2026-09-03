"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { registerStudent } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (
      !name.trim() ||
      !rollNumber.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid college email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Evently terms before continuing.");
      return;
    }

    setLoading(true);

    try {
      await registerStudent({ name, email, password });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="campus-background min-h-screen">
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
          <div className="w-full max-w-md text-center">
            <div className="mb-6 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight">Account created</h1>

            <p className="mt-3 text-sm text-white/50">
              Your student account has been created successfully.
              You can now sign in and start exploring events.
            </p>

            <Link
              href="/login"
              className="mt-8 block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Sign in
            </Link>

            <p className="mt-6 text-xs text-white/30">
              Already have an account?{" "}
              <Link href="/login" className="underline hover:text-white">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
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
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>

            <p className="mt-2 text-sm text-white/50">
              Register as a student to book event tickets
            </p>

            {error && (
              <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Name */}

              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Full Name
                </label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.02] pl-10 pr-4 text-sm outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Roll Number */}

              <div>
                <label htmlFor="rollNumber" className="mb-1.5 block text-sm font-medium">
                  Roll Number
                </label>

                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                  <input
                    id="rollNumber"
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.02] pl-10 pr-4 text-sm outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                    placeholder="23CSE042"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  College Email
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
                    autoComplete="new-password"
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

              {/* Confirm Password */}

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.02] pl-10 pr-12 text-sm outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms */}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/[0.02] text-violet-500 focus:ring-violet-500/50"
                />
                <span className="text-sm text-white/60">
                  I agree to the{" "}
                  <a href="#" className="underline hover:text-white">
                    Evently Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline hover:text-white">
                    Privacy Policy
                  </a>
                </span>
              </label>

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
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Create account
                    <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-white/30">
              Already have an account?{" "}
              <Link href="/login" className="underline hover:text-white">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}