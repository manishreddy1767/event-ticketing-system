"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  User,
  GraduationCap,
  Building2,
  CalendarDays,
  IdCard,
} from "lucide-react";

import {
  getMe,
  updateMyProfile,
  getStudentProfile,
  updateStudentProfile,
  type ApiUser,
  type ApiStudentProfile,
} from "@/lib/api";

import { useAuth } from "@/lib/auth";

export default function ProfilePage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [studentProfile, setStudentProfile] =
    useState<ApiStudentProfile | null>(null);

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [college, setCollege] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const userData = await getMe();

        console.log("PROFILE: getMe() succeeded", userData);

        setProfile(userData);
        setName(userData.name);
        setEmail(userData.email);

        if (userData.role === "student") {
          const studentData = await getStudentProfile();

          console.log(
            "PROFILE: getStudentProfile() succeeded",
            studentData,
          );

          setStudentProfile(studentData);

          setRollNumber(studentData.roll_number ?? "");
          setDepartment(studentData.department ?? "");
          setYear(studentData.year ?? "");
          setCollege(studentData.college ?? "");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSave() {
    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    if (
      isStudent &&
      (
        !rollNumber.trim() ||
        !department.trim() ||
        !year.trim() ||
        !college.trim()
      )
    ) {
      setError("Please fill in all student profile fields.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSaved(false);

      const updatedUser = await updateMyProfile({
        name: name.trim(),
        email: email.trim(),
      });

      setProfile(updatedUser);

      setName(updatedUser.name);
      setEmail(updatedUser.email);

      if (isStudent) {
        const updatedStudent = await updateStudentProfile({
          roll_number: rollNumber.trim(),
          department: department.trim(),
          year: year.trim(),
          college: college.trim(),
        });

        setStudentProfile(updatedStudent);

        setRollNumber(updatedStudent.roll_number ?? "");
        setDepartment(updatedStudent.department ?? "");
        setYear(updatedStudent.year ?? "");
        setCollege(updatedStudent.college ?? "");
      }

      setEditing(false);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error("Failed to update profile:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }

    if (studentProfile) {
      setRollNumber(studentProfile.roll_number ?? "");
      setDepartment(studentProfile.department ?? "");
      setYear(studentProfile.year ?? "");
      setCollege(studentProfile.college ?? "");
    }

    setError(null);
    setEditing(false);
  }

  if (loading) {
    return (
      <main className="campus-background min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4">
          <div className="text-center">
            <User className="mx-auto h-10 w-10 animate-pulse text-violet-300/50" />

            <p className="mt-4 text-xs text-white/40">
              Loading profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="campus-background min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4">
          <div className="text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-red-300/50" />

            <h2 className="mt-4 text-lg font-semibold">
              Unable to load profile
            </h2>

            <p className="mt-2 text-xs text-white/40">
              {error}
            </p>

            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
            >
              <ArrowLeft size={14} />
              Back home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const roleLabel =
    profile?.role === "organizer"
      ? "Organizer account"
      : profile?.role === "admin"
        ? "Admin account"
        : "Student account";

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

          <div>
            <p className="text-sm font-medium text-violet-300">
              {roleLabel}
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Your profile.
            </h2>

            <p className="mt-3 max-w-2xl text-xs leading-5 text-white/35">
              Manage the account information connected to your
              Evently registrations, tickets, attendance, and
              certificates.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3 text-xs text-red-200">
              {error}
            </div>
          )}

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">

            <div className="border-b border-white/[0.06] p-6 sm:p-8">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-400/10 text-xl font-semibold text-violet-300">
                    {profile?.name
                      ? profile.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "EV"}
                  </div>

                  <div>

                    <h3 className="text-base font-semibold">
                      {profile?.name}
                    </h3>

                    <p className="mt-1 text-[10px] text-white/25">
                      {roleLabel}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-[9px] text-emerald-300">
                      <CheckCircle2 size={11} />

                      {profile?.status === "active"
                        ? "Account active"
                        : "Account inactive"}
                    </div>

                  </div>

                </div>

                {!editing ? (

                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setEditing(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-[10px] font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <Pencil size={13} />
                    Edit profile
                  </button>

                ) : (

                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-[10px] font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[10px] font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save size={13} />
                      {saving ? "Saving..." : "Save changes"}
                    </button>

                  </div>

                )}

              </div>

            </div>

            <div className="grid gap-px bg-white/[0.04] sm:grid-cols-2">

              <ProfileField
                icon={<User size={15} />}
                label="Full name"
                value={name}
                editing={editing}
                onChange={setName}
              />

              <ProfileField
                icon={<Mail size={15} />}
                label="Email address"
                value={email}
                editing={editing}
                onChange={setEmail}
                type="email"
              />

              {isStudent && (
                <>
                  <ProfileField
                    icon={<IdCard size={15} />}
                    label="Roll number"
                    value={rollNumber}
                    editing={editing}
                    onChange={setRollNumber}
                  />

                  <ProfileField
                    icon={<GraduationCap size={15} />}
                    label="Department"
                    value={department}
                    editing={editing}
                    onChange={setDepartment}
                  />

                  <ProfileField
                    icon={<CalendarDays size={15} />}
                    label="Year"
                    value={year}
                    editing={editing}
                    onChange={setYear}
                  />

                  <ProfileField
                    icon={<Building2 size={15} />}
                    label="College"
                    value={college}
                    editing={editing}
                    onChange={setCollege}
                  />
                </>
              )}

              <ProfileField
                icon={<ShieldCheck size={15} />}
                label="Role"
                value={profile?.role || "student"}
                editing={false}
                onChange={() => {}}
              />

              <ProfileField
                icon={<CheckCircle2 size={15} />}
                label="Account status"
                value={profile?.status || "active"}
                editing={false}
                onChange={() => {}}
              />

            </div>

          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-emerald-300">
                <ShieldCheck size={17} />
              </div>

              <h3 className="mt-4 text-xs font-semibold">
                Account security
              </h3>

              <p className="mt-2 text-[10px] leading-5 text-white/25">
                Your account information is securely connected
                to your Evently activity and account access.
              </p>

              <p className="mt-4 text-[10px] text-white/30">
                Password management will be added separately.
              </p>

            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/[0.08] text-violet-300">
                <User size={17} />
              </div>

              <h3 className="mt-4 text-xs font-semibold">
                {isStudent ? "Student identity" : "Account identity"}
              </h3>

              <p className="mt-2 text-[10px] leading-5 text-white/25">
                {isStudent
                  ? "Your roll number, department, year, and college are stored securely with your student account."
                  : "Your account identity and role are securely connected to your Evently account."}
              </p>

            </div>

          </div>

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
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="bg-[#090d15] p-5 sm:p-6">

      <div className="flex items-center gap-2 text-white/20">
        {icon}

        <span className="text-[9px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>

      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-3 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/30 focus:bg-white/[0.05]"
        />
      ) : (
        <p className="mt-3 text-xs font-medium text-white/70">
          {value || "Not provided"}
        </p>
      )}

    </div>
  );
}
