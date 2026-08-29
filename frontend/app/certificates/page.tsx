"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

type Certificate = {
  id: string;
  event: string;
  type: "Participation" | "Winner";
  team: string;
  participant: string;
  date: string;
  issued: string;
  status: "Issued" | "Pending";
};

const certificates: Certificate[] = [
  {
    id: "CERT-AI26-RK-001",
    event: "AI Hackathon 2026",
    type: "Participation",
    team: "Neural Ninjas",
    participant: "Rahul Kumar",
    date: "12 September 2026",
    issued: "15 September 2026",
    status: "Issued",
  },
  {
    id: "CERT-WEB26-RK-004",
    event: "Web Innovation Challenge",
    type: "Winner",
    team: "Solo Participant",
    participant: "Rahul Kumar",
    date: "20 September 2026",
    issued: "22 September 2026",
    status: "Issued",
  },
];

export default function CertificatesPage() {
  return (
    <main className="campus-background min-h-screen">
      {/* Navbar */}

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 backdrop-blur-xl sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
                E
              </div>

              <span className="text-lg font-bold tracking-tight">
                Evently
              </span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <Link
                href="/events"
                className="text-sm text-white/45 transition hover:text-white"
              >
                Events
              </Link>

              <Link
                href="/team/invitations"
                className="text-sm text-white/45 transition hover:text-white"
              >
                Invitations
              </Link>

              <Link
                href="/tickets"
                className="text-sm text-white/45 transition hover:text-white"
              >
                My Tickets
              </Link>

              <span className="text-sm font-medium text-white">
                Certificates
              </span>
            </div>

            <span className="text-sm text-white/50">
              My Account
            </span>
          </nav>
        </div>
      </header>

      {/* Content */}

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to tickets
        </Link>

        <div className="mt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
            <Award size={22} />
          </div>

          <p className="mt-6 text-sm font-medium text-amber-300">
            Your achievements
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Certificates.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/40">
            Your verified event achievements, participation
            records, and awards — all linked to your student
            account.
          </p>
        </div>

        {/* Summary */}

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <p className="text-[10px] uppercase tracking-wider text-white/25">
              Certificates
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {certificates.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <p className="text-[10px] uppercase tracking-wider text-white/25">
              Participation
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {
                certificates.filter(
                  (certificate) =>
                    certificate.type === "Participation"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <p className="text-[10px] uppercase tracking-wider text-white/25">
              Awards
            </p>

            <p className="mt-3 text-3xl font-semibold">
              {
                certificates.filter(
                  (certificate) =>
                    certificate.type === "Winner"
                ).length
              }
            </p>
          </div>
        </div>

        {/* Certificate cards */}

        <div className="mt-8 space-y-4">
          {certificates.map((certificate) => (
            <article
              key={certificate.id}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c101a]/95"
            >
              <div className="grid lg:grid-cols-[1fr_300px]">
                {/* Information */}

                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                          certificate.type === "Winner"
                            ? "bg-amber-400/10 text-amber-300"
                            : "bg-violet-400/10 text-violet-300"
                        }`}
                      >
                        {certificate.type === "Winner" ? (
                          <Trophy size={21} />
                        ) : (
                          <Award size={21} />
                        )}
                      </div>

                      <div>
                        <span
                          className={`rounded-full px-3 py-1.5 text-[9px] ${
                            certificate.type === "Winner"
                              ? "bg-amber-400/10 text-amber-300"
                              : "bg-violet-400/10 text-violet-300"
                          }`}
                        >
                          {certificate.type}
                        </span>

                        <h2 className="mt-4 text-xl font-semibold tracking-tight">
                          {certificate.event}
                        </h2>

                        <p className="mt-1 text-xs text-white/30">
                          {certificate.team}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-[9px] text-emerald-300">
                      <CheckCircle2 size={12} />
                      {certificate.status}
                    </div>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <CalendarDays
                        size={15}
                        className="text-white/25"
                      />

                      <p className="mt-3 text-[10px] text-white/25">
                        Event date
                      </p>

                      <p className="mt-1 text-xs font-medium">
                        {certificate.date}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <Award
                        size={15}
                        className="text-white/25"
                      />

                      <p className="mt-3 text-[10px] text-white/25">
                        Issued
                      </p>

                      <p className="mt-1 text-xs font-medium">
                        {certificate.issued}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 flex items-center gap-3 border-t border-white/[0.07] pt-6">
                    <Users
                      size={15}
                      className="text-white/25"
                    />

                    <div>
                      <p className="text-xs font-medium">
                        {certificate.participant}
                      </p>

                      <p className="mt-1 text-[10px] text-white/25">
                        Individual certificate
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-[10px] uppercase tracking-wider text-white/20">
                      Certificate ID
                    </p>

                    <p className="mt-2 font-mono text-xs text-white/45">
                      {certificate.id}
                    </p>
                  </div>
                </div>

                {/* Preview */}

                <div className="border-t border-white/[0.07] bg-white/[0.015] p-6 sm:p-8 lg:border-l lg:border-t-0">
                  <div className="relative flex min-h-[250px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#111622] p-6 text-center">
                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

                    <div className="relative">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/5 text-amber-300">
                        {certificate.type === "Winner" ? (
                          <Trophy size={21} />
                        ) : (
                          <Award size={21} />
                        )}
                      </div>

                      <p className="mt-5 text-[9px] uppercase tracking-[0.25em] text-white/25">
                        Evently Certificate
                      </p>

                      <p className="mt-3 text-sm font-semibold">
                        {certificate.type}
                      </p>

                      <p className="mt-2 text-[10px] leading-4 text-white/30">
                        {certificate.participant}
                      </p>

                      <div className="mx-auto mt-5 h-px w-24 bg-white/10" />

                      <p className="mt-4 text-[9px] text-white/20">
                        {certificate.event}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-xs font-semibold text-black transition hover:bg-white/90"
                    >
                      <Download size={14} />
                      Download
                    </button>

                    <button
                      type="button"
                      className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <ExternalLink size={14} />
                      View
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Verification */}

        <div className="mt-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <ShieldCheck size={18} />
            </div>

            <div>
              <p className="text-sm font-medium">
                Certificates are verifiable
              </p>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-white/30">
                Every certificate receives a unique ID. An
                organiser or third party will eventually be
                able to verify its authenticity without
                needing access to your account.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}