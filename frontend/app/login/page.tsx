"use client";

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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.");
      return;
    }

    /*
     * Authentication will be connected to the backend later.
     * The backend will determine whether the account belongs
     * to a student, organizer, or admin.
     */
    setError(
      "Authentication is not connected yet. The backend will handle login."
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

          <div className="rounded-[2rem] border border-white/10 bg-[#0c101a]/95 p-6 shadow-2xl sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
              <ShieldCheck size={19} />
            </div>

            <p className="mt-6 text-sm font-medium text-violet-300">
              Welcome back
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              Sign in.
            </h1>

            <p className="mt-3 text-xs leading-5 text-white/35">
              Sign in to manage your events, tickets, teams,
              attendance, and certificates.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/30"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@college.edu"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.04]"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-[10px] font-medium uppercase tracking-wider text-white/30"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-[9px] text-violet-300 transition hover:text-violet-200"
                    onClick={() =>
                      setError(
                        "Password reset will be connected to the backend later."
                      )
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-10 pr-11 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.04]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-white/60"
                  >
                    {showPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}

              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-white/10 bg-white/[0.03] accent-violet-400"
                />

                <span className="text-[10px] text-white/30">
                  Remember me
                </span>
              </label>

              {/* Error */}

              {error && (
                <div className="rounded-xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3 text-[10px] leading-4 text-red-300">
                  {error}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-xs font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Sign in
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Register */}

            <div className="mt-7 border-t border-white/[0.07] pt-6 text-center">
              <p className="text-[10px] text-white/25">
                Don&apos;t have an account?
              </p>

              <Link
                href="/register"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-violet-300 transition hover:text-violet-200"
              >
                Create an account
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Security note */}

          <div className="mt-5 flex items-center justify-center gap-2 text-[9px] text-white/20">
            <LockKeyhole size={11} />
            Your account security is protected by Evently.
          </div>

          <p className="mt-4 text-center text-[9px] leading-4 text-white/15">
            Student, organizer, and admin accounts use the same
            secure sign-in system. Your account role is
            determined by the platform.
          </p>
        </div>
      </div>
    </main>
  );
}