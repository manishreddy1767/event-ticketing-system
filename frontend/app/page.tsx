"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  QrCode,
  Sparkles,
  Ticket,
  Users,
  Award,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Navbar from "@/components/navbar/navbar";

const events = [
  {
    title: "AI Hackathon 2026",
    category: "TECHNOLOGY",
    date: "12 SEP",
    location: "Main Auditorium",
    registered: 382,
    capacity: 500,
    price: "₹100",
    demand: "High demand",
    accent: "from-violet-500/30 via-indigo-500/10 to-cyan-400/10",
  },
  {
    title: "Design Thinking Workshop",
    category: "WORKSHOP",
    date: "15 SEP",
    location: "Innovation Lab",
    registered: 124,
    capacity: 200,
    price: "₹50",
    demand: "Filling steadily",
    accent: "from-cyan-400/20 via-teal-400/10 to-violet-500/10",
  },
  {
    title: "Campus Coding Contest",
    category: "COMPETITION",
    date: "18 SEP",
    location: "CSE Block",
    registered: 286,
    capacity: 300,
    price: "₹75",
    demand: "Almost full",
    accent: "from-orange-400/20 via-pink-500/10 to-violet-500/10",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function Home() {
  return (
    <main className="campus-background min-h-screen overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 sm:pt-36">
        <div className="pointer-events-none absolute left-[8%] top-32 h-72 w-72 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-[8%] top-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs font-medium text-white/65 backdrop-blur-xl">
                <Sparkles size={14} className="text-violet-300" />
                Your campus, connected.
              </div>

              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[5.3rem]">
                Your campus.
                <br />
                <span className="text-white/35">Your events.</span>
                <br />
                Your experience.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
                Discover workshops, hackathons, competitions and experiences
                happening around your campus — without missing what matters.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/events"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-[0_10px_40px_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Explore events
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="#trending"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-medium text-white/65 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  See what&apos;s trending
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-white/35">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  Verified college events
                </span>
                <span className="flex items-center gap-2">
                  <QrCode size={14} className="text-violet-300" />
                  Instant digital tickets
                </span>
              </div>
            </motion.div>

            {/* FEATURED EVENT */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-8 rounded-[3rem] bg-violet-500/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0f1a]/90 p-2 shadow-2xl">
                <div className="relative min-h-[470px] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-violet-600/25 via-[#111625] to-cyan-400/10">
                  {/* Abstract event photography treatment */}
                  <div className="absolute inset-0">
                    <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-500/30 blur-[90px]" />
                    <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-cyan-400/15 blur-[90px]" />

                    <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.025)_45%,transparent_46%)]" />

                    <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#070a12] via-[#070a12]/80 to-transparent" />
                  </div>

                  <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-white/70 backdrop-blur-xl">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    FEATURED EVENT
                  </div>

                  <div className="absolute right-6 top-6 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-right backdrop-blur-xl">
                    <p className="text-[9px] uppercase tracking-wider text-white/35">
                      Demand
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-white">
                      76%
                    </p>
                  </div>

                  <div className="absolute bottom-7 left-7 right-7">
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-violet-300">
                      SEPTEMBER 12 • 2026
                    </p>

                    <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                      AI Hackathon
                    </h2>

                    <p className="mt-3 max-w-md text-sm leading-6 text-white/45">
                      Build. Collaborate. Compete. A full-day technology
                      experience created for ambitious students.
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-white/10 bg-white/[0.045] p-3 backdrop-blur">
                        <p className="text-[10px] text-white/35">Registered</p>
                        <p className="mt-1 text-sm font-semibold">382</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.045] p-3 backdrop-blur">
                        <p className="text-[10px] text-white/35">Spots left</p>
                        <p className="mt-1 text-sm font-semibold">118</p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.045] p-3 backdrop-blur">
                        <p className="text-[10px] text-white/35">From</p>
                        <p className="mt-1 text-sm font-semibold">₹100</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-white/40">
                        <MapPin size={14} />
                        Main Auditorium
                      </span>

                      <Link
                        href="/events"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black transition hover:scale-105"
                      >
                        <ArrowRight size={17} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section
        id="trending"
        className="border-t border-white/[0.06] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
          >
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-300">
                <Zap size={15} />
                Live demand
              </div>

              <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Trending on campus
              </h2>

              <p className="mt-2 text-sm text-white/35">
                See what students are signing up for right now.
              </p>
            </div>

            <Link
              href="/events"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-white"
            >
              View all events
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => {
              const percentage = Math.round(
                (event.registered / event.capacity) * 100
              );

              return (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Link
                    href="/events"
                    className="group block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-2 transition duration-300 hover:-translate-y-1.5 hover:border-white/[0.16] hover:bg-white/[0.045]"
                  >
                    <div
                      className={`relative h-56 overflow-hidden rounded-xl bg-gradient-to-br ${event.accent}`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.12),transparent_25%)]" />

                      <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-[10px] font-semibold tracking-wider text-white/65 backdrop-blur-xl">
                        {event.category}
                      </div>

                      <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-lg border border-emerald-300/10 bg-emerald-400/10 px-2.5 py-1.5 text-[10px] font-medium text-emerald-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        {event.demand}
                      </div>

                      <div className="absolute bottom-4 left-4 flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-white text-black shadow-lg">
                        <span className="text-[9px] font-bold">
                          {event.date.split(" ")[1]}
                        </span>
                        <span className="text-base font-black">
                          {event.date.split(" ")[0]}
                        </span>
                      </div>
                    </div>

                    <div className="px-3 pb-3 pt-5">
                      <h3 className="text-lg font-semibold tracking-tight">
                        {event.title}
                      </h3>

                      <div className="mt-4 space-y-2 text-xs text-white/40">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          {event.location}
                        </div>

                        <div className="flex items-center gap-2">
                          <Users size={14} />
                          {event.registered} / {event.capacity} registered
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-[11px]">
                          <span className="text-white/35">
                            Current occupancy
                          </span>
                          <span className="font-medium text-white/55">
                            {percentage}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: 0.15 }}
                            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300"
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                        <span className="text-sm font-semibold">
                          {event.price}
                          <span className="ml-1 text-xs font-normal text-white/30">
                            onwards
                          </span>
                        </span>

                        <span className="text-xs font-medium text-white/35 transition group-hover:text-white">
                          View event →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCT EXPERIENCE */}
      <section className="border-t border-white/[0.06] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-violet-300">
                <Ticket size={16} />
                One registration. Everything you need.
              </div>

              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                From registration to check-in,{" "}
                <span className="text-white/35">it just works.</span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/40 sm:text-base">
                Every student gets a digital ticket, a unique QR code and a
                personal event record. After the event, certificates appear
                directly in their account.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: Ticket,
                    title: "Smart registration",
                    text: "Register individually or choose a team size supported by the event.",
                  },
                  {
                    icon: QrCode,
                    title: "Instant digital ticket",
                    text: "Your ticket and QR code are generated as soon as registration is confirmed.",
                  },
                  {
                    icon: Award,
                    title: "Certificates in your account",
                    text: "Participation and winner certificates stay accessible after the event.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                      <item.icon size={19} />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-white/35">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Ticket visual */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.97 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative flex justify-center"
            >
              <div className="absolute h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />

              <div className="relative w-full max-w-md rotate-1 overflow-hidden rounded-[2rem] border border-white/10 bg-[#101521] p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-black text-black">
                      E
                    </div>
                    <span className="text-sm font-semibold">Evently</span>
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300">
                    VALID TICKET
                  </span>
                </div>

                <div className="mt-10">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-violet-300">
                    TECHNOLOGY • 12 SEP 2026
                  </p>

                  <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                    AI Hackathon
                  </h3>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-white/30">Attendee</p>
                      <p className="mt-1 font-medium">Manish Reddy</p>
                    </div>

                    <div>
                      <p className="text-white/30">Registration</p>
                      <p className="mt-1 font-medium">TEAM-3-82A</p>
                    </div>
                  </div>
                </div>

                <div className="my-7 border-t border-dashed border-white/10" />

                <div className="flex items-end justify-between gap-6">
                  <div className="space-y-3 text-xs text-white/40">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={14} />
                      12 September 2026
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock3 size={14} />
                      10:00 AM
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={14} />
                      Main Auditorium
                    </span>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <QrCode size={82} className="text-black" />
                  </div>
                </div>

                <div className="mt-7 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-[10px] text-white/30">
                  Present this QR code at the entrance for smart check-in.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-white/[0.06] py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Sparkles size={20} className="text-violet-300" />
          </div>

          <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            There&apos;s always something
            <br />
            <span className="text-white/35">happening on campus.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/35">
            Find your next event, reserve your spot and experience campus
            beyond the classroom.
          </p>

          <Link
            href="/events"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90"
          >
            Explore campus events
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 text-xs text-white/25 sm:flex-row sm:px-6 lg:px-8">
          <span>Evently — College Event Platform</span>
          <span>Built for campus experiences.</span>
        </div>
      </footer>
    </main>
  );
}