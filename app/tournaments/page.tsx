"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  BellIcon,
  CalendarIcon,
  ChevronRightIcon,
  FilterIcon,
  MapPinIcon,
  SearchIcon,
} from "@/components/Icons";
import Layout from "@/components/Layout";
import { toQuery } from "@/lib/utils";

type TopTab = "browse" | "joined" | "history";
type FormatTab = "all" | "singles" | "doubles";

type TournamentItem = {
  id: string;
  name: string;
  subtitle: string;
  start: string;
  end: string;
  entry?: string;
  location: string;
  players: string;
  cta: "Register" | "View" | "Chevron";
  joinedStatus?: string;
};

const baseSubtitle = "Pickle ball | Men's | Multiple Modes";

const browseItems: TournamentItem[] = [
  {
    id: "1",
    name: "Monsoon Pickleball Op..",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    players: "50+ More",
    cta: "Register",
  },
  {
    id: "2",
    name: "Monsoon Pickleball Op..",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    players: "50+ More",
    cta: "Register",
  },
  {
    id: "3",
    name: "Monsoon Pickleball Op..",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    players: "50+ More",
    cta: "Register",
  },
];

const joinedItems: TournamentItem[] = [
  {
    id: "4",
    name: "Monsoon Pickleball Op..",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    players: "50+ More",
    cta: "View",
  },
  {
    id: "5",
    name: "Monsoon Pickleball Op..",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    players: "50+ More",
    cta: "View",
  },
  {
    id: "6",
    name: "Monsoon Pickleball Op..",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    players: "50+ More",
    cta: "View",
  },
];

const historyItems: TournamentItem[] = [
  {
    id: "7",
    name: "Champions league",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    location: "Raipur | Chattisgarh",
    players: "",
    cta: "Chevron",
    joinedStatus: "Eliminated - Round 4",
  },
  {
    id: "8",
    name: "Champions league",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    location: "Raipur | Chattisgarh",
    players: "",
    cta: "Chevron",
    joinedStatus: "Eliminated - Round 4",
  },
  {
    id: "9",
    name: "Champions league",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    location: "Raipur | Chattisgarh",
    players: "",
    cta: "Chevron",
    joinedStatus: "Eliminated - Round 4",
  },
  {
    id: "10",
    name: "Champions league",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    location: "Raipur | Chattisgarh",
    players: "",
    cta: "Chevron",
    joinedStatus: "Eliminated - Round 4",
  },
];

function TournamentCard({ item }: { item: TournamentItem }) {
  return (
    <Link
      href={`/tournaments/detail${toQuery({ id: item.id })}`}
      className="block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition hover:border-primary"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 grid h-12 w-12 shrink-0 place-content-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[10px] font-bold text-[var(--color-text-muted)]">
          SOFT
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[16px] font-bold leading-5 text-[var(--color-text)]">{item.name}</h3>
              <p className="truncate text-[12px] text-[var(--color-text-muted)]">{item.subtitle}</p>
            </div>
            {item.cta === "Chevron" ? (
              <ChevronRightIcon size={20} className="mt-1 text-[var(--color-text)]" />
            ) : null}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-y-2 text-[12px] text-[var(--color-text-muted)]">
            <div className="flex items-center gap-1.5">
              <CalendarIcon size={12} />
              <span>Start: {item.start}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarIcon size={12} />
              <span>End: {item.end}</span>
            </div>
            {item.entry ? (
              <div className="flex items-center gap-1.5">
                <span className="currency-inr text-primary font-bold">&#8377;</span> {item.entry}
              </div>
            ) : (
              <div className="h-4" />
            )}
            <div className="flex items-center gap-1.5">
              <MapPinIcon size={12} />
              <span>{item.location}</span>
            </div>
            {item.joinedStatus ? (
              <div className="col-span-2 text-[12px] flex items-center gap-1">
                <BellIcon size={12} className="text-primary" /> {item.joinedStatus}
              </div>
            ) : null}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-[var(--color-text-muted)]">
              <div className="flex -space-x-1">
                <div className="h-5 w-5 rounded-full bg-[#dbb27a] ring-1 ring-white dark:ring-[#1b1b1b]" />
                <div className="h-5 w-5 rounded-full bg-[#3ea3bf] ring-1 ring-white dark:ring-[#1b1b1b]" />
                <div className="h-5 w-5 rounded-full bg-[#2d6d94] ring-1 ring-white dark:ring-[#1b1b1b]" />
              </div>
              {item.players ? <span>{item.players}</span> : null}
            </div>

            {item.cta === "Register" || item.cta === "View" ? (
              <span className="inline-flex h-8 min-w-[92px] items-center justify-center rounded-full border border-primary px-4 text-[14px] font-semibold text-primary">
                {item.cta}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState<TopTab>("browse");
  const [format, setFormat] = useState<FormatTab>("all");

  const list = useMemo(() => {
    if (activeTab === "joined") return joinedItems;
    if (activeTab === "history") return historyItems;
    return browseItems;
  }, [activeTab]);

  return (
    <Layout title="Tournaments">
      <div className="bg-[var(--color-surface)] px-4 pb-3 pt-4 border-b border-[var(--color-border)]">
        <label className="flex h-10 items-center gap-2 rounded-xl bg-[var(--color-surface-elevated)] px-3 text-[var(--color-text-muted)] border border-[var(--color-border)]">
          <SearchIcon size={16} />
          <input
            type="text"
            placeholder="Search tournaments, cities..."
            className="w-full bg-transparent text-[14px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </label>

        <div className="mt-4 grid grid-cols-3 text-center text-[15px]">
          {(["browse", "joined", "history"] as TopTab[]).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-10 capitalize border-b-2 transition-colors ${active
                    ? "border-primary font-semibold text-[var(--color-text)]"
                    : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
        <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
          <button className="grid h-9 w-9 shrink-0 place-content-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-primary">
            <FilterIcon size={14} />
          </button>
          {([
            { id: "all", label: "All Formats" },
            { id: "singles", label: "Singles" },
            { id: "doubles", label: "Doubles" },
          ] as { id: FormatTab; label: string }[]).map((tab) => {
            const active = format === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFormat(tab.id)}
                className={`h-9 shrink-0 rounded-xl border px-6 text-[14px] font-medium transition-colors ${active
                    ? "border-primary bg-primary text-white"
                    : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 px-4 pb-8 pt-4">
        {activeTab === "browse" ? (
          <>
            <h2 className="text-[18px] font-semibold text-[var(--color-text)]">Trending Tournaments</h2>
            {list.map((item) => (
              <TournamentCard key={item.id} item={item} />
            ))}
            <h2 className="pt-2 text-[18px] font-semibold text-[var(--color-text)]">Tournaments Near You</h2>
            {browseItems.map((item) => (
              <TournamentCard key={`near-${item.id}`} item={item} />
            ))}
          </>
        ) : (
          list.map((item) => <TournamentCard key={item.id} item={item} />)
        )}
      </div>
    </Layout>
  );
}

