"use client";

import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import Tabs, { type TabItem } from "@/components/Tabs";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { TrophyIcon, MapPinIcon, CalendarIcon, WalletIcon, FilterIcon, EditIcon, UsersIcon } from "@/components/Icons";
import { toQuery } from "@/lib/utils";
import { tournamenApi } from "@/lib/api/tournamentApi";
import { TournamentData } from "@/lib/models";


const tabs: TabItem[] = [
  { id: "live", label: "Live" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "drafts", label: "Drafts" },
];
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

function getTournamentStatus(tournament: TournamentData): "live" | "upcoming" | "past" | "drafts" {
  if (tournament.touenamentState === "draft") return "drafts";

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

function getPrimarySport(tournament: TournamentData) {
  return (
    tournament.events?.[0]?.sportsOption?.label ||
    tournament.events?.[0]?.sportsOption?.code ||
    "No events"
  );
}

function getEntryFee(tournament: TournamentData) {
  const paidEvent = tournament.events?.find((event) => Number(event.amount) > 0);
  return paidEvent ? `₹${paidEvent.amount} Entry` : "Free Entry";
}

function getGenderLabel(tournament: TournamentData) {
  const gender = tournament.events?.find((event) => event.gender)?.gender;
  if (gender === "male") return "Men's";
  if (gender === "female") return "Women's";
  return "Open";
}

export default function OrgTournamentsPage() {
  const [activeTab, setActiveTab] = useState("live");
  const { activeOrganization } = useApp();
  const activeOrgId = activeOrganization?.id ?? null;
  const [showFilters, setShowFilters] = useState(false);
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const orgId = activeOrgId;

  useEffect(() => {
    let isActive = true;

    const loadTournaments = async () => {
      try {
        setErrorMessage("");
        setIsLoading(true);

        const tournaments = await tournamenApi.getOrganizationTournaments(orgId!);

        if (isActive) {
          setTournaments(Array.isArray(tournaments) ? tournaments : []);
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
  }, [orgId]);

  const visibleTournaments = useMemo(
    () =>
      tournaments.filter((tournament) => {
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
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-sm text-[var(--color-muted)] py-8">
                Loading tournaments...
              </p>
            ) : errorMessage ? (
              <p className="rounded-xl border border-[var(--color-border)] bg-red-500/10 px-4 py-3 text-sm font-medium text-[var(--color-error)]">
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
                href={`/org/tournaments/detail${toQuery({ t: t.id })}`}
                className="relative flex flex-col p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] hover:shadow-[var(--shadow-card-hover)] transition-all overflow-hidden"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <TrophyIcon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[var(--color-text)] leading-tight">{t.name || "Untitled Tournament"}</h4>
                      <p className="text-sm text-[var(--color-muted)] mt-1">
                        {t.description || getPrimarySport(t)}
                      </p>
                    </div>
                  </div>
                  <span
                    className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]"
                  >
                    {getGenderLabel(t)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                    <MapPinIcon size={16} className="shrink-0" />
                    <span className="truncate">{[t.venueCity, t.venueState].filter(Boolean).join(", ") || t.venueName || "Venue TBA"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                    <UsersIcon size={16} className="shrink-0" />
                    <span>{t.events?.length ?? 0} Events</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                    <CalendarIcon size={16} className="shrink-0" />
                    <span>{formatDate(t.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                    <WalletIcon size={16} className="shrink-0" />
                    <span>{getEntryFee(t)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Past Tab - Empty State */}
        {activeTab === "past" && (
          <div className="space-y-4">
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
                href={`/org/tournaments/detail${toQuery({ t: t.id })}`}
                className="relative block p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] hover:shadow-[var(--shadow-card-hover)] transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <TrophyIcon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[var(--color-text)] leading-tight">{t.name || "Untitled Tournament"}</h4>
                      <p className="text-sm text-[var(--color-muted)] mt-1">{getPrimarySport(t)}</p>
                    </div>
                  </div>
                  <div className="text-[var(--color-muted)] flex-shrink-0 mt-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                      <MapPinIcon size={16} className="shrink-0" />
                      <span className="truncate">{[t.venueCity, t.venueState].filter(Boolean).join(", ") || t.venueName || "Venue TBA"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                      <CalendarIcon size={16} className="shrink-0" />
                      <span>{formatDate(t.startDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                    <UsersIcon size={16} className="shrink-0" />
                    <span>{t.events?.length ?? 0} Events</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Drafts Tab */}
        {activeTab === "drafts" && (
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-sm text-[var(--color-muted)] py-8">
                Loading drafts...
              </p>
            ) : visibleTournaments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto bg-[var(--color-surface-elevated)] rounded-full flex items-center justify-center mb-4">
                  <EditIcon size={32} className="text-[var(--color-muted)]" />
                </div>
                <p className="text-[var(--color-muted)]">No drafts</p>
                <p className="text-sm text-[var(--color-muted)]">
                  Draft tournaments will appear here
                </p>
              </div>
            ) : visibleTournaments.map((t) => (
              <div
                key={t.id}
                className="relative block p-5 bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-card)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <TrophyIcon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[var(--color-text)] leading-tight">{t.name || "Untitled Draft"}</h4>
                      <p className="text-sm text-[var(--color-muted)] mt-1">{t.description || "Incomplete Setup"}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-[var(--badge-error-bg)] text-[var(--badge-error-text)] flex items-center justify-center shrink-0 hover:bg-red-500/20 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  </button>
                </div>

                <div className="h-px w-full bg-[var(--color-border)] mb-4"></div>

                <div className="mb-6">
                  <p className="text-sm text-[var(--color-muted)]">Created: {formatDate(t.startDate)}</p>
                </div>

                <Link
                  href={`/org/tournaments/detail${toQuery({ t: t.id })}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[var(--radius-button)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:border-primary transition-colors"
                >
                  <EditIcon size={18} />
                  <span>Complete Draft Setup</span>
                </Link>
              </div>
            ))}
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

