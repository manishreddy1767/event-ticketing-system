"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Loader2,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { getPendingOrganizers, approveOrganizer, rejectOrganizer } from "@/lib/api";

type OrganizerStatus = "active" | "pending" | "rejected";

type Organizer = {
  id: number;
  user_id: number;
  name: string;
  email: string;
  organization_name: string;
  phone: string;
  description: string | null;
  status: OrganizerStatus;
  created_at: string;
};

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | OrganizerStatus>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    async function fetchOrganizers() {
      try {
        setLoading(true);
        const data = await getPendingOrganizers();
        setOrganizers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load organizers");
      } finally {
        setLoading(false);
      }
    }
    fetchOrganizers();
  }, []);

  const filteredOrganizers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return organizers.filter((organizer) => {
      const matchesSearch =
        !query ||
        organizer.name.toLowerCase().includes(query) ||
        organizer.email.toLowerCase().includes(query) ||
        organizer.organization_name.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" || organizer.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [organizers, search, filter]);

  const activeCount = organizers.filter(
    (organizer) => organizer.status === "active"
  ).length;

  const pendingCount = organizers.filter(
    (organizer) => organizer.status === "pending"
  ).length;

  const rejectedCount = organizers.filter(
    (organizer) => organizer.status === "rejected"
  ).length;

  async function handleApproveOrganizer(id: number) {
    setActionLoading(id);
    try {
      await approveOrganizer(id);
      setOrganizers((current) =>
        current.map((organizer) =>
          organizer.id === id ? { ...organizer, status: "active" as const } : organizer
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve organizer");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRejectOrganizer(id: number) {
    setActionLoading(id);
    try {
      await rejectOrganizer(id);
      setOrganizers((current) =>
        current.map((organizer) =>
          organizer.id === id ? { ...organizer, status: "rejected" as const } : organizer
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject organizer");
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
            <div className="animate-pulse space-y-8">
              <div className="h-4 w-1/4 rounded bg-white/10" />
              <div className="grid gap-6 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
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
              Review organizer applications, approve or reject accounts,
              and control organizer access to the Evently platform.
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
              label="Rejected"
              value={rejectedCount}
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
                  placeholder="Search organizer, email or organization..."
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
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Organizer table */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <p className="text-[9px] uppercase tracking-wider text-white/20">
                Organizer applications
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
                      Organization
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Phone
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Status
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Applied
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
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-white/50">
                          {organizer.organization_name}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-white/50">
                          {organizer.phone}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={organizer.status}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-white/50">
                          {new Date(organizer.created_at).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <ActionButton
                          organizer={organizer}
                          onApprove={handleApproveOrganizer}
                          onReject={handleRejectOrganizer}
                          loading={actionLoading === organizer.id}
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
                      label="Organization"
                      value={organizer.organization_name}
                    />

                    <InfoBox
                      icon={<Users size={12} />}
                      label="Phone"
                      value={organizer.phone}
                    />

                    <InfoBox
                      icon={<UserCog size={12} />}
                      label="Applied"
                      value={new Date(organizer.created_at).toLocaleDateString()}
                    />
                  </div>

                  <div className="mt-4">
                    <ActionButton
                      organizer={organizer}
                      onApprove={handleApproveOrganizer}
                      onReject={handleRejectOrganizer}
                      loading={actionLoading === organizer.id}
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
                  Approve or reject organizer applications. Approved
                  organizers can create events and manage certificates.
                  Rejected applications cannot be resubmitted.
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
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-300">
        <CheckCircle2 size={10} />
        Active
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-[9px] text-amber-300">
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-400/10 px-2.5 py-1 text-[9px] text-red-300">
      <XCircle size={10} />
      Rejected
    </span>
  );
}

function ActionButton({
  organizer,
  onApprove,
  onReject,
  loading,
}: {
  organizer: Organizer;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  loading: boolean;
}) {
  if (organizer.status === "pending") {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onApprove(organizer.id)}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[9px] font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
        >
          <Check size={11} />
          Approve
        </button>

        <button
          type="button"
          onClick={() => onReject(organizer.id)}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/[0.04] px-3 py-2 text-[9px] text-red-300 transition hover:bg-red-400/[0.08] disabled:opacity-50"
        >
          <X size={11} />
          Reject
        </button>
      </div>
    );
  }

  if (organizer.status === "active") {
    return (
      <span className="text-[9px] text-white/30">Approved</span>
    );
  }

  return (
    <span className="text-[9px] text-white/30">Rejected</span>
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