"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock3,
  Download,
  FileUp,
  Loader2,
  Search,
  Send,
  Users,
  XCircle,
} from "lucide-react";
import { getEventCertificates, uploadCertificateTemplate, type ApiOrganizerCertificate } from "@/lib/api";

type CertificateStatus = "Issued" | "Pending" | "Not eligible";

type Attendee = {
  id: number;
  name: string;
  rollNumber: string;
  email: string;
  team: string | null;
  attendance: "Present" | "Absent";
  certificate: CertificateStatus;
  certificateCode?: string;
};

export default function OrganizerCertificatesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "All" | CertificateStatus
  >("All");

  const [certificateData, setCertificateData] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [templateUploaded, setTemplateUploaded] = useState(false);

  // Fetch certificates on mount
  useEffect(() => {
    async function fetchCertificates() {
      try {
        setLoading(true);
        const data = await getEventCertificates(1); // Hardcoded event ID for now
        // Transform backend data to frontend format
        const transformed = data.map((cert) => ({
          id: cert.id,
          name: cert.user?.name || "Unknown",
          rollNumber: "", // Not available from backend
          email: cert.user?.email || "",
          team: null, // Not available from backend
          attendance: "Present" as const, // Certificates only exist for present attendees
          certificate: "Issued" as CertificateStatus,
          certificateCode: cert.certificate_code,
        }));
        setCertificateData(transformed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load certificates");
      } finally {
        setLoading(false);
      }
    }
    fetchCertificates();
  }, []);

  const filteredAttendees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return certificateData.filter((attendee) => {
      const matchesSearch =
        !query ||
        attendee.name.toLowerCase().includes(query) ||
        attendee.rollNumber.toLowerCase().includes(query) ||
        attendee.email.toLowerCase().includes(query) ||
        attendee.team?.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" ||
        attendee.certificate === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter, certificateData]);

  const eligibleCount = certificateData.filter(
    (attendee) => attendee.attendance === "Present"
  ).length;

  const issuedCount = certificateData.filter(
    (attendee) => attendee.certificate === "Issued"
  ).length;

  const pendingCount = certificateData.filter(
    (attendee) => attendee.certificate === "Pending"
  ).length;

  async function handleTemplateUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadCertificateTemplate(1, file); // Hardcoded event ID
      setTemplateUploaded(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload template");
    } finally {
      setUploading(false);
    }
  }

  function issueCertificate(id: number) {
    setCertificateData((current) =>
      current.map((attendee) =>
        attendee.id === id
          ? {
              ...attendee,
              certificate: "Issued",
            }
          : attendee
      )
    );
  }

  function issueAllCertificates() {
    setCertificateData((current) =>
      current.map((attendee) =>
        attendee.attendance === "Present"
          ? {
              ...attendee,
              certificate: "Issued",
            }
          : attendee
      )
    );
  }

  function downloadCertificate(attendee: Attendee) {
    if (attendee.certificateCode) {
      // In a real app, this would download the PDF
      alert(`Downloading certificate ${attendee.certificateCode} for ${attendee.name}`);
    } else {
      alert(`Certificate download for ${attendee.name} - no certificate code available.`);
    }
  }

  return (
    <main className="campus-background min-h-screen">
      {/* Header */}

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/organizer/events"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={15} />
            </Link>

            <div>
              <p className="text-[9px] uppercase tracking-wider text-white/20">
                Organizer
              </p>

              <h1 className="mt-1 text-sm font-semibold">
                Certificates
              </h1>
            </div>
          </div>

          <Link
            href="/organizer/attendance"
            className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-[10px] font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
          >
            Attendance
          </Link>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          {/* Intro */}

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-violet-300">
                Certificate management
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Certificates.
              </h2>

              <p className="mt-3 max-w-2xl text-xs leading-5 text-white/35">
                Issue certificates only to participants who
                attended the event. Team membership alone does
                not make a participant certificate eligible.
              </p>
            </div>

            <button
              type="button"
              onClick={issueAllCertificates}
              disabled={pendingCount === 0}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[10px] font-semibold transition ${
                pendingCount === 0
                  ? "cursor-not-allowed bg-white/[0.05] text-white/20"
                  : "bg-white text-black hover:bg-white/90"
              }`}
            >
              <Send size={13} />
              Issue all eligible
            </button>
          </div>

          {/* Event */}

          <div className="mt-8 rounded-2xl border border-violet-400/10 bg-violet-400/[0.035] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-violet-300/60">
                  Selected event
                </p>

                <h3 className="mt-1 text-base font-semibold">
                  AI Hackathon 2026
                </h3>

                <p className="mt-1 text-[10px] text-white/25">
                  18 October 2026 • Vardhaman College of Engineering
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Award
                  size={17}
                  className="text-violet-300"
                />

                <span className="text-[10px] text-white/40">
                  Attendance-based certificates
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Template Upload */}
          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                <FileUp size={17} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">Certificate Template</h3>
                <p className="mt-1 text-[10px] text-white/25">
                  Upload a certificate template image (PNG/JPG) for this event.
                  The template will be used when generating certificates.
                </p>
                {templateUploaded && (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-300">
                    <CheckCircle2 size={10} />
                    Template uploaded
                  </span>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleTemplateUpload}
                  className="mt-4 w-full max-w-xs h-10 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-[10px] text-white outline-none placeholder:text-white/20 focus:border-violet-400/30"
                  disabled={uploading}
                />
                {uploading && (
                  <p className="mt-2 text-[10px] text-amber-300">Uploading...</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={<Users size={16} />}
              label="Certificate eligible"
              value={eligibleCount}
            />

            <StatCard
              icon={<CheckCircle2 size={16} />}
              label="Certificates issued"
              value={issuedCount}
            />

            <StatCard
              icon={<Clock3 size={16} />}
              label="Pending certificates"
              value={pendingCount}
            />
          </div>

          {/* Search + Filter */}

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
                  placeholder="Search name, roll number, team or email..."
                  className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-9 pr-3 text-[10px] text-white outline-none placeholder:text-white/20 focus:border-violet-400/30"
                />
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target.value as
                      | "All"
                      | CertificateStatus
                  )
                }
                className="h-10 rounded-xl border border-white/[0.07] bg-[#0c101a] px-3 text-[10px] text-white/50 outline-none"
              >
                <option value="All">All certificates</option>
                <option value="Issued">Issued</option>
                <option value="Pending">Pending</option>
                <option value="Not eligible">
                  Not eligible
                </option>
              </select>
            </div>
          </div>

          {/* Participants */}

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <p className="text-[9px] uppercase tracking-wider text-white/20">
                Certificate recipients
              </p>

              <p className="mt-1 text-xs text-white/35">
                Showing {filteredAttendees.length} participants
              </p>
            </div>

            {/* Desktop */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Participant
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Roll number
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Team
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Attendance
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Certificate
                    </th>

                    <th className="px-5 py-3 text-[9px] font-medium uppercase tracking-wider text-white/20">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttendees.map((attendee) => (
                    <tr
                      key={attendee.id}
                      className="border-b border-white/[0.05] transition hover:bg-white/[0.015]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 text-[10px] font-semibold text-violet-300">
                            {getInitials(attendee.name)}
                          </div>

                          <div>
                            <p className="text-xs font-medium text-white/75">
                              {attendee.name}
                            </p>

                            <p className="mt-0.5 text-[9px] text-white/20">
                              {attendee.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-mono text-[10px] text-white/40">
                        {attendee.rollNumber}
                      </td>

                      <td className="px-5 py-4 text-[10px] text-white/40">
                        {attendee.team ?? "Individual"}
                      </td>

                      <td className="px-5 py-4">
                        <AttendanceBadge
                          attendance={attendee.attendance}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <CertificateBadge
                          status={attendee.certificate}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {attendee.certificate === "Pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                issueCertificate(attendee.id)
                              }
                              className="rounded-lg bg-white px-3 py-2 text-[9px] font-semibold text-black transition hover:bg-white/90"
                            >
                              Issue
                            </button>
                          )}

                          {attendee.certificate === "Issued" && (
                            <button
                              type="button"
                              onClick={() =>
                                downloadCertificate(attendee)
                              }
                              className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[9px] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
                            >
                              <Download size={11} />
                              Download
                            </button>
                          )}

                          {attendee.certificate ===
                            "Not eligible" && (
                            <span className="text-[9px] text-white/15">
                              Attendance required
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}

            <div className="divide-y divide-white/[0.06] lg:hidden">
              {filteredAttendees.length === 0 ? (
                <EmptyState />
              ) : (
                filteredAttendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-[10px] font-semibold text-violet-300">
                          {getInitials(attendee.name)}
                        </div>

                        <div>
                          <p className="text-xs font-medium">
                            {attendee.name}
                          </p>

                          <p className="mt-1 font-mono text-[9px] text-white/25">
                            {attendee.rollNumber}
                          </p>
                        </div>
                      </div>

                      <CertificateBadge
                        status={attendee.certificate}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-white/15">
                          Team
                        </p>

                        <p className="mt-1 text-[10px] text-white/45">
                          {attendee.team ?? "Individual"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-white/15">
                          Attendance
                        </p>

                        <div className="mt-1">
                          <AttendanceBadge
                            attendance={attendee.attendance}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      {attendee.certificate === "Pending" && (
                        <button
                          type="button"
                          onClick={() =>
                            issueCertificate(attendee.id)
                          }
                          className="w-full rounded-xl bg-white py-2.5 text-[10px] font-semibold text-black"
                        >
                          Issue certificate
                        </button>
                      )}

                      {attendee.certificate === "Issued" && (
                        <button
                          type="button"
                          onClick={() =>
                            downloadCertificate(attendee)
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] py-2.5 text-[10px] text-white/45"
                        >
                          <Download size={12} />
                          Download certificate
                        </button>
                      )}

                      {attendee.certificate ===
                        "Not eligible" && (
                        <div className="flex items-center gap-2 rounded-xl bg-white/[0.025] px-3 py-2.5 text-[9px] text-white/20">
                          <XCircle size={12} />
                          Attendance required
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredAttendees.length === 0 && (
              <div className="hidden lg:block">
                <EmptyState />
              </div>
            )}
          </div>

          {/* Certificate rule */}

          <div className="mt-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-5">
            <div className="flex items-start gap-3">
              <Award
                size={17}
                className="mt-0.5 shrink-0 text-emerald-300"
              />

              <div>
                <p className="text-xs font-medium">
                  Certificate eligibility
                </p>

                <p className="mt-1 text-[10px] leading-5 text-white/25">
                  A participant becomes eligible only after their
                  individual attendance is recorded. Team
                  registration does not automatically grant
                  certificates to every team member.
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

      <p className="mt-1 text-2xl font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}

function AttendanceBadge({
  attendance,
}: {
  attendance: "Present" | "Absent";
}) {
  if (attendance === "Present") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-300">
        <CheckCircle2 size={10} />
        Present
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-400/10 px-2.5 py-1 text-[9px] text-red-300">
      <XCircle size={10} />
      Absent
    </span>
  );
}

function CertificateBadge({
  status,
}: {
  status: CertificateStatus;
}) {
  if (status === "Issued") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-300">
        <CheckCircle2 size={10} />
        Issued
      </span>
    );
  }

  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 text-[9px] text-amber-300">
        <Clock3 size={10} />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2.5 py-1 text-[9px] text-white/20">
      <XCircle size={10} />
      Not eligible
    </span>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-white/20">
        <Search size={18} />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        No participants found
      </h3>

      <p className="mt-2 text-[10px] text-white/25">
        Try changing your search or filter.
      </p>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}