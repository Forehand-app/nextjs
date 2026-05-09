"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, EllipsisIcon, CalendarIcon, TrophyIcon } from "@/components/Icons";
import { routes } from "@/lib/routes";
import { useClientSearchParams } from "@/lib/useClientSearchParams";

// ─── Types ────────────────────────────────────────────────────────────────────

type SetScore = { a: string; b: string };

type MatchRow = {
  id: string;
  status: "upcoming" | "live" | "ended";
  label: string;
  scheduledDate: string;
  scheduledTime: string;
  sideA: { initials: string; name: string };
  sideB: { initials: string; name: string };
  setsWonA: number;
  setsWonB: number;
  sets: SetScore[];
  winner?: "a" | "b";
  court?: string;
  scorer?: string;
};

type FilterId = "all" | "upcoming" | "past" | "ongoing";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DUMMY_MATCHES: MatchRow[] = [
  {
    id: "m-1",
    status: "live",
    label: "Match 1",
    scheduledDate: "01 May 25",
    scheduledTime: "05:00 AM",
    sideA: { initials: "KV", name: "Team A" },
    sideB: { initials: "KV", name: "Team B" },
    setsWonA: 1,
    setsWonB: 0,
    sets: [
      { a: "02", b: "04" },
      { a: "04", b: "03" },
      { a: "--", b: "--" },
    ],
    court: "Court 1",
    scorer: "Scorer 3",
  },
  {
    id: "m-2",
    status: "ended",
    label: "Match 1",
    scheduledDate: "01 May 25",
    scheduledTime: "05:00 AM",
    sideA: { initials: "KV", name: "Kunal Verma" },
    sideB: { initials: "AK", name: "Anil Kumar" },
    setsWonA: 3,
    setsWonB: 0,
    sets: [
      { a: "20", b: "18" },
      { a: "18", b: "14" },
      { a: "12", b: "08" },
    ],
    winner: "a",
    court: "Court 1",
    scorer: "Scorer 3",
  },
  {
    id: "m-3",
    status: "upcoming",
    label: "Match 1",
    scheduledDate: "DD/MM",
    scheduledTime: "--:--",
    sideA: { initials: "", name: "Team A" },
    sideB: { initials: "", name: "Team B" },
    setsWonA: 0,
    setsWonB: 0,
    sets: [
      { a: "--", b: "--" },
      { a: "--", b: "--" },
      { a: "--", b: "--" },
    ],
    court: "Select Court",
    scorer: "Select Scorer",
  },
];

const ROUNDS = ["Round 1", "Round 2", "Round 3"];
const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "ongoing", label: "Ongoing" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlayerAvatar({
  initials,
  status,
}: {
  initials: string;
  status?: "live" | "ended";
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-12 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex items-center justify-center text-sm font-bold text-[var(--color-text)]">
        {initials || <span className="text-[var(--color-muted)] text-lg">+</span>}
      </div>
      {status === "live" && (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Live
        </span>
      )}
      {status === "ended" && (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--color-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-muted)] inline-block" />
          Ended
        </span>
      )}
    </div>
  );
}

