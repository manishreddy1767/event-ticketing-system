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
  Building2,
  Phone,
} from "lucide-react";

export default function OrganizerRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [organizerName, setOrganizerName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
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
      !organizerName.trim() ||
      !fullName.trim() ||
      !email.trim() ||
      !department.trim() ||
      !phone.trim() ||
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

    if (phone.replace(/\D/g, "").length < 10) {
      setError("Enter a valid phone number.");
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
     * Organizer account creation and admin approval
     * will be connected to the backend later.
     */
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="campus-background min-h-screen">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0c101a]/95 p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
              <ShieldCheck size={28} />
            </div>

            <p className="mt-7 text-sm font-medium text-amber-300">
              Application submitted
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Awaiting approval.
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/40">
              Your organizer application has been submitted.
              An Evently administrator must review and approve
              your account before you can manage events.
            </p>

            <div className="mt-7 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left">
              <p className="text-[9px] uppercase tracking-wider text-white/20">
                Application
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] text-white/25">
                    Organization
                  </span>

                  <span className="text-xs text-white/60">
                    {organizerName}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] text-white/25">
                    Applicant
                  </span>

                  <span className="text-xs text-white/60">
                    {fullName}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] text-white/25">
                    Status
                  </span>

                  <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[9px] text-amber-300">
                    Pending
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-5 text-[10px] leading-5 text-white/25">
              The backend will generate a unique Organizer ID
              after the application is created.
            </p>

            <Link
              href="/login"
              className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-xs font-semibold text-black transition hover:bg-white/90"
            >
              Back to sign in
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
        <div className="w-full max-w-lg">
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
              Apply to become an event organizer
            </p>
          </div>

          {/* Card */}

          <div className="rounded-[2rem] border border-white/10 bg-[#0c101a]/95 p-6 shadow-2xl sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
              <Building2 size={19} />
            </div>

            <p className="mt-6 text-sm font-medium text-violet-300">
              Organizer registration
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              Apply to organize.
            </h1>

            <p className="mt-3 text-xs leading-5 text-white/35">
              Submit your organization details. An Evently
              administrator will review your application before
              organizer access is granted.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* Organization */}

              <div>
                <label
                  htmlFor="organizerName"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/30"
                >
                  Organization / club name
                </label>

                <div className="relative">
                  <Building2
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  />

                  <input
                    id="organizerName"
                    type="text"
                    value={organizerName}
                    onChange={(event) =>
                      setOrganizerName(event.target.value)
                    }
                    placeholder="CSE Department / Coding Club"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.04]"
                  />
                </div>
              </div>

              {/* Applicant name */}

              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/30"
                >
                  Your full name
                </label>

                <div className="relative">
                  <UserRound
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  />

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Your full name"
                    autoComplete="name"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.04]"
                  />
                </div>
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
                    placeholder="organizer@college.edu"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.04]"
                  />
                </div>
              </div>

              {/* Department */}

              <div>
                <label
                  htmlFor="department"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/30"
                >
                  Department
                </label>

                <input
                  id="department"
                  type="text"
                  value={department}
                  onChange={(event) =>
                    setDepartment(event.target.value)
                  }
                  placeholder="Computer Science & Engineering"
                  className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.04]"
                />
              </div>

              {/* Phone */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/30"
                >
                  Phone number
                </label>

                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  />

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.04]"
                  />
                </div>
              </div>

              {/* Reason */}

              <div>
                <label
                  htmlFor="reason"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/30"
                >
                  Purpose
                  <span className="ml-1 normal-case text-white/15">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="reason"
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value)
                  }
                  placeholder="Tell us briefly what type of events you plan to organize..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40 focus:bg-white/[0.04]"
                />
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
                  I confirm that the information provided is
                  accurate and agree to Evently&apos;s organizer
                  terms and platform policies.
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
                Submit organizer application
                <ArrowRight size={15} />
              </button>
            </form>

            {/* Existing account */}

            <div className="mt-7 border-t border-white/[0.07] pt-6 text-center">
              <p className="text-[10px] text-white/25">
                Already have an Evently account?
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

          {/* Approval note */}

          <div className="mt-5 flex items-center justify-center gap-2 text-[9px] text-white/20">
            <ShieldCheck size={11} />
            Organizer accounts require admin approval.
          </div>
        </div>
      </div>
    </main>
  );
}