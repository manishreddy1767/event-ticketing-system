"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import {
  Activity,
  Award,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  ImagePlus,
  Loader2,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { createEvent, createTicketType, type ApiEvent } from "@/lib/api";

const categories = [
  "Hackathon",
  "Workshop",
  "Competition",
  "Seminar",
  "Technical Event",
  "Cultural Event",
  "Other",
];

export default function CreateEventPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [published, setPublished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    null
  );
  const [imageName, setImageName] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "Hackathon",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    registrationStart: "",
    registrationEnd: "",
    venue: "",
    capacity: "100",
    maxDiscountPercent: "20",
    teamSize: "1",
    ticketName: "General Admission",
    ticketPrice: "0",
    certificateEnabled: true,
    rules: "",
  });

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
    setPublished(false);
    setError(null);
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB.");
      return;
    }

    setImageName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result as string);
    };

    reader.readAsDataURL(file);

    setSaved(false);
    setPublished(false);
  }

  function removeImage() {
    setImagePreview(null);
    setImageName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setSaved(false);
    setPublished(false);
  }

  function handleSaveDraft() {
    setSaved(true);
    setPublished(false);
  }

  async function handlePublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setPublished(false);
    setSaved(false);

    try {
      // Combine date and time for event_date
      const eventDateTime = `${form.eventDate}T${form.startTime}:00`;

      // Create the event
      const newEvent: ApiEvent = await createEvent({
        title: form.title,
        description: form.description,
        venue: form.venue,
        event_date: eventDateTime,
        capacity: Number(form.capacity),
        max_discount_percent: Number(form.maxDiscountPercent),
      });

      // Create the ticket type
      await createTicketType(newEvent.id, {
        name: form.ticketName,
        price: Number(form.ticketPrice),
        capacity: Number(form.capacity),
        team_size: Number(form.teamSize),
      });

      setPublished(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="campus-background min-h-screen">
      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.07] bg-[#080b12]/90 px-4 py-6 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-black">
              E
            </div>

            <span className="text-lg font-bold tracking-tight">
              Evently
            </span>
          </Link>

          <div className="mt-8 rounded-xl border border-violet-400/10 bg-violet-400/[0.04] p-3">
            <p className="text-[9px] uppercase tracking-wider text-white/20">
              Workspace
            </p>

            <p className="mt-1 text-xs font-medium text-violet-300">
              Organizer
            </p>
          </div>

          <nav className="mt-7 space-y-1">
            <p className="mb-3 px-3 text-[9px] uppercase tracking-wider text-white/20">
              Management
            </p>

            <Link
              href="/organizer/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Activity size={16} />
              Dashboard
            </Link>

            <Link
              href="/organizer/events"
              className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-3 py-2.5 text-xs font-medium text-white"
            >
              <CalendarDays size={16} />
              Events
            </Link>

            <Link
              href="/organizer/registrations"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Users size={16} />
              Registrations
            </Link>

            <Link
              href="/organizer/attendance"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white"
            >
              <ShieldCheck size={16} />
              Attendance
            </Link>

            <Link
              href="/organizer/certificates"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Award size={16} />
              Certificates
            </Link>
          </nav>

          <div className="mt-auto">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
              <p className="text-[9px] uppercase tracking-wider text-white/20">
                Signed in as
              </p>

              <p className="mt-2 text-xs font-medium">
                Event Organizer
              </p>

              <p className="mt-1 text-[10px] text-white/25">
                Vardhaman College of Engineering
              </p>
            </div>

            <Link
              href="/"
              className="mt-3 block px-3 py-2 text-[10px] text-white/25 transition hover:text-white"
            >
              ← Back to Evently
            </Link>
          </div>
        </div>
      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/20">
                Organizer workspace
              </p>

              <h1 className="mt-1 text-sm font-semibold">
                Create event
              </h1>
            </div>

            <Link
              href="/organizer/events"
              className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 text-xs text-white/50 transition hover:bg-white/[0.05] hover:text-white"
            >
              <X size={14} />
              Cancel
            </Link>
          </div>
        </header>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">

            {/* =========================
                HEADING
            ========================= */}

            <div>
              <p className="text-sm font-medium text-violet-300">
                Event configuration
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Create a new event.
              </h2>

              <p className="mt-3 max-w-2xl text-xs leading-5 text-white/35">
                Configure the event, registration window,
                participation limits, cover image, and
                certificate eligibility before publishing it.
              </p>
            </div>

            {/* =========================
                SUCCESS MESSAGES
            ========================= */}

            {published && (
              <div className="mt-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                    <ShieldCheck size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-emerald-300">
                      Event published successfully
                    </p>

                    <p className="mt-1 text-[10px] text-white/30">
                      The event and ticket type have been created on the backend.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-red-300">
                    <ShieldCheck size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-red-300">
                      Failed to create event
                    </p>

                    <p className="mt-1 text-[10px] text-white/30">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {saved && (
              <div className="mt-6 rounded-2xl border border-violet-400/10 bg-violet-400/[0.04] p-4">
                <div className="flex items-center gap-3">
                  <Save
                    size={15}
                    className="text-violet-300"
                  />

                  <p className="text-xs text-violet-200">
                    Event draft saved locally for this demo.
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handlePublish}
              className="mt-8 space-y-6"
            >
              {/* =========================
                  BASIC INFORMATION
              ========================= */}

              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                    <FileText size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Basic information
                    </h3>

                    <p className="mt-1 text-[10px] text-white/25">
                      Tell participants what this event is
                      about.
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid gap-5">
                  <div>
                    <label
                      htmlFor="title"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      Event name
                    </label>

                    <input
                      id="title"
                      required
                      value={form.title}
                      onChange={(event) =>
                        updateField(
                          "title",
                          event.target.value
                        )
                      }
                      placeholder="e.g. AI Hackathon 2026"
                      className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white outline-none placeholder:text-white/15 focus:border-violet-400/30"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      Category
                    </label>

                    <div className="relative">
                      <select
                        id="category"
                        value={form.category}
                        onChange={(event) =>
                          updateField(
                            "category",
                            event.target.value
                          )
                        }
                        className="mt-2 h-12 w-full appearance-none rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 pr-10 text-xs text-white outline-none focus:border-violet-400/30"
                      >
                        {categories.map((category) => (
                          <option
                            key={category}
                            value={category}
                            className="bg-[#0c101a]"
                          >
                            {category}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-white/25"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      Description
                    </label>

                    <textarea
                      id="description"
                      required
                      value={form.description}
                      onChange={(event) =>
                        updateField(
                          "description",
                          event.target.value
                        )
                      }
                      placeholder="Describe the event, its purpose, and what participants can expect..."
                      rows={5}
                      className="mt-2 w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 text-xs leading-5 text-white outline-none placeholder:text-white/15 focus:border-violet-400/30"
                    />
                  </div>
                </div>
              </section>

              {/* =========================
                  EVENT COVER IMAGE
              ========================= */}

              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-400/10 text-fuchsia-300">
                    <ImagePlus size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Event cover image
                    </h3>

                    <p className="mt-1 text-[10px] text-white/25">
                      This image will appear on event cards
                      and the event details page.
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {!imagePreview ? (
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="group flex min-h-[260px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.015] px-6 text-center transition hover:border-violet-400/30 hover:bg-violet-400/[0.02]"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-white/30 transition group-hover:bg-violet-400/10 group-hover:text-violet-300">
                        <Upload size={22} />
                      </div>

                      <p className="mt-5 text-sm font-medium">
                        Upload event cover
                      </p>

                      <p className="mt-2 text-xs text-white/25">
                        Click to choose an image
                      </p>

                      <p className="mt-3 text-[9px] text-white/15">
                        JPG, PNG or WEBP • Maximum 5 MB
                      </p>

                      <p className="mt-1 text-[9px] text-white/15">
                        Recommended aspect ratio: 16:9
                      </p>
                    </button>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20">
                      <div className="relative aspect-video w-full">
                        <img
                          src={imagePreview}
                          alt="Event cover preview"
                          className="absolute inset-0 h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white">
                              {imageName}
                            </p>

                            <p className="mt-1 text-[9px] text-white/50">
                              Event cover preview
                            </p>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                fileInputRef.current?.click()
                              }
                              className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 text-[10px] font-medium text-white backdrop-blur-md transition hover:bg-black/60"
                            >
                              <Upload size={13} />
                              Change
                            </button>

                            <button
                              type="button"
                              onClick={removeImage}
                              className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 bg-black/40 text-red-300 backdrop-blur-md transition hover:bg-red-400/10"
                              aria-label="Remove image"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-start gap-2 text-[9px] leading-4 text-white/20">
                  <ImagePlus
                    size={12}
                    className="mt-0.5 shrink-0"
                  />

                  Use a clear image that represents your event.
                  A 16:9 landscape image will look best across
                  the student event discovery experience.
                </div>
              </section>

              {/* =========================
                  SCHEDULE
              ========================= */}

              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <CalendarDays size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Event schedule
                    </h3>

                    <p className="mt-1 text-[10px] text-white/25">
                      Define exactly when the event takes
                      place.
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="eventDate"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      Event date
                    </label>

                    <input
                      id="eventDate"
                      type="date"
                      required
                      value={form.eventDate}
                      onChange={(event) =>
                        updateField(
                          "eventDate",
                          event.target.value
                        )
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white outline-none focus:border-violet-400/30"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="startTime"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      Start time
                    </label>

                    <div className="relative">
                      <Clock3
                        size={14}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                      />

                      <input
                        id="startTime"
                        type="time"
                        required
                        value={form.startTime}
                        onChange={(event) =>
                          updateField(
                            "startTime",
                            event.target.value
                          )
                        }
                        className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-4 text-xs text-white outline-none focus:border-violet-400/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="endTime"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      End time
                    </label>

                    <div className="relative">
                      <Clock3
                        size={14}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                      />

                      <input
                        id="endTime"
                        type="time"
                        required
                        value={form.endTime}
                        onChange={(event) =>
                          updateField(
                            "endTime",
                            event.target.value
                          )
                        }
                        className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-4 text-xs text-white outline-none focus:border-violet-400/30"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* =========================
                  REGISTRATION
              ========================= */}

              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <Users size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Registration settings
                    </h3>

                    <p className="mt-1 text-[10px] text-white/25">
                      Control who can register and when.
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="registrationStart"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      Registration opens
                    </label>

                    <input
                      id="registrationStart"
                      type="datetime-local"
                      required
                      value={form.registrationStart}
                      onChange={(event) =>
                        updateField(
                          "registrationStart",
                          event.target.value
                        )
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white outline-none focus:border-violet-400/30"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="registrationEnd"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      Registration closes
                    </label>

                    <input
                      id="registrationEnd"
                      type="datetime-local"
                      required
                      value={form.registrationEnd}
                      onChange={(event) =>
                        updateField(
                          "registrationEnd",
                          event.target.value
                        )
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white outline-none focus:border-violet-400/30"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="capacity"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      Maximum participants
                    </label>

                    <input
                      id="capacity"
                      type="number"
                      min="1"
                      required
                      value={form.capacity}
                      onChange={(event) =>
                        updateField(
                          "capacity",
                          event.target.value
                        )
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white outline-none focus:border-violet-400/30"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="teamSize"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      Maximum team size
                    </label>

                    <input
                      id="teamSize"
                      type="number"
                      min="1"
                      max="3"
                      required
                      value={form.teamSize}
                      onChange={(event) =>
                        updateField(
                          "teamSize",
                          event.target.value
                        )
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white outline-none focus:border-violet-400/30"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="maxDiscountPercent"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      Maximum discount (%)
                    </label>

                    <input
                      id="maxDiscountPercent"
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={form.maxDiscountPercent}
                      onChange={(event) =>
                        updateField(
                          "maxDiscountPercent",
                          event.target.value
                        )
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white outline-none focus:border-violet-400/30"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="ticketName"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      Ticket type name
                    </label>

                    <input
                      id="ticketName"
                      required
                      value={form.ticketName}
                      onChange={(event) =>
                        updateField(
                          "ticketName",
                          event.target.value
                        )
                      }
                      placeholder="e.g. General Admission"
                      className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white outline-none placeholder:text-white/15 focus:border-violet-400/30"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="ticketPrice"
                      className="text-[10px] uppercase tracking-wider text-white/25"
                    >
                      Ticket price (₹)
                    </label>

                    <input
                      id="ticketPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={form.ticketPrice}
                      onChange={(event) =>
                        updateField(
                          "ticketPrice",
                          event.target.value
                        )
                      }
                      className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white outline-none focus:border-violet-400/30"
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-violet-400/10 bg-violet-400/[0.03] p-4">
                  <div className="flex items-start gap-3">
                    <Clock3
                      size={15}
                      className="mt-0.5 shrink-0 text-violet-300"
                    />

                    <div>
                      <p className="text-xs font-medium">
                        Registration deadline
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-white/30">
                        After the closing date and time, new
                        registrations will be rejected by the
                        backend. Students will no longer be
                        able to join the event.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* =========================
                  LOCATION
              ========================= */}

              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300">
                    <MapPin size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Location
                    </h3>

                    <p className="mt-1 text-[10px] text-white/25">
                      Tell participants where to attend.
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  <label
                    htmlFor="venue"
                    className="text-[10px] uppercase tracking-wider text-white/25"
                  >
                    Venue
                  </label>

                  <input
                    id="venue"
                    required
                    value={form.venue}
                    onChange={(event) =>
                      updateField(
                        "venue",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Main Auditorium, Vardhaman College"
                    className="mt-2 h-12 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-xs text-white outline-none placeholder:text-white/15 focus:border-violet-400/30"
                  />
                </div>
              </section>

              {/* =========================
                  CERTIFICATES
              ========================= */}

              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                    <Award size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Certificate settings
                    </h3>

                    <p className="mt-1 text-[10px] text-white/25">
                      Configure whether this event supports
                      certificates.
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <div>
                    <p className="text-xs font-medium">
                      Enable certificates
                    </p>

                    <p className="mt-1 text-[10px] text-white/25">
                      Organizers can issue participation or
                      winner certificates after the event.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "certificateEnabled",
                        !form.certificateEnabled
                      )
                    }
                    className={`relative h-6 w-11 rounded-full transition ${
                      form.certificateEnabled
                        ? "bg-emerald-400"
                        : "bg-white/10"
                    }`}
                    aria-label="Toggle certificates"
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        form.certificateEnabled
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </section>

              {/* =========================
                  RULES
              ========================= */}

              <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/40">
                    <FileText size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Rules & instructions
                    </h3>

                    <p className="mt-1 text-[10px] text-white/25">
                      Optional information participants should
                      know before registering.
                    </p>
                  </div>
                </div>

                <textarea
                  value={form.rules}
                  onChange={(event) =>
                    updateField(
                      "rules",
                      event.target.value
                    )
                  }
                  placeholder="Enter event rules, eligibility requirements, submission instructions, or other important information..."
                  rows={6}
                  className="mt-7 w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 text-xs leading-5 text-white outline-none placeholder:text-white/15 focus:border-violet-400/30"
                />
              </section>

              {/* =========================
                  PUBLISHING CHECKLIST
              ========================= */}

              <section className="rounded-2xl border border-violet-400/10 bg-violet-400/[0.025] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                    <Plus size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Publishing checklist
                    </h3>

                    <p className="mt-1 text-[10px] text-white/25">
                      Review the configuration before
                      publishing.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <ChecklistItem
                    label="Event information"
                    complete={
                      form.title.trim().length > 0 &&
                      form.description.trim().length > 0
                    }
                  />

                  <ChecklistItem
                    label="Cover image"
                    complete={imagePreview !== null}
                  />

                  <ChecklistItem
                    label="Schedule"
                    complete={
                      form.eventDate.length > 0 &&
                      form.startTime.length > 0 &&
                      form.endTime.length > 0
                    }
                  />

                  <ChecklistItem
                    label="Registration window"
                    complete={
                      form.registrationStart.length > 0 &&
                      form.registrationEnd.length > 0
                    }
                  />

                  <ChecklistItem
                    label="Venue"
                    complete={form.venue.trim().length > 0}
                  />

                  <ChecklistItem
                    label="Capacity & team settings"
                    complete={
                      Number(form.capacity) > 0 &&
                      Number(form.teamSize) > 0
                    }
                  />

                  <ChecklistItem
                    label="Discount & ticket settings"
                    complete={
                      Number(form.maxDiscountPercent) >= 0 &&
                      form.ticketName.trim().length > 0 &&
                      Number(form.ticketPrice) >= 0
                    }
                  />
                </div>
              </section>

              {/* =========================
                  ACTIONS
              ========================= */}

              <div className="sticky bottom-4 z-20 rounded-2xl border border-white/10 bg-[#080b12]/90 p-3 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 text-xs font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Save size={15} />
                    Save draft
                  </button>

                  <button
                    type="submit"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-semibold text-black transition hover:bg-white/90"
                  >
                    <Plus size={15} />
                    Publish event
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function ChecklistItem({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          complete
            ? "bg-emerald-400/10 text-emerald-300"
            : "bg-white/[0.05] text-white/20"
        }`}
      >
        {complete ? "✓" : "•"}
      </div>

      <span
        className={`text-[10px] ${
          complete ? "text-white/60" : "text-white/25"
        }`}
      >
        {label}
      </span>
    </div>
  );
}