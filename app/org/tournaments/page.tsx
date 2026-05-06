"use client";

import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import Tabs, { type TabItem } from "@/components/Tabs";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useAppSession } from "@/components/AppSessionProvider";
import { TrophyIcon, MapPinIcon, CalendarIcon, WalletIcon, FilterIcon, EditIcon, UsersIcon } from "@/components/Icons";
import { routes } from "@/lib/routes";


const tabs: TabItem[] = [
  { id: "live", label: "Live" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "drafts", label: "Drafts" },
];

type TournamentEvent = {
  id?: string;
  name?: string | null;
  amount?: number | null;
  gender?: "male" | "female" | null;
  sportsOption?: {
    name?: string | null;
    code?: string | null;
  } | null;
};

type OrgTournament = {
  id: string;
  name?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  venueName?: string | null;
  venueCity?: string | null;
  venueState?: string | null;
  venueCourts?: number | null;
  events?: TournamentEvent[];
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

function formatDate(value?: string | null) {
  if (!value) return "Date TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getTournamentStatus(tournament: OrgTournament): "live" | "upcoming" | "past" {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = tournament.startDate ? new Date(tournament.startDate) : null;
  const endDate = tournament.endDate ? new Date(tournament.endDate) : startDate;

  if (startDate && !Number.isNaN(startDate.getTime())) {
    startDate.setHours(0, 0, 0, 0);
  }

  if (endDate && !Number.isNaN(endDate.getTime())) {
    endDate.setHours(0, 0, 0, 0);
  }

  if (endDate && endDate < today) return "past";
  if (startDate && startDate > today) return "upcoming";
  return "live";
}

function getPrimarySport(tournament: OrgTournament) {
  return (
    tournament.events?.[0]?.sportsOption?.name ||
    tournament.events?.[0]?.sportsOption?.code ||
    "No events"
  );
}

function getEntryFee(tournament: OrgTournament) {
  const paidEvent = tournament.events?.find((event) => Number(event.amount) > 0);
  return paidEvent ? `₹${paidEvent.amount} Entry` : "Free Entry";
}

function getGenderLabel(tournament: OrgTournament) {
  const gender = tournament.events?.find((event) => event.gender)?.gender;
  if (gender === "male") return "Men's";
  if (gender === "female") return "Women's";
  return "Open";
}

export default function OrgTournamentsPage() {
  const [activeTab, setActiveTab] = useState("live");
  const { session } = useAuth();
  const { activeOrgId, organization } = useAppSession();
  const [showFilters, setShowFilters] = useState(false);
  const [tournaments, setTournaments] = useState<OrgTournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const orgId =
    activeOrgId ||
    (typeof organization?.id === "string" ? organization.id : null);

  useEffect(() => {
    let isActive = true;

    const loadTournaments = async () => {
      if (!session?.access_token || !orgId) {
        setIsLoading(false);
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBaseUrl) {
        setErrorMessage("Tournament service is not configured.");
        setIsLoading(false);
        return;
      }

      try {
        setErrorMessage("");
        setIsLoading(true);
        const response = await fetch(`${apiBaseUrl}/tournament/list/org/${orgId}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        const result = (await response.json().catch(() => null)) as
          | ApiResponse<OrgTournament[]>
          | null;

        if (!response.ok || result?.success === false) {
          throw new Error(result?.message || "Unable to load tournaments.");
        }

        if (isActive) {
          setTournaments(Array.isArray(result?.data) ? result.data : []);
        }
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load organization tournaments", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load tournaments.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadTournaments();

    return () => {
      isActive = false;
    };
  }, [orgId, session]);

  const visibleTournaments = useMemo(
    () =>
      tournaments.filter((tournament) => {
        if (activeTab === "drafts") return false;
        return getTournamentStatus(tournament) === activeTab;
      }),
    [activeTab, tournaments],
  );

  return (
    <Layout title="Tournaments">
      <div className="p-4 space-y-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-lg">Your Tournaments</h1>
            <p className="text-sm text-[var(--color-muted)]">
              Create and manage your tournaments
            </p>
          </div>
          <Link
            href="/org/tournaments/create"
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ background: "var(--gradient-orange)" }}
          >
            +
          </Link>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm"
        >
          <FilterIcon size={16} className="text-[var(--color-muted)]" />
          <span className="text-[var(--color-muted)]">Filters</span>
        </button>

        {/* Tabs */}
        <Tabs
          tabs={tabs}
          activeId={activeTab}
          onChange={setActiveTab}
          ariaLabel="Tournament status"
        />

        {/* Tournament List */}
        {activeTab !== "drafts" && activeTab !== "past" && (
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-center text-sm text-[var(--color-muted)] py-8">
                Loading tournaments...
              </p>
            ) : errorMessage ? (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
            ) : visibleTournaments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto bg-[var(--color-surface-elevated)] rounded-full flex items-center justify-center mb-4">
                  <TrophyIcon size={32} className="text-[var(--color-muted)]" />
                </div>
                <p className="text-[var(--color-muted)]">
                  No {activeTab} tournaments
                </p>
                <p className="text-sm text-[var(--color-muted)]">
                  Create a tournament to get started
                </p>
              </div>
            ) : visibleTournaments.map((t) => (
              <Link
                key={t.id}
                href={routes.orgTournamentDetail(t.id)}
                className="card p-4 block hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrophyIcon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{t.name || "Untitled Tournament"}</h4>
                      <p className="text-xs text-[var(--color-muted)]">
                        {t.description || getPrimarySport(t)}
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary"
                  >
                    {getGenderLabel(t)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
                  <span className="flex items-center gap-1"><MapPinIcon size={12} /> {[t.venueCity, t.venueState].filter(Boolean).join(" | ") || t.venueName || "Venue TBA"}</span>
                  <span className="flex items-center gap-1"><UsersIcon size={12} /> {t.events?.length ?? 0} events</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--color-muted)] mt-1">
                  <span className="flex items-center gap-1"><CalendarIcon size={12} /> {formatDate(t.startDate)}</span>
                  <span className="flex items-center gap-1"><WalletIcon size={12} /> {getEntryFee(t)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Past Tab - Empty State */}
        {activeTab === "past" && (
          <div className="space-y-3">
            {isLoading ? (
              <p className="text-center text-sm text-[var(--color-muted)] py-8">
                Loading tournaments...
              </p>
            ) : visibleTournaments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto bg-[var(--color-surface-elevated)] rounded-full flex items-center justify-center mb-4">
                  <TrophyIcon size={32} className="text-[var(--color-muted)]" />
                </div>
                <p className="text-[var(--color-muted)]">No past tournaments</p>
                <p className="text-sm text-[var(--color-muted)]">
                  Completed tournaments will appear here
                </p>
              </div>
            ) : visibleTournaments.map((t) => (
              <Link
                key={t.id}
                href={routes.orgTournamentDetail(t.id)}
                className="card p-4 block hover:border-primary/30 transition-colors"
              >
                <h4 className="font-semibold">{t.name || "Untitled Tournament"}</h4>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  {formatDate(t.startDate)} · {getPrimarySport(t)} · {t.events?.length ?? 0} events
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Drafts Tab */}
        {activeTab === "drafts" && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-[var(--color-surface-elevated)] rounded-full flex items-center justify-center mb-4">
              <EditIcon size={32} className="text-[var(--color-muted)]" />
            </div>
            <p className="text-[var(--color-muted)]">No drafts</p>
            <p className="text-sm text-[var(--color-muted)]">
              Draft tournaments will appear here
            </p>
          </div>
        )}

        {/* Filters Modal */}
        {showFilters && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setShowFilters(false)}
            />
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface)] rounded-t-2xl p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Refine Results</h3>
                <button className="text-primary text-sm">Reset All</button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Sport
                </label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Table Tennis", "Badminton", "Padel", "Pickleball", "Squash"].map(
                    (sport) => (
                      <button
                        key={sport}
                        className={`px-3 py-1.5 rounded-full text-sm ${sport === "All"
                          ? "bg-primary text-white"
                          : "bg-[var(--color-surface-elevated)] hover:border-primary"
                          }`}
                      >
                        {sport}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Search location
                </label>
                <input
                  type="text"
                  placeholder="Type city or venue..."
                  className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Raipur", "Indore", "Goa", "Delhi", "Mumbai"].map((city) => (
                    <span
                      key={city}
                      className="px-3 py-1 rounded-full text-xs bg-[var(--color-surface-elevated)]"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Schedule Window
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="DD-MM-YYYY"
                    className="px-4 py-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] text-sm"
                  />
                  <input
                    type="text"
                    placeholder="DD-MM-YYYY"
                    className="px-4 py-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] text-sm"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3 rounded-xl font-semibold text-white"
                style={{ background: "var(--gradient-orange)" }}
              >
                Apply Changes
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

