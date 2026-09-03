"use client";

import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
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
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0c101a]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <Link
              href="/login"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>

            <h1 className="text-2xl font-bold tracking-tight">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Password reset will be available soon.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-white/40" />

                <div>
                  <p className="text-sm font-medium">
                    Password recovery
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white/40">
                    We&apos;ll add email verification and secure password
                    reset functionality here in a future update.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/login"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
