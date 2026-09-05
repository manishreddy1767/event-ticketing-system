"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken, getMe, type ApiUser } from "@/lib/api";

function getHomeForRole(role: string): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "organizer":
      return "/organizer/dashboard";
    case "student":
    default:
      return "/events";
  }
}

function getRequiredRole(
  pathname: string
): "admin" | "organizer" | "student" | null {
  // Public authentication pages
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/organizer/register"
  ) {
    return null;
  }

  if (pathname.startsWith("/admin")) {
    return "admin";
  }

  if (pathname.startsWith("/organizer")) {
    return "organizer";
  }

  if (
    pathname === "/events" ||
    pathname.startsWith("/events/") ||
    pathname.startsWith("/tickets") ||
    pathname.startsWith("/certificates") ||
    pathname.startsWith("/team")
  ) {
    return "student";
  }

  return null;
}

export default function RoleGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      const requiredRole = getRequiredRole(pathname);

      // Public/shared pages do not need role protection.
      if (!requiredRole) {
        if (!cancelled) {
          setChecking(false);
        }
        return;
      }

      const token = getAccessToken();

      // No token -> login.
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const currentUser = await getMe();

        if (cancelled) return;

        setUser(currentUser);

        if (currentUser.role !== requiredRole) {
          router.replace(getHomeForRole(currentUser.role));
          return;
        }

        setChecking(false);
      } catch {
        if (!cancelled) {
          router.replace("/login");
        }
      }
    }

    checkAccess();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (checking && getRequiredRole(pathname)) {
    return (
      <main className="campus-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />
          <p className="mt-4 text-xs text-white/40">
            Checking access...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
