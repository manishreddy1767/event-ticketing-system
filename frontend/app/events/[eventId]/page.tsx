"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import {
  getEvent,
  getEventTicketTypes,
  type ApiEvent,
  type ApiTicketType,
} from "@/lib/api";

type Event = {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  registered: number;
  capacity: number;
  deadline: string;
  ticketTypes: {
    id: number;
    size: number;
    label: string;
    description: string;
    price: number;
    available_quantity: number;
  }[];
};

function formatDate(dateString: string): { date: string; time: string } {
  const date = new Date(dateString);

  return {
    date: date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState(1);

  useEffect(() => {
    async function fetchEventData() {
      try {
        setLoading(true);

        const eventId = (await params).eventId;
        const numericEventId = parseInt(eventId, 10);

        const [apiEvent, ticketTypes] = await Promise.all([
          getEvent(numericEventId),
          getEventTicketTypes(numericEventId),
        ]);

        const { date, time } = formatDate(apiEvent.event_date);

        const transformedTicketTypes = ticketTypes.map((tt) => ({
          id: tt.id,
          size: tt.team_size,
          label: tt.name,
          description:
            tt.team_size === 1
              ? "Participate on your own"
              : `Team of ${tt.team_size}`,
          price: Number(tt.price),
          available_quantity: tt.available_quantity,
        }));

        setEvent({
          id: apiEvent.id,
          title: apiEvent.title,
          category: "Technology",
          date,
          time,
          location: apiEvent.venue,
          organizer: "Event Organizer",
          description: apiEvent.description || "No description available",
          registered: apiEvent.registered_count,
          capacity: apiEvent.capacity,
          deadline: date,
          ticketTypes: transformedTicketTypes,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load event"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEventData();
  }, [params]);

  const selectedTicket = event?.ticketTypes.find(
    (ticket) => ticket.size === selectedTeam
  );

  const basePrice = selectedTicket?.price ?? 0;

  const total = basePrice;

  const occupancy = event
    ? Math.round((event.registered / event.capacity) * 100)
    : 0;

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

  if (error || !event) {
    return (
      <main className="campus-background min-h-screen overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <Sparkles className="mx-auto h-12 w-12 text-white/20" />

          <h3 className="mt-4 text-lg font-medium">
            Event not found
          </h3>

          <p className="mt-2 text-white/40">
            {error || "This event doesn't exist or has been removed"}
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

  return (
    <main className="campus-background min-h-screen overflow-x-hidden">
      {/* Background gradients */}
      <div className="pointer-events-none absolute left-[8%] top-32 h-72 w-72 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute right-[8%] top-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/events"
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-medium text-white/60 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to events
        </Link>

        {/* Main layout */}
        <div className="grid w-full min-w-0 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          {/* Main content */}
          <div className="min-w-0 space-y-6">
            {/* Event header */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm text-white/50">
                <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                  {event.category}
                </span>

              </div>

              <h1 className="mt-3 break-words text-3xl font-bold tracking-tight sm:text-4xl">
                {event.title}
              </h1>

              <p className="mt-4 break-words text-lg text-white/60">
                {event.description}
              </p>
            </div>

            {/* Event details */}
            <div className="min-w-0 rounded-2xl border border-white/10 bg-[#0c101a]/50 p-6">
              <h2 className="text-lg font-semibold">
                Event Details
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                    <CalendarDays className="h-5 w-5 text-violet-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-white/40">
                      Date
                    </p>

                    <p className="font-medium">
                      {event.date}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                    <Clock3 className="h-5 w-5 text-cyan-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-white/40">
                      Time
                    </p>

                    <p className="font-medium">
                      {event.time}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-white/40">
                      Venue
                    </p>

                    <p className="break-words font-medium">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                    <ShieldCheck className="h-5 w-5 text-orange-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-white/40">
                      Registration Deadline
                    </p>

                    <p className="font-medium">
                      {event.deadline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Capacity bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-white/50">
                    Capacity
                  </span>

                  <span className="text-right font-medium">
                    {event.registered} / {event.capacity} registered
                  </span>
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${occupancy}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Ticket types */}
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">
                Choose Your Ticket
              </h2>

              <div className="mt-4 grid gap-4">
                {event.ticketTypes.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTeam(ticket.size)}
                    className={`relative flex min-w-0 w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                      selectedTeam === ticket.size
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                      <Users className="h-6 w-6 text-white/60" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">
                          {ticket.label}
                        </span>

                        {ticket.available_quantity < 10 &&
                          ticket.available_quantity > 0 && (
                            <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-medium text-orange-400">
                              Only {ticket.available_quantity} left
                            </span>
                          )}

                        {ticket.available_quantity === 0 && (
                          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-400">
                            Sold out
                          </span>
                        )}
                      </div>

                      <p className="mt-1 break-words text-sm text-white/50">
                        {ticket.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-lg font-bold">
                        ₹{ticket.price}
                      </p>

                      <p className="text-sm text-white/40">
                        per team
                      </p>
                    </div>

                    {selectedTeam === ticket.size && (
                      <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-violet-500/50" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking summary */}
          <aside className="min-w-0 lg:min-w-[280px]">
            <div className="sticky top-24 w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0c101a]/50 p-6">
              <h3 className="text-lg font-semibold">
                Booking Summary
              </h3>

              <div className="mt-4 space-y-3">
                <div className="flex min-w-0 items-center justify-between gap-4 text-sm">
                  <span className="min-w-0 truncate text-white/50">
                    {selectedTicket?.label}
                  </span>

                  <span className="shrink-0 font-medium">
                    ₹{basePrice}
                  </span>
                </div>



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

              {/* Reserve button */}
              <Link
                href={`/events/${event.id}/reserve?teamSize=${selectedTeam}`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/90"
              >
                <span className="truncate">
                  Continue to Reserve
                </span>

                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>

              <p className="mt-4 text-center text-xs text-white/40">
                Secure checkout • QR ticket issued instantly
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}