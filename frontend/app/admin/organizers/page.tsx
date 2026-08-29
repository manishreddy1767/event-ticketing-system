"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X,
  XCircle,
} from "lucide-react";

type OrganizerStatus = "Active" | "Pending" | "Suspended";

type Organizer = {
  id: number;
  name: string;
  email: string;
  department: string;
  events: number;
  participants: number;
  status: OrganizerStatus;
};

const initialOrganizers: Organizer[] = [
  {
    id: 1,
    name: "CSE Department",
    email: "cse@college.edu",
    department: "Computer Science",
    events: 12,
    participants: 1840,
    status: "Active",
  },
  {
    id: 2,
    name: "IEEE Student Branch",
    email: "ieee@college.edu",
    department: "Student Organization",
    events: 8,
    participants: 920,
    status: "Active",
  },
  {
    id: 3,
    name: "Coding Club",
    email: "coding@college.edu",
    department: "Technical Club",
    events: 6,
    participants: 680,
    status: "Pending",
  },
  {
    id: 4,
    name: "Innovation Cell",
    email: "innovation@college.edu",
    department: "Innovation & Entrepreneurship",
    events: 9,
    participants: 1140,
    status: "Active",
  },
  {
    id: 5,
    name: "Robotics Club",
    email: "robotics@college.edu",
    department: "Technical Club",
    events: 4,
    participants: 310,
    status: "Suspended",
  },
];

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] =
    useState<Organizer[]>(initialOrganizers);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "All" | OrganizerStatus
  >("All");

  const filteredOrganizers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return organizers.filter((organizer) => {
      const matchesSearch =
        !query ||
        organizer.name.toLowerCase().includes(query) ||
        organizer.email.toLowerCase().includes(query) ||
        organizer.department.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" ||
        organizer.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [organizers, search, filter]);

  const activeCount = organizers.filter(
    (organizer) => organizer.status === "Active"
  ).length;

  const pendingCount = organizers.filter(
    (organizer) => organizer.status === "Pending"
  ).length;

  const suspendedCount = organizers.filter(
    (organizer) => organizer.status === "Suspended"
  ).length;

  function approveOrganizer(id: number) {
    setOrganizers((current) =>
      current.map((organizer) =>
        organizer.id === id
          ? { ...organizer, status: "Active" }
          : organizer
      )
    );
  }

  function suspendOrganizer(id: number) {
    setOrganizers((current) =>
      current.map((organizer) =>
        organizer.id === id
          ? { ...organizer, status: "Suspended" }
          : organizer
      )
    );
  }

  function activateOrganizer(id: number) {
    setOrganizers((current) =>
      current.map((organizer) =>
        organizer.id === id
          ? { ...organizer, status: "Active" }
          : organizer
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
                Organizer management
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
              Organizers.
            </h2>

            <p className="mt-3 max-w-2xl text-xs leading-5 text-white/35">
              Review organizer accounts, monitor activity, and
              control organizer access to the Evently platform.
            </p>
          </div>

          {/* Stats */}

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={<CheckCircle2 size={16} />}
              label="Active organizers"
              value={activeCount}
            />

            <StatCard
              icon={<Users size={16} />}
              label="Pending approval"
              value={pendingCount}
            />

            <StatCard
              icon={<XCircle size={16} />}
              label="Suspended"
              value={suspendedCount}
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
                  placeholder="Search organizer, email or department..."
                  className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-9 pr-3 text-[10px] text-white outline-none placeholder:text-white/20 focus:border-violet-400/30"
                />
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target.value as
                      | "All"
                      | OrganizerStatus
                  )
                }
                className="h-10 rounded-xl border border-white/[0.07] bg-[#0c101a] px-3 text-[10px] text-white/50 outline-none"
              >
                <option value="All">All organizers</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Organizer table */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <p className="text-[9px] uppercase tracking-wider text-white/20">
                Organizer accounts
              </p>

              <p className="mt-1 text-xs text-white/35">
                Showing {filteredOrganizers.length} organizers
              </p>
            </div>

            {/* Desktop */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Organizer
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Events
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Participants
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
                  {filteredOrganizers.map((organizer) => (
                    <tr
                      key={organizer.id}
                      className="border-b border-white/[0.05] transition hover:bg-white/[0.015]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                            <UserCog size={15} />
                          </div>

                          <div>
                            <p className="text-xs font-medium">
                              {organizer.name}
                            </p>

                            <p className="mt-1 text-[9px] text-white/20">
                              {organizer.email}
                            </p>

                            <p className="mt-1 text-[9px] text-white/30">
                              {organizer.department}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-white/50">
                          {organizer.events}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-white/50">
                          {organizer.participants.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={organizer.status}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <ActionButton
                          organizer={organizer}
                          onApprove={approveOrganizer}
                          onSuspend={suspendOrganizer}
                          onActivate={activateOrganizer}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}

            <div className="divide-y divide-white/[0.06] lg:hidden">
              {filteredOrganizers.map((organizer) => (
                <div
                  key={organizer.id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                        <UserCog size={15} />
                      </div>

                      <div>
                        <p className="text-xs font-medium">
                          {organizer.name}
                        </p>

                        <p className="mt-1 text-[9px] text-white/25">
                          {organizer.email}
                        </p>
                      </div>
                    </div>

                    <StatusBadge
                      status={organizer.status}
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <InfoBox
                      icon={<CalendarDays size={12} />}
                      label="Events"
                      value={organizer.events}
                    />

                    <InfoBox
                      icon={<Users size={12} />}
                      label="Participants"
                      value={organizer.participants}
                    />

                    <InfoBox
                      icon={<UserCog size={12} />}
                      label="Type"
                      value="Organizer"
                    />
                  </div>

                  <div className="mt-4">
                    <ActionButton
                      organizer={organizer}
                      onApprove={approveOrganizer}
                      onSuspend={suspendOrganizer}
                      onActivate={activateOrganizer}
                    />
                  </div>
                </div>
              ))}
            </div>

            {filteredOrganizers.length === 0 && (
              <div className="px-6 py-14 text-center">
                <Search
                  size={20}
                  className="mx-auto text-white/15"
                />

                <p className="mt-4 text-sm font-medium">
                  No organizers found
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
                  Admin controls
                </p>

                <p className="mt-1 text-[10px] leading-5 text-white/25">
                  Organizer approval and suspension are currently
                  frontend-only actions. Authentication,
                  permissions, and persistent account status will
                  be enforced by the backend later.
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
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: OrganizerStatus;
}) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-300">
        <CheckCircle2 size={10} />
        Active
      </span>
    );
  }

  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-[9px] text-amber-300">
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-400/10 px-2.5 py-1 text-[9px] text-red-300">
      <XCircle size={10} />
      Suspended
    </span>
  );
}

function ActionButton({
  organizer,
  onApprove,
  onSuspend,
  onActivate,
}: {
  organizer: Organizer;
  onApprove: (id: number) => void;
  onSuspend: (id: number) => void;
  onActivate: (id: number) => void;
}) {
  if (organizer.status === "Pending") {
    return (
      <button
        type="button"
        onClick={() => onApprove(organizer.id)}
        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[9px] font-semibold text-black transition hover:bg-white/90"
      >
        <Check size={11} />
        Approve
      </button>
    );
  }

  if (organizer.status === "Active") {
    return (
      <button
        type="button"
        onClick={() => onSuspend(organizer.id)}
        className="flex items-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/[0.04] px-3 py-2 text-[9px] text-red-300 transition hover:bg-red-400/[0.08]"
      >
        <X size={11} />
        Suspend
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onActivate(organizer.id)}
      className="flex items-center gap-1.5 rounded-lg border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-2 text-[9px] text-emerald-300 transition hover:bg-emerald-400/[0.08]"
    >
      <Check size={11} />
      Activate
    </button>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-white/20">
        {icon}
        <span className="text-[8px] uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-2 text-[10px] text-white/50">
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </p>
    </div>
  );
}