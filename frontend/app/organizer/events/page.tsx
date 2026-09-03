"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Edit3,
  MapPin,
  Plus,
  Search,
  Ticket,
  Users,
  Loader2,
} from "lucide-react";
import { getMyEvents, type ApiEvent } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type EventStatus =
  | "Registration open"
  | "Upcoming"
  | "Registration closed"
  | "Ended"
  | "pending"
  | "approved"
  | "rejected";

interface EventWithStats extends ApiEvent {
  registrations: number;
  registrationDeadline: string;
  date: string;
  time: string;
}

const filters = [
  "All",
  "Registration open",
  "Upcoming",
  "Registration closed",
  "Ended",
] as const;

type Filter = (typeof filters)[number];

function getEventStatus(event: ApiEvent): EventStatus {
  const now = new Date();
  const eventDate = new Date(event.event_date);
  const deadline = new Date(event.event_date); // For demo, using event date as deadline

  if (event.status === "pending") return "pending";
  if (event.status === "rejected") return "Ended";
  if (event.status === "approved") {
    if (now > eventDate) return "Ended";
    if (now > deadline) return "Registration closed";
    return "Registration open";
  }
  return "Upcoming";
}

function formatDate(dateString: string): { date: string; time: string } {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
  };
}

export default function OrganizerEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      if (!user || user.role !== "organizer") return;

      try {
        setLoading(true);
        const eventsData = await getMyEvents();

        // Add mock registration stats since the backend doesn't provide them yet
        const eventsWithStats: EventWithStats[] = eventsData.map((event) => {
          const dateTime = formatDate(event.event_date);
          return {
            ...event,
            registrations: Math.floor(Math.random() * event.capacity * 0.8), // Placeholder
            registrationDeadline: dateTime.date, // Using event date as deadline for display
            date: dateTime.date,
            time: dateTime.time,
          };
        });

        setEvents(eventsWithStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [user]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const status = getEventStatus(event);
      const matchesFilter = filter === "All" || status === filter;

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        searchValue.length === 0 ||
        event.title.toLowerCase().includes(searchValue) ||
        event.venue.toLowerCase().includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [events, filter, search]);

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
              <Ticket size={16} />
              Attendance
            </Link>

            <Link
              href="/organizer/certificates"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Users size={16} />
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
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/20">
                Organizer workspace
              </p>

              <h1 className="mt-1 text-sm font-semibold">
                Events
              </h1>
            </div>

            <Link
              href="/organizer/events/create"
              className="flex h-9 items-center gap-2 rounded-xl bg-white px-3 text-xs font-semibold text-black transition hover:bg-white/90"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">
                Create event
              </span>
            </Link>
          </div>
        </header>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Heading */}

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium text-violet-300">
                  Event management
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Manage your events.
                </h2>

                <p className="mt-3 max-w-xl text-xs leading-5 text-white/35">
                  Create, monitor, and manage registration
                  windows for every campus event.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-white/25">
                <CalendarDays size={14} />
                {events.length} total events
              </div>
            </div>

            {/* Search */}

            <div className="mt-8 flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search events or venues..."
                  className="h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-11 pr-4 text-xs text-white outline-none placeholder:text-white/20 focus:border-violet-400/30"
                />
              </div>

              <div className="relative">
                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.target.value as Filter)
                  }
                  className="h-12 w-full appearance-none rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 pr-10 text-xs text-white outline-none focus:border-violet-400/30 lg:w-52"
                >
                  {filters.map((item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-[#0c101a]"
                    >
                      {item}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/25"
                />
              </div>
            </div>

            {/* Filter pills */}

            <div className="mt-5 flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-3 py-1.5 text-[10px] transition ${
                    filter === item
                      ? "bg-white text-black"
                      : "border border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Events */}

            <div className="mt-8 space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-12 text-center">
                  <CalendarDays
                    size={25}
                    className="mx-auto text-white/15"
                  />

                  <p className="mt-4 text-sm font-medium">
                    No events found
                  </p>

                  <p className="mt-2 text-xs text-white/25">
                    Try another search or filter.
                  </p>
                </div>
              ) : (
                filteredEvents.map((event) => {
                  const percentage = Math.min(
                    Math.round(
                      (event.registrations /
                        event.capacity) *
                        100
                    ),
                    100
                  );

                  const isFull =
                    event.registrations >= event.capacity;

                  return (
                    <article
                      key={event.id}
                      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:bg-white/[0.03] sm:p-6"
                    >
                      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                        {/* Main event information */}

                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
                            <CalendarDays size={19} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-semibold">
                                {event.title}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[9px] ${
                                  event.status ===
                                  "Registration open"
                                    ? "bg-emerald-400/10 text-emerald-300"
                                    : event.status === "Ended"
                                      ? "bg-white/[0.06] text-white/25"
                                      : "bg-amber-400/10 text-amber-300"
                                }`}
                              >
                                {event.status}
                              </span>
                            </div>

                            <p className="mt-2 max-w-2xl text-xs leading-5 text-white/30">
                              {event.description}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-white/25">
                              <span className="flex items-center gap-1.5">
                                <CalendarDays size={12} />
                                {event.date}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Clock3 size={12} />
                                {event.time}
                              </span>

                              <span className="flex items-center gap-1.5">
                                <MapPin size={12} />
                                {event.venue}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Registration stats */}

                        <div className="w-full shrink-0 xl:w-72">
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-white/20">
                                Registrations
                              </p>

                              <p className="mt-1 text-xl font-semibold">
                                {event.registrations}
                                <span className="ml-1 text-xs font-normal text-white/20">
                                  / {event.capacity}
                                </span>
                              </p>
                            </div>

                            <span className="text-[10px] text-white/25">
                              {percentage}%
                            </span>
                          </div>

                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className={`h-full rounded-full ${
                                isFull
                                  ? "bg-amber-400"
                                  : "bg-violet-400"
                              }`}
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>

                          <p className="mt-3 flex items-center gap-1.5 text-[9px] text-white/20">
                            <Clock3 size={11} />
                            Registration closes{" "}
                            {event.registrationDeadline}
                          </p>
                        </div>

                        {/* Actions */}

                        <div className="flex shrink-0 items-center gap-2 xl:w-44 xl:justify-end">
                          <Link
                            href={`/organizer/events/${event.id}`}
                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] text-[10px] font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white xl:flex-none xl:px-4"
                          >
                            Manage
                            <ArrowRight size={13} />
                          </Link>

                          <Link
                            href={`/organizer/events/${event.id}/edit`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/30 transition hover:bg-white/[0.06] hover:text-white"
                            aria-label={`Edit ${event.title}`}
                          >
                            <Edit3 size={14} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* Footer note */}

            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="flex items-start gap-3">
                <Clock3
                  size={16}
                  className="mt-0.5 shrink-0 text-violet-300/70"
                />

                <div>
                  <p className="text-xs font-medium">
                    Registration deadlines
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-white/25">
                    These deadlines are currently demo data.
                    Once the backend is connected, registration
                    status will be determined from the actual
                    event deadline and students will
                    automatically be prevented from registering
                    after it closes.
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