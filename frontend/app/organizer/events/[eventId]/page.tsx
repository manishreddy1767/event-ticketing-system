"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  ExternalLink,
  MapPin,
  QrCode,
  Ticket,
  Users,
} from "lucide-react";

type OrganizerEventView = {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  registrations: number;
  capacity: number;
  teams: number;
  attendance: number;
  certificates: number;
  registrationDeadline: string;
  status: string;
};

export default function OrganizerEventDetailsPage() {
  const params = useParams();
  const eventId = Number(params.eventId);

  const [event, setEvent] = useState<OrganizerEventView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError(null);

        const { getMyEvent } = await import("@/lib/api");
        const data = await getMyEvent(eventId);

        const eventDate = new Date(data.event_date);

        setEvent({
          id: data.id,
          title: data.title,
          category: "Event",
          description: data.description ?? "No description provided.",
          date: eventDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          time: eventDate.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          venue: data.venue,
          registrations: data.registered_count,
          capacity: data.capacity,
          teams: 0,
          attendance: 0,
          certificates: 0,
          registrationDeadline: "Not specified",
          status:
            data.status === "approved"
              ? "Registration open"
              : data.status === "pending"
                ? "Pending approval"
                : "Rejected",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load event",
        );
      } finally {
        setLoading(false);
      }
    }

    if (Number.isFinite(eventId)) {
      loadEvent();
    } else {
      setError("Invalid event ID");
      setLoading(false);
    }
  }, [eventId]);

  if (loading) {
    return (
      <main className="campus-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />
          <p className="mt-4 text-xs text-white/40">
            Loading event...
          </p>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="campus-background flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-red-300">
            {error ?? "Event not found"}
          </p>
          <Link
            href="/organizer/events"
            className="mt-4 inline-flex rounded-xl border border-white/[0.07] px-4 py-2 text-xs text-white/50 hover:text-white"
          >
            Back to events
          </Link>
        </div>
      </main>
    );
  }

  const registrationPercentage =
    event.capacity === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (event.registrations / event.capacity) * 100,
          ),
        );

  const attendancePercentage =
    event.registrations === 0
      ? 0
      : Math.round(
          (event.attendance / event.registrations) * 100,
        );

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
              className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-3 py-2.5 text-xs font-medium text-white"
            >
              <CalendarDays size={16} />
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
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white"
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
                href="/organizer/events"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft size={15} />
              </Link>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/20">
                  Organizer workspace
                </p>

                <h1 className="mt-1 text-sm font-semibold">
                  Event overview
                </h1>
              </div>
            </div>

            <Link
              href={`/organizer/events/${event.id}/edit`}
              className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-xs text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              <Edit3 size={14} />
              <span className="hidden sm:inline">
                Edit event
              </span>
            </Link>
          </div>
        </header>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* =========================
                EVENT HERO
            ========================= */}

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c101a]/95">
              <div className="relative aspect-[16/6] min-h-[260px] overflow-hidden bg-gradient-to-br from-violet-950 via-[#11162a] to-[#080b12]">
                {/* Decorative background */}

                <div className="absolute -left-20 -top-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

                <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(139,92,246,0.16),transparent_35%)]" />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0c101a] via-[#0c101a]/40 to-transparent px-6 pb-7 pt-20 sm:px-8">
                  <div className="flex flex-wrap items-end justify-between gap-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-[9px] font-medium text-emerald-300">
                          {event.status}
                        </span>

                        <span className="rounded-full bg-white/[0.07] px-3 py-1.5 text-[9px] text-white/40">
                          {event.category}
                        </span>
                      </div>

                      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                        {event.title}
                      </h2>

                      <p className="mt-2 max-w-2xl text-xs leading-5 text-white/35">
                        {event.description}
                      </p>
                    </div>

                    <Link
                      href={`/events/${event.id}`}
                      className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 text-[10px] text-white/50 backdrop-blur-md transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <ExternalLink size={13} />
                      Student view
                    </Link>
                  </div>
                </div>
              </div>

              {/* Event metadata */}

              <div className="grid border-t border-white/[0.07] sm:grid-cols-3">
                <InfoItem
                  icon={<CalendarDays size={15} />}
                  label="Date"
                  value={event.date}
                />

                <InfoItem
                  icon={<Clock3 size={15} />}
                  label="Time"
                  value={event.time}
                />

                <InfoItem
                  icon={<MapPin size={15} />}
                  label="Venue"
                  value={event.venue}
                />
              </div>
            </div>

            {/* =========================
                STATISTICS
            ========================= */}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<Ticket size={17} />}
                label="Registrations"
                value={`${event.registrations}`}
                suffix={`/ ${event.capacity}`}
                detail={`${registrationPercentage}% capacity`}
              />

              <StatCard
                icon={<Users size={17} />}
                label="Teams"
                value={`${event.teams}`}
                detail="Registered teams"
              />

              <StatCard
                icon={<CheckCircle2 size={17} />}
                label="Attendance"
                value={`${event.attendance}`}
                suffix={`/ ${event.registrations}`}
                detail={`${attendancePercentage}% checked in`}
              />

              <StatCard
                icon={<Award size={17} />}
                label="Certificates"
                value={`${event.certificates}`}
                detail="Issued so far"
              />
            </div>

            {/* =========================
                MANAGEMENT GRID
            ========================= */}

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
              {/* Registration & attendance */}

              <div className="space-y-6">
                {/* Registration progress */}

                <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/20">
                        Registration
                      </p>

                      <h3 className="mt-1 text-sm font-semibold">
                        Registration progress
                      </h3>
                    </div>

                    <Ticket
                      size={17}
                      className="text-violet-300/70"
                    />
                  </div>

                  <div className="mt-7">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-semibold">
                          {event.registrations}
                          <span className="ml-1 text-sm font-normal text-white/20">
                            / {event.capacity}
                          </span>
                        </p>

                        <p className="mt-2 text-[10px] text-white/25">
                          Participants registered
                        </p>
                      </div>

                      <span className="text-xs text-white/35">
                        {registrationPercentage}%
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-violet-400"
                        style={{
                          width: `${registrationPercentage}%`,
                        }}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[9px] text-white/20">
                      <span>
                        {event.capacity -
                          event.registrations}{" "}
                        spots remaining
                      </span>

                      <span>
                        Closes {event.registrationDeadline}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Attendance progress */}

                <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/20">
                        Attendance
                      </p>

                      <h3 className="mt-1 text-sm font-semibold">
                        Event check-in
                      </h3>
                    </div>

                    <QrCode
                      size={17}
                      className="text-emerald-300/70"
                    />
                  </div>

                  <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-[10px] border-white/[0.05]">
                      <div className="text-center">
                        <p className="text-2xl font-semibold">
                          {attendancePercentage}%
                        </p>

                        <p className="mt-1 text-[9px] text-white/20">
                          checked in
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Attendance scanner ready
                      </p>

                      <p className="mt-2 text-xs leading-5 text-white/30">
                        Scan each participant&apos;s personal QR
                        code. Team registrations are tracked
                        individually, so checking in one member
                        does not check in the rest of their team.
                      </p>

                      <Link
                        href={`/organizer/attendance?event=${event.id}`}
                        className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[10px] font-semibold text-black transition hover:bg-white/90"
                      >
                        <QrCode size={14} />
                        Open attendance
                      </Link>
                    </div>
                  </div>
                </section>
              </div>

              {/* Quick actions */}

              <div className="space-y-6">
                <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <p className="text-[10px] uppercase tracking-wider text-white/20">
                    Manage
                  </p>

                  <h3 className="mt-1 text-sm font-semibold">
                    Quick actions
                  </h3>

                  <div className="mt-5 space-y-2">
                    <ActionLink
                      href={`/organizer/registrations?event=${event.id}`}
                      icon={<Users size={16} />}
                      title="View registrations"
                      description="Students and teams"
                    />

                    <ActionLink
                      href={`/organizer/attendance?event=${event.id}`}
                      icon={<QrCode size={16} />}
                      title="Manage attendance"
                      description="Scan and verify check-ins"
                    />

                    <ActionLink
                      href={`/organizer/certificates?event=${event.id}`}
                      icon={<Award size={16} />}
                      title="Issue certificates"
                      description="Participation and winner awards"
                    />

                    <ActionLink
                      href={`/organizer/events/${event.id}/edit`}
                      icon={<Edit3 size={16} />}
                      title="Edit event"
                      description="Update event configuration"
                    />
                  </div>
                </section>

                {/* Registration deadline */}

                <section className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.025] p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                      <Clock3 size={16} />
                    </div>

                    <div>
                      <p className="text-xs font-medium">
                        Registration deadline
                      </p>

                      <p className="mt-2 text-[11px] text-amber-200/70">
                        {event.registrationDeadline}
                      </p>

                      <p className="mt-2 text-[9px] leading-4 text-white/25">
                        After this deadline, the backend will
                        automatically reject new registrations.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Certificate status */}

                <section className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                      <Award size={16} />
                    </div>

                    <div>
                      <p className="text-xs font-medium">
                        Certificates enabled
                      </p>

                      <p className="mt-2 text-[9px] leading-4 text-white/25">
                        Certificates can be issued individually
                        after attendance has been verified.
                      </p>

                      <Link
                        href={`/organizer/certificates?event=${event.id}`}
                        className="mt-4 inline-flex items-center gap-1.5 text-[10px] text-emerald-300/70 transition hover:text-emerald-300"
                      >
                        Manage certificates
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* =========================
                EVENT RULES
            ========================= */}

            <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/40">
                  <Activity size={17} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/20">
                    Event configuration
                  </p>

                  <h3 className="mt-1 text-sm font-semibold">
                    Current event settings
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Setting
                  label="Category"
                  value={event.category}
                />

                <Setting
                  label="Team size"
                  value="Up to 4 members"
                />

                <Setting
                  label="Capacity"
                  value={`${event.capacity} participants`}
                />

                <Setting
                  label="Certificates"
                  value="Enabled"
                />
              </div>
            </section>

            {/* =========================
                TEAM ATTENDANCE NOTE
            ========================= */}

            <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-5">
              <div className="flex items-start gap-3">
                <Users
                  size={17}
                  className="mt-0.5 shrink-0 text-cyan-300"
                />

                <div>
                  <p className="text-xs font-medium">
                    Team registrations are tracked per member
                  </p>

                  <p className="mt-1 max-w-4xl text-[10px] leading-5 text-white/25">
                    A team registration creates an individual
                    ticket and QR code for every member. The
                    organizer can therefore mark attendance,
                    certificate eligibility, and certificate
                    issuance independently for each participant.
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

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.07] p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-white/30">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-wider text-white/20">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-medium text-white/60">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
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

      <p className="mt-2 text-2xl font-semibold tracking-tight">
        {value}
        {suffix && (
          <span className="ml-1 text-xs font-normal text-white/20">
            {suffix}
          </span>
        )}
      </p>

      <p className="mt-2 text-[10px] text-white/25">
        {detail}
      </p>
    </div>
  );
}

function ActionLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition hover:bg-white/[0.05]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/35 transition group-hover:text-white/70">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium">
          {title}
        </p>

        <p className="mt-1 text-[9px] text-white/20">
          {description}
        </p>
      </div>

      <ArrowRight
        size={13}
        className="text-white/15 transition group-hover:translate-x-0.5 group-hover:text-white/40"
      />
    </Link>
  );
}

function Setting({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-[9px] uppercase tracking-wider text-white/20">
        {label}
      </p>

      <p className="mt-2 text-xs font-medium text-white/60">
        {value}
      </p>
    </div>
  );
}