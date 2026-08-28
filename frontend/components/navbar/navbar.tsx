import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 backdrop-blur-xl sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
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
              className="text-sm text-white/60 transition hover:text-white"
            >
              Events
            </Link>

            <Link
              href="/events"
              className="text-sm text-white/60 transition hover:text-white"
            >
              Discover
            </Link>

            <Link
              href="/tickets"
              className="text-sm text-white/60 transition hover:text-white"
            >
              My Tickets
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-white/65 transition hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="hidden items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 sm:flex"
            >
              Get Started
              <ArrowRight size={15} />
            </Link>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}