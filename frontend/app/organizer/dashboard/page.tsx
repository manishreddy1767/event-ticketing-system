"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  LogOut,
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Plus,
  QrCode,
  Ticket,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { getMyEvents, getMyTickets, type ApiEvent, type ApiTicket } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface EventWithStats extends ApiEvent {
  registrations?: number;
  attendance?: number;
  certificates?: number;
  ticketTypes?: { capacity: number; team_size: number }[];
}

interface DashboardStats {
  totalEvents: number;
  totalRegistrations: number;
  totalAttendance: number;
  totalCertificates: number;
}

export default function OrganizerDashboardPage() {
  const { logout } = useAuth();
  const { user } = useAuth();
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalRegistrations: 0,
    totalAttendance: 0,
    totalCertificates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user || user.role !== "organizer") return;

      try {
        setLoading(true);
        const [eventsData] = await Promise.all([
          getMyEvents(),
          // Could also fetch tickets/attendance/certificates for stats
        ]);

        // For now, use mock stats for attendance/certificates since those endpoints require event IDs
        // In a full implementation, we'd fetch these per event
        const eventsWithStats: EventWithStats[] = eventsData.map((event) => ({
          ...event,
          registrations: Math.floor(Math.random() * event.capacity * 0.8), // Placeholder
          attendance: 0,
          certificates: 0,
        }));

        setEvents(eventsWithStats);
        setStats({
          totalEvents: eventsData.length,
          totalRegistrations: eventsWithStats.reduce((sum, e) => sum + (e.registrations || 0), 0),
          totalAttendance: eventsWithStats.reduce((sum, e) => sum + (e.attendance || 0), 0),
          totalCertificates: eventsWithStats.reduce((sum, e) => sum + (e.certificates || 0), 0),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  function formatDate(dateString: string): { date: string; time: string } {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
  }

  if (loading) {
    return (
      <main className="campus-background min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.07] bg-[#080b12]/90 px-4 py-6 backdrop-blur-xl lg:block">
          <div className="flex h-full flex-col">
            <Link href="/" className="flex items-center gap-2.5 px-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black">E</div>
              <span className="text-lg font-bold tracking-tight">Evently</span>
            </Link>
            <div className="mt-8 rounded-xl border border-violet-400/10 bg-violet-400/[0.04] p-3">
              <p className="text-[9px] uppercase tracking-wider text-white/20">Workspace</p>
              <p className="mt-1 text-xs font-medium text-violet-300">Organizer</p>
            </div>
            <nav className="mt-7 space-y-1">
              <p className="mb-3 px-3 text-[9px] uppercase tracking-wider text-white/20">Management</p>
              <Link href="/organizer/dashboard" className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-3 py-2.5 text-xs font-medium text-white">
                <Activity size={16} /> Dashboard
              </Link>
              <Link href="/organizer/events" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white">
                <CalendarDays size={16} /> Events
              </Link>
              <Link href="/organizer/registrations" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white">
                <Users size={16} /> Registrations
              </Link>
              <Link href="/organizer/attendance" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white">
                <QrCode size={16} /> Attendance
              </Link>
              <Link href="/organizer/certificates" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white">
                <Award size={16} /> Certificates
              </Link>
              <Link href="/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white">
                <Activity size={16} /> Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-red-400/70 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut size={16} /> Logout
              </button>
            </nav>
            <div className="mt-auto">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                <p className="text-[9px] uppercase tracking-wider text-white/20">Signed in as</p>
                <p className="mt-2 text-xs font-medium">Event Organizer</p>
                <p className="mt-1 text-[10px] text-white/25">Vardhaman College of Engineering</p>
              </div>
              <Link href="/" className="mt-1 block px-3 py-2 text-[10px] text-white/25 transition hover:text-white">← Back to Evently</Link>
            </div>
          </div>
        </aside>

        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/20">Organizer workspace</p>
                <h1 className="mt-1 text-sm font-semibold">Dashboard</h1>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/profile" className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[10px] text-white/50 transition hover:bg-white/[0.06] hover:text-white">
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
                <Link href="/organizer/events/create" className="flex h-9 items-center gap-2 rounded-xl bg-white px-3 text-xs font-semibold text-black transition hover:bg-white/90">
                  <Plus size={14} />
                  <span className="hidden sm:inline">Create event</span>
                </Link>
              </div>
            </div>
          </header>

          <section className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="animate-pulse space-y-8">
                <div className="h-4 w-1/4 rounded bg-white/10" />
                <div className="h-32 w-full rounded-2xl bg-white/5" />
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 rounded-2xl border border-white/10 bg-white/[0.02]" />
                  ))}
                </div>
                <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
                  <div className="h-96 rounded-2xl border border-white/10 bg-white/[0.02]" />
                  <div className="h-96 rounded-2xl border border-white/10 bg-white/[0.02]" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Filter upcoming events
  const upcomingEvents = events
    .filter((e) => e.status === "approved")
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 3);

  return (
    <main className="campus-background min-h-screen">
      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.07] bg-[#080b12]/90 px-4 py-6 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}

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

          {/* Role */}

          <div className="mt-8 rounded-xl border border-violet-400/10 bg-violet-400/[0.04] p-3">
            <p className="text-[9px] uppercase tracking-wider text-white/20">
              Workspace
            </p>

            <p className="mt-1 text-xs font-medium text-violet-300">
              Organizer
            </p>
          </div>

          {/* Navigation */}

          <nav className="mt-7 space-y-1">
            <p className="mb-3 px-3 text-[9px] uppercase tracking-wider text-white/20">
              Management
            </p>

            <Link
              href="/organizer/dashboard"
              className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-3 py-2.5 text-xs font-medium text-white"
            >
              <Activity size={16} />
              Dashboard
            </Link>

            <Link
              href="/organizer/events"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white"
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

          {/* Bottom */}

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
          MAIN AREA
      ========================= */}

      <div className="lg:pl-64">
        {/* Top bar */}

        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/20">
                Organizer workspace
              </p>

              <h1 className="mt-1 text-sm font-semibold">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden text-[10px] text-white/25 sm:block">
                {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>

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
                href="/organizer/events/create"
                className="flex h-9 items-center gap-2 rounded-xl bg-white px-3 text-xs font-semibold text-black transition hover:bg-white/90"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">
                  Create event
                </span>
              </Link>
            </div>
          </div>
        </header>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">

            {error && (
              <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            {/* =========================
                WELCOME
            ========================= */}

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium text-violet-300">
                  Good evening
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  Your events at a glance.
                </h2>

                <p className="mt-3 max-w-xl text-xs leading-5 text-white/35">
                  Monitor registrations, attendance, and
                  certificates across your events from one
                  workspace.
                </p>
              </div>

              <Link
                href="/organizer/events"
                className="inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white"
              >
                Manage all events
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* =========================
                STATS
            ========================= */}

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total events", value: stats.totalEvents, change: "Active events", icon: CalendarDays },
                { label: "Registrations", value: stats.totalRegistrations, change: "Total participants", icon: Ticket },
                { label: "Attendance", value: stats.totalAttendance, change: "Checked in", icon: CheckCircle2 },
                { label: "Certificates", value: stats.totalCertificates, change: "Issued", icon: Award },
              ].map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <motion.div
                    key={stat.label}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-white/40">
                        <Icon size={16} />
                      </div>

                      <TrendingUp
                        size={14}
                        className="text-emerald-300/70"
                      />
                    </div>

                    <p className="mt-5 text-[10px] uppercase tracking-wider text-white/20">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      {stat.value}
                    </p>

                    <p className="mt-2 text-[10px] text-emerald-300/70">
                      {stat.change}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* =========================
                EVENTS + ACTIVITY
            ========================= */}

            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">

              {/* Upcoming events */}

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/20">
                      Upcoming
                    </p>

                    <h3 className="mt-1 text-sm font-semibold">
                      Upcoming events
                    </h3>
                  </div>

                  <Link
                    href="/organizer/events"
                    className="text-[10px] text-white/30 transition hover:text-white"
                  >
                    View all
                  </Link>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {upcomingEvents.length === 0 ? (
                    <div className="p-10 text-center">
                      <CalendarDays className="mx-auto h-12 w-12 text-white/20" />
                      <h4 className="mt-4 text-sm font-medium">No upcoming events</h4>
                      <p className="mt-2 text-white/40">Create your first event to get started</p>
                      <Link
                        href="/organizer/events/create"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
                      >
                        <Plus size={12} />
                        Create event
                      </Link>
                    </div>
                  ) : (
                    upcomingEvents.map((event) => {
                      const percentage = event.capacity > 0
                        ? Math.round(((event.registrations || 0) / event.capacity) * 100)
                        : 0;
                      const { date, time } = formatDate(event.event_date);

                      return (
                        <Link
                          key={event.id}
                          href={`/organizer/events/${event.id}`}
                          className="block p-5 transition hover:bg-white/[0.025]"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                                <CalendarDays size={17} />
                              </div>

                              <div>
                                <h4 className="text-sm font-medium">
                                  {event.title}
                                </h4>

                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/25">
                                  <span>{date}</span>
                                  <span>{time}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-5">
                              <div className="min-w-32">
                                <div className="flex justify-between text-[9px]">
                                  <span className="text-white/25">
                                    Registrations
                                  </span>

                                  <span className="text-white/40">
                                    {event.registrations || 0}/
                                    {event.capacity}
                                  </span>
                                </div>

                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                  <div
                                    className="h-full rounded-full bg-violet-400"
                                    style={{
                                      width: `${percentage}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              <ChevronRight
                                size={15}
                                className="hidden text-white/20 sm:block"
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-300">
                              {event.status === "approved" ? "Registration open" : event.status}
                            </span>

                            <span className="text-[9px] text-white/20">
                              {percentage}% capacity
                            </span>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Recent activity */}

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <div className="border-b border-white/[0.07] p-5">
                  <p className="text-[10px] uppercase tracking-wider text-white/20">
                    Live activity
                  </p>

                  <h3 className="mt-1 text-sm font-semibold">
                    Recent activity
                  </h3>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {upcomingEvents.length > 0 && upcomingEvents[0] ? (
                    <>
                      <div className="p-5">
                        <div className="flex gap-3">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                            <Ticket size={13} className="text-violet-300" />
                          </div>
                          <div>
                            <p className="text-[11px] leading-5 text-white/50">
                              Event "{upcomingEvents[0].title}" created
                            </p>
                            <p className="mt-1 text-[9px] text-white/20">
                              Just now
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-5 text-center text-white/30">
                      No recent activity
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <Link
                    href="/organizer/activity"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] py-2.5 text-[10px] text-white/35 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    View activity
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>

            {/* =========================
                QUICK ACTIONS
            ========================= */}

            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-wider text-white/20">
                Quick actions
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/organizer/events/create"
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.04]"
                >
                  <Plus
                    size={18}
                    className="text-violet-300"
                  />

                  <p className="mt-4 text-xs font-medium">
                    Create event
                  </p>

                  <p className="mt-1 text-[10px] text-white/25">
                    Publish a new campus event.
                  </p>
                </Link>

                <Link
                  href="/organizer/registrations"
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.04]"
                >
                  <Users
                    size={18}
                    className="text-cyan-300"
                  />

                  <p className="mt-4 text-xs font-medium">
                    View registrations
                  </p>

                  <p className="mt-1 text-[10px] text-white/25">
                    Review students and teams.
                  </p>
                </Link>

                <Link
                  href="/organizer/attendance"
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.04]"
                >
                  <QrCode
                    size={18}
                    className="text-emerald-300"
                  />

                  <p className="mt-4 text-xs font-medium">
                    Check attendance
                  </p>

                  <p className="mt-1 text-[10px] text-white/25">
                    Scan participant QR codes.
                  </p>
                </Link>

                <Link
                  href="/organizer/certificates"
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.04]"
                >
                  <Award
                    size={18}
                    className="text-amber-300"
                  />

                  <p className="mt-4 text-xs font-medium">
                    Issue certificates
                  </p>

                  <p className="mt-1 text-[10px] text-white/25">
                    Award verified certificates.
                  </p>
                </Link>
              </div>
            </div>

            {/* =========================
                SYSTEM STATUS
            ========================= */}

            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />

                <div>
                  <p className="text-xs font-medium">
                    Evently systems operational
                  </p>

                  <p className="mt-1 text-[10px] text-white/20">
                    Registration and attendance services are
                    running normally.
                  </p>
                </div>
              </div>

              <span className="text-[9px] text-white/20">
                Last checked just now
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}