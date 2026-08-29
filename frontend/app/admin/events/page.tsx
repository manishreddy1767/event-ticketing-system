"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Eye,
  Search,
  ShieldCheck,
  Ticket,
  Users,
  XCircle,
} from "lucide-react";

type EventStatus = "Live" | "Upcoming" | "Completed" | "Suspended";

type AdminEvent = {
  id: string;
  name: string;
  organizer: string;
  organizerId: string;
  date: string;
  registrations: number;
  capacity: number;
  status: EventStatus;
};

const initialEvents: AdminEvent[] = [
  {
    id: "EVT-AI26-001",
    name: "AI Hackathon 2026",
    organizer: "CSE Department",
    organizerId: "ORG-0001",
    date: "18 Oct 2026",
    registrations: 248,
    capacity: 300,
    status: "Live",
  },
  {
    id: "EVT-TS26-002",
    name: "Tech Symposium 2026",
    organizer: "IEEE Student Branch",
    organizerId: "ORG-0002",
    date: "25 Oct 2026",
    registrations: 184,
    capacity: 250,
    status: "Upcoming",
  },
  {
    id: "EVT-CS26-003",
    name: "CodeSprint",
    organizer: "Coding Club",
    organizerId: "ORG-0003",
    date: "02 Nov 2026",
    registrations: 312,
    capacity: 400,
    status: "Upcoming",
  },
  {
    id: "EVT-IN26-004",
    name: "Innovation Expo",
    organizer: "Innovation Cell",
    organizerId: "ORG-0004",
    date: "10 Sep 2026",
    registrations: 96,
    capacity: 150,
    status: "Completed",
  },
  {
    id: "EVT-RB26-005",
    name: "Robotics Challenge",
    organizer: "Robotics Club",
    organizerId: "ORG-0005",
    date: "15 Nov 2026",
    registrations: 74,
    capacity: 120,
    status: "Suspended",
  },
];

export default function AdminEventsPage() {
  const [events, setEvents] =
    useState<AdminEvent[]>(initialEvents);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "All" | EventStatus
  >("All");

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        event.name.toLowerCase().includes(query) ||
        event.id.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query) ||
        event.organizerId.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" ||
        event.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [events, search, filter]);

  const liveCount = events.filter(
    (event) => event.status === "Live"
  ).length;

  const upcomingCount = events.filter(
    (event) => event.status === "Upcoming"
  ).length;

  const completedCount = events.filter(
    (event) => event.status === "Completed"
  ).length;

  const totalRegistrations = events.reduce(
    (total, event) => total + event.registrations,
    0
  );

  function suspendEvent(id: string) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? { ...event, status: "Suspended" }
          : event
      )
    );
  }

  function restoreEvent(id: string) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? { ...event, status: "Upcoming" }
          : event
      )
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
              Oversee every event on Evently, regardless of
              which organizer created it.
            </p>
          </div>

          {/* Stats */}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<CheckCircle2 size={16} />}
              label="Live events"
              value={liveCount}
            />

            <StatCard
              icon={<CalendarDays size={16} />}
              label="Upcoming"
              value={upcomingCount}
            />

            <StatCard
              icon={<XCircle size={16} />}
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
                  placeholder="Search event, event ID, organizer or organizer ID..."
                  className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-9 pr-3 text-[10px] text-white outline-none placeholder:text-white/20 focus:border-violet-400/30"
                />
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target.value as
                      | "All"
                      | EventStatus
                  )
                }
                className="h-10 rounded-xl border border-white/[0.07] bg-[#0c101a] px-3 text-[10px] text-white/50 outline-none"
              >
                <option value="All">All events</option>
                <option value="Live">Live</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Suspended">Suspended</option>
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
                      Organizer
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Date
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Registrations
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
                              {event.name}
                            </p>

                            <p className="mt-1 font-mono text-[9px] text-white/20">
                              {event.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-[10px] text-white/50">
                          {event.organizer}
                        </p>

                        <p className="mt-1 font-mono text-[8px] text-white/20">
                          {event.organizerId}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-[10px] text-white/40">
                        {event.date}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-[10px] text-white/50">
                          {event.registrations.toLocaleString()}
                        </p>

                        <p className="mt-1 text-[8px] text-white/20">
                          of {event.capacity.toLocaleString()}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <EventStatusBadge
                          status={event.status}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <EventAction
                          event={event}
                          onSuspend={suspendEvent}
                          onRestore={restoreEvent}
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
                          {event.name}
                        </p>

                        <p className="mt-1 font-mono text-[8px] text-white/20">
                          {event.id}
                        </p>
                      </div>
                    </div>

                    <EventStatusBadge
                      status={event.status}
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <InfoBox
                      label="Organizer"
                      value={event.organizer}
                    />

                    <InfoBox
                      label="Organizer ID"
                      value={event.organizerId}
                    />

                    <InfoBox
                      label="Date"
                      value={event.date}
                    />

                    <InfoBox
                      label="Registrations"
                      value={`${event.registrations} / ${event.capacity}`}
                    />
                  </div>

                  <div className="mt-4">
                    <EventAction
                      event={event}
                      onSuspend={suspendEvent}
                      onRestore={restoreEvent}
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
                  Admins can oversee events created by any
                  organizer. Suspension and restoration are
                  currently frontend-only actions. Actual
                  permissions and event status will be enforced
                  by the backend later.
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
  status: EventStatus;
}) {
  const config = {
    Live: {
      className: "bg-emerald-400/10 text-emerald-300",
      icon: <CheckCircle2 size={10} />,
    },
    Upcoming: {
      className: "bg-violet-400/10 text-violet-300",
      icon: <CalendarDays size={10} />,
    },
    Completed: {
      className: "bg-white/[0.05] text-white/30",
      icon: <CheckCircle2 size={10} />,
    },
    Suspended: {
      className: "bg-red-400/10 text-red-300",
      icon: <XCircle size={10} />,
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
  onSuspend,
  onRestore,
}: {
  event: AdminEvent;
  onSuspend: (id: string) => void;
  onRestore: (id: string) => void;
}) {
  if (event.status === "Suspended") {
    return (
      <button
        type="button"
        onClick={() => onRestore(event.id)}
        className="flex items-center gap-1.5 rounded-lg border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-2 text-[9px] text-emerald-300 transition hover:bg-emerald-400/[0.08]"
      >
        <CheckCircle2 size={11} />
        Restore
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() =>
          alert(
            `Event details for ${event.name} will be connected to the backend later.`
          )
        }
        className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[9px] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
      >
        <Eye size={11} />
        View
      </button>

      <button
        type="button"
        onClick={() => onSuspend(event.id)}
        className="flex items-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/[0.04] px-3 py-2 text-[9px] text-red-300 transition hover:bg-red-400/[0.08]"
      >
        <XCircle size={11} />
        Suspend
      </button>
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