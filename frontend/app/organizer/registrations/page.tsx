"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Download,
  Search,
  Users,
  CheckCircle2,
  Clock3,
  XCircle,
  Ticket,
  UserRound,
  Filter,
} from "lucide-react";

type RegistrationStatus = "Paid" | "Pending" | "Cancelled";

type Participant = {
  id: number;
  name: string;
  rollNumber: string;
  email: string;
  college: string;
  team: string | null;
  teamSize: number;
  status: RegistrationStatus;
  ticketId: string;
  attendance: "Present" | "Not checked in";
};

const participants: Participant[] = [
  {
    id: 1,
    name: "Manish Reddy",
    rollNumber: "23CSE042",
    email: "manish@example.com",
    college: "Vardhaman College of Engineering",
    team: "Team Alpha",
    teamSize: 3,
    status: "Paid",
    ticketId: "EVT-AI26-7F31",
    attendance: "Present",
  },
  {
    id: 2,
    name: "Rahul Kumar",
    rollNumber: "23CSE046",
    email: "rahul@example.com",
    college: "Vardhaman College of Engineering",
    team: "Team Alpha",
    teamSize: 3,
    status: "Paid",
    ticketId: "EVT-AI26-8A21",
    attendance: "Present",
  },
  {
    id: 3,
    name: "Arjun Sharma",
    rollNumber: "23CSE058",
    email: "arjun@example.com",
    college: "Vardhaman College of Engineering",
    team: "Team Alpha",
    teamSize: 3,
    status: "Paid",
    ticketId: "EVT-AI26-9B12",
    attendance: "Not checked in",
  },
  {
    id: 4,
    name: "Priya Sharma",
    rollNumber: "23CSE061",
    email: "priya@example.com",
    college: "Vardhaman College of Engineering",
    team: null,
    teamSize: 1,
    status: "Paid",
    ticketId: "EVT-AI26-4D82",
    attendance: "Present",
  },
  {
    id: 5,
    name: "Sneha Patel",
    rollNumber: "23CSE072",
    email: "sneha@example.com",
    college: "Vardhaman College of Engineering",
    team: "Code Queens",
    teamSize: 2,
    status: "Paid",
    ticketId: "EVT-AI26-5E92",
    attendance: "Not checked in",
  },
  {
    id: 6,
    name: "Ananya Reddy",
    rollNumber: "23CSE080",
    email: "ananya@example.com",
    college: "Vardhaman College of Engineering",
    team: "Code Queens",
    teamSize: 2,
    status: "Pending",
    ticketId: "EVT-AI26-6F11",
    attendance: "Not checked in",
  },
  {
    id: 7,
    name: "Karthik Rao",
    rollNumber: "23CSE091",
    email: "karthik@example.com",
    college: "Vardhaman College of Engineering",
    team: null,
    teamSize: 1,
    status: "Paid",
    ticketId: "EVT-AI26-2A41",
    attendance: "Not checked in",
  },
  {
    id: 8,
    name: "Sandeep Rao",
    rollNumber: "23CSE104",
    email: "sandeep@example.com",
    college: "Vardhaman College of Engineering",
    team: "Innovation Squad",
    teamSize: 4,
    status: "Paid",
    ticketId: "EVT-AI26-3C51",
    attendance: "Present",
  },
  {
    id: 9,
    name: "Vikram Singh",
    rollNumber: "23CSE109",
    email: "vikram@example.com",
    college: "Vardhaman College of Engineering",
    team: "Innovation Squad",
    teamSize: 4,
    status: "Paid",
    ticketId: "EVT-AI26-4C61",
    attendance: "Present",
  },
  {
    id: 10,
    name: "Aditi Rao",
    rollNumber: "23CSE115",
    email: "aditi@example.com",
    college: "Vardhaman College of Engineering",
    team: "Innovation Squad",
    teamSize: 4,
    status: "Paid",
    ticketId: "EVT-AI26-5C71",
    attendance: "Not checked in",
  },
  {
    id: 11,
    name: "Rohan Mehta",
    rollNumber: "23CSE121",
    email: "rohan@example.com",
    college: "Vardhaman College of Engineering",
    team: "Innovation Squad",
    teamSize: 4,
    status: "Paid",
    ticketId: "EVT-AI26-6C81",
    attendance: "Not checked in",
  },
];

