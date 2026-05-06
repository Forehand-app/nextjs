"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useAppSession } from "@/components/AppSessionProvider";

/** 
 * Wraps protected route groups. 
 * Redirects unauthenticated users to /login, and authenticated users without a profile to /register. 
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const { profile, isResolving } = useAppSession();

  useEffect(() => {
    if (isLoading || isResolving) return;

    // Not authenticated -> login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Authenticated but no backend profile -> register
    if (!profile) {
      router.replace("/register");
    }
  }, [isAuthenticated, isLoading, isResolving, profile, router]);

  if (isLoading || isResolving) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[var(--color-muted)]">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }

  return <>{children}</>;
}
