"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { getEvents, type ApiEvent } from "@/lib/api";

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  dateLabel: string;
  time: string;
  location: string;
  registered: number;
  capacity: number;
  price: string;
  deadline: string;
  demand: "high" | "medium" | "low";
  discount?: number;
  gradient: string;
};

const categories = [
  "All",
  "Technology",
  "Workshop",
  "Competition",
  "Seminar",
  "Cultural",
];

function DemandBadge({ demand }: { demand: Event["demand"] }) {
  if (demand === "high") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-orange-300/10 bg-orange-400/10 px-2.5 py-1.5 text-[10px] font-medium text-orange-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
        High demand
      </span>
    );
  }

  if (demand === "medium") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-yellow-300/10 bg-yellow-400/10 px-2.5 py-1.5 text-[10px] font-medium text-yellow-300">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
        Filling steadily
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 rounded-full border border-emerald-300/10 bg-emerald-400/10 px-2.5 py-1.5 text-[10px] font-medium text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      More availability
    </span>
  );
}

function formatDate(dateString: string): {
  date: string;
  dateLabel: string;
  time: string;
} {
  const date = new Date(dateString);

  return {
    date: date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    dateLabel: date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

function calculateDemand(
  registered: number,
  capacity: number,
): Event["demand"] {
  if (capacity <= 0) return "low";

  const percentage = (registered / capacity) * 100;

  if (percentage >= 80) return "high";
  if (percentage >= 50) return "medium";

  return "low";
}

function getGradient(index: number): string {
  const gradients = [
    "from-violet-500/30 via-indigo-500/10 to-cyan-400/10",
    "from-cyan-400/20 via-teal-400/10 to-violet-500/10",
    "from-orange-400/20 via-pink-500/10 to-violet-500/10",
    "from-emerald-400/20 via-teal-500/10 to-cyan-400/10",
    "from-pink-400/20 via-rose-500/10 to-violet-500/10",
  ];

  return gradients[index % gradients.length];
}

export default function EventsPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading === false && user === null) {
      router.replace("/login");
      return;
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);

        const data = await getEvents();

        const transformed = data.map(
          (apiEvent: ApiEvent, index) => {
            const {
              date,
              dateLabel,
              time,
            } = formatDate(apiEvent.event_date);

            const registered = apiEvent.registered_count;
            const capacity = apiEvent.capacity;

            return {
              id: apiEvent.id,
              title: apiEvent.title,
              description:
                apiEvent.description ?? "",
              date,
              dateLabel,
              time,
              location: apiEvent.venue,
              registered,
              capacity,
              price: "View ticket options",
              deadline: "Open",
              demand: calculateDemand(
                registered,
                capacity,
              ),
              discount:
                apiEvent.max_discount_percent,
              gradient: getGradient(index),
            };
          },
        );

        setEvents(transformed);
        setFilteredEvents(transformed);
      } catch (err) {
        console.error(
          "Failed to fetch events:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load events",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  useEffect(() => {
    const query = searchQuery
      .toLowerCase()
      .trim();

    const result = events.filter((event) => {
      const matchesCategory =
        selectedCategory === "All";

      const matchesSearch =
        !query ||
        event.title
          .toLowerCase()
          .includes(query) ||
        event.description
          .toLowerCase()
          .includes(query) ||
        event.location
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });

    setFilteredEvents(result);
  }, [
    events,
    selectedCategory,
    searchQuery,
  ]);

  if (loading) {
    return (
      <main className="campus-background min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <nav className="mb-12 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0c101a]/60 px-5 py-4 backdrop-blur-xl">

            <Link
              href="/events"
              className="text-lg font-bold tracking-tight"
            >
              Evently
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">

              <Link
                href="/events"
                className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black"
              >
                Events
              </Link>

              <Link
                href="/tickets"
                className="rounded-xl px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
              >
                My Tickets
              </Link>

              <Link
                href="/certificates"
                className="rounded-xl px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
              >
                Certifications
              </Link>

              <Link
                href="/team/invitations"
                className="rounded-xl px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
              >
                Team Invitations
              </Link>

              <Link
                href="/profile"
                className="rounded-xl px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
              >
                Profile
              </Link>

              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="rounded-xl px-4 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                Logout
              </button>

            </div>

          </nav>

          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-white/10 bg-[#0c101a]/50 p-6"
              >
                <div className="h-4 w-3/4 rounded bg-white/10" />
                <div className="mt-4 h-3 w-1/2 rounded bg-white/5" />
                <div className="mt-4 h-3 w-1/3 rounded bg-white/5" />
              </div>
            ))}
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="campus-background min-h-screen overflow-hidden">

      <div className="pointer-events-none absolute left-[8%] top-32 h-72 w-72 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute right-[8%] top-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Student Navigation */}
        <nav className="mb-12 flex items-center justify-between rounded-2xl border border-white/10 bg-[#0c101a]/60 px-5 py-4 backdrop-blur-xl">

          <Link
            href="/events"
            className="text-lg font-bold tracking-tight"
          >
            Evently
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">

            <Link
              href="/events"
              className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
            >
              Events
            </Link>

            <Link
              href="/tickets"
              className="rounded-xl px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              My Tickets
            </Link>

            <Link
              href="/certificates"
              className="rounded-xl px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              Certifications
            </Link>

              <Link
                href="/team/invitations"
                className="rounded-xl px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
              >
                Team Invitations
              </Link>

            <Link
              href="/profile"
              className="rounded-xl px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
            >
              Profile
            </Link>

            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="rounded-xl px-4 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              Logout
            </button>

          </div>

        </nav>

        {/* Header */}
        <div className="mb-12 text-center">

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Discover Events
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/50">
            Find and register for exciting events happening across your campus
          </p>

        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Search & Filter */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative w-full max-w-md">

            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search events..."
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.02] pl-10 pr-4 text-sm outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 placeholder:text-white/20"
            />

          </div>

          <div className="flex flex-wrap items-center gap-2">

            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-white text-black shadow-lg shadow-white/10"
                    : "border border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}

          </div>

        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (

          <div className="py-16 text-center">

            <Sparkles className="mx-auto h-12 w-12 text-white/20" />

            <h3 className="mt-4 text-lg font-medium">
              No events found
            </h3>

            <p className="mt-2 text-white/40">
              {searchQuery
                ? "Try adjusting your search query"
                : "No events are currently available"}
            </p>

          </div>

        ) : (

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredEvents.map((event) => (

              <motion.div
                key={event.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                }}
              >

                <Link
                  href={`/events/${event.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c101a]/50 transition hover:border-violet-500/30 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]"
                >

                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                  />

                  <div className="relative z-10 flex flex-1 flex-col p-6">

                    <div className="flex items-center justify-between">

                      <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/60">
                        Campus Event
                      </span>

                      <DemandBadge
                        demand={event.demand}
                      />

                    </div>

                    <h3 className="mt-4 text-xl font-bold tracking-tight transition-colors group-hover:text-violet-300">
                      {event.title}
                    </h3>

                    <div className="mt-4 flex flex-1 flex-col">

                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>
                          {event.dateLabel}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-sm text-white/50">
                        <Clock3 className="h-4 w-4 shrink-0" />
                        <span>
                          {event.time}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-sm text-white/50">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>
                          {event.location}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">

                        <span className="text-sm text-white/50">
                          Capacity: {event.capacity}
                        </span>

                        {event.discount &&
                          event.discount > 0 && (
                            <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                              Up to{" "}
                              {event.discount}%
                              discount
                            </span>
                          )}

                      </div>

                    </div>

                    <div className="mt-6 border-t border-white/10 pt-4">

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-medium text-white/60">
                          View ticket options
                        </span>

                        <span className="flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors group-hover:text-white">
                          View details
                          <ArrowRight size={14} />
                        </span>

                      </div>

                    </div>

                  </div>

                </Link>

              </motion.div>

            ))}

          </div>

        )}

      </div>
    </main>
  );
}