export default function OrganizerRegistrationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"All" | RegistrationStatus>("All");
  const [attendanceFilter, setAttendanceFilter] =
    useState<"All" | "Present" | "Not checked in">("All");
  const [expandedTeams, setExpandedTeams] = useState<string[]>([
    "Team Alpha",
  ]);

  const filteredParticipants = useMemo(() => {
    const query = search.trim().toLowerCase();

    return participants.filter((participant) => {
      const matchesSearch =
        !query ||
        participant.name.toLowerCase().includes(query) ||
        participant.rollNumber.toLowerCase().includes(query) ||
        participant.email.toLowerCase().includes(query) ||
        participant.ticketId.toLowerCase().includes(query) ||
        participant.team?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        participant.status === statusFilter;

      const matchesAttendance =
        attendanceFilter === "All" ||
        participant.attendance === attendanceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAttendance
      );
    });
  }, [search, statusFilter, attendanceFilter]);

  const totalParticipants = participants.length;
  const paidParticipants = participants.filter(
    (participant) => participant.status === "Paid"
  ).length;
  const presentParticipants = participants.filter(
    (participant) => participant.attendance === "Present"
  ).length;
  const teamParticipants = participants.filter(
    (participant) => participant.team
  ).length;

  const teams = Array.from(
    new Set(
      filteredParticipants
        .map((participant) => participant.team)
        .filter(Boolean) as string[]
    )
  );

  function toggleTeam(teamName: string) {
    setExpandedTeams((current) =>
      current.includes(teamName)
        ? current.filter((team) => team !== teamName)
        : [...current, teamName]
    );
  }

  function exportParticipants() {
    alert(
      "Participant export will be connected to the backend later."
    );
  }

  return (
    <main className="campus-background min-h-screen">
      {/* Header */}

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/organizer/events"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={15} />
            </Link>

            <div>
              <p className="text-[9px] uppercase tracking-wider text-white/20">
                Organizer
              </p>

              <h1 className="mt-1 text-sm font-semibold">
                Registrations
              </h1>
            </div>
          </div>

          <Link
            href="/organizer/attendance"
            className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-[10px] font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
          >
            Attendance
          </Link>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          {/* Intro */}

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-violet-300">
                Participant management
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Registrations.
              </h2>

              <p className="mt-3 max-w-2xl text-xs leading-5 text-white/35">
                View registered students, teams, tickets, payment
                status, and attendance for your event.
              </p>
            </div>

            <button
              type="button"
              onClick={exportParticipants}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-[10px] font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Download size={13} />
              Export participants
            </button>
          </div>

          {/* Event */}

          <div className="mt-8 rounded-2xl border border-violet-400/10 bg-violet-400/[0.035] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-violet-300/60">
                  Selected event
                </p>

                <h3 className="mt-1 text-base font-semibold">
                  AI Hackathon 2026
                </h3>

                <p className="mt-1 text-[10px] text-white/25">
                  18 October 2026 • Vardhaman College of Engineering
                </p>
              </div>

              <span className="w-fit rounded-full bg-emerald-400/10 px-3 py-1.5 text-[10px] text-emerald-300">
                Registration open
              </span>
            </div>
          </div>

          {/* Stats */}

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<Users size={16} />}
              label="Total participants"
              value={totalParticipants}
            />

            <StatCard
              icon={<Ticket size={16} />}
              label="Paid registrations"
              value={paidParticipants}
            />

            <StatCard
              icon={<CheckCircle2 size={16} />}
              label="Checked in"
              value={presentParticipants}
            />

            <StatCard
              icon={<Users size={16} />}
              label="Team participants"
              value={teamParticipants}
            />
          </div>

          {/* Filters */}

          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search name, roll number, team, email or ticket..."
                  className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-9 pr-3 text-[10px] text-white outline-none placeholder:text-white/20 focus:border-violet-400/30"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={14} className="text-white/20" />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as
                        | "All"
                        | RegistrationStatus
                    )
                  }
                  className="h-10 rounded-xl border border-white/[0.07] bg-[#0c101a] px-3 text-[10px] text-white/50 outline-none"
                >
                  <option value="All">All payments</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={attendanceFilter}
                  onChange={(event) =>
                    setAttendanceFilter(
                      event.target.value as
                        | "All"
                        | "Present"
                        | "Not checked in"
                    )
                  }
                  className="h-10 rounded-xl border border-white/[0.07] bg-[#0c101a] px-3 text-[10px] text-white/50 outline-none"
                >
                  <option value="All">All attendance</option>
                  <option value="Present">Checked in</option>
                  <option value="Not checked in">
                    Not checked in
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Participant table */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/20">
                    Participants
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    Showing {filteredParticipants.length} of{" "}
                    {totalParticipants} registrations
                  </p>
                </div>

                <UserRound
                  size={16}
                  className="text-white/20"
                />
              </div>
            </div>

            {/* Desktop table */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Participant
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Roll number
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Team
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Ticket
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Payment
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Attendance
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredParticipants
                    .filter(
                      (participant) => !participant.team
                    )
                    .map((participant) => (
                      <ParticipantRow
                        key={participant.id}
                        participant={participant}
                      />
                    ))}

                  {teams.map((teamName) => {
                    const members = filteredParticipants.filter(
                      (participant) =>
                        participant.team === teamName
                    );

                    const expanded =
                      expandedTeams.includes(teamName);

                    return (
                      <TeamGroup
                        key={teamName}
                        teamName={teamName}
                        members={members}
                        expanded={expanded}
                        onToggle={() =>
                          toggleTeam(teamName)
                        }
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}

            <div className="divide-y divide-white/[0.06] lg:hidden">
              {filteredParticipants.length === 0 ? (
                <EmptyState />
              ) : (
                filteredParticipants.map((participant) => (
                  <MobileParticipantCard
                    key={participant.id}
                    participant={participant}
                  />
                ))
              )}
            </div>

            {filteredParticipants.length === 0 && (
              <div className="hidden lg:block">
                <EmptyState />
              </div>
            )}
          </div>

          {/* Team note */}

          <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-5">
            <div className="flex items-start gap-3">
              <Users
                size={17}
                className="mt-0.5 shrink-0 text-cyan-300"
              />

              <div>
                <p className="text-xs font-medium">
                  Team registrations are tracked individually
                </p>

                <p className="mt-1 text-[10px] leading-5 text-white/25">
                  Each team member has their own ticket and QR
                  code. When attendance is recorded, only the
                  student who actually checks in is marked present.
                  This allows certificates to be issued correctly
                  to individual attendees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/40">
        {icon}
      </div>

      <p className="mt-4 text-[9px] uppercase tracking-wider text-white/20">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}

function ParticipantRow({
  participant,
}: {
  participant: Participant;
}) {
  return (
    <tr className="border-b border-white/[0.05] transition hover:bg-white/[0.015]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 text-[10px] font-semibold text-violet-300">
            {getInitials(participant.name)}
          </div>

          <div>
            <p className="text-xs font-medium text-white/75">
              {participant.name}
            </p>

            <p className="mt-0.5 text-[9px] text-white/20">
              {participant.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 font-mono text-[10px] text-white/40">
        {participant.rollNumber}
      </td>

      <td className="px-5 py-4">
        <span className="text-[10px] text-white/40">
          Individual
        </span>
      </td>

      <td className="px-5 py-4 font-mono text-[9px] text-white/30">
        {participant.ticketId}
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={participant.status} />
      </td>

      <td className="px-5 py-4">
        <AttendanceBadge
          attendance={participant.attendance}
        />
      </td>
    </tr>
  );
}

function TeamGroup({
  teamName,
  members,
  expanded,
  onToggle,
}: {
  teamName: string;
  members: Participant[];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-b border-white/[0.05] bg-white/[0.015]">
        <td colSpan={6} className="px-5 py-3">
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center gap-3 text-left"
          >
            {expanded ? (
              <ChevronDown
                size={14}
                className="text-white/30"
              />
            ) : (
              <ChevronRight
                size={14}
                className="text-white/30"
              />
            )}

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-400/10">
              <Users
                size={13}
                className="text-violet-300"
              />
            </div>

            <div>
              <p className="text-xs font-semibold">
                {teamName}
              </p>

              <p className="mt-0.5 text-[9px] text-white/20">
                {members.length} participant
                {members.length === 1 ? "" : "s"}
              </p>
            </div>

            <span className="ml-auto text-[9px] text-white/20">
              Team registration
            </span>
          </button>
        </td>
      </tr>

      {expanded &&
        members.map((participant) => (
          <ParticipantRow
            key={participant.id}
            participant={participant}
          />
        ))}
    </>
  );
}

function MobileParticipantCard({
  participant,
}: {
  participant: Participant;
}) {
  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-[10px] font-semibold text-violet-300">
            {getInitials(participant.name)}
          </div>

          <div>
            <p className="text-xs font-medium">
              {participant.name}
            </p>

            <p className="mt-1 font-mono text-[9px] text-white/25">
              {participant.rollNumber}
            </p>
          </div>
        </div>

        <StatusBadge status={participant.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-white/15">
            Team
          </p>

          <p className="mt-1 text-[10px] text-white/45">
            {participant.team ?? "Individual"}
          </p>
        </div>

        <div>
          <p className="text-[9px] uppercase tracking-wider text-white/15">
            Attendance
          </p>

          <div className="mt-1">
            <AttendanceBadge
              attendance={participant.attendance}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">
        <p className="text-[8px] uppercase tracking-wider text-white/15">
          Ticket ID
        </p>

        <p className="mt-1 font-mono text-[9px] text-white/30">
          {participant.ticketId}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: RegistrationStatus;
}) {
  const styles = {
    Paid: "bg-emerald-400/10 text-emerald-300",
    Pending: "bg-amber-400/10 text-amber-300",
    Cancelled: "bg-red-400/10 text-red-300",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function AttendanceBadge({
  attendance,
}: {
  attendance: "Present" | "Not checked in";
}) {
  if (attendance === "Present") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-300">
        <CheckCircle2 size={10} />
        Present
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2.5 py-1 text-[9px] text-white/25">
      <Clock3 size={10} />
      Not checked in
    </span>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-white/20">
        <Search size={18} />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        No participants found
      </h3>

      <p className="mt-2 text-[10px] text-white/25">
        Try changing your search or filters.
      </p>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}