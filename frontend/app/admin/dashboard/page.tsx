"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ShieldCheck,
  Ticket,
  TrendingUp,
  Users,
  UserCog,
} from "lucide-react";

const stats = [
  {
    label: "Total students",
    value: "1,284",
    detail: "+86 this month",
    icon: Users,
  },
  {
    label: "Organizers",
    value: "42",
    detail: "38 active",
    icon: UserCog,
  },
  {
    label: "Events",
    value: "76",
    detail: "12 upcoming",
    icon: CalendarDays,
  },
  {
    label: "Registrations",
    value: "8,421",
    detail: "+14.8% this month",
    icon: Ticket,
  },
];

const recentEvents = [
  {
    name: "AI Hackathon 2026",
    organizer: "CSE Department",
    registrations: 248,
    status: "Live",
  },
  {
    name: "Tech Symposium 2026",
    organizer: "IEEE Student Branch",
    registrations: 184,
    status: "Upcoming",
  },
  {
    name: "CodeSprint",
    organizer: "Coding Club",
    registrations: 312,
    status: "Upcoming",
  },
  {
    name: "Innovation Expo",
    organizer: "Innovation Cell",
    registrations: 96,
    status: "Completed",
  },
];

const recentOrganizers = [
  {
    name: "CSE Department",
    email: "cse@college.edu",
    events: 12,
    status: "Active",
  },
  {
    name: "IEEE Student Branch",
    email: "ieee@college.edu",
    events: 8,
    status: "Active",
  },
  {
    name: "Coding Club",
    email: "coding@college.edu",
    events: 6,
    status: "Active",
  },
  {
    name: "Innovation Cell",
    email: "innovation@college.edu",
    events: 9,
    status: "Active",
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="campus-background min-h-screen">
      {/* Header */}

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
              E
            </div>

            <div>
              <span className="text-lg font-bold tracking-tight">
                Evently
              </span>

              <p className="text-[8px] uppercase tracking-widest text-white/25">
                Admin Console
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/organizers"
              className="hidden rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-[10px] text-white/45 transition hover:bg-white/[0.06] hover:text-white sm:block"
            >
              Organizers
            </Link>

            <Link
              href="/admin/users"
              className="hidden rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-[10px] text-white/45 transition hover:bg-white/[0.06] hover:text-white sm:block"
            >
              Users
            </Link>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
              <ShieldCheck size={16} />
            </div>
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

            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Admin dashboard.
            </h1>

            <p className="mt-3 max-w-2xl text-xs leading-5 text-white/35">
              Monitor the Evently platform, manage organizers,
              oversee events, and review student activity.
            </p>
          </div>

          {/* Stats */}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/40">
                      <Icon size={16} />
                    </div>

                    <TrendingUp
                      size={14}
                      className="text-emerald-300/60"
                    />
                  </div>

                  <p className="mt-5 text-[9px] uppercase tracking-wider text-white/20">
                    {stat.label}
                  </p>

                  <p className="mt-1 text-2xl font-semibold tracking-tight">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-[9px] text-emerald-300/60">
                    {stat.detail}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Platform health */}

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/20">
                    Platform activity
                  </p>

                  <h2 className="mt-1 text-sm font-semibold">
                    Registration activity
                  </h2>
                </div>

                <Activity
                  size={16}
                  className="text-violet-300/60"
                />
              </div>

              <div className="mt-6 flex h-40 items-end gap-2">
                {[42, 55, 48, 72, 64, 88, 76, 94, 81, 100, 91, 108].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex flex-1 items-end"
                    >
                      <div
                        className="w-full rounded-t-lg bg-violet-400/20 transition hover:bg-violet-400/35"
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    </div>
                  )
                )}
              </div>

              <div className="mt-3 flex justify-between text-[8px] text-white/15">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <CheckCircle2 size={17} />
              </div>

              <p className="mt-5 text-[9px] uppercase tracking-wider text-emerald-300/60">
                System status
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                All systems operational
              </h2>

              <p className="mt-3 text-[10px] leading-5 text-white/30">
                Event registration, ticketing, attendance,
                certificates, and organizer services are
                operating normally.
              </p>

              <div className="mt-6 space-y-3">
                <HealthRow
                  label="Registration service"
                  status="Operational"
                />

                <HealthRow
                  label="Ticket service"
                  status="Operational"
                />

                <HealthRow
                  label="Attendance service"
                  status="Operational"
                />
              </div>
            </div>
          </div>

          {/* Events + organizers */}

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {/* Events */}

            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/20">
                    Events
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    Recent platform events
                  </p>
                </div>

                <Link
                  href="/admin/events"
                  className="flex items-center gap-1 text-[9px] text-violet-300"
                >
                  View all
                  <ArrowRight size={11} />
                </Link>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {recentEvents.map((event) => (
                  <div
                    key={event.name}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">
                        {event.name}
                      </p>

                      <p className="mt-1 truncate text-[9px] text-white/20">
                        {event.organizer}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] text-white/45">
                        {event.registrations}
                      </p>

                      <p className="mt-1 text-[8px] text-white/20">
                        registrations
                      </p>
                    </div>

                    <span
                      className={`hidden rounded-full px-2.5 py-1 text-[8px] sm:block ${
                        event.status === "Live"
                          ? "bg-emerald-400/10 text-emerald-300"
                          : event.status === "Completed"
                            ? "bg-white/[0.05] text-white/30"
                            : "bg-violet-400/10 text-violet-300"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizers */}

            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/20">
                    Organizers
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    Active organizers
                  </p>
                </div>

                <Link
                  href="/admin/organizers"
                  className="flex items-center gap-1 text-[9px] text-violet-300"
                >
                  Manage
                  <ArrowRight size={11} />
                </Link>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {recentOrganizers.map((organizer) => (
                  <div
                    key={organizer.email}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">
                        {organizer.name}
                      </p>

                      <p className="mt-1 truncate text-[9px] text-white/20">
                        {organizer.email}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-white/45">
                        {organizer.events}
                      </p>

                      <p className="mt-1 text-[8px] text-white/20">
                        events
                      </p>
                    </div>

                    <span className="hidden rounded-full bg-emerald-400/10 px-2.5 py-1 text-[8px] text-emerald-300 sm:block">
                      {organizer.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick actions */}

          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <p className="text-[9px] uppercase tracking-wider text-white/20">
              Quick access
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <QuickAction
                href="/admin/organizers"
                icon={<UserCog size={16} />}
                title="Manage organizers"
                description="Review organizer accounts and activity."
              />

              <QuickAction
                href="/admin/events"
                icon={<CalendarDays size={16} />}
                title="Manage events"
                description="Review all events across the platform."
              />

              <QuickAction
                href="/admin/users"
                icon={<Users size={16} />}
                title="Manage users"
                description="Review registered student accounts."
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HealthRow({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-white/35">
        {label}
      </span>

      <span className="flex items-center gap-1.5 text-[9px] text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
        {status}
      </span>
    </div>
  );
}

function QuickAction({
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
      className="group rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 transition hover:bg-white/[0.04]"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-white/40 transition group-hover:text-white">
        {icon}
      </div>

      <p className="mt-4 text-xs font-medium">
        {title}
      </p>

      <p className="mt-1 text-[9px] leading-4 text-white/20">
        {description}
      </p>
    </Link>
  );
}