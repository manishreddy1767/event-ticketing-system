"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Search,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import {
  getEvent,
  getEventTicketTypes,
  getEventDiscount,
  bookTicket,
  createTeam,
  sendTeamInvitation,
  getTeamMembers,
  getMyTeams,
  getStudents,
  deleteTeam,
  leaveTeam,
  type ApiEvent,
  type ApiTicketType,
  type ApiTeam,
  type ApiStudent,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Student = ApiStudent;

type TeamMemberData = {
  id: number;
  name: string;
  status: "leader" | "invited" | "accepted";
};

export default function ReservePage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ teamSize?: string }>;
}) {
  const { user } = useAuth();

  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [ticketTypes, setTicketTypes] = useState<ApiTicketType[]>([]);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTeamSize, setSelectedTeamSize] = useState(1);
  const [selectedTicketType, setSelectedTicketType] =
    useState<ApiTicketType | null>(null);

  // Team state
  const [team, setTeam] = useState<ApiTeam | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<number[]>([]);
  const [teamName, setTeamName] = useState("");
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [booking, setBooking] = useState(false);

  const [step, setStep] = useState<
    "select" | "team" | "confirm" | "payment"
  >("select");

  // Student search
  const [searchQuery, setSearchQuery] = useState("");

  const [students, setStudents] = useState<Student[]>([]);

  const [inviting, setInviting] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEventData() {
      try {
        setLoading(true);
        setError(null);

        const eventId = (await params).eventId;
        const teamSizeParam = (await searchParams).teamSize;

        const numericEventId = parseInt(eventId, 10);

        const [
          apiEvent,
          apiTicketTypes,
          apiDiscount,
          apiStudents,
        ] = await Promise.all([
          getEvent(numericEventId),
          getEventTicketTypes(numericEventId),
          getEventDiscount(numericEventId),
          getStudents(),
        ]);

        setEvent(apiEvent);
        setTicketTypes(apiTicketTypes);
        setDiscount(Number(apiDiscount.predicted_discount));
        setStudents(apiStudents);

        const myTeams = await getMyTeams();
        const existingTeam = myTeams.find((t) => t.event_id === numericEventId);

        if (existingTeam) {
          setTeam(existingTeam);
          const members = await getTeamMembers(existingTeam.id);
          setTeamMembers(members.map((member) => ({
            id: member.user_id,
            name: member.user_id === user?.id ? "You" : "Member",
            status: member.user_id === user?.id ? "leader" : "invited",
          })));
        }

        // Select ticket from URL parameter
        if (teamSizeParam) {
          const size = parseInt(teamSizeParam, 10);

          const matchingTicket = apiTicketTypes.find(
            (tt) => tt.team_size === size
          );

          if (matchingTicket) {
            setSelectedTeamSize(size);
            setSelectedTicketType(matchingTicket);
            setStep("select");
          }
        } else if (apiTicketTypes.length > 0) {
          const firstTicket = apiTicketTypes[0];

          setSelectedTeamSize(firstTicket.team_size);
          setSelectedTicketType(firstTicket);
          setStep("select");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load event"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEventData();
  }, [params, searchParams]);

  /*
   * Selecting a ticket should NOT immediately change the step.
   * The user should first select a ticket and then click Continue.
   */
  const handleTicketSelect = (ticketType: ApiTicketType) => {
    if (ticketType.available_quantity === 0) {
      return;
    }

    setSelectedTeamSize(ticketType.team_size);
    setSelectedTicketType(ticketType);
    setError(null);
    setStep("select");
  };

  /*
   * Continue from Step 1:
   * - Individual ticket → confirmation
   * - Team ticket → team building
   */
  const handleContinueFromSelect = () => {
    if (!selectedTicketType) {
      setError("Please select a ticket type.");
      return;
    }

    if (selectedTicketType.available_quantity === 0) {
      setError("This ticket type is sold out.");
      return;
    }

    if (selectedTicketType.team_size === 1) {
      setStep("confirm");
    } else {
      setStep("team");
    }
  };

  const handleCreateTeam = async () => {
    if (!event || !user) {
      setError("You must be logged in to create a team.");
      return;
    }

    const trimmedTeamName = teamName.trim();

    if (!trimmedTeamName) {
      setError("Please enter a team name.");
      return;
    }

    if (trimmedTeamName.length < 2) {
      setError("Team name must be at least 2 characters.");
      return;
    }

    setCreatingTeam(true);
    setError(null);

    try {
      const newTeam = await createTeam({
        event_id: event.id,
        name: trimmedTeamName,
      });

      setTeam(newTeam);

      const members = await getTeamMembers(newTeam.id);

      setTeamMembers(
        members.map((member) => ({
          id: member.user_id,
          name:
            member.user_id === user.id
              ? "You"
              : "Member",
          status:
            member.user_id === user.id
              ? "leader"
              : "invited",
        }))
      );

      setStep("team");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create team"
      );
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!team) return;

    if (!window.confirm(`Are you sure you want to delete "${team.name}"?`)) return;

    setError(null);

    try {
      await deleteTeam(team.id);
      setTeam(null);
      setTeamMembers([]);
      setPendingInvitations([]);
      setTeamName("");
      setSearchQuery("");
      setStep("select");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete team");
    }
  };

  const handleLeaveTeam = async () => {
    if (!team) return;

    if (!window.confirm(`Are you sure you want to leave "${team.name}"?`)) return;

    setError(null);

    try {
      await leaveTeam(team.id);
      setTeam(null);
      setTeamMembers([]);
      setPendingInvitations([]);
      setTeamName("");
      setSearchQuery("");
      setStep("select");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to leave team");
    }
  };

  const handleInviteMember = async (studentId: number) => {
    if (!team) {
      setError("Create a team first.");
      return;
    }

    if (teamMembers.length >= selectedTeamSize) {
      setError("Your team is already full.");
      return;
    }

    setInviting(studentId);
    setError(null);

    try {
      await sendTeamInvitation(team.id, studentId);
      setPendingInvitations((prev) =>
        prev.includes(studentId) ? prev : [...prev, studentId]
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to invite member"
      );
    } finally {
      setInviting(null);
    }
  };

  const handleBookTicket = async () => {
    if (!event || !selectedTicketType || !user) {
      setError("Unable to complete booking. Please log in again.");
      return;
    }

    if (selectedTicketType.team_size > 1) {
      if (!team) {
        setError("Please create a team first.");
        return;
      }

      if (teamMembers.length < selectedTicketType.team_size) {
        setError(
          `Your team needs ${selectedTicketType.team_size} members to continue.`
        );
        return;
      }
    }

    setBooking(true);
    setError(null);

    try {
      const ticket = await bookTicket(event.id, {
        ticket_type_id: selectedTicketType.id,
        quantity: 1,
        team_id: team?.id,
      });

      window.location.href =
        `/events/${event.id}/payment?ticketId=${ticket.id}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to book ticket"
      );
    } finally {
      setBooking(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      student.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main className="campus-background min-h-screen overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-4 w-1/4 rounded bg-white/10" />

            <div className="h-32 w-full rounded-2xl bg-white/5" />

            <div className="grid gap-6 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl border border-white/10 bg-white/[0.02]"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !event) {
    return (
      <main className="campus-background min-h-screen overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <Sparkles className="mx-auto h-12 w-12 text-white/20" />

          <h3 className="mt-4 text-lg font-medium">
            Event not found
          </h3>

          <p className="mt-2 text-white/40">
            {error}
          </p>

          <Link
            href="/events"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Back to events
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  if (!event || !selectedTicketType) {
    return null;
  }

  const basePrice = Number(selectedTicketType.price);

  const discountAmount = Math.round(
    (basePrice * discount) / 100
  );

  const total = basePrice - discountAmount;

  const steps = [
    "select",
    "team",
    "confirm",
    "payment",
  ] as const;

  const currentStepIndex = steps.indexOf(step);

  return (
    <main className="campus-background min-h-screen overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-4">
          {steps.map((currentStep, index) => (
            <div
              key={currentStep}
              className="flex items-center gap-2"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition ${
                  currentStepIndex >= index
                    ? "bg-white text-black"
                    : "bg-white/[0.05] text-white/30"
                }`}
              >
                {index + 1}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-16 transition ${
                    currentStepIndex > index
                      ? "bg-white"
                      : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-auto mb-6 max-w-4xl rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid w-full min-w-0 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">

          {/* Main content */}
          <div className="min-w-0 space-y-6">

            {/* STEP 1 */}
            {step === "select" && (
              <div>
                <h2 className="text-xl font-semibold">
                  Select Ticket Type
                </h2>

                <p className="mt-1 text-white/50">
                  Choose the team size that works for you
                </p>

                <div className="mt-4 grid gap-4">
                  {ticketTypes.map((ticketType) => (
                    <button
                      key={ticketType.id}
                      type="button"
                      onClick={() =>
                        handleTicketSelect(ticketType)
                      }
                      disabled={
                        ticketType.available_quantity === 0
                      }
                      className={`relative flex min-w-0 w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                        selectedTeamSize ===
                        ticketType.team_size
                          ? "border-violet-500/50 bg-violet-500/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      } ${
                        ticketType.available_quantity === 0
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                        <Users className="h-6 w-6 text-white/60" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">
                            {ticketType.name}
                          </span>

                          {ticketType.available_quantity <
                            10 &&
                            ticketType.available_quantity >
                              0 && (
                              <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-medium text-orange-400">
                                Only{" "}
                                {
                                  ticketType.available_quantity
                                }{" "}
                                left
                              </span>
                            )}

                          {ticketType.available_quantity ===
                            0 && (
                            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-400">
                              Sold out
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-white/50">
                          {ticketType.team_size === 1
                            ? "Individual booking"
                            : `Team of ${ticketType.team_size}`}{" "}
                          • ₹{ticketType.price} per team
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-lg font-bold">
                          ₹{ticketType.price}
                        </p>

                        <p className="text-xs text-white/40">
                          per team
                        </p>
                      </div>

                      {selectedTeamSize ===
                        ticketType.team_size && (
                        <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-violet-500/50" />
                      )}
                    </button>
                  ))}
                </div>

                {/* NEW: Continue button */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleContinueFromSelect}
                    disabled={
                      !selectedTicketType ||
                      selectedTicketType.available_quantity === 0
                    }
                    className="flex-1 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>
                      {selectedTicketType?.team_size === 1
                        ? "Continue to Confirmation"
                        : "Continue to Build Team"}
                    </span>

                    <ArrowRight className="ml-2 inline-block h-4 w-4" />
                  </button>

                  <Link
                    href="/events"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-medium text-white/60 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </Link>
                </div>
              </div>
            )}

            {/* STEP 2 - TEAM */}
            {step === "team" &&
              selectedTeamSize > 1 && (
                <div>
                  <h2 className="text-xl font-semibold">
                    Build Your Team
                  </h2>

                  <p className="mt-1 text-white/50">
                    Add{" "}
                    {selectedTeamSize - 1} teammate
                    {selectedTeamSize - 1 > 1
                      ? "s"
                      : ""}{" "}
                    to your team
                  </p>

                  {team ? (
                    <div className="mt-4 space-y-3">

                      {/* Team created */}
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                          <div>
                            <p className="font-medium text-emerald-300">
                              Team created!
                            </p>

                            <p className="text-sm text-emerald-500">
                              Team: {team.name} •{" "}
                              {teamMembers.length}/
                              {selectedTeamSize} members
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Current members */}
                      <div className="space-y-2">
                        {teamMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20">
                                <UserPlus className="h-4 w-4 text-violet-400" />
                              </div>

                              <div>
                                <p className="font-medium">
                                  {member.name}
                                </p>

                                <p className="text-sm text-white/50">
                                  {member.status ===
                                  "leader"
                                    ? "Team Leader"
                                    : "Teammate"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Search */}
                        {teamMembers.length <
                          selectedTeamSize && (
                          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                              <UserPlus className="h-4 w-4 text-white/40" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                                <input
                                  type="text"
                                  value={searchQuery}
                                  onChange={(e) =>
                                    setSearchQuery(
                                      e.target.value
                                    )
                                  }
                                  placeholder="Search students by name or roll number..."
                                  className="h-10 w-full rounded-xl bg-transparent pl-10 pr-4 text-sm outline-none placeholder:text-white/20"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Student list */}
                        {teamMembers.length <
                          selectedTeamSize && (
                          <div className="max-h-60 grid gap-2 overflow-y-auto">
                            {filteredStudents
                              .filter(
                                (student) =>
                                  !teamMembers.some(
                                    (member) =>
                                      member.id ===
                                      student.id
                                  ) &&
                                  !pendingInvitations.includes(
                                    student.id
                                  )
                              )
                              .map((student) => (
                                <button
                                  key={student.id}
                                  type="button"
                                  onClick={() =>
                                    handleInviteMember(
                                      student.id
                                    )
                                  }
                                  disabled={
                                    inviting ===
                                    student.id
                                  }
                                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left transition hover:border-white/20 disabled:opacity-50"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                                      <UserPlus className="h-4 w-4 text-white/40" />
                                    </div>

                                    <div className="min-w-0">
                                      <p className="font-medium">
                                        {student.name}
                                      </p>

                                      <p className="text-sm text-white/50">
                                        {
                                          student.email
                                        }{" "}
                                        •{" "}
                                      </p>
                                    </div>
                                  </div>

                                  {inviting ===
                                  student.id ? (
                                    <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                                  ) : (
                                    <span className="shrink-0 text-sm text-white/40">
                                      Invite
                                    </span>
                                  )}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Team actions */}
                      <div className="mt-4 space-y-3">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setStep("confirm")}
                            disabled={
                              teamMembers.length <
                              selectedTeamSize
                            }
                            className="flex-1 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Continue
                            <ArrowRight className="ml-2 inline-block h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setTeam(null);
                              setTeamMembers([]);
                              setPendingInvitations([]);
                              setTeamName("");
                              setSearchQuery("");
                              setStep("select");
                            }}
                            className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3 text-sm font-semibold text-white/60 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
                          >
                            Change Team Size
                          </button>
                        </div>

                        {team.leader_id === user?.id ? (
                          <button
                            type="button"
                            onClick={handleDeleteTeam}
                            className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                          >
                            Delete Team
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleLeaveTeam}
                            className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20"
                          >
                            Exit Team
                          </button>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="mt-4">
                      <label className="mb-2 block text-sm font-medium text-white/70">
                        Team Name
                      </label>

                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Enter your team name"
                        maxLength={100}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                      />

                      <button
                        type="button"
                        onClick={handleCreateTeam}
                        disabled={creatingTeam}
                        className="mt-4 w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
                      >
                        {creatingTeam
                          ? "Creating team..."
                          : "Create Team"}
                      </button>
                    </div>
                  )}
                </div>
              )}

            {/* STEP 3 - CONFIRM */}
            {step === "confirm" && (
              <div>
                <h2 className="text-xl font-semibold">
                  Confirm Booking
                </h2>

                <p className="mt-1 text-white/50">
                  Review your booking details
                </p>

                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">

                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {selectedTicketType.name}
                      </p>

                      <p className="text-sm text-white/50">
                        {selectedTicketType.team_size === 1
                          ? "Individual booking"
                          : `Team of ${selectedTicketType.team_size}`}
                      </p>
                    </div>

                    <span className="shrink-0 text-lg font-bold">
                      ₹{basePrice}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="mt-3 flex items-center justify-between text-emerald-400">
                      <span>
                        Smart discount ({discount}%)
                      </span>

                      <span className="font-medium">
                        -₹{discountAmount}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        Total
                      </span>

                      <span className="text-xl font-bold">
                        ₹{total}
                      </span>
                    </div>
                  </div>

                  {team && (
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <p className="text-sm text-white/50">
                        Team: {team.name}
                      </p>

                      <p className="text-sm text-white/50">
                        {teamMembers.length} member(s)
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleBookTicket}
                    disabled={booking}
                    className="flex-1 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
                  >
                    {booking
                      ? "Booking..."
                      : "Confirm & Pay"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStep(
                        selectedTicketType.team_size === 1
                          ? "select"
                          : "team"
                      )
                    }
                    disabled={booking}
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-6 py-3 text-sm font-semibold text-white/60 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="min-w-0 lg:min-w-[280px]">
            <div className="sticky top-24 w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0c101a]/50 p-6">

              <h3 className="text-lg font-semibold">
                Order Summary
              </h3>

              <div className="mt-4 space-y-3">

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="min-w-0 truncate text-white/50">
                    {selectedTicketType.name}
                  </span>

                  <span className="shrink-0 font-medium">
                    ₹{basePrice}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between gap-4 text-sm text-emerald-400">
                    <span className="min-w-0 truncate">
                      Smart discount ({discount}%)
                    </span>

                    <span className="shrink-0 font-medium">
                      -₹{discountAmount}
                    </span>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="shrink-0 text-xl font-bold">
                      ₹{total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Context message */}
              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-sm text-white/50">
                  {selectedTicketType.team_size === 1
                    ? "Individual booking — no team required."
                    : `Team of ${selectedTicketType.team_size} required before booking.`}
                </p>
              </div>

              {/* Current step */}
              <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                <div className="h-2 w-2 rounded-full bg-violet-400" />
                Step {currentStepIndex + 1} of{" "}
                {steps.length}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}