"use client";

import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import Tabs, { type TabItem } from "@/components/Tabs";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { TrophyIcon, MapPinIcon, CalendarIcon, WalletIcon, FilterIcon, EditIcon, UsersIcon } from "@/components/Icons";
import { toQuery } from "@/lib/utils";
import { tournamentApi } from "@/lib/api/tournamentApi";
import { TournamentData } from "@/lib/models";
import OrgTournamentCard from "@/components/OrgTournamentCard";


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
  if (tournament.tournamentState === "draft") return "drafts";

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

        const loadedTournaments = await tournamentApi.getOrganizationTournaments(orgId!);

        if (isActive) {
          const tList = Array.isArray(loadedTournaments) ? [...loadedTournaments] : [];
          
          if (!tList.find(t => t.id === "dummy-system-1")) {
            tList.unshift({
              id: "dummy-system-1",
              organizationId: orgId || "org-1",
              name: "System Dummy Tournament",
              description: "A dummy tournament showing various event states",
              startDate: new Date().toISOString(),
              venueName: "Dummy Arena",
              venueAddress: "123 Fake St",
              venueCity: "Mumbai",
              venueState: "MH",
              venuePostalCode: "400001",
              venueCourts: 4,
              contactName: "Admin",
              contactEmail: "admin@dummy.com",
              contactPhone: "9999999999",
              tournamentState: "live",
              events: [
                {
                  id: "dummy-1",
                  tournamentId: "dummy-system-1",
                  name: "Men's Singles (Just Created)",
                  startDate: new Date().toISOString(),
                  dueDate: new Date().toISOString(),
                  pointsPerSet: 21,
                  setsPerMatch: 3,
                  amount: 500,
                  eventState: "created",
                  teams: []
                },
                {
                  id: "dummy-2",
                  tournamentId: "dummy-system-1",
                  name: "Women's Doubles (In Progress)",
                  startDate: new Date().toISOString(),
                  dueDate: new Date().toISOString(),
                  pointsPerSet: 21,
                  setsPerMatch: 3,
                  amount: 1000,
                  eventState: "in_progress",
                  teams: [{}, {}, {}, {}] as any
                },
                {
                  id: "dummy-3",
                  tournamentId: "dummy-system-1",
                  name: "Mixed Doubles (Completed)",
                  startDate: new Date().toISOString(),
                  dueDate: new Date().toISOString(),
                  pointsPerSet: 21,
                  setsPerMatch: 3,
                  amount: 800,
                  eventState: "completed",
                  teams: [{}, {}, {}, {}, {}, {}, {}, {}] as any
                }
              ]
            } as TournamentData);
          }

          setTournaments(tList);
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
              <OrgTournamentCard
                key={t.id}
                id={t.id || ""}
                name={t.name || "Untitled Tournament"}
                subtitle={t.description || getPrimarySport(t)}
                badgeLabel={getGenderLabel(t)}
                location={[t.venueCity, t.venueState].filter(Boolean).join(", ") || t.venueName || "Venue TBA"}
                eventsCount={t.events?.length ?? 0}
                date={formatDate(t.startDate)}
                entryFee={getEntryFee(t)}
                href={`/org/tournaments/detail${toQuery({ t: t.id })}`}
              />
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
              <OrgTournamentCard
                key={t.id}
                id={t.id || ""}
                name={t.name || "Untitled Tournament"}
                subtitle={getPrimarySport(t)}
                badgeLabel="Completed"
                location={[t.venueCity, t.venueState].filter(Boolean).join(", ") || t.venueName || "Venue TBA"}
                eventsCount={t.events?.length ?? 0}
                date={formatDate(t.startDate)}
                entryFee={getEntryFee(t)}
                href={`/org/tournaments/detail${toQuery({ t: t.id })}`}
              />
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

      </div>
    </Layout>
  );
}

