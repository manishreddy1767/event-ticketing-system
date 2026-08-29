"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  MapPin,
  QrCode,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

type TicketStatus = "confirmed" | "checked-in";

type EventTicket = {
  id: string;
  event: string;
  team: string;
  ticketType: string;
  participant: string;
  rollNumber: string;
  date: string;
  time: string;
  venue: string;
  status: TicketStatus;
  certificate: "available" | "pending";
};

const tickets: EventTicket[] = [
  {
    id: "EVT-AI26-7F31",
    event: "AI Hackathon 2026",
    team: "Neural Ninjas",
    ticketType: "Team of 3",
    participant: "Rahul Kumar",
    rollNumber: "23A81A0501",
    date: "12 September 2026",
    time: "9:00 AM – 6:00 PM",
    venue: "Main Auditorium",
    status: "confirmed",
    certificate: "pending",
  },
  {
    id: "EVT-WEB26-91D4",
    event: "Web Innovation Challenge",
    team: "Solo Participant",
    ticketType: "Individual",
    participant: "Rahul Kumar",
    rollNumber: "23A81A0501",
    date: "20 September 2026",
    time: "10:00 AM – 4:00 PM",
    venue: "Innovation Lab",
    status: "checked-in",
    certificate: "available",
  },
];

export default function MyTicketsPage() {
  const [selectedTicket, setSelectedTicket] =
    useState<EventTicket | null>(tickets[0]);

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

              <Link
                href="/team/invitations"
                className="text-sm text-white/45 transition hover:text-white"
              >
                Invitations
              </Link>

              <span className="text-sm font-medium text-white">
                My Tickets
              </span>
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

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Browse events
        </Link>

        <div className="mt-8">
          <p className="text-sm font-medium text-violet-300">
            Your event access
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            My tickets.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/40">
            Every ticket is linked to your student account.
            Use your personal QR code for event check-in.
          </p>
        </div>

        {/* =========================
            TICKET LAYOUT
        ========================= */}

        <div className="mt-10 grid gap-6 lg:grid-cols-[380px_1fr]">

          {/* =========================
              TICKET LIST
          ========================= */}

          <div className="space-y-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wider text-white/25">
                Registered events
              </p>

              <span className="text-[10px] text-white/25">
                {tickets.length} tickets
              </span>
            </div>

            {tickets.map((ticket) => {
              const selected =
                selectedTicket?.id === ticket.id;

              return (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-violet-400/30 bg-violet-400/[0.06]"
                      : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          selected
                            ? "bg-violet-400/10 text-violet-300"
                            : "bg-white/[0.05] text-white/30"
                        }`}
                      >
                        <Ticket size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {ticket.event}
                        </p>

                        <p className="mt-1 text-[10px] text-white/25">
                          {ticket.team}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] ${
                        ticket.status === "checked-in"
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-violet-400/10 text-violet-300"
                      }`}
                    >
                      {ticket.status === "checked-in"
                        ? "Checked in"
                        : "Confirmed"}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <span className="text-[10px] text-white/30">
                      {ticket.date}
                    </span>

                    <span className="text-[10px] text-white/30">
                      {ticket.ticketType}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* =========================
              TICKET PREVIEW
          ========================= */}

          {selectedTicket && (
            <motion.div
              key={selectedTicket.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c101a]/95"
            >
              {/* Header */}

              <div className="border-b border-white/[0.07] p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-violet-400/10 px-3 py-1.5 text-[9px] font-medium text-violet-300">
                        {selectedTicket.status ===
                        "checked-in"
                          ? "CHECKED IN"
                          : "CONFIRMED"}
                      </span>

                      {selectedTicket.certificate ===
                        "available" && (
                        <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-[9px] text-emerald-300">
                          CERTIFICATE READY
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                      {selectedTicket.event}
                    </h2>

                    <p className="mt-2 text-xs text-white/30">
                      {selectedTicket.team} •{" "}
                      {selectedTicket.ticketType}
                    </p>
                  </div>

                  <Ticket
                    size={22}
                    className="text-white/20"
                  />
                </div>
              </div>

              {/* Ticket body */}

              <div className="grid md:grid-cols-[1fr_260px]">

                {/* Information */}

                <div className="p-6 sm:p-8">
                  <p className="text-[10px] uppercase tracking-wider text-white/25">
                    Participant
                  </p>

                  <div className="mt-4">
                    <p className="text-xl font-semibold">
                      {selectedTicket.participant}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {selectedTicket.rollNumber}
                    </p>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <CalendarDays
                        size={15}
                        className="text-white/25"
                      />

                      <p className="mt-3 text-[10px] text-white/25">
                        Date
                      </p>

                      <p className="mt-1 text-xs font-medium">
                        {selectedTicket.date}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <Clock3
                        size={15}
                        className="text-white/25"
                      />

                      <p className="mt-3 text-[10px] text-white/25">
                        Time
                      </p>

                      <p className="mt-1 text-xs font-medium">
                        {selectedTicket.time}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 sm:col-span-2">
                      <MapPin
                        size={15}
                        className="text-white/25"
                      />

                      <p className="mt-3 text-[10px] text-white/25">
                        Venue
                      </p>

                      <p className="mt-1 text-xs font-medium">
                        {selectedTicket.venue}
                      </p>
                    </div>
                  </div>

                  {/* Team */}

                  <div className="mt-8 border-t border-white/[0.07] pt-7">
                    <div className="flex items-center gap-3">
                      <Users
                        size={16}
                        className="text-violet-300"
                      />

                      <div>
                        <p className="text-xs font-medium">
                          {selectedTicket.team}
                        </p>

                        <p className="mt-1 text-[10px] text-white/25">
                          Your team registration
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ticket ID */}

                  <div className="mt-7 border-t border-white/[0.07] pt-7">
                    <p className="text-[10px] uppercase tracking-wider text-white/25">
                      Ticket ID
                    </p>

                    <p className="mt-2 font-mono text-xs text-white/50">
                      {selectedTicket.id}
                    </p>
                  </div>
                </div>

                {/* QR */}

                <div className="border-t border-white/[0.07] bg-white/[0.015] p-6 sm:p-8 md:border-l md:border-t-0">
                  <div className="flex h-full flex-col items-center justify-center text-center">

                    <div className="rounded-2xl border border-white/10 bg-white p-5">
                      {/* 
                       * Frontend placeholder.
                       * Later this will be replaced by a real QR
                       * generated from the backend ticket ID.
                       */}
                      <div className="flex h-44 w-44 items-center justify-center bg-black">
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({
                            length: 49,
                          }).map((_, index) => {
                            const pattern =
                              (index * 17 +
                                index * index) %
                              5;

                            return (
                              <div
                                key={index}
                                className={`h-4 w-4 ${
                                  pattern < 2
                                    ? "bg-white"
                                    : "bg-black"
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-emerald-300">
                      <QrCode size={15} />

                      <span className="text-[10px] font-medium">
                        Personal QR ticket
                      </span>
                    </div>

                    <p className="mt-2 max-w-[220px] text-[10px] leading-4 text-white/25">
                      Present this QR code at the event
                      entrance for attendance verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}

              <div className="border-t border-white/[0.07] p-6 sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row">

                  <button
                    type="button"
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-xs font-semibold text-black transition hover:bg-white/90"
                  >
                    <Download size={15} />
                    Download ticket
                  </button>

                  {selectedTicket.certificate ===
                    "available" && (
                    <Link
                      href="/certificates"
                      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/[0.08]"
                    >
                      View certificate
                      <ExternalLink size={14} />
                    </Link>
                  )}
                </div>

                <div className="mt-5 flex items-start gap-2 text-[10px] leading-4 text-white/25">
                  <ShieldCheck
                    size={14}
                    className="mt-0.5 shrink-0 text-emerald-400/70"
                  />

                  This ticket belongs to{" "}
                  {selectedTicket.participant}. Do not share
                  your QR code with another participant.
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* =========================
            ATTENDANCE INFO
        ========================= */}

        <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p className="text-sm font-medium">
                Attendance is individual
              </p>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-white/30">
                Every team member has their own ticket and QR
                code. When the organiser scans a member&apos;s
                QR code, only that student&apos;s attendance is
                recorded. This also determines their
                eligibility for a participation or winner
                certificate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}