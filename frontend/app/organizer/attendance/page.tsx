"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock3,
  QrCode,
  Search,
  ShieldCheck,
  Ticket,
  Users,
  XCircle,
} from "lucide-react";

type ParticipantStatus = "checked-in" | "pending";

type Participant = {
  id: string;
  name: string;
  email: string;
  team: string;
  ticket: string;
  status: ParticipantStatus;
  checkInTime?: string;
};

const initialParticipants: Participant[] = [
  {
    id: "1",
    name: "Manish Reddy",
    email: "manish@example.com",
    team: "Team Alpha",
    ticket: "EVT-1024",
    status: "checked-in",
    checkInTime: "9:17 AM",
  },
  {
    id: "2",
    name: "Rahul Kumar",
    email: "rahul@example.com",
    team: "Team Alpha",
    ticket: "EVT-1025",
    status: "checked-in",
    checkInTime: "9:18 AM",
  },
  {
    id: "3",
    name: "Arjun Sharma",
    email: "arjun@example.com",
    team: "Team Alpha",
    ticket: "EVT-1026",
    status: "pending",
  },
  {
    id: "4",
    name: "Sandeep Rao",
    email: "sandeep@example.com",
    team: "Team Alpha",
    ticket: "EVT-1027",
    status: "pending",
  },
  {
    id: "5",
    name: "Priya Reddy",
    email: "priya@example.com",
    team: "Code Queens",
    ticket: "EVT-1028",
    status: "checked-in",
    checkInTime: "9:21 AM",
  },
  {
    id: "6",
    name: "Ananya Singh",
    email: "ananya@example.com",
    team: "Code Queens",
    ticket: "EVT-1029",
    status: "pending",
  },
];

