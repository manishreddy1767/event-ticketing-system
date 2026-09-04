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

            <div>
              <label className="text-[10px] uppercase tracking-wider text-white/30">
                Maximum discount (%)
              </label>

              <input
                required
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-white outline-none focus:border-violet-400/40"
              />
            </div>

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
