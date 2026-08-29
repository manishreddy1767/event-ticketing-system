"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError(
        "Please agree to the Evently terms before continuing."
      );
      return;
    }

    /*
     * Account creation will be connected to the backend later.
     */
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="campus-background min-h-screen">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0c101a]/95 p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
              <Check size={28} />
            </div>

            <p className="mt-7 text-sm font-medium text-emerald-300">
              Registration ready
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Account created.
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/40">
              Your student account is ready to be connected
              to Evently&apos;s authentication system.
            </p>

            <Link
              href="/login"
              className="mt-7 flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-xs font-semibold text-black transition hover:bg-white/90"
            >
              Continue to sign in
              <ArrowRight size={15} />
            </Link>
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
              Create your student account
            </p>
          </div>

          {/* Card */}

          <div className="rounded-[2rem] border border-white/10 bg-[#0c101a]/95 p-6 shadow-2xl sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
              <UserRound size={19} />
            </div>

            <p className="mt-6 text-sm font-medium text-violet-300">
              Student registration
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              Create account.
            </h1>

            <p className="mt-3 text-xs leading-5 text-white/35">
              Use your college details to create your Evently
              student account.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Full name */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/30"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Your full name"
                    autoComplete="name"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.04]"
                  />
                </div>
              </div>

              {/* Roll number */}

              <div>
                <label
                  htmlFor="rollNumber"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/30"
                >
                  Roll number
                </label>

                <input
                  id="rollNumber"
                  type="text"
                  value={rollNumber}
                  onChange={(event) =>
                    setRollNumber(
                      event.target.value.toUpperCase()
                    )
                  }
                  placeholder="23A81A0501"
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.04]"
                />

                <p className="mt-2 text-[9px] text-white/20">
                  Use the roll number issued by your college.
                </p>
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/30"
                >
                  College email
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
                <label
                  htmlFor="password"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/30"
                >
                  Password
                </label>

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
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
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

              {/* Confirm password */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/30"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  />

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-10 pr-11 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.04]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-white/60"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}

              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) =>
                    setAgreed(event.target.checked)
                  }
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-white/10 bg-white/[0.03] accent-violet-400"
                />

                <span className="text-[10px] leading-4 text-white/30">
                  I agree to Evently&apos;s terms and understand
                  that my college details may be used for event
                  registration and verification.
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
                Create student account
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Login */}

            <div className="mt-7 border-t border-white/[0.07] pt-6 text-center">
              <p className="text-[10px] text-white/25">
                Already have an account?
              </p>

              <Link
                href="/login"
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-violet-300 transition hover:text-violet-200"
              >
                Sign in
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Security note */}

          <div className="mt-5 flex items-center justify-center gap-2 text-[9px] text-white/20">
            <ShieldCheck size={11} />
            Your account information is protected by Evently.
          </div>
        </div>
      </div>
    </main>
  );
}