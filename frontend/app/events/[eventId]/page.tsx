"use client";

import Link from "next/link";
import { useState } from "react";
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

const event = {
  title: "AI Hackathon 2026",
  category: "Technology",
  date: "12 September 2026",
  time: "10:00 AM – 8:00 PM",
  location: "Main Auditorium",
  organizer: "Vardhaman Tech Club",

  description:
    "A full-day technology challenge where students come together to build, experiment and solve meaningful problems using technology.",

  registered: 382,
  capacity: 500,

  deadline: "10 September 2026",

  ticketTypes: [
    {
      size: 1,
      label: "Individual",
      description: "Participate on your own",
      price: 100,
    },
    {
      size: 2,
      label: "Team of 2",
      description: "Bring one teammate",
      price: 180,
    },
    {
      size: 3,
      label: "Team of 3",
      description: "Build with two teammates",
      price: 240,
    },
    {
      size: 4,
      label: "Team of 4",
      description: "Build with three teammates",
      price: 280,
    },
  ],

  smartDiscount: 10,
};

export default function EventDetailsPage() {
  const [selectedTeam, setSelectedTeam] = useState(1);

  const selectedTicket = event.ticketTypes.find(
    (ticket) => ticket.size === selectedTeam
  );

  const basePrice = selectedTicket?.price ?? 0;

  const discount = Math.round(
    (basePrice * event.smartDiscount) / 100
  );

  const total = basePrice - discount;

  const occupancy = Math.round(
    (event.registered / event.capacity) * 100
  );

  return (
    <main className="campus-background min-h-screen overflow-hidden">
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
                className="text-sm font-medium text-white"
              >
                Events
              </Link>

              <Link
                href="/events"
                className="text-sm text-white/45 transition hover:text-white"
              >
                Discover
              </Link>

              <Link
                href="/tickets"
                className="text-sm text-white/45 transition hover:text-white"
              >
                My Tickets
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden text-sm text-white/60 transition hover:text-white sm:block"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="hidden rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 sm:block"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* =========================
          BACK
      ========================= */}

      <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-6 lg:px-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to events
        </Link>
      </div>

      {/* =========================
          HERO + REGISTRATION
      ========================= */}

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative min-h-[500px] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-600/30 via-[#111625] to-cyan-400/10"
          >
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-violet-500/25 blur-[120px]" />

            <div className="absolute -bottom-20 -left-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-[110px]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.08),transparent_25%)]" />

            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px]" />

            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#070a12] via-[#070a12]/80 to-transparent" />

            <div className="absolute left-7 top-7 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] font-semibold tracking-[0.15em] text-white/65 backdrop-blur-xl">
              {event.category.toUpperCase()}
            </div>

            <div className="absolute right-7 top-7 flex items-center gap-2 rounded-full border border-orange-300/10 bg-orange-400/10 px-3 py-2 text-[10px] font-medium text-orange-300 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
              High demand
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-2 text-xs text-violet-300">
                <Sparkles size={14} />
                Featured campus event
              </div>

              <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
                {event.title}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">
                {event.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/50 backdrop-blur">
                  <CalendarDays size={14} />
                  {event.date}
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/50 backdrop-blur">
                  <MapPin size={14} />
                  {event.location}
                </div>
              </div>
            </div>
          </motion.div>

          {/* REGISTRATION CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[2rem] border border-white/10 bg-[#0c101a]/90 p-6 sm:p-7"
          >
            {/* Price */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-white/30">
                  Registration from
                </p>

                <p className="mt-1 text-3xl font-semibold">
                  ₹{event.ticketTypes[0].price}
                </p>
              </div>

              <div className="rounded-xl border border-violet-300/10 bg-violet-400/10 px-3 py-2 text-right">
                <p className="text-[9px] uppercase tracking-wider text-violet-200/50">
                  Smart offer
                </p>

                <p className="mt-0.5 text-sm font-semibold text-violet-200">
                  {event.smartDiscount}% OFF
                </p>
              </div>
            </div>

            <div className="my-6 border-t border-white/[0.07]" />

            {/* Team selection */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">
                    Choose your registration
                  </h2>

                  <p className="mt-1 text-xs text-white/30">
                    Select the team size you want to register.
                  </p>
                </div>

                <Users
                  size={18}
                  className="text-white/25"
                />
              </div>

              <div className="mt-5 space-y-2">
                {event.ticketTypes.map((ticketType) => {
                  const selected =
                    selectedTeam === ticketType.size;

                  return (
                    <button
                      key={ticketType.size}
                      type="button"
                      onClick={() =>
                        setSelectedTeam(ticketType.size)
                      }
                      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-violet-400/40 bg-violet-400/[0.08]"
                          : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold ${
                            selected
                              ? "bg-violet-400 text-white"
                              : "bg-white/[0.06] text-white/50"
                          }`}
                        >
                          {ticketType.size}
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            {ticketType.label}
                          </p>

                          <p className="mt-0.5 text-[11px] text-white/30">
                            {ticketType.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-white/65">
                          ₹{ticketType.price}
                        </span>

                        {selected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-400">
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRICE SUMMARY */}
            <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="flex justify-between text-xs text-white/40">
                <span>
                  {selectedTicket?.label}
                </span>

                <span>
                  ₹{basePrice}
                </span>
              </div>

              <div className="mt-2 flex justify-between text-xs text-emerald-300">
                <span>
                  Smart discount ({event.smartDiscount}%)
                </span>

                <span>
                  -₹{discount}
                </span>
              </div>

              <div className="my-3 border-t border-white/[0.06]" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Total
                </span>

                <span className="text-xl font-semibold">
                  ₹{total}
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/register"
              className="group mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              Reserve your spot

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/25">
              <ShieldCheck size={13} />
              Your spot is temporarily reserved during checkout.
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================
          EVENT INFORMATION
      ========================= */}

      <section className="border-y border-white/[0.06]">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            {
              icon: CalendarDays,
              label: "Date",
              value: event.date,
            },
            {
              icon: Clock3,
              label: "Time",
              value: event.time,
            },
            {
              icon: MapPin,
              label: "Venue",
              value: event.location,
            },
            {
              icon: Users,
              label: "Organizer",
              value: event.organizer,
            },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`flex items-start gap-4 py-7 lg:px-6 ${
                index !== 3
                  ? "border-b border-white/[0.06] lg:border-b-0 lg:border-r"
                  : ""
              }`}
            >
              <item.icon
                size={18}
                className="mt-0.5 text-violet-300"
              />

              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/25">
                  {item.label}
                </p>

                <p className="mt-1 text-sm font-medium text-white/70">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          DEMAND + DEADLINE
      ========================= */}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">

          {/* DEMAND */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7">
            <div className="flex items-center gap-2 text-sm font-medium text-violet-300">
              <Zap size={16} />
              Live demand
            </div>

            <div className="mt-7 flex items-end justify-between">
              <div>
                <p className="text-4xl font-semibold tracking-tight">
                  {occupancy}%
                </p>

                <p className="mt-1 text-xs text-white/30">
                  of available capacity occupied
                </p>
              </div>

              <p className="text-sm text-white/40">
                {event.registered} / {event.capacity}
              </p>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.07]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width: `${occupancy}%`,
                }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300"
              />
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-orange-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />

              This event is receiving strong demand.
            </div>
          </div>

          {/* DEADLINE */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7">
            <div className="flex items-center gap-2 text-sm font-medium text-white/70">
              <Clock3
                size={16}
                className="text-violet-300"
              />

              Registration deadline
            </div>

            <p className="mt-6 text-2xl font-semibold">
              {event.deadline}
            </p>

            <p className="mt-2 text-xs leading-5 text-white/30">
              Registration automatically closes after the
              organizer&apos;s deadline.
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-xs text-white/40">
              <ShieldCheck
                size={15}
                className="text-emerald-400"
              />

              Verified event by college administration
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          AFTER REGISTRATION
      ========================= */}

      <section className="border-t border-white/[0.06] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="max-w-xl">
            <p className="text-sm font-medium text-violet-300">
              After registration
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Everything stays in your Evently account.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/35">
              Your registration, ticket, check-in status and
              certificates remain connected to your account.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">

            {/* TICKET */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition hover:-translate-y-1 hover:bg-white/[0.035]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                <Ticket size={20} />
              </div>

              <h3 className="mt-6 text-sm font-semibold">
                Digital ticket
              </h3>

              <p className="mt-2 text-xs leading-5 text-white/35">
                Your unique digital ticket is generated after
                registration confirmation.
              </p>
            </div>

            {/* QR */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition hover:-translate-y-1 hover:bg-white/[0.035]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                <Zap size={20} />
              </div>

              <h3 className="mt-6 text-sm font-semibold">
                Smart check-in
              </h3>

              <p className="mt-2 text-xs leading-5 text-white/35">
                Present your QR code at the entrance for quick
                and reliable event verification.
              </p>
            </div>

            {/* CERTIFICATE */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition hover:-translate-y-1 hover:bg-white/[0.035]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                <Sparkles size={20} />
              </div>

              <h3 className="mt-6 text-sm font-semibold">
                Certificate
              </h3>

              <p className="mt-2 text-xs leading-5 text-white/35">
                Participation and winner certificates can be
                accessed directly from your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 text-xs text-white/25 sm:flex-row sm:px-6 lg:px-8">
          <span>
            Evently — College Event Platform
          </span>

          <span>
            Built for campus experiences.
          </span>
        </div>
      </footer>
    </main>
  );
}