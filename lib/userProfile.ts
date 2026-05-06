import type { Session, User } from "@supabase/supabase-js";

export type UserProfile = {
  id?: string;
  name?: string | null;
  phone?: string | null;
  gender?: string | null;
  dob?: string | null;
  playingHand?: string | null;
  primarySport?: string | null;
};

type UserProfileResponse = {
  success?: boolean;
  message?: string;
  data?: UserProfile | null;
};

export function getUserDisplayName(user: User | null): string {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    ""
  );
}

export function formatDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  return value.split("T")[0] ?? "";
}

export async function fetchUserProfile(session: Session | null): Promise<UserProfile | null> {
  if (!session?.access_token) {
    throw new Error("Please sign in again to load your profile.");
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("Profile service is not configured.");
  }

  const response = await fetch(`${apiBaseUrl}/user/profile`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const result = (await response.json().catch(() => null)) as
    | UserProfileResponse
    | null;

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || "Unable to load your profile.");
  }

  return result?.data ?? null;
}
