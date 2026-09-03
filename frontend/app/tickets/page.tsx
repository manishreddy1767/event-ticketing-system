"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  Ticket,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import {
  getMyTickets,
  getEvents,
  getEventTicketTypes,
  getMyTeam,
  getTicketQr,
} from "@/lib/api";

type TicketStatus =
  | "reserved"
  | "paid"
  | "checked_in"
  | "cancelled";

type EventTicket = {
  id: number;
  event: string;
  team: string;
  ticketType: string;
  participant: string;
  rollNumber: string;
  date: string;
  time: string;
  venue: string;
  status: TicketStatus;
  certificate: "available" | "pending" | "not_eligible";
  qrToken: string;
  totalAmount: number;
};

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] =
    useState<EventTicket | null>(null);

  const [qrLoading, setQrLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  // ============================================================
  // Load tickets
  // ============================================================

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        setError(null);

        const apiTickets = await getMyTickets();
        const apiEvents = await getEvents();
        const eventTicketTypes = await Promise.all(
          apiEvents.map(async (event) => ({
            event,
            ticketTypes: await getEventTicketTypes(event.id),
          }))
        );

        const transformedTickets = await Promise.all(
          apiTickets.map(async (apiTicket) => {
            const eventData = eventTicketTypes.find((item) =>
              item.ticketTypes.some((tt) => tt.id === apiTicket.ticket_type_id)
            );
            const event = eventData?.event;
            const ticketType = eventData?.ticketTypes.find(
              (tt) => tt.id === apiTicket.ticket_type_id
            );
            const teamData = apiTicket.team_id
              ? await getMyTeam(apiTicket.team_id).catch(() => null)
              : null;
            const eventDate = event ? new Date(event.event_date) : new Date();

            return {
              id: apiTicket.id,
              event: event?.title || "Event",
              team: teamData?.name || (apiTicket.team_id ? "Team" : "Individual"),
              ticketType: ticketType?.name || "Ticket",
              participant: "You",
              rollNumber: "",
              date: eventDate.toLocaleDateString(
                "en-US",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              ),
              time: eventDate.toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                },
              ),
              venue: event?.venue || "Venue",
              status: apiTicket.status as TicketStatus,
              certificate:
                apiTicket.status === "checked_in"
                  ? ("available" as const)
                  : ("pending" as const),
              qrToken: apiTicket.qr_token,
              totalAmount: Number(apiTicket.total_amount),
            };
          }),
        );

        setTickets(transformedTickets);

        if (transformedTickets.length > 0) {
          setSelectedTicket(transformedTickets[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load tickets",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  // ============================================================
  // Load real QR image whenever selected ticket changes
  // ============================================================

  useEffect(() => {
    if (
      !selectedTicket ||
      selectedTicket.status !== "paid"
    ) {
      setQrImage(null);
      setQrError(null);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    async function loadQr() {
      try {
        setQrLoading(true);
        setQrError(null);
        setQrImage(null);

        const blob = await getTicketQr(
          selectedTicket!.id,
        );

        if (cancelled) {
          return;
        }

        objectUrl = URL.createObjectURL(blob);
        setQrImage(objectUrl);
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Failed to load QR:",
            err,
          );

          setQrError(
            err instanceof Error
              ? err.message
              : "Failed to load QR code",
          );
        }
      } finally {
        if (!cancelled) {
          setQrLoading(false);
        }
      }
    }

    loadQr();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedTicket]);

  // ============================================================
  // Download real QR PNG
  // ============================================================

  const handleDownloadQR = async (
    ticket: EventTicket,
  ) => {
    if (ticket.status !== "paid") {
      return;
    }

    setQrLoading(true);
    setQrError(null);

    try {
      const blob = await getTicketQr(ticket.id);

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = `evently-ticket-${ticket.id}-qr.png`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        "Failed to download QR:",
        err,
      );

      setQrError(
        err instanceof Error
          ? err.message
          : "Failed to download QR code",
      );
    } finally {
      setQrLoading(false);
    }
  };

  // ============================================================
  // Retry QR loading
  // ============================================================

  const handleRetryQR = async (ticket: EventTicket) => {
    if (ticket.status !== "paid") {
      return;
    }

    setQrLoading(true);
    setQrError(null);

    try {
      const blob = await getTicketQr(ticket.id);
      const url = URL.createObjectURL(blob);

      setQrImage((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
        return url;
      });
    } catch (err) {
      console.error("Failed to reload QR:", err);
      setQrError(
        err instanceof Error
          ? err.message
          : "Failed to load QR code",
      );
    } finally {
      setQrLoading(false);
    }
  };

  // ============================================================
  // Status badge
  // ============================================================

  const getStatusBadge = (
    status: TicketStatus,
  ) => {
    switch (status) {
      case "paid":
        return (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Confirmed
          </span>
        );

      case "checked_in":
        return (
          <span className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-medium text-cyan-400">
            <ShieldCheck className="h-3 w-3" />
            Checked in
          </span>
        );

      case "reserved":
        return (
          <span className="flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-[10px] font-medium text-yellow-400">
            <Clock3 className="h-3 w-3" />
            Reserved
          </span>
        );

      default:
        return (
          <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-400">
            <XCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
    }
  };

  // ============================================================
  // Loading
  // ============================================================

  if (loading) {
    return (
      <main className="campus-background min-h-screen">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Link
                href="/events"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft size={15} />
              </Link>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/20">
                  Tickets
                </p>

                <h1 className="mt-1 text-sm font-semibold">
                  My Tickets
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl border border-white/10 bg-white/[0.02]"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // Main page
  // ============================================================

  return (
    <main className="campus-background min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={15} />
            </Link>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/20">
                Tickets
              </p>

              <h1 className="mt-1 text-sm font-semibold">
                My Tickets
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

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="py-16 text-center">
            <Ticket className="mx-auto h-12 w-12 text-white/20" />

            <h3 className="mt-4 text-lg font-medium">
              No tickets yet
            </h3>

            <p className="mt-2 text-white/40">
              Start exploring events and book your first ticket
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
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Ticket List */}
            <div className="space-y-3 lg:col-span-1">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() =>
                    setSelectedTicket(ticket)
                  }
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                    selectedTicket?.id === ticket.id
                      ? "border-violet-500/50 bg-violet-500/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05]">
                    <Ticket className="h-6 w-6 text-white/60" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {ticket.event}
                    </p>

                    <p className="truncate text-sm text-white/50">
                      {ticket.date}
                    </p>
                  </div>

                  {getStatusBadge(ticket.status)}
                </button>
              ))}
            </div>

            {/* Ticket Detail */}
            <div className="lg:col-span-3">
              {selectedTicket ? (
                <motion.div
                  key={selectedTicket.id}
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  className="rounded-2xl border border-white/10 bg-[#0c101a]/50 p-6"
                >
                  {/* Ticket Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/60">
                          {selectedTicket.ticketType}
                        </span>

                        {getStatusBadge(
                          selectedTicket.status,
                        )}
                      </div>

                      <h2 className="mt-2 text-2xl font-bold tracking-tight">
                        {selectedTicket.event}
                      </h2>

                      <p className="mt-1 text-white/50">
                        {selectedTicket.team}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        onClick={() =>
                          handleDownloadQR(
                            selectedTicket,
                          )
                        }
                        disabled={
                          qrLoading ||
                          selectedTicket.status !==
                            "paid"
                        }
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-medium text-white/60 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Download className="h-4 w-4" />

                        {qrLoading
                          ? "Loading..."
                          : "Download QR"}
                      </button>

                      <Link
                        href="/events"
                        className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
                      >
                        Book More
                      </Link>
                    </div>
                  </div>

                  {/* Ticket Information */}
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
                        <CalendarDays className="h-5 w-5 text-violet-400" />
                      </div>

                      <div>
                        <p className="text-xs text-white/40">
                          Date
                        </p>

                        <p className="font-medium">
                          {selectedTicket.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
                        <Clock3 className="h-5 w-5 text-cyan-400" />
                      </div>

                      <div>
                        <p className="text-xs text-white/40">
                          Time
                        </p>

                        <p className="font-medium">
                          {selectedTicket.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
                        <MapPin className="h-5 w-5 text-emerald-400" />
                      </div>

                      <div>
                        <p className="text-xs text-white/40">
                          Venue
                        </p>

                        <p className="font-medium">
                          {selectedTicket.venue}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
                        <ShieldCheck className="h-5 w-5 text-orange-400" />
                      </div>

                      <div>
                        <p className="text-xs text-white/40">
                          Ticket ID
                        </p>

                        <p className="font-mono text-sm">
                          {selectedTicket.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        QR Ticket
                      </h3>

                      <span className="text-sm text-white/50">
                        Show this at check-in
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-center">
                      <div className="flex h-56 w-56 items-center justify-center rounded-xl bg-white p-4">
                        {selectedTicket.status !==
                        "paid" ? (
                          <div className="text-center text-black">
                            <ShieldCheck className="mx-auto h-16 w-16 opacity-40" />

                            <p className="mt-3 text-sm">
                              QR available after payment
                            </p>
                          </div>
                        ) : qrLoading ? (
                          <div className="text-center text-black">
                            <QrCode className="mx-auto h-16 w-16 animate-pulse" />

                            <p className="mt-3 text-sm">
                              Loading QR...
                            </p>
                          </div>
                        ) : qrImage ? (
                          <img
                            src={qrImage}
                            alt={`QR code for ticket ${selectedTicket.id}`}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="text-center text-black">
                            <QrCode className="mx-auto h-20 w-20 opacity-50" />

                            <p className="mt-3 text-sm">
                              QR code unavailable
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                handleRetryQR(selectedTicket)
                              }
                              className="mt-3 rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white transition hover:bg-black/80"
                            >
                              Try Again
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {qrError && (
                      <p className="mt-3 text-center text-sm text-red-400">
                        {qrError}
                      </p>
                    )}

                    <p className="mt-4 text-center text-sm text-white/50">
                      Scan at venue entrance for check-in
                    </p>
                  </div>

                  {/* Payment Information */}
                  <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/40">
                          Payment Status
                        </p>

                        <p className="mt-1 font-semibold text-emerald-400">
                          {selectedTicket.status ===
                          "paid"
                            ? "Payment Successful"
                            : "Payment Pending"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-white/40">
                          Amount Paid
                        </p>

                        <p className="mt-1 text-lg font-bold">
                          ₹
                          {selectedTicket.totalAmount.toFixed(
                            2,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Section */}
                  <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        Certificate
                      </h3>

                      {selectedTicket.certificate ===
                        "available" && (
                        <Link
                          href="/certificates"
                          className="text-sm font-medium text-violet-400 hover:text-violet-300"
                        >
                          View Certificate
                          <ExternalLink className="ml-1 inline h-3 w-3" />
                        </Link>
                      )}

                      {selectedTicket.certificate ===
                        "pending" && (
                        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[10px] font-medium text-yellow-400">
                          Available after check-in
                        </span>
                      )}

                      {selectedTicket.certificate ===
                        "not_eligible" && (
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-medium text-red-400">
                          Not eligible
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-white/50">
                      {selectedTicket.certificate ===
                      "available"
                        ? "Your certificate is ready for download"
                        : selectedTicket.certificate ===
                            "pending"
                          ? "Certificates are issued after event attendance is confirmed"
                          : "Certificates are only issued to attendees who checked in"}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-[#0c101a]/50 p-12 text-center">
                  <Sparkles className="mx-auto h-12 w-12 text-white/20" />

                  <h3 className="mt-4 text-lg font-medium">
                    Select a ticket
                  </h3>

                  <p className="mt-2 text-white/40">
                    Choose a ticket from the list to view
                    details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}