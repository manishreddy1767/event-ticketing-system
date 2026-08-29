"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

type Student = {
  id: number;
  name: string;
  rollNumber: string;
  branch: string;
  year: string;
};

type TeamMember = {
  student: Student;
  status: "leader" | "invited" | "accepted";
};

const event = {
  title: "AI Hackathon 2026",
  date: "12 September 2026",
  venue: "Main Auditorium",

  ticketTypes: [
    {
      size: 1,
      label: "Individual",
      price: 100,
    },
    {
      size: 2,
      label: "Team of 2",
      price: 180,
    },
    {
      size: 3,
      label: "Team of 3",
      price: 240,
    },
    {
      size: 4,
      label: "Team of 4",
      price: 280,
    },
  ],

  smartDiscount: 10,
};

/*
 * Mock college directory.
 *
 * Later this will come from the backend:
 *
 * GET /students/search?q=...
 */
const students: Student[] = [
  {
    id: 1,
    name: "Rahul Kumar",
    rollNumber: "23A81A0501",
    branch: "CSE",
    year: "3rd Year",
  },
  {
    id: 2,
    name: "Priya Sharma",
    rollNumber: "23A81A0512",
    branch: "CSE",
    year: "3rd Year",
  },
  {
    id: 3,
    name: "Arjun Reddy",
    rollNumber: "23A81A0524",
    branch: "CSE",
    year: "3rd Year",
  },
  {
    id: 4,
    name: "Sneha Patel",
    rollNumber: "23A81A0618",
    branch: "ECE",
    year: "3rd Year",
  },
  {
    id: 5,
    name: "Karthik Rao",
    rollNumber: "23A81A0711",
    branch: "IT",
    year: "3rd Year",
  },
  {
    id: 6,
    name: "Ananya Reddy",
    rollNumber: "23A81A0803",
    branch: "CSE",
    year: "3rd Year",
  },
];

const currentUser: Student = {
  id: 999,
  name: "Manish Reddy",
  rollNumber: "23A81A05XX",
  branch: "CSE",
  year: "3rd Year",
};

