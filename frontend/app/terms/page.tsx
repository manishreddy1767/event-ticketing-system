import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            Terms of Service
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Last updated: September 2026
          </p>

          <div className="mt-8 space-y-7 text-sm leading-7 text-white/60">
            <section>
              <h2 className="text-lg font-semibold text-white">
                1. Acceptance of Terms
              </h2>
              <p className="mt-2">
                By creating an Evently account, you agree to use the platform
                responsibly and follow these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                2. Account Responsibility
              </h2>
              <p className="mt-2">
                You are responsible for keeping your account credentials
                secure and for the activity performed through your account.
                You should provide accurate information when registering.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                3. Event Registration
              </h2>
              <p className="mt-2">
                Evently allows students to discover and register for college
                events. Registration, ticket availability, pricing, and event
                rules may vary depending on the organizer.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                4. Payments and Tickets
              </h2>
              <p className="mt-2">
                Where payment is required, users are responsible for
                completing the applicable payment process. Tickets should not
                be transferred or misused in violation of event rules.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                5. Prohibited Use
              </h2>
              <p className="mt-2">
                Users must not attempt to misuse the platform, access another
                person's account, submit fraudulent information, or interfere
                with the operation of Evently.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">
                6. Changes to These Terms
              </h2>
              <p className="mt-2">
                These terms may be updated as Evently develops. Continued use
                of the platform after changes means you acknowledge the
                updated terms.
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
