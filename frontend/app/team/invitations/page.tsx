"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";

type InvitationStatus =
  | "pending"
  | "accepted"
  | "declined";

const invitation = {
  id: 1,
  event: {
    title: "AI Hackathon 2026",
    date: "12 September 2026",
    time: "9:00 AM – 6:00 PM",
    venue: "Main Auditorium",
  },
  team: {
    name: "Neural Ninjas",
    size: 3,
  },
  inviter: {
    name: "Manish Reddy",
    rollNumber: "23A81A05XX",
  },
  expiresIn: "24 hours",
};

const teamMembers = [
  {
    name: "Manish Reddy",
    rollNumber: "23A81A05XX",
    role: "Team Leader",
    status: "Leader",
  },
  {
    name: "Rahul Kumar",
    rollNumber: "23A81A0501",
    role: "Teammate",
    status: "You",
  },
  {
    name: "Priya Sharma",
    rollNumber: "23A81A0512",
    role: "Teammate",
    status: "Pending",
  },
];

export default function TeamInvitationPage() {
  const [status, setStatus] =
    useState<InvitationStatus>("pending");

  function acceptInvitation() {
    setStatus("accepted");
  }

  function declineInvitation() {
    setStatus("declined");
  }

  /* =========================
     ACCEPTED STATE
  ========================= */

  if (status === "accepted") {
    return (
      <main className="campus-background flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0c101a]/95 p-8 text-center shadow-2xl"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
            <Check size={30} />
          </div>

          <p className="mt-7 text-sm font-medium text-emerald-300">
            Invitation accepted
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            You&apos;re on the team.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/40">
            You have joined{" "}
            <span className="text-white/70">
              {invitation.team.name}
            </span>{" "}
            for {invitation.event.title}.
          </p>

          <div className="mt-7 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                <Users size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {invitation.team.name}
                </p>

                <p className="mt-1 text-[10px] text-white/25">
                  {invitation.team.size} members
                </p>
              </div>

              <span className="ml-auto rounded-full bg-emerald-400/10 px-3 py-1.5 text-[10px] text-emerald-300">
                Joined
              </span>
            </div>

            <div className="mt-5 border-t border-white/[0.07] pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/30">
                  Event
                </span>

                <span className="text-xs text-white/60">
                  {invitation.event.title}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-white/30">
                  Date
                </span>

                <span className="text-xs text-white/60">
                  {invitation.event.date}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/events"
            className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Browse events
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </main>
    );
  }

  /* =========================
     DECLINED STATE
  ========================= */

  if (status === "declined") {
    return (
      <main className="campus-background flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0c101a]/95 p-8 text-center shadow-2xl"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
            <X size={30} />
          </div>

          <p className="mt-7 text-sm font-medium text-red-300">
            Invitation declined
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            You left the invitation.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/40">
            You have declined the invitation to join{" "}
            {invitation.team.name}.
          </p>

          <Link
            href="/events"
            className="mt-7 flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] text-sm font-medium text-white transition hover:bg-white/[0.07]"
          >
            Back to events
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </main>
    );
  }

  /* =========================
     PENDING INVITATION
  ========================= */

  return (
    <main className="campus-background min-h-screen">

      {/* =========================
          NAVBAR
      ========================= */}

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

              <span className="text-sm font-medium text-white">
                Invitations
              </span>

              <Link
                href="/tickets"
                className="text-sm text-white/45 transition hover:text-white"
              >
                My Tickets
              </Link>
            </div>

            <span className="text-sm text-white/50">
              My Account
            </span>
          </nav>
        </div>
      </header>

      {/* =========================
          CONTENT
      ========================= */}

      <section className="mx-auto max-w-5xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">

        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to events
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium text-violet-300">
            Team invitation
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            You&apos;ve been invited.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/40">
            A teammate has invited you to participate in
            an event. Review the details before joining the
            team.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* =========================
              INVITATION CARD
          ========================= */}

          <div className="rounded-[2rem] border border-white/10 bg-[#0c101a]/95 p-6 sm:p-8">

            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/25">
                  Event
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  {invitation.event.title}
                </h2>
              </div>

              <span className="rounded-full border border-amber-400/10 bg-amber-400/[0.06] px-3 py-1.5 text-[10px] text-amber-300">
                Pending response
              </span>
            </div>

            {/* Event information */}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-white/25">
                  <CalendarDays size={15} />

                  <span className="text-[10px]">
                    Date
                  </span>
                </div>

                <p className="mt-3 text-xs font-medium">
                  {invitation.event.date}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-white/25">
                  <Clock3 size={15} />

                  <span className="text-[10px]">
                    Time
                  </span>
                </div>

                <p className="mt-3 text-xs font-medium">
                  {invitation.event.time}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-white/25">
                  <MapPin size={15} />

                  <span className="text-[10px]">
                    Venue
                  </span>
                </div>

                <p className="mt-3 text-xs font-medium">
                  {invitation.event.venue}
                </p>
              </div>
            </div>

            {/* Inviter */}

            <div className="mt-7 border-t border-white/[0.07] pt-7">
              <p className="text-[10px] uppercase tracking-wider text-white/25">
                Invited by
              </p>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-sm font-semibold text-violet-300">
                  MR
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {invitation.inviter.name}
                  </p>

                  <p className="mt-1 text-[10px] text-white/25">
                    {invitation.inviter.rollNumber} • Team
                    Leader
                  </p>
                </div>
              </div>
            </div>

            {/* Team */}

            <div className="mt-7 border-t border-white/[0.07] pt-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/25">
                    Team
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    {invitation.team.name}
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                  <Users size={18} />
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {teamMembers.map((member) => (
                  <div
                    key={member.rollNumber}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                  >
                    <div>
                      <p className="text-xs font-medium">
                        {member.name}
                      </p>

                      <p className="mt-1 text-[10px] text-white/25">
                        {member.rollNumber}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] ${
                        member.status === "You"
                          ? "bg-violet-400/10 text-violet-300"
                          : member.status === "Leader"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-white/[0.05] text-white/30"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={declineInvitation}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] text-sm font-medium text-white/60 transition hover:bg-red-400/[0.05] hover:text-red-300"
              >
                <X size={16} />
                Decline
              </button>

              <button
                type="button"
                onClick={acceptInvitation}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Accept invitation
                <Check size={16} />
              </button>
            </div>
          </div>

          {/* =========================
              SIDE PANEL
          ========================= */}

          <aside className="space-y-4">

            {/* Expiry */}

            <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-5">
              <div className="flex items-start gap-3">
                <Clock3
                  size={17}
                  className="mt-0.5 text-amber-300"
                />

                <div>
                  <p className="text-xs font-medium text-amber-200">
                    Invitation expires
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    Within {invitation.expiresIn}
                  </p>

                  <p className="mt-2 text-[10px] leading-4 text-white/25">
                    Accept the invitation before it expires
                    to join the team.
                  </p>
                </div>
              </div>
            </div>

            {/* What happens */}

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-[10px] uppercase tracking-wider text-white/25">
                After you accept
              </p>

              <div className="mt-5 space-y-4">
                {[
                  "You become an official team member.",
                  "Your registration is linked to your student account.",
                  "You receive your own event ticket and QR code.",
                  "Your attendance and certificate are recorded separately.",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex gap-3"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                      <Check size={12} />
                    </div>

                    <p className="text-[11px] leading-5 text-white/35">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}

            <div className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-emerald-400/70"
              />

              <div>
                <p className="text-xs font-medium">
                  Verified student account
                </p>

                <p className="mt-1 text-[10px] leading-4 text-white/25">
                  Your invitation is tied to your Evently
                  student account, so another student cannot
                  accept it on your behalf.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}