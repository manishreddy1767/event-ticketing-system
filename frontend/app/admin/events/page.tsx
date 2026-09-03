"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Eye,
  Loader2,
  Search,
  ShieldCheck,
  Ticket,
  Users,
  XCircle,
} from "lucide-react";
import { getPendingEvents, approveEvent, rejectEvent } from "@/lib/api";

type BackendEventStatus = "pending" | "approved" | "rejected";

type AdminEvent = {
  id: number;
  title: string;
  organizer_id: number;
  venue: string;
  event_date: string;
  capacity: number;
  max_discount_percent: number;
  status: BackendEventStatus;
  created_at: string;
};

type DisplayEventStatus =
  | "Pending Approval"
  | "Live"
  | "Upcoming"
  | "Completed"
  | "Rejected"
  | "Approved";

function mapBackendStatus(status: BackendEventStatus): DisplayEventStatus {
  switch (status) {
    case "pending":
      return "Pending Approval";
    case "approved":
      return "Approved"; // Will be mapped to Live/Upcoming based on date
    case "rejected":
      return "Rejected";
    default:
      return "Pending Approval";
  }
}

function getDisplayStatus(event: AdminEvent): DisplayEventStatus {
  const baseStatus = mapBackendStatus(event.status);

  if (baseStatus === "Approved") {
    // Check if event date has passed
    const eventDate = new Date(event.event_date);
    const now = new Date();
    return eventDate < now ? "Completed" : "Upcoming";
  }

  return baseStatus;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | DisplayEventStatus>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await getPendingEvents();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const displayEvents = useMemo(() => {
    return events.map((event) => ({
      ...event,
      displayStatus: getDisplayStatus(event),
    }));
  }, [events]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return displayEvents.filter((event) => {
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.id.toString().includes(query) ||
        event.organizer_id.toString().includes(query);

      const matchesFilter =
        filter === "All" || event.displayStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [displayEvents, search, filter]);

  const pendingCount = displayEvents.filter(
    (event) => event.displayStatus === "Pending Approval"
  ).length;

  const upcomingCount = displayEvents.filter(
    (event) => event.displayStatus === "Upcoming"
  ).length;

  const completedCount = displayEvents.filter(
    (event) => event.displayStatus === "Completed"
  ).length;

  const totalRegistrations = 0; // Would need separate endpoint for actual registrations

  async function handleApproveEvent(id: number) {
    setActionLoading(id);
    try {
      await approveEvent(id);
      setEvents((current) =>
        current.map((event) =>
          event.id === id ? { ...event, status: "approved" as const } : event
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve event");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRejectEvent(id: number) {
    setActionLoading(id);
    try {
      await rejectEvent(id);
      setEvents((current) =>
        current.map((event) =>
          event.id === id ? { ...event, status: "rejected" as const } : event
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject event");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <main className="campus-background min-h-screen">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft size={15} />
              </Link>

              <div>
                <p className="text-[9px] uppercase tracking-wider text-white/20">
                  Admin
                </p>

                <h1 className="mt-1 text-sm font-semibold">
                  Event management
                </h1>
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
              <ShieldCheck size={16} />
            </div>
          </div>
        </header>

        <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="animate-pulse space-y-8">
              <div className="h-4 w-1/4 rounded bg-white/10" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 rounded-2xl border border-white/10 bg-white/[0.02]" />
                ))}
              </div>
              <div className="h-48 rounded-2xl border border-white/10 bg-white/[0.02]" />
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
              href="/admin/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={15} />
            </Link>

            <div>
              <p className="text-[9px] uppercase tracking-wider text-white/20">
                Admin
              </p>

              <h1 className="mt-1 text-sm font-semibold">
                Event management
              </h1>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
            <ShieldCheck size={16} />
          </div>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          {/* Intro */}

          <div>
            <p className="text-sm font-medium text-violet-300">
              Platform administration
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Events.
            </h2>

            <p className="mt-3 max-w-2xl text-xs leading-5 text-white/35">
              Oversee events on Evently. Pending events can be approved
              or rejected before they become visible to students.
            </p>
          </div>

          {/* Stats */}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<ShieldCheck size={16} />}
              label="Pending approval"
              value={pendingCount}
            />

            <StatCard
              icon={<CheckCircle2 size={16} />}
              label="Upcoming events"
              value={upcomingCount}
            />

            <StatCard
              icon={<CalendarDays size={16} />}
              label="Completed"
              value={completedCount}
            />

            <StatCard
              icon={<Ticket size={16} />}
              label="Registrations"
              value={totalRegistrations}
            />
          </div>

          {/* Search */}

          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
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
                  placeholder="Search event, event ID, organizer ID..."
                  className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-9 pr-3 text-[10px] text-white outline-none placeholder:text-white/20 focus:border-violet-400/30"
                />
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target.value as
                      | "All"
                      | DisplayEventStatus
                  )
                }
                className="h-10 rounded-xl border border-white/[0.07] bg-[#0c101a] px-3 text-[10px] text-white/50 outline-none"
              >
                <option value="All">All events</option>
                <option value="Pending Approval">
                  Pending Approval
                </option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Events */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <p className="text-[9px] uppercase tracking-wider text-white/20">
                Platform events
              </p>

              <p className="mt-1 text-xs text-white/35">
                Showing {filteredEvents.length} events
              </p>
            </div>

            {/* Desktop */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Event
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Organizer ID
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Date
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Capacity
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Max Discount
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Status
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-white/[0.05] transition hover:bg-white/[0.015]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                            <CalendarDays size={15} />
                          </div>

                          <div>
                            <p className="text-xs font-medium">
                              {event.title}
                            </p>

                            <p className="mt-1 font-mono text-[9px] text-white/20">
                              ID: {event.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-[10px] text-white/50">
                          {event.organizer_id}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-[10px] text-white/40">
                        {new Date(event.event_date).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-white/50">
                          {event.capacity.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-white/50">
                          {event.max_discount_percent}%
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <EventStatusBadge
                          status={event.displayStatus}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <EventAction
                          event={event}
                          onApprove={handleApproveEvent}
                          onReject={handleRejectEvent}
                          loading={actionLoading === event.id}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}

            <div className="divide-y divide-white/[0.06] lg:hidden">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                        <CalendarDays size={15} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium">
                          {event.title}
                        </p>

                        <p className="mt-1 font-mono text-[8px] text-white/20">
                          ID: {event.id}
                        </p>
                      </div>
                    </div>

                    <EventStatusBadge
                      status={event.displayStatus}
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <InfoBox
                      label="Organizer ID"
                      value={event.organizer_id.toString()}
                    />

                    <InfoBox
                      label="Date"
                      value={new Date(event.event_date).toLocaleDateString()}
                    />

                    <InfoBox
                      label="Capacity"
                      value={event.capacity.toLocaleString()}
                    />

                    <InfoBox
                      label="Max Discount"
                      value={`${event.max_discount_percent}%`}
                    />
                  </div>

                  <div className="mt-4">
                    <EventAction
                      event={event}
                      onApprove={handleApproveEvent}
                      onReject={handleRejectEvent}
                      loading={actionLoading === event.id}
                    />
                  </div>
                </div>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="px-6 py-14 text-center">
                <Search
                  size={20}
                  className="mx-auto text-white/15"
                />

                <p className="mt-4 text-sm font-medium">
                  No events found
                </p>

                <p className="mt-2 text-[10px] text-white/20">
                  Try changing your search or filter.
                </p>
              </div>
            )}
          </div>

          {/* Admin note */}

          <div className="mt-6 rounded-2xl border border-violet-400/10 bg-violet-400/[0.025] p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-violet-300"
              />

              <div>
                <p className="text-xs font-medium">
                  Platform-level event control
                </p>

                <p className="mt-1 text-[10px] leading-5 text-white/25">
                  Admins can approve or reject pending events. Approved
                  events become visible to students for registration.
                  Rejected events cannot be resubmitted.
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

      <p className="mt-1 text-2xl font-semibold">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function EventStatusBadge({
  status,
}: {
  status: DisplayEventStatus;
}) {
  const config: Record<DisplayEventStatus, { className: string; icon: React.ReactNode }> = {
    "Pending Approval": {
      className: "bg-amber-400/10 text-amber-300",
      icon: <ShieldCheck size={10} />,
    },
    Upcoming: {
      className: "bg-violet-400/10 text-violet-300",
      icon: <CalendarDays size={10} />,
    },
    Completed: {
      className: "bg-white/[0.05] text-white/30",
      icon: <CheckCircle2 size={10} />,
    },
    Rejected: {
      className: "bg-red-400/[0.06] text-red-300",
      icon: <XCircle size={10} />,
    },
    Live: {
      className: "bg-emerald-400/10 text-emerald-300",
      icon: <CheckCircle2 size={10} />,
    },
    Approved: {
      className: "bg-violet-400/10 text-violet-300",
      icon: <CalendarDays size={10} />,
    },
  };

  const item = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] ${item.className}`}
    >
      {item.icon}
      {status}
    </span>
  );
}

function EventAction({
  event,
  onApprove,
  onReject,
  loading,
}: {
  event: AdminEvent & { displayStatus: DisplayEventStatus };
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  loading: boolean;
}) {
  if (event.displayStatus === "Pending Approval") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() =>
            alert(
              `Event details for ${event.title} will be connected to the backend later.`
            )
          }
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[9px] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
        >
          <Eye size={11} />
          View
        </button>

        <button
          type="button"
          onClick={() => onApprove(event.id)}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[9px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
        >
          <CheckCircle2 size={11} />
          Approve
        </button>

        <button
          type="button"
          onClick={() => onReject(event.id)}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/[0.04] px-3 py-2 text-[9px] text-red-300 transition hover:bg-red-400/[0.08] disabled:opacity-50"
        >
          <XCircle size={11} />
          Reject
        </button>
      </div>
    );
  }

  if (event.displayStatus === "Rejected") {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            alert(
              `Event details for ${event.title} will be connected to the backend later.`
            )
          }
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[9px] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
        >
          <Eye size={11} />
          View
        </button>

        <span className="text-[9px] text-white/20">
          No action
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() =>
          alert(
            `Event details for ${event.title} will be connected to the backend later.`
          )
        }
        className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[9px] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
      >
        <Eye size={11} />
        View
      </button>

      <span className="text-[9px] text-white/20">
        {event.displayStatus}
      </span>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <p className="text-[8px] uppercase tracking-wider text-white/15">
        {label}
      </p>

      <p className="mt-2 truncate text-[10px] text-white/50">
        {value}
      </p>
    </div>
  );
}