export default function AttendancePage() {
  const [participants, setParticipants] =
    useState<Participant[]>(initialParticipants);

  const [ticketInput, setTicketInput] = useState("");
  const [search, setSearch] = useState("");
  const [scanMessage, setScanMessage] = useState<{
    type: "success" | "warning" | "error";
    title: string;
    description: string;
  } | null>(null);

  const checkedInCount = participants.filter(
    (participant) => participant.status === "checked-in"
  ).length;

  const pendingCount = participants.length - checkedInCount;

  const attendancePercentage =
    participants.length === 0
      ? 0
      : Math.round(
          (checkedInCount / participants.length) * 100
        );

  const filteredParticipants = participants.filter(
    (participant) => {
      const value = search.toLowerCase().trim();

      if (!value) return true;

      return (
        participant.name.toLowerCase().includes(value) ||
        participant.email.toLowerCase().includes(value) ||
        participant.team.toLowerCase().includes(value) ||
        participant.ticket.toLowerCase().includes(value)
      );
    }
  );

  function scanTicket() {
    const ticket = ticketInput.trim().toUpperCase();

    if (!ticket) {
      setScanMessage({
        type: "warning",
        title: "Enter a ticket ID",
        description:
          "Enter the participant ticket ID before confirming attendance.",
      });

      return;
    }

    const participant = participants.find(
      (item) => item.ticket.toUpperCase() === ticket
    );

    if (!participant) {
      setScanMessage({
        type: "error",
        title: "Invalid ticket",
        description:
          "This ticket could not be found for AI Hackathon 2026.",
      });

      return;
    }

    if (participant.status === "checked-in") {
      setScanMessage({
        type: "warning",
        title: "Already checked in",
        description: `${participant.name} was already checked in at ${participant.checkInTime}.`,
      });

      return;
    }

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    setParticipants((current) =>
      current.map((item) =>
        item.id === participant.id
          ? {
              ...item,
              status: "checked-in",
              checkInTime: currentTime,
            }
          : item
      )
    );

    setTicketInput("");

    setScanMessage({
      type: "success",
      title: "Attendance confirmed",
      description: `${participant.name} has been checked in successfully.`,
    });
  }

  function markAttendance(participantId: string) {
    const participant = participants.find(
      (item) => item.id === participantId
    );

    if (!participant) return;

    if (participant.status === "checked-in") {
      setScanMessage({
        type: "warning",
        title: "Already checked in",
        description: `${participant.name} is already marked as present.`,
      });

      return;
    }

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    setParticipants((current) =>
      current.map((item) =>
        item.id === participantId
          ? {
              ...item,
              status: "checked-in",
              checkInTime: currentTime,
            }
          : item
      )
    );

    setScanMessage({
      type: "success",
      title: "Attendance confirmed",
      description: `${participant.name} has been marked present.`,
    });
  }

  return (
    <main className="campus-background min-h-screen">
      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.07] bg-[#080b12]/90 px-4 py-6 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
              E
            </div>

            <span className="text-lg font-bold tracking-tight">
              Evently
            </span>
          </Link>

          <div className="mt-8 rounded-xl border border-violet-400/10 bg-violet-400/[0.04] p-3">
            <p className="text-[9px] uppercase tracking-wider text-white/20">
              Workspace
            </p>

            <p className="mt-1 text-xs font-medium text-violet-300">
              Organizer
            </p>
          </div>

          <nav className="mt-7 space-y-1">
            <p className="mb-3 px-3 text-[9px] uppercase tracking-wider text-white/20">
              Management
            </p>

            <Link
              href="/organizer/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Activity size={16} />
              Dashboard
            </Link>

            <Link
              href="/organizer/events"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white"
            >
              <CalendarIcon />
              Events
            </Link>

            <Link
              href="/organizer/registrations"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Users size={16} />
              Registrations
            </Link>

            <Link
              href="/organizer/attendance"
              className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-3 py-2.5 text-xs font-medium text-white"
            >
              <QrCode size={16} />
              Attendance
            </Link>

            <Link
              href="/organizer/certificates"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Award size={16} />
              Certificates
            </Link>
          </nav>

          <div className="mt-auto">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
              <p className="text-[9px] uppercase tracking-wider text-white/20">
                Signed in as
              </p>

              <p className="mt-2 text-xs font-medium">
                Event Organizer
              </p>

              <p className="mt-1 text-[10px] text-white/25">
                Vardhaman College of Engineering
              </p>
            </div>

            <Link
              href="/"
              className="mt-3 block px-3 py-2 text-[10px] text-white/25 transition hover:text-white"
            >
              ← Back to Evently
            </Link>
          </div>
        </div>
      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link
                href="/organizer/events/1"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft size={15} />
              </Link>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/20">
                  AI Hackathon 2026
                </p>

                <h1 className="mt-1 text-sm font-semibold">
                  Attendance
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <span className="text-[9px] text-emerald-300">
                Scanner active
              </span>
            </div>
          </div>
        </header>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* =========================
                HEADER
            ========================= */}

            <div>
              <p className="text-sm font-medium text-violet-300">
                Event check-in
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Scan attendance.
              </h2>

              <p className="mt-3 max-w-2xl text-xs leading-5 text-white/35">
                Scan each participant&apos;s unique ticket QR
                code. Team members are checked in individually.
              </p>
            </div>

            {/* =========================
                STATS
            ========================= */}

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <StatCard
                icon={<Users size={17} />}
                label="Registered"
                value={participants.length.toString()}
                detail="Participants"
              />

              <StatCard
                icon={<CheckCircle2 size={17} />}
                label="Checked in"
                value={checkedInCount.toString()}
                detail={`${attendancePercentage}% attendance`}
              />

              <StatCard
                icon={<Clock3 size={17} />}
                label="Remaining"
                value={pendingCount.toString()}
                detail="Participants yet to arrive"
              />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
              {/* =========================
                  SCANNER
              ========================= */}

              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/20">
                      QR scanner
                    </p>

                    <h3 className="mt-1 text-sm font-semibold">
                      Check in participant
                    </h3>
                  </div>

                  <QrCode
                    size={18}
                    className="text-violet-300"
                  />
                </div>

                {/* Scanner visual */}

                <div className="relative mt-7 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-violet-400/10 bg-[#090d16]">
                  <div className="absolute inset-8 rounded-2xl border border-dashed border-white/[0.08]" />

                  <div className="relative flex h-44 w-44 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.03]">
                    <QrCode
                      size={100}
                      strokeWidth={1}
                      className="text-violet-300/60"
                    />

                    <span className="absolute -top-px left-1/2 h-0.5 w-28 -translate-x-1/2 animate-pulse bg-violet-400" />
                  </div>

                  <div className="absolute bottom-5 left-0 right-0 text-center">
                    <p className="text-[10px] font-medium text-white/50">
                      QR camera scanner
                    </p>

                    <p className="mt-1 text-[9px] text-white/20">
                      Camera integration will be connected to
                      the backend
                    </p>
                  </div>
                </div>

                {/* Manual lookup */}

                <div className="mt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/[0.06]" />

                    <span className="text-[9px] uppercase tracking-wider text-white/15">
                      or enter ticket manually
                    </span>

                    <div className="h-px flex-1 bg-white/[0.06]" />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <div className="relative flex-1">
                      <Ticket
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                      />

                      <input
                        value={ticketInput}
                        onChange={(event) =>
                          setTicketInput(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            scanTicket();
                          }
                        }}
                        placeholder="EVT-1024"
                        className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-3 text-xs uppercase text-white outline-none placeholder:text-white/15 focus:border-violet-400/30"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={scanTicket}
                      className="flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-[10px] font-semibold text-black transition hover:bg-white/90"
                    >
                      <QrCode size={14} />
                      Check in
                    </button>
                  </div>
                </div>

                {/* Scan message */}

                {scanMessage && (
                  <div
                    className={`mt-4 rounded-xl border p-4 ${
                      scanMessage.type === "success"
                        ? "border-emerald-400/10 bg-emerald-400/[0.04]"
                        : scanMessage.type === "warning"
                          ? "border-amber-400/10 bg-amber-400/[0.04]"
                          : "border-red-400/10 bg-red-400/[0.04]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {scanMessage.type === "success" ? (
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-emerald-300"
                        />
                      ) : scanMessage.type === "warning" ? (
                        <AlertCircle
                          size={16}
                          className="mt-0.5 shrink-0 text-amber-300"
                        />
                      ) : (
                        <XCircle
                          size={16}
                          className="mt-0.5 shrink-0 text-red-300"
                        />
                      )}

                      <div>
                        <p className="text-xs font-medium">
                          {scanMessage.title}
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-white/30">
                          {scanMessage.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setScanMessage(null)}
                        className="ml-auto text-white/20 hover:text-white"
                        aria-label="Close message"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* =========================
                  PARTICIPANT LIST
              ========================= */}

              <section className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-7">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/20">
                      Participants
                    </p>

                    <h3 className="mt-1 text-sm font-semibold">
                      Attendance list
                    </h3>
                  </div>

                  <div className="relative sm:w-64">
                    <Search
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                    />

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search participant..."
                      className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-9 pr-3 text-[10px] text-white outline-none placeholder:text-white/15 focus:border-violet-400/30"
                    />
                  </div>
                </div>

                {/* Progress */}

                <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-white/20">
                        Attendance progress
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {checkedInCount}
                        <span className="ml-1 text-xs font-normal text-white/20">
                          / {participants.length}
                        </span>
                      </p>
                    </div>

                    <span className="text-[10px] text-white/30">
                      {attendancePercentage}%
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all"
                      style={{
                        width: `${attendancePercentage}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Table */}

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[650px]">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-left">
                        <th className="px-3 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                          Participant
                        </th>

                        <th className="px-3 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                          Team
                        </th>

                        <th className="px-3 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                          Ticket
                        </th>

                        <th className="px-3 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                          Status
                        </th>

                        <th className="px-3 py-3 text-right text-[9px] font-medium uppercase tracking-wider text-white/20">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredParticipants.map(
                        (participant) => (
                          <tr
                            key={participant.id}
                            className="border-b border-white/[0.05] last:border-b-0"
                          >
                            <td className="px-3 py-4">
                              <div>
                                <p className="text-xs font-medium">
                                  {participant.name}
                                </p>

                                <p className="mt-1 text-[9px] text-white/20">
                                  {participant.email}
                                </p>
                              </div>
                            </td>

                            <td className="px-3 py-4 text-[10px] text-white/30">
                              {participant.team}
                            </td>

                            <td className="px-3 py-4">
                              <span className="rounded-lg bg-white/[0.04] px-2 py-1 font-mono text-[9px] text-white/30">
                                {participant.ticket}
                              </span>
                            </td>

                            <td className="px-3 py-4">
                              {participant.status ===
                              "checked-in" ? (
                                <div>
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-300">
                                    <CheckCircle2 size={10} />
                                    Checked in
                                  </span>

                                  <p className="mt-1 text-[8px] text-white/15">
                                    {participant.checkInTime}
                                  </p>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-[9px] text-white/30">
                                  <Clock3 size={10} />
                                  Pending
                                </span>
                              )}
                            </td>

                            <td className="px-3 py-4 text-right">
                              {participant.status ===
                              "pending" ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    markAttendance(
                                      participant.id
                                    )
                                  }
                                  className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[9px] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
                                >
                                  Mark present
                                </button>
                              ) : (
                                <span className="text-[9px] text-white/15">
                                  Verified
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  {filteredParticipants.length === 0 && (
                    <div className="py-12 text-center">
                      <Search
                        size={22}
                        className="mx-auto text-white/10"
                      />

                      <p className="mt-3 text-xs text-white/30">
                        No participants found
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* =========================
                IMPORTANT NOTE
            ========================= */}

            <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-cyan-300"
                />

                <div>
                  <p className="text-xs font-medium">
                    Team members are tracked individually
                  </p>

                  <p className="mt-1 max-w-4xl text-[10px] leading-5 text-white/25">
                    A team registration does not automatically
                    mark every member as present. Each participant
                    has their own ticket and QR code. This allows
                    the organizer to verify exactly who attended
                    and later issue certificates only to eligible
                    members.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-white/35">
        {icon}
      </div>

      <p className="mt-5 text-[9px] uppercase tracking-wider text-white/20">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>

      <p className="mt-2 text-[10px] text-white/25">
        {detail}
      </p>
    </div>
  );
}

function CalendarIcon() {
  return <CalendarDaysIcon />;
}

function CalendarDaysIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect
        width="18"
        height="18"
        x="3"
        y="4"
        rx="2"
      />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}