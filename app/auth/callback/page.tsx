"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

/**
 * Handles the Google OAuth PKCE callback.
 * Exchanges the `code` param for a session, then redirects
 * to /register (new user) or /home (returning user).
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const didRun = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const supabase = getSupabaseBrowserClient();

    const completeAuth = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (!code) throw new Error("No auth code found in URL.");

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;

        // Check if the user already has a backend profile
        const { data: { session } } = await supabase.auth.getSession();
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!session?.access_token || !apiBaseUrl) {
          router.replace("/register");
          return;
        }

        const res = await fetch(`${apiBaseUrl}/user/profile`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.ok) {
          const result = await res.json().catch(() => null);
          if (result?.success && result?.data) {
            router.replace("/home");
            return;
          }
        }

        router.replace("/register");
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Unable to complete sign-in.");
      }
    };

    void completeAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-6 text-center">
      <div className="max-w-sm space-y-3">
        <h1 className="text-xl font-bold text-[var(--color-text)]">Signing you in...</h1>
        {error ? (
          <>
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => router.replace("/login")}
              className="text-sm text-primary underline"
            >
              Back to login
            </button>
          </>
        ) : (
          <p className="text-xs text-[var(--color-muted)]">Please wait a moment...</p>
        )}
      </div>
    </div>
  );
}