export default function ReservationPage() {
  const [selectedTeamSize, setSelectedTeamSize] = useState(3);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      student: currentUser,
      status: "leader",
    },
  ]);

  const [search, setSearch] = useState("");

  const [timeLeft, setTimeLeft] = useState(10 * 60);

  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState("");

  /*
   * Countdown
   */
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /*
   * Selected ticket
   */
  const selectedTicket = event.ticketTypes.find(
    (ticket) => ticket.size === selectedTeamSize
  );

  const basePrice = selectedTicket?.price ?? 0;

  const discount = Math.round(
    (basePrice * event.smartDiscount) / 100
  );

  const total = basePrice - discount;

  /*
   * Countdown formatting
   */
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (timeLeft % 60)
    .toString()
    .padStart(2, "0");

  const expired = timeLeft === 0;

  /*
   * How many teammates are still required?
   */
  const remainingSlots =
    selectedTeamSize - teamMembers.length;

  /*
   * Search results
   */
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return students.filter((student) => {
      const alreadyAdded = teamMembers.some(
        (member) => member.student.id === student.id
      );

      if (alreadyAdded) {
        return false;
      }

      return (
        student.name.toLowerCase().includes(query) ||
        student.rollNumber.toLowerCase().includes(query)
      );
    });
  }, [search, teamMembers]);

  /*
   * Add teammate
   */
  function addMember(student: Student) {
    if (expired) {
      return;
    }

    if (teamMembers.length >= selectedTeamSize) {
      return;
    }

    setTeamMembers((current) => [
      ...current,
      {
        student,
        status: "invited",
      },
    ]);

    setSearch("");
    setError("");
  }

  /*
   * Remove teammate
   */
  function removeMember(studentId: number) {
    setTeamMembers((current) =>
      current.filter(
        (member) => member.student.id !== studentId
      )
    );
  }

  /*
   * Change team size
   */
  function changeTeamSize(size: number) {
    setSelectedTeamSize(size);

    /*
     * Keep the leader and remove excess members.
     */
    setTeamMembers((current) =>
      current.slice(0, size)
    );

    setError("");
  }

  /*
   * Confirm registration
   */
  function handleSubmit(
    formEvent: React.FormEvent<HTMLFormElement>
  ) {
    formEvent.preventDefault();

    if (expired) {
      setError(
        "Your reservation has expired. Please start again."
      );
      return;
    }

    if (teamMembers.length !== selectedTeamSize) {
      setError(
        `Add ${
          selectedTeamSize - teamMembers.length
        } more teammate${
          selectedTeamSize - teamMembers.length === 1
            ? ""
            : "s"
        } before continuing.`
      );
      return;
    }

    /*
     * In the real backend, this will NOT immediately
     * confirm the team unless all invitations are accepted.
     */
    setSubmitted(true);
  }

  /*
   * Success screen
   */
  if (submitted) {
    return (
      <main className="campus-background flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0c101a]/95 p-8 text-center shadow-2xl"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
            <Users size={30} />
          </div>

          <p className="mt-7 text-sm font-medium text-violet-300">
            Team created
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Team invitations sent.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/40">
            Your teammates have been invited to join your team.
            Once every teammate accepts the invitation, your team
            will be ready to complete the ticket purchase.
          </p>

          <div className="mt-7 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/25">
                  Team
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {selectedTicket?.label}
                </p>
              </div>

              <span className="rounded-full bg-amber-400/10 px-3 py-1.5 text-[10px] text-amber-300">
                Awaiting acceptance
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.student.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-medium">
                      {member.student.name}
                    </p>

                    <p className="mt-0.5 text-[10px] text-white/25">
                      {member.student.rollNumber}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] ${
                      member.status === "leader"
                        ? "text-violet-300"
                        : "text-amber-300"
                    }`}
                  >
                    {member.status === "leader"
                      ? "Team leader"
                      : "Invitation sent"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-[11px] leading-5 text-white/25">
            Registration will become final once all required
            teammates accept their invitations.
          </p>

          <Link
            href="/events"
            className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Back to events
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="campus-background min-h-screen">
      {/* =========================
          NAVBAR
      ========================= */}

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <nav className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 backdrop-blur-xl sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2.5"
            >
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
                className="text-sm text-white/45 transition hover:text-white"
              >
                Events
              </Link>

              <span className="text-sm font-medium text-white">
                Reservation
              </span>

              <Link
                href="/tickets"
                className="text-sm text-white/45 transition hover:text-white"
              >
                My Tickets
              </Link>
            </div>

            <Link
              href="/login"
              className="hidden text-sm text-white/50 transition hover:text-white sm:block"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <Link
          href={`/events/1`}
          className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to event
        </Link>

        {/* Heading */}
        <div className="mt-8 max-w-2xl">
          <p className="text-sm font-medium text-violet-300">
            Team registration
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Build your team.
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/40">
            Create one registration for your team and invite
            your college teammates directly through Evently.
          </p>
        </div>

        {/* Main grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px]">

          {/* =========================
              LEFT
          ========================= */}

          <form
            id="reservation-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Reservation notice */}
            <div className="rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                  <LockKeyhole size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Your spot is temporarily reserved
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Complete your team registration before
                    the reservation timer expires.
                  </p>
                </div>
              </div>
            </div>

            {/* =========================
                TEAM SIZE
            ========================= */}

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/25">
                    Step 1
                  </p>

                  <h2 className="mt-2 text-lg font-semibold">
                    Choose team size
                  </h2>
                </div>

                <Users
                  size={19}
                  className="text-white/25"
                />
              </div>

              <p className="mt-2 text-xs text-white/30">
                Your team size determines the available
                registration type.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {event.ticketTypes.map((ticket) => {
                  const selected =
                    selectedTeamSize === ticket.size;

                  return (
                    <button
                      key={ticket.size}
                      type="button"
                      onClick={() =>
                        changeTeamSize(ticket.size)
                      }
                      className={`rounded-xl border p-4 text-center transition ${
                        selected
                          ? "border-violet-400/40 bg-violet-400/[0.08]"
                          : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div
                        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold ${
                          selected
                            ? "bg-violet-400 text-white"
                            : "bg-white/[0.06] text-white/40"
                        }`}
                      >
                        {ticket.size}
                      </div>

                      <p className="mt-3 text-xs font-medium">
                        {ticket.size === 1
                          ? "Individual"
                          : `Team of ${ticket.size}`}
                      </p>

                      <p className="mt-1 text-[10px] text-white/25">
                        ₹{ticket.price}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =========================
                TEAM MEMBERS
            ========================= */}

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/25">
                    Step 2
                  </p>

                  <h2 className="mt-2 text-lg font-semibold">
                    Build your team
                  </h2>
                </div>

                <span className="rounded-full bg-white/[0.05] px-3 py-1.5 text-[10px] text-white/35">
                  {teamMembers.length}/{selectedTeamSize}
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-white/30">
                Search for registered college students and
                invite them to your team.
              </p>

              {/* Current members */}
              <div className="mt-6 space-y-2">
                {teamMembers.map((member, index) => (
                  <div
                    key={member.student.id}
                    className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-black/10 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-xs font-semibold text-white/60">
                        {member.student.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <p className="text-xs font-medium">
                          {member.student.name}
                        </p>

                        <p className="mt-1 text-[10px] text-white/25">
                          {member.student.rollNumber} •{" "}
                          {member.student.branch}
                        </p>
                      </div>
                    </div>

                    {index === 0 ? (
                      <span className="rounded-full bg-violet-400/10 px-2.5 py-1 text-[10px] text-violet-300">
                        Leader
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          removeMember(member.student.id)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-white/25 transition hover:bg-red-400/10 hover:text-red-300"
                        aria-label={`Remove ${member.student.name}`}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Search */}
              {remainingSlots > 0 && (
                <div className="relative mt-4">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                  />

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search by name or roll number..."
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-11 pr-4 text-xs text-white outline-none placeholder:text-white/20 transition focus:border-violet-400/40"
                  />

                  {/* Search results */}
                  {search && (
                    <div className="absolute inset-x-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-white/10 bg-[#111621] shadow-2xl">
                      {searchResults.length > 0 ? (
                        <div className="p-2">
                          {searchResults.map((student) => (
                            <button
                              key={student.id}
                              type="button"
                              onClick={() =>
                                addMember(student)
                              }
                              className="flex w-full items-center justify-between rounded-xl p-3 text-left transition hover:bg-white/[0.05]"
                            >
                              <div>
                                <p className="text-xs font-medium">
                                  {student.name}
                                </p>

                                <p className="mt-1 text-[10px] text-white/25">
                                  {student.rollNumber} •{" "}
                                  {student.branch} •{" "}
                                  {student.year}
                                </p>
                              </div>

                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
                                <UserPlus size={14} />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-5 text-center">
                          <p className="text-xs text-white/40">
                            No matching student found.
                          </p>

                          <p className="mt-1 text-[10px] text-white/20">
                            Try their name or roll number.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Remaining */}
              {remainingSlots > 0 && (
                <div className="mt-4 flex items-center gap-2 text-[10px] text-white/25">
                  <UserPlus size={13} />

                  Add {remainingSlots} more{" "}
                  {remainingSlots === 1
                    ? "teammate"
                    : "teammates"}{" "}
                  to complete your team.
                </div>
              )}

              {remainingSlots === 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-3 text-[10px] text-emerald-300">
                  <CheckCircle2 size={14} />

                  Your team is complete.
                </div>
              )}
            </div>

            {/* =========================
                INVITATION INFO
            ========================= */}

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <Sparkles size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-medium">
                    How team registration works
                  </h3>

                  <div className="mt-4 space-y-3">
                    {[
                      "You become the team leader.",
                      "Your selected teammates receive invitations.",
                      "Every teammate accepts the invitation from their Evently account.",
                      "Once everyone accepts, the team becomes fully registered.",
                    ].map((text, index) => (
                      <div
                        key={text}
                        className="flex gap-3"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[9px] text-white/40">
                          {index + 1}
                        </span>

                        <p className="text-xs leading-5 text-white/35">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3 text-xs text-red-300">
                <X size={15} />
                {error}
              </div>
            )}

            {/* Mobile button */}
            <button
              type="submit"
              disabled={expired}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition lg:hidden ${
                expired
                  ? "cursor-not-allowed bg-white/10 text-white/25"
                  : "bg-white text-black hover:bg-white/90"
              }`}
            >
              {expired
                ? "Reservation expired"
                : "Send team invitations"}

              {!expired && <ArrowRight size={16} />}
            </button>
          </form>

          {/* =========================
              RIGHT SUMMARY
          ========================= */}

          <aside className="lg:sticky lg:top-24 lg:h-fit">

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c101a]/95">

              {/* TIMER */}
              <div
                className={`border-b p-6 ${
                  expired
                    ? "border-red-400/10 bg-red-400/[0.04]"
                    : "border-violet-400/10 bg-violet-400/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock3
                      size={16}
                      className={
                        expired
                          ? "text-red-300"
                          : "text-violet-300"
                      }
                    />

                    <span className="text-xs font-medium text-white/60">
                      {expired
                        ? "Reservation expired"
                        : "Time remaining"}
                    </span>
                  </div>

                  {!expired && (
                    <span className="text-[10px] text-white/25">
                      Temporary hold
                    </span>
                  )}
                </div>

                <div
                  className={`mt-4 text-5xl font-semibold tracking-[-0.04em] ${
                    expired
                      ? "text-red-300"
                      : "text-white"
                  }`}
                >
                  {minutes}:{seconds}
                </div>

                {!expired && (
                  <p className="mt-2 text-[11px] leading-5 text-white/30">
                    Your reserved capacity will be released
                    when this timer reaches zero.
                  </p>
                )}

                {expired && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-red-300">
                    <X size={14} />
                    Your temporary reservation has been
                    released.
                  </div>
                )}
              </div>

              {/* SUMMARY */}
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-wider text-white/25">
                  Registration summary
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                  {event.title}
                </h2>

                <div className="mt-4 space-y-2 text-xs text-white/35">
                  <p>{event.date}</p>
                  <p>{event.venue}</p>
                </div>

                <div className="my-6 border-t border-white/[0.07]" />

                {/* Team */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/30">
                      Registration
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {selectedTicket?.label}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05]">
                    <Users
                      size={16}
                      className="text-white/40"
                    />
                  </div>
                </div>

                {/* Members */}
                <div className="mt-4 space-y-2">
                  {teamMembers.map((member) => (
                    <div
                      key={member.student.id}
                      className="flex items-center justify-between text-[10px]"
                    >
                      <span className="text-white/40">
                        {member.student.name}
                      </span>

                      <span
                        className={
                          member.status === "leader"
                            ? "text-violet-300"
                            : "text-amber-300"
                        }
                      >
                        {member.status === "leader"
                          ? "Leader"
                          : "Invite"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="my-6 border-t border-white/[0.07]" />

                {/* Price */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-white/40">
                    <span>Team registration</span>

                    <span>₹{basePrice}</span>
                  </div>

                  <div className="flex justify-between text-xs text-emerald-300">
                    <span>
                      Smart discount ({event.smartDiscount}%)
                    </span>

                    <span>
                      -₹{discount}
                    </span>
                  </div>

                  <div className="border-t border-white/[0.07] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Total
                      </span>

                      <span className="text-2xl font-semibold">
                        ₹{total}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop button */}
                <button
                  type="submit"
                  form="reservation-form"
                  disabled={expired}
                  className={`mt-6 hidden h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition lg:flex ${
                    expired
                      ? "cursor-not-allowed bg-white/10 text-white/25"
                      : "bg-white text-black hover:-translate-y-0.5 hover:bg-white/90"
                  }`}
                >
                  {expired
                    ? "Reservation expired"
                    : "Send team invitations"}

                  {!expired && (
                    <ArrowRight size={16} />
                  )}
                </button>

                <div className="mt-5 flex items-start gap-2 text-[10px] leading-4 text-white/25">
                  <ShieldCheck
                    size={14}
                    className="mt-0.5 shrink-0 text-emerald-400/70"
                  />

                  Your registration details are protected
                  while your reservation is active.
                </div>
              </div>
            </div>

            {/* Demand */}
            {!expired && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-orange-300/10 bg-orange-400/[0.04] px-4 py-3">
                <Zap
                  size={15}
                  className="mt-0.5 text-orange-300"
                />

                <p className="text-[10px] leading-4 text-white/35">
                  This event has high demand. Your temporary
                  reservation prevents the selected capacity
                  from being claimed by another registration.
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}