function SetScoreGrid({ sets }: { sets: SetScore[] }) {
  return (
    <div className="flex border border-[var(--color-border)] rounded-xl overflow-hidden mt-3">
      {sets.map((s, i) => (
        <div
          key={i}
          className={`flex-1 text-center py-2 ${i < sets.length - 1 ? "border-r border-[var(--color-border)]" : ""}`}
        >
          <p className="text-[10px] text-[var(--color-muted)] font-medium mb-1">
            Set {i + 1}
          </p>
          <p className="text-sm font-bold text-[var(--color-text)]">
            {s.a === "--" ? (
              <span className="text-[var(--color-muted)]">--</span>
            ) : (
              <>{s.a} - {s.b}</>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}

function MatchCard({
  match,
  tournamentId,
  eventId,
}: {
  match: MatchRow;
  tournamentId: string;
  eventId: string;
}) {
  const headerBg =
    match.status === "live"
      ? "bg-green-500"
      : match.status === "ended"
      ? "bg-green-600"
      : "bg-green-500";

  const scoreA = String(match.setsWonA).padStart(2, "0");
  const scoreB = String(match.setsWonB).padStart(2, "0");

  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm bg-[var(--color-surface)]">
      {/* Green header bar */}
      <div className={`${headerBg} px-4 py-2.5 flex items-center justify-center`}>
        <span className="text-white font-bold text-sm">{match.label}</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Date / Time row */}
        <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
          <div className="flex items-center gap-1.5">
            <CalendarIcon size={12} />
            <span>{match.scheduledDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{match.scheduledTime}</span>
          </div>
        </div>

        {/* Players + Score */}
        <div className="flex items-center justify-between gap-2">
          {/* Side A */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <PlayerAvatar
              initials={match.sideA.initials}
              status={match.status === "live" ? "live" : match.status === "ended" ? "ended" : undefined}
            />
            <span className="text-xs font-medium text-[var(--color-text)] text-center leading-tight">
              {match.sideA.name}
            </span>
          </div>

          {/* Center score */}
          <div className="flex flex-col items-center flex-shrink-0">
            {match.status === "upcoming" ? (
              <span className="text-base font-bold text-[var(--color-muted)]">VS</span>
            ) : (
              <>
                <span className="text-[10px] text-[var(--color-muted)] font-semibold mb-0.5">Sets Won</span>
                <span className="text-2xl font-black text-[var(--color-text)] leading-none">
                  {scoreA} - {scoreB}
                </span>
              </>
            )}
          </div>

          {/* Side B */}
          <div className="flex flex-col items-center gap-1 flex-1">
            <PlayerAvatar initials={match.sideB.initials} />
            <span className="text-xs font-medium text-[var(--color-text)] text-center leading-tight">
              {match.sideB.name}
            </span>
          </div>
        </div>

        {/* Court / Scorer pills */}
        <div className="flex gap-2 justify-center">
          <span className="text-[11px] px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium">
            {match.court}
          </span>
          <span className="text-[11px] px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium">
            {match.scorer}
          </span>
        </div>

        {/* Set score grid */}
        <SetScoreGrid sets={match.sets} />

        {/* Winner label for ended matches */}
        {match.status === "ended" && match.winner && (
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <TrophyIcon size={14} className="text-orange-500" />
            <span className="text-sm font-semibold text-[var(--color-text)]">
              {match.winner === "a" ? match.sideA.name : match.sideB.name}
            </span>
          </div>
        )}

        {/* CTA for live/upcoming */}
        {match.status !== "ended" && (
          <Link
            href={routes.orgMatchSetup(tournamentId, eventId, match.id)}
            className="block w-full py-3 rounded-full text-center text-sm font-bold text-white transition-all active:scale-[0.98]"
            style={{ background: "var(--gradient-orange)" }}
          >
            {match.status === "live" ? "Manage Match" : "Start Match"}
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrgManageMatchesPage() {
  const router = useRouter();
  const searchParams = useClientSearchParams();
  const tournamentId = searchParams.get("tournamentId") || "1";
  const eventId = searchParams.get("eventId") || "1";

  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [activeRound, setActiveRound] = useState("Round 1");

  const filtered = useMemo(() => {
    return DUMMY_MATCHES.filter((m) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "upcoming") return m.status === "upcoming";
      if (activeFilter === "past") return m.status === "ended";
      if (activeFilter === "ongoing") return m.status === "live";
      return true;
    });
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-[var(--color-surface-elevated)] transition-colors text-[var(--color-text)]"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="font-bold text-base text-[var(--color-text)]">Manage Matches</h1>
      </div>

      <div className="flex-1 p-4 space-y-4 pb-24">

        {/* ── Tournament Info Card ── */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
            <TrophyIcon size={22} className="text-orange-500" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[var(--color-text)] text-sm truncate">Mumbai Men&apos;s 2025</p>
            <p className="text-xs text-[var(--color-muted)] truncate">Andheri West Organization</p>
          </div>
        </div>

        {/* ── Event / Category Card ── */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-base text-[var(--color-text)]">Pickle Ball Men&apos;s 2025</h2>
              <p className="text-sm text-[var(--color-muted)] mt-0.5">
                Under 20 | 24 Dec 2025, 9:00 AM
              </p>
            </div>
            <button className="text-[var(--color-muted)] p-1">
              <EllipsisIcon size={20} />
            </button>
          </div>
          <p className="text-xs font-semibold text-orange-500 mt-2">Round of 64 ongoing</p>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === f.id
                  ? "bg-orange-500 text-white"
                  : "bg-[var(--color-surface-elevated)] text-[var(--color-muted)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Round Navigator ── */}
        <div className="flex items-center gap-2">
          {ROUNDS.map((round, i) => (
            <React.Fragment key={round}>
              <button
                onClick={() => setActiveRound(round)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  activeRound === round
                    ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                    : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)]"
                }`}
              >
                {round}
              </button>
              {i < ROUNDS.length - 1 && (
                <div className="flex-1 border-t-2 border-dashed border-[var(--color-border)]" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Match Cards ── */}
        <div className="space-y-5">
          {filtered.length === 0 ? (
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-muted)]">
              No matches found.
            </div>
          ) : (
            filtered.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                tournamentId={tournamentId}
                eventId={eventId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
