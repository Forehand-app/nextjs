"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { finishAuthFromUrl, getPostLoginRoute } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const didRunRef = useRef(false);

  useEffect(() => {
    let isActive = true;
    if (didRunRef.current) return;
    didRunRef.current = true;

    const completeAuth = async () => {
      try {
        const currentUrl = new URL(window.location.href);
        const code = currentUrl.searchParams.get("code");
        const callbackStorageKey = code ? `forehand:auth-callback:${code}` : null;

        if (callbackStorageKey && sessionStorage.getItem(callbackStorageKey) === "done") {
          const target = await getPostLoginRoute();
          router.replace(target);
          return;
        }

        const target = await finishAuthFromUrl(currentUrl.toString());

        if (callbackStorageKey) {
          sessionStorage.setItem(callbackStorageKey, "done");
        }

        if (currentUrl.search || currentUrl.hash) {
          window.history.replaceState({}, "", "/auth/callback/");
        }

        if (isActive) {
          router.replace(target);
        }
      } catch (cause) {
        if (!isActive) return;
        const message = cause instanceof Error ? cause.message : "Unable to complete sign-in.";
        setError(message);
      }
    };

    void completeAuth();

    return () => {
      isActive = false;
    };
  }, [finishAuthFromUrl, getPostLoginRoute, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-6 text-center">
      <div className="max-w-sm space-y-3">
        <h1 className="text-xl font-bold text-[var(--color-text)]">
          Completing sign in
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          We&apos;re linking your Google account to Forehand.
        </p>
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <p className="text-xs text-[var(--color-muted)]">Please wait a moment...</p>
        )}
      </div>
    </div>
  );
}
