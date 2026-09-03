"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import {
  acceptTeamInvitation,
  rejectTeamInvitation,
  getMyTeamInvitations,
  getMyTeam,
  getEvent,
  type ApiTeamInvitation,
  type ApiTeam,
  type ApiEvent,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";

type InvitationData = ApiTeamInvitation & {
  team?: ApiTeam;
  event?: ApiEvent;
};

export default function TeamInvitationsPage() {
  const { user, loading: authLoading } = useAuth();

  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadInvitations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const invitationList = await getMyTeamInvitations();

      const enriched = await Promise.all(
        invitationList.map(async (invitation) => {
          try {
            const team = await getMyTeam(invitation.team_id);
            const event = await getEvent(team.event_id);

            return {
              ...invitation,
              team,
              event,
            };
          } catch {
            return {
              ...invitation,
            };
          }
        })
      );

      setInvitations(enriched);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load team invitations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading === false && user === null) {
      window.location.href = "/login";
      return;
    }

    if (user) {
      loadInvitations();
    }
  }, [user, authLoading]);

  const handleAccept = async (invitationId: number) => {
    setProcessing(invitationId);
    setError(null);

    try {
      await acceptTeamInvitation(invitationId);

      setInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== invitationId)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to accept invitation"
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (invitationId: number) => {
    setProcessing(invitationId);
    setError(null);

    try {
      await rejectTeamInvitation(invitationId);

      setInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== invitationId)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reject invitation"
      );
    } finally {
      setProcessing(null);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="campus-background min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-white/10" />
            <div className="h-48 rounded-2xl border border-white/10 bg-white/[0.02]" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="campus-background min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={15} />
            </Link>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/20">
                Teams
              </p>
              <h1 className="mt-1 text-sm font-semibold">
                Team Invitations
              </h1>
            </div>
          </div>

          <Link
            href="/events"
            className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-[10px] font-medium text-white/60 transition hover:bg-white/[0.05] hover:text-white"
          >
            Browse Events
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15">
              <UserPlus className="h-6 w-6 text-violet-400" />
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Team Invitations
              </h2>
              <p className="mt-1 text-sm text-white/40">
                Review invitations from other students
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {invitations.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0c101a]/50 p-10 text-center">
            <Users className="mx-auto h-12 w-12 text-white/20" />

            <h3 className="mt-4 text-lg font-semibold">
              No pending invitations
            </h3>

            <p className="mt-2 text-sm text-white/40">
              You don't have any team invitations waiting for your response.
            </p>

            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Browse Events
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {invitations.map((invitation) => (
              <motion.div
                key={invitation.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-[#0c101a]/50 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-violet-500/15 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-violet-400">
                        Team Invitation
                      </span>

                      <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-medium text-amber-400">
                        <Clock3 className="h-3 w-3" />
                        Pending
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-bold">
                      {invitation.team?.name || "Team Invitation"}
                    </h3>

                    <p className="mt-1 text-sm text-white/50">
                      You've been invited to join this team.
                    </p>
                  </div>
                </div>

                {invitation.event && (
                  <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="font-semibold">
                      {invitation.event.title}
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <CalendarDays className="h-4 w-4 text-violet-400" />
                        {new Date(
                          invitation.event.event_date
                        ).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <Clock3 className="h-4 w-4 text-cyan-400" />
                        {new Date(
                          invitation.event.event_date
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-white/50">
                        <MapPin className="h-4 w-4 text-emerald-400" />
                        <span className="truncate">
                          {invitation.event.venue}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleAccept(invitation.id)}
                    disabled={processing !== null}
                    className="flex-1 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processing === invitation.id ? (
                      "Processing..."
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 inline-block h-4 w-4" />
                        Accept
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReject(invitation.id)}
                    disabled={processing !== null}
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle className="mr-2 inline-block h-4 w-4" />
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
