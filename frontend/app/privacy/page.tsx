import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="campus-background min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <Link
          href="/register"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Registration
        </Link>

        <div className="rounded-[1.5rem] border border-white/10 bg-[#0c101a]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Privacy Policy
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Last updated: September 2026
          </p>

          <div className="mt-8 space-y-7 text-sm leading-7 text-white/60">
            <section>
              <h2 className="text-lg font-semibold text-white">
                1. Information We Collect
              </h2>
              <p className="mt-2">
                Evently may collect information provided during account
                registration and event participation, such as your name,
                email address, profile information, event registrations, and
                ticket information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                2. How We Use Information
              </h2>
              <p className="mt-2">
                Information is used to provide account access, manage event
                registrations and tickets, support event participation, and
                provide relevant platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                3. Account Security
              </h2>
              <p className="mt-2">
                Evently uses security measures designed to protect account
                information. Users should also protect their passwords and
                avoid sharing account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                4. Event Information
              </h2>
              <p className="mt-2">
                Information necessary for event registration and participation
                may be available to authorized event organizers or
                administrators where required for event management.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                5. Data Protection
              </h2>
              <p className="mt-2">
                We aim to limit access to personal information to authorized
                users and systems that require it to operate Evently.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                6. Updates
              </h2>
              <p className="mt-2">
                This Privacy Policy may be updated when platform functionality
                or data practices change. The latest version will be made
                available through Evently.
              </p>
            </section>
          </div>

          <Link
            href="/register"
            className="mt-10 flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Return to Registration
          </Link>
        </div>
      </div>
    </main>
  );
}
