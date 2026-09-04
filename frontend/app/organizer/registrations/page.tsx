"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  Loader2,
  LogOut,
} from "lucide-react";
import { getOrganizerRegistrations, getEvent, type ApiRegistration, type ApiEvent } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type RegistrationStatus = "Paid" | "Pending" | "Cancelled";

interface RegistrationWithAttendance extends ApiRegistration {
  attendance: "Present" | "Not checked in";
}

function normalizeStatus(status: string): RegistrationStatus {
  const normalized = status.toLowerCase();
  if (normalized === "paid") return "Paid";
  if (normalized === "pending" || normalized === "reserved") return "Pending";
  if (normalized === "cancelled" || normalized === "refunded") return "Cancelled";
  return "Pending";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function OrganizerRegistrationsPage() {
  const { user, logout } = useAuth();
  const [registrations, setRegistrations] = useState<RegistrationWithAttendance[]>([]);
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | RegistrationStatus>("All");
  const [attendanceFilter, setAttendanceFilter] = useState<"All" | "Present" | "Not checked in">("All");
  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get event ID from URL - in a real app this would come from route params
  // For now we'll use the first event from getMyEvents or a specific event
  useEffect(() => {
    async function fetchRegistrations() {
      if (!user || user.role !== "organizer") return;

      try {
        setLoading(true);

        // First get the organizer's events to find the event ID
        const events = await getEvent(user.id);
        // Actually, we need to get events first. Let's fetch the first event for now
        // In a real implementation, this would come from route params
        // For demo purposes, let's get all organizer events and use the first one
        // We need to import getMyEvents
        const { getMyEvents } = await import("@/lib/api");
        const myEvents = await getMyEvents();

        if (myEvents.length > 0) {
          const firstEvent = myEvents[0];
          setEvent(firstEvent);

          const regs = await getOrganizerRegistrations(firstEvent.id);

          // Transform registrations to include attendance status
          const registrationsWithAttendance: RegistrationWithAttendance[] = regs.map((reg) => ({
            ...reg,
            attendance: "Not checked in" as "Present" | "Not checked in", // TODO: fetch actual attendance
          }));

          setRegistrations(registrationsWithAttendance);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load registrations");
      } finally {
        setLoading(false);
      }
    }

    fetchRegistrations();
  }, [user]);

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return registrations.filter((registration) => {
      const matchesSearch =
        !query ||
        registration.user?.name?.toLowerCase().includes(query) ||
        registration.user?.email?.toLowerCase().includes(query) ||
        registration.qr_token.toLowerCase().includes(query) ||
        registration.ticket_type?.toLowerCase().includes(query);

      const normalizedStatus = normalizeStatus(registration.status);
      const matchesStatus =
        statusFilter === "All" ||
        normalizedStatus === statusFilter;

      const matchesAttendance =
        attendanceFilter === "All" ||
        registration.attendance === attendanceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAttendance
      );
    });
  }, [registrations, search, statusFilter, attendanceFilter]);

  const totalParticipants = registrations.length;
  const paidParticipants = registrations.filter(
    (registration) => normalizeStatus(registration.status) === "Paid"
  ).length;
  const presentParticipants = registrations.filter(
    (registration) => registration.attendance === "Present"
  ).length;
  const teamParticipants = registrations.filter(
    (registration) => registration.team_id
  ).length;

  const teams = Array.from(
    new Set(
      filteredRegistrations
        .map((registration) => registration.team_id)
        .filter(Boolean) as number[]
    )
  ).map((teamId) => {
    const teamRegs = filteredRegistrations.filter((r) => r.team_id === teamId);
    return {
      id: teamId,
      name: `Team ${teamId}`,
      members: teamRegs,
    };
  });

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

  if (loading) {
    return (
      <main className="campus-background min-h-screen">
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
          </div>
        </header>
        <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="animate-pulse space-y-8">
              <div className="h-4 w-1/4 rounded bg-white/10" />
              <div className="h-32 w-full rounded-2xl bg-white/5" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
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

          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[10px] text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="flex items-center gap-1.5 rounded-xl border border-red-400/10 bg-red-400/5 px-3 py-2 text-[10px] text-red-300 transition hover:bg-red-400/10"
            >
              <LogOut size={13} />
              Logout
            </button>
            <Link
              href="/organizer/attendance"
              className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[10px] font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              Attendance
            </Link>
          </div>
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
          {event && (
            <div className="mt-8 rounded-2xl border border-violet-400/10 bg-violet-400/[0.035] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-violet-300/60">
                    Selected event
                  </p>
                  <h3 className="mt-1 text-base font-semibold">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-[10px] text-white/25">
                    {new Date(event.event_date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })} • {event.venue}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-emerald-400/10 px-3 py-1.5 text-[10px] text-emerald-300">
                  {event.status === "approved" ? "Registration open" : event.status}
                </span>
              </div>
            </div>
          )}

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
                  placeholder="Search name, email, team, email or ticket..."
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
                    Showing {filteredRegistrations.length} of{" "}
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
                      Email
                    </th>
                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Team
                    </th>
                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Ticket Type
                    </th>
                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      QR Token
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
                  {filteredRegistrations
                    .filter(
                      (registration) => !registration.team_id
                    )
                    .map((registration) => (
                      <ParticipantRow
                        key={registration.id}
                        registration={registration}
                      />
                    ))}

                  {teams.map((team) => {
                    const expanded = expandedTeams.includes(team.name);
                    return (
                      <TeamGroup
                        key={team.id}
                        teamName={team.name}
                        members={team.members}
                        expanded={expanded}
                        onToggle={() =>
                          toggleTeam(team.name)
                        }
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-white/[0.06] lg:hidden">
              {filteredRegistrations.length === 0 ? (
                <EmptyState />
              ) : (
                filteredRegistrations.map((registration) => (
                  <MobileParticipantCard
                    key={registration.id}
                    registration={registration}
                  />
                ))
              )}
            </div>

            {filteredRegistrations.length === 0 && (
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
  registration,
}: {
  registration: RegistrationWithAttendance;
}) {
  return (
    <tr className="border-b border-white/[0.05] transition hover:bg-white/[0.015]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 text-[10px] font-semibold text-violet-300">
            {getInitials(registration.user?.name || "Unknown")}
          </div>
          <div>
            <p className="text-xs font-medium text-white/75">
              {registration.user?.name || "Unknown"}
            </p>
            <p className="mt-0.5 text-[9px] text-white/20">
              {registration.user?.email || ""}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 font-mono text-[10px] text-white/40">
        {registration.user?.email || "N/A"}
      </td>
      <td className="px-5 py-4">
        <span className="text-[10px] text-white/40">
          {registration.team_id ? `Team ${registration.team_id}` : "Individual"}
        </span>
      </td>
      <td className="px-5 py-4 font-mono text-[9px] text-white/30">
        {registration.ticket_type}
      </td>
      <td className="px-5 py-4 font-mono text-[9px] text-white/30">
        {registration.qr_token.slice(0, 12)}...
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={normalizeStatus(registration.status)} />
      </td>
      <td className="px-5 py-4">
        <AttendanceBadge
          attendance={registration.attendance}
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
  members: RegistrationWithAttendance[];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-b border-white/[0.05] bg-white/[0.015]">
        <td colSpan={7} className="px-5 py-3">
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
        members.map((registration) => (
          <ParticipantRow
            key={registration.id}
            registration={registration}
          />
        ))}
    </>
  );
}

function MobileParticipantCard({
  registration,
}: {
  registration: RegistrationWithAttendance;
}) {
  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-[10px] font-semibold text-violet-300">
            {getInitials(registration.user?.name || "Unknown")}
          </div>
          <div>
            <p className="text-xs font-medium">
              {registration.user?.name || "Unknown"}
            </p>
            <p className="mt-1 font-mono text-[9px] text-white/25">
              {registration.user?.email || "N/A"}
            </p>
          </div>
        </div>
        <StatusBadge status={normalizeStatus(registration.status)} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-white/15">
            Team
          </p>
          <p className="mt-1 text-[10px] text-white/45">
            {registration.team_id ? `Team ${registration.team_id}` : "Individual"}
          </p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider text-white/15">
            Attendance
          </p>
          <div className="mt-1">
            <AttendanceBadge
              attendance={registration.attendance}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2">
        <p className="text-[8px] uppercase tracking-wider text-white/15">
          QR Token
        </p>
        <p className="mt-1 font-mono text-[9px] text-white/30">
          {registration.qr_token}
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
  const styles: Record<RegistrationStatus, string> = {
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