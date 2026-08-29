"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Manish Reddy",
    rollNumber: "23CSE042",
    college: "Vardhaman College of Engineering",
    course: "B.Tech Computer Science and Engineering",
    year: "3rd Year",
    email: "manish@example.com",
  });

  const [saved, setSaved] = useState(false);

  function handleSave() {
    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <main className="campus-background min-h-screen">
      {/* Header */}

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b12]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/40 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={15} />
            </Link>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/20">
                Account
              </p>

              <h1 className="mt-1 text-sm font-semibold">
                My Profile
              </h1>
            </div>
          </div>

          <Link
            href="/tickets"
            className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-[10px] font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
          >
            My Tickets
          </Link>
        </div>
      </header>

      <section className="px-4 py-10 sm:px-6 lg:py-14">
        <div className="mx-auto max-w-4xl">
          {/* Intro */}

          <div>
            <p className="text-sm font-medium text-violet-300">
              Student account
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Your profile.
            </h2>

            <p className="mt-3 max-w-2xl text-xs leading-5 text-white/35">
              Keep your student information up to date. These
              details will be used for event registrations,
              tickets, attendance records, and certificates.
            </p>
          </div>

          {/* Profile card */}

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            {/* Profile heading */}

            <div className="border-b border-white/[0.06] p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-400/10 text-xl font-semibold text-violet-300">
                    MR
                  </div>

                  <div>
                    <h3 className="text-base font-semibold">
                      {profile.name}
                    </h3>

                    <p className="mt-1 text-[10px] text-white/25">
                      Student account
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-[9px] text-emerald-300">
                      <CheckCircle2 size={11} />
                      Profile verified
                    </div>
                  </div>
                </div>

                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-[10px] font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Pencil size={13} />
                    Edit profile
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[10px] font-semibold text-black transition hover:bg-white/90"
                  >
                    <Save size={13} />
                    Save changes
                  </button>
                )}
              </div>
            </div>

            {/* Fields */}

            <div className="grid gap-px bg-white/[0.04] sm:grid-cols-2">
              <ProfileField
                icon={<User size={15} />}
                label="Full name"
                value={profile.name}
                editing={editing}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    name: value,
                  })
                }
              />

              <ProfileField
                icon={<GraduationCap size={15} />}
                label="Roll number"
                value={profile.rollNumber}
                editing={editing}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    rollNumber: value,
                  })
                }
              />

              <ProfileField
                icon={<Mail size={15} />}
                label="Email address"
                value={profile.email}
                editing={editing}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    email: value,
                  })
                }
              />

              <ProfileField
                icon={<GraduationCap size={15} />}
                label="College"
                value={profile.college}
                editing={editing}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    college: value,
                  })
                }
              />

              <ProfileField
                icon={<GraduationCap size={15} />}
                label="Course"
                value={profile.course}
                editing={editing}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    course: value,
                  })
                }
              />

              <ProfileField
                icon={<GraduationCap size={15} />}
                label="Year"
                value={profile.year}
                editing={editing}
                onChange={(value) =>
                  setProfile({
                    ...profile,
                    year: value,
                  })
                }
              />
            </div>
          </div>

          {/* Account information */}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-emerald-300">
                <ShieldCheck size={17} />
              </div>

              <h3 className="mt-4 text-xs font-semibold">
                Account security
              </h3>

              <p className="mt-2 text-[10px] leading-5 text-white/25">
                Your account information is used to securely
                connect your registrations, tickets, attendance,
                and certificates.
              </p>

              <button
                type="button"
                className="mt-4 text-[10px] font-medium text-white/40 transition hover:text-white"
              >
                Change password →
              </button>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/[0.08] text-violet-300">
                <GraduationCap size={17} />
              </div>

              <h3 className="mt-4 text-xs font-semibold">
                Student identity
              </h3>

              <p className="mt-2 text-[10px] leading-5 text-white/25">
                Your roll number identifies you when registering
                for events and helps organizers issue certificates
                to the correct participant.
              </p>

              <p className="mt-4 font-mono text-[10px] text-violet-300/70">
                {profile.rollNumber}
              </p>
            </div>
          </div>

          {/* Important note */}

          <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-cyan-300"
              />

              <div>
                <p className="text-xs font-medium">
                  Your identity stays connected
                </p>

                <p className="mt-1 text-[10px] leading-5 text-white/25">
                  When the real backend is connected, your
                  student ID will link your registrations,
                  individual tickets, QR codes, attendance, and
                  certificates together. You won't need to enter
                  your roll number every time you register.
                </p>
              </div>
            </div>
          </div>

          {/* Saved notification */}

          {saved && (
            <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-emerald-400/10 bg-[#0d1513] px-4 py-3 shadow-2xl">
              <CheckCircle2
                size={15}
                className="text-emerald-300"
              />

              <span className="text-[10px] font-medium text-emerald-200">
                Profile changes saved
              </span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ProfileField({
  icon,
  label,
  value,
  editing,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="bg-[#090d15] p-5 sm:p-6">
      <div className="flex items-center gap-2 text-white/20">
        {icon}

        <span className="text-[9px] uppercase tracking-wider">
          {label}
        </span>
      </div>

      {editing ? (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-3 h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white outline-none focus:border-violet-400/30"
        />
      ) : (
        <p className="mt-3 text-xs text-white/65">
          {value}
        </p>
      )}
    </div>
  );
}