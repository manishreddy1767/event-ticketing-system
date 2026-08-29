"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

type Event = {
  id: number;
  title: string;
  category: string;
  date: string;
  dateLabel: string;
  time: string;
  location: string;
  registered: number;
  capacity: number;
  price: number;
  deadline: string;
  description: string;
  demand: "high" | "medium" | "low";
  discount?: number;
  teamSizes: number[];
  gradient: string;
};

const events: Event[] = [
  {
    id: 1,
    title: "AI Hackathon 2026",
    category: "Technology",
    date: "2026-09-12",
    dateLabel: "12 SEP",
    time: "10:00 AM",
    location: "Main Auditorium",
    registered: 382,
    capacity: 500,
    price: 100,
    deadline: "10 Sep",
    description:
      "Build, collaborate and compete in a full-day technology challenge.",
    demand: "high",
    teamSizes: [1, 2, 3, 4],
    gradient: "from-violet-600/35 via-indigo-500/10 to-cyan-400/10",
  },
  {
    id: 2,
    title: "Design Thinking Workshop",
    category: "Workshop",
    date: "2026-09-15",
    dateLabel: "15 SEP",
    time: "2:00 PM",
    location: "Innovation Lab",
    registered: 124,
    capacity: 200,
    price: 50,
    deadline: "13 Sep",
    description:
      "Learn practical design thinking techniques through hands-on activities.",
    demand: "medium",
    discount: 10,
    teamSizes: [1, 2],
    gradient: "from-cyan-400/25 via-teal-400/10 to-violet-500/10",
  },
  {
    id: 3,
    title: "Campus Coding Contest",
    category: "Competition",
    date: "2026-09-18",
    dateLabel: "18 SEP",
    time: "9:00 AM",
    location: "CSE Block",
    registered: 286,
    capacity: 300,
    price: 75,
    deadline: "17 Sep",
    description:
      "Put your problem-solving skills to the test against the best coders.",
    demand: "high",
    teamSizes: [1],
    gradient: "from-orange-400/25 via-pink-500/10 to-violet-500/10",
  },
  {
    id: 4,
    title: "Robotics Expo",
    category: "Technology",
    date: "2026-09-22",
    dateLabel: "22 SEP",
    time: "11:00 AM",
    location: "Open Grounds",
    registered: 91,
    capacity: 250,
    price: 0,
    deadline: "21 Sep",
    description:
      "Explore student-built robots, autonomous systems and innovative prototypes.",
    demand: "low",
    discount: 20,
    teamSizes: [1, 2, 3],
    gradient: "from-blue-500/25 via-sky-400/10 to-violet-500/10",
  },
  {
    id: 5,
    title: "Entrepreneurship Summit",
    category: "Seminar",
    date: "2026-09-25",
    dateLabel: "25 SEP",
    time: "10:30 AM",
    location: "Seminar Hall",
    registered: 167,
    capacity: 250,
    price: 120,
    deadline: "23 Sep",
    description:
      "Meet founders, explore startup ideas and learn what it takes to build.",
    demand: "medium",
    teamSizes: [1],
    gradient: "from-amber-400/20 via-orange-500/10 to-pink-500/10",
  },
  {
    id: 6,
    title: "Photography Walk",
    category: "Cultural",
    date: "2026-09-28",
    dateLabel: "28 SEP",
    time: "5:00 PM",
    location: "North Campus",
    registered: 48,
    capacity: 100,
    price: 30,
    deadline: "27 Sep",
    description:
      "Explore the campus through a creative lens with fellow photography enthusiasts.",
    demand: "low",
    discount: 15,
    teamSizes: [1],
    gradient: "from-pink-500/20 via-purple-500/10 to-cyan-400/10",
  },
];

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

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredEvents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return events.filter((event) => {
      const matchesCategory =
        category === "All" || event.category === category;

      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <main className="campus-background min-h-screen">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 backdrop-blur-xl sm:px-6">
            <Link href="/" className="flex items-center gap-2.5">
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
                className="text-sm font-medium text-white"
              >
                Events
              </Link>

              <Link
                href="/events"
                className="text-sm text-white/45 transition hover:text-white"
              >
                Discover
              </Link>

              <Link
                href="/tickets"
                className="text-sm text-white/45 transition hover:text-white"
              >
                My Tickets
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden text-sm text-white/60 transition hover:text-white sm:block"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="hidden rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 sm:block"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Page heading */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-36 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-violet-300">
            <Sparkles size={15} />
            Discover
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
            Find something worth
            <br />
            <span className="text-white/35">showing up for.</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-white/40 sm:text-base">
            Explore verified events happening around campus and find your
            next workshop, competition or experience.
          </p>
        </motion.div>
      </section>

      {/* Search + filters */}
      <section className="sticky top-0 z-30 border-y border-white/[0.06] bg-[#070a12]/85 py-4 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, categories or venues..."
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-10 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-violet-400/40 focus:bg-white/[0.06]"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-white/35 hover:bg-white/10 hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-medium transition ${
                    category === item
                      ? "bg-white text-black"
                      : "border border-white/10 bg-white/[0.03] text-white/45 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "event" : "events"}
            </p>

            <p className="mt-1 text-xs text-white/30">
              Showing upcoming events
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-white/30 sm:flex">
            <Zap size={13} className="text-violet-300" />
            Demand updates live
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event, index) => {
              const occupancy = Math.round(
                (event.registered / event.capacity) * 100
              );

              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.05, 0.25),
                  }}
                >
                  <Link
                    href={`/events/${event.id}`}
                    className="group block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-2 transition duration-300 hover:-translate-y-1.5 hover:border-white/[0.16] hover:bg-white/[0.045]"
                  >
                    {/* Visual */}
                    <div
                      className={`relative h-56 overflow-hidden rounded-xl bg-gradient-to-br ${event.gradient}`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.12),transparent_25%)]" />

                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0b0f18] via-[#0b0f18]/50 to-transparent" />

                      <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/25 px-2.5 py-1.5 text-[10px] font-semibold tracking-wider text-white/65 backdrop-blur-xl">
                        {event.category.toUpperCase()}
                      </div>

                      <div className="absolute right-4 top-4">
                        <DemandBadge demand={event.demand} />
                      </div>

                      <div className="absolute bottom-4 left-4 flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-white text-black shadow-xl">
                        <span className="text-[9px] font-bold">
                          {event.dateLabel.split(" ")[1]}
                        </span>
                        <span className="text-base font-black">
                          {event.dateLabel.split(" ")[0]}
                        </span>
                      </div>

                      {event.discount && (
                        <div className="absolute bottom-4 right-4 rounded-lg border border-violet-300/10 bg-violet-400/10 px-2.5 py-1.5 text-[10px] font-medium text-violet-200 backdrop-blur">
                          {event.discount}% smart discount
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="px-3 pb-3 pt-5">
                      <h2 className="text-lg font-semibold tracking-tight transition group-hover:text-white/90">
                        {event.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/35">
                        {event.description}
                      </p>

                      <div className="mt-5 space-y-2.5 text-xs text-white/40">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={14} />
                          {event.dateLabel} • {event.time}
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          {event.location}
                        </div>

                        <div className="flex items-center gap-2">
                          <Users size={14} />
                          Teams of {event.teamSizes.join(", ")}
                        </div>
                      </div>

                      {/* Demand */}
                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-[11px]">
                          <span className="text-white/30">
                            Current occupancy
                          </span>

                          <span className="font-medium text-white/55">
                            {occupancy}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${occupancy}%` }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300"
                          />
                        </div>
                      </div>

                      <div className="mt-5 border-t border-white/[0.06] pt-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[10px] text-white/25">
                              Registration from
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              {event.price === 0 ? "Free" : `₹${event.price}`}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] text-white/25">
                              Deadline
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-white/55">
                              <Clock3 size={12} />
                              {event.deadline}
                            </p>
                          </div>

                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-white/40 transition group-hover:bg-white group-hover:text-black">
                            <ArrowRight size={15} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Search size={22} className="text-white/30" />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              No events found
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
              Try a different search term or choose another category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-6 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 text-xs text-white/25 sm:flex-row sm:px-6 lg:px-8">
          <span>Evently — College Event Platform</span>
          <span>Built for campus experiences.</span>
        </div>
      </footer>
    </main>
  );
}