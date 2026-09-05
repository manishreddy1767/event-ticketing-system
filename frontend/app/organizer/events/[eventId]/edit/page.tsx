"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Save,
  Loader2,
} from "lucide-react";
import { getMyEvent, updateEvent } from "@/lib/api";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Number(params.eventId);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [eventType, setEventType] = useState("other");
  const [registrationMode, setRegistrationMode] = useState<
    "individual" | "team"
  >("individual");
  const [minTeamSize, setMinTeamSize] = useState("1");
  const [maxTeamSize, setMaxTeamSize] = useState("1");

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError(null);

        if (!Number.isFinite(eventId)) {
          throw new Error("Invalid event ID");
        }

        const event = await getMyEvent(eventId);

        setTitle(event.title);
        setDescription(event.description ?? "");
        setVenue(event.venue);

        const date = new Date(event.event_date);

        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000,
        )
          .toISOString()
          .slice(0, 16);

        setEventDate(localDate);
        setCapacity(String(event.capacity));
        setMaxDiscount(String(event.max_discount_percent));
        setEventType(event.event_type);
        setRegistrationMode(event.registration_mode);
        setMinTeamSize(String(event.min_team_size));
        setMaxTeamSize(String(event.max_team_size));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load event",
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);

      await updateEvent(eventId, {
        title: title.trim(),
        description: description.trim() || undefined,
        venue: venue.trim(),
        event_date: new Date(eventDate).toISOString(),
        capacity: Number(capacity),
        max_discount_percent: Number(maxDiscount),
        event_type: eventType,
        registration_mode: registrationMode,
        min_team_size:
          registrationMode === "individual" ? 1 : Number(minTeamSize),
        max_team_size:
          registrationMode === "individual" ? 1 : Number(maxTeamSize),
      });

      router.push(`/organizer/events/${eventId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update event",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="campus-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2
            size={28}
            className="mx-auto animate-spin text-violet-300"
          />
          <p className="mt-4 text-xs text-white/40">
            Loading event...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="campus-background min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/organizer/events/${eventId}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={15} />
            </Link>

            <div>
              <p className="text-[9px] uppercase tracking-wider text-white/20">
                Organizer
              </p>
              <h1 className="mt-1 text-sm font-semibold">
                Edit event
              </h1>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
            <CalendarDays size={16} />
          </div>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6 lg:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm font-medium text-violet-300">
              Event configuration
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              Update your event.
            </h2>

            <p className="mt-3 max-w-2xl text-xs leading-5 text-white/35">
              Update the event information below. Changes to an
              approved event remain approved.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-7"
          >
            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/30">
                Event title
              </label>

              <input
                required
                minLength={3}
                maxLength={200}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-violet-400/40"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/30">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-violet-400/40"
                placeholder="Describe your event"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/30">
                Venue
              </label>

              <input
                required
                minLength={2}
                maxLength={255}
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-violet-400/40"
                placeholder="Enter venue"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/30">
                  Event date & time
                </label>

                <input
                  required
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-white outline-none focus:border-violet-400/40"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/30">
                  Capacity
                </label>

                <input
                  required
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-white outline-none focus:border-violet-400/40"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/30">
                  Event type
                </label>

                <select
                  required
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-white outline-none focus:border-violet-400/40"
                >
                  <option value="hackathon" className="bg-slate-900">
                    Hackathon
                  </option>
                  <option value="workshop" className="bg-slate-900">
                    Workshop
                  </option>
                  <option value="seminar" className="bg-slate-900">
                    Seminar
                  </option>
                  <option value="conference" className="bg-slate-900">
                    Conference
                  </option>
                  <option value="competition" className="bg-slate-900">
                    Competition
                  </option>
                  <option value="meetup" className="bg-slate-900">
                    Meetup
                  </option>
                  <option value="other" className="bg-slate-900">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/30">
                  Registration type
                </label>

                <select
                  required
                  value={registrationMode}
                  onChange={(e) =>
                    setRegistrationMode(
                      e.target.value as "individual" | "team"
                    )
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-white outline-none focus:border-violet-400/40"
                >
                  <option value="individual" className="bg-slate-900">
                    Individual
                  </option>
                  <option value="team" className="bg-slate-900">
                    Team
                  </option>
                </select>
              </div>
            </div>

            {registrationMode === "team" && (
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/30">
                    Minimum team size
                  </label>

                  <input
                    required
                    type="number"
                    min={2}
                    max={10}
                    value={minTeamSize}
                    onChange={(e) => setMinTeamSize(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-white outline-none focus:border-violet-400/40"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/30">
                    Maximum team size
                  </label>

                  <input
                    required
                    type="number"
                    min={2}
                    max={10}
                    value={maxTeamSize}
                    onChange={(e) => setMaxTeamSize(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-white outline-none focus:border-violet-400/40"
                  />
                </div>

                <div className="sm:col-span-2 rounded-xl border border-violet-400/10 bg-violet-400/[0.03] p-4">
                  <p className="text-xs font-medium">
                    Team ticket prices
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-white/30">
                    Ticket prices can be edited from the ticket
                    configuration after the event settings are saved.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:justify-end">
              <Link
                href={`/organizer/events/${eventId}`}
                className="flex h-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 text-xs text-white/50 transition hover:bg-white/[0.05] hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-400 px-5 text-xs font-semibold text-black transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
