"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  SearchIcon,
  CheckIcon,
  XIcon,
  EllipsisIcon,
} from "@/components/Icons";
import { toQuery } from "@/lib/utils";

type ParticipantStatus = "pending" | "confirmed" | "rejected";

type Participant = {
  id: string;
  name: string;
  role: string;
  age: string;
  avatar: string;
  status: ParticipantStatus;
};

const DUMMY_PARTICIPANTS: Participant[] = [
  {
    id: "1",
    name: "Anil Kumar",
    role: "Power Player",
    age: "under 20",
    avatar: "AK",
    status: "pending",
  },
  {
    id: "2",
    name: "Rahul Singh",
    role: "Power Player",
    age: "under 20",
    avatar: "RS",
    status: "confirmed",
  },
  {
    id: "3",
    name: "Priya Patel",
    role: "Power Player",
    age: "under 20",
    avatar: "PP",
    status: "rejected",
  },
  {
    id: "4",
    name: "John Doe",
    role: "Power Player",
    age: "under 20",
    avatar: "JD",
    status: "confirmed",
  },
  {
    id: "5",
    name: "Emily Chen",
    role: "Power Player",
    age: "under 20",
    avatar: "EC",
    status: "pending",
  },
  {
    id: "6",
    name: "Kunal Verma",
    role: "Power Player",
    age: "under 20",
    avatar: "KV",
    status: "confirmed",
  },
];

type FilterTab = "all" | "pending" | "confirmed";

export default function EventParticipantsPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const tournamentId = searchParams.get("tournamentId") || "1";
  const eventId = searchParams.get("eventId") || "1";

  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [participants, setParticipants] =
    useState<Participant[]>(DUMMY_PARTICIPANTS);

  const filtered = participants.filter((p) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "confirmed"
        ? p.status === "confirmed"
        : p.status === "pending");
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = participants.filter(
    (p) => p.status === "pending",
  ).length;

  const updateStatus = (id: string, status: ParticipantStatus) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p)),
    );
  };

  const handleProceed = () => {
    router.push(
      "/org/tournaments/event/fixture" + toQuery({ tournamentId, eventId }),
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-[var(--color-surface-elevated)] transition-colors text-[var(--color-text)]"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="font-semibold text-[var(--color-text)] text-lg">
          Participant Confirmation
        </h1>
      </div>

      {/* Event Info */}
      <div className="bg-[var(--color-surface)] px-4 py-3 border-b border-[var(--color-border)]">
        <h2 className="font-bold text-base text-[var(--color-text)]">
          Pickle Ball Men&apos;s 2025
        </h2>
        <p className="text-sm text-[var(--color-muted)] mt-0.5">
          Under 20 | 24 Dec 2025, 9:00 AM
        </p>
        <p className="text-xs text-orange-500 font-medium mt-1">
          {pendingCount} Registration Pending
        </p>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 pb-28">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(["all", "pending", "confirmed"] as FilterTab[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-orange-500 text-white"
                  : "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]"
              }`}
            >
              {f === "all"
                ? "All"
                : f === "confirmed"
                  ? "Confirmed"
                  : "Pending"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            type="text"
            placeholder="Search Participants by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Participants List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-[var(--color-muted)]">
              No participants found.
            </div>
          )}
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-[var(--color-surface)] rounded-xl p-3 border border-[var(--color-border)] shadow-sm"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                  {p.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[var(--color-text)] truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {p.role} • {p.age}
                  </p>
                </div>

                {/* Actions based on status */}
                {p.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => updateStatus(p.id, "confirmed")}
                      className="px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(p.id, "rejected")}
                      className="px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {p.status === "confirmed" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateStatus(p.id, "confirmed")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-semibold"
                    >
                      <CheckIcon size={12} /> Confirm
                    </button>
                    <button className="text-[var(--color-muted)] p-1">
                      <EllipsisIcon size={18} />
                    </button>
                  </div>
                )}

                {p.status === "rejected" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                      <XIcon size={14} className="text-red-500" />
                    </div>
                    <button className="text-[var(--color-muted)] p-1">
                      <EllipsisIcon size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] z-40">
        <button
          onClick={handleProceed}
          className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]"
          style={{ background: "var(--gradient-orange)" }}
        >
          Save and Proceed
        </button>
      </div>
    </div>
  );
}
