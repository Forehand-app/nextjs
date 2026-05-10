"use client";

import React, { useState } from "react";
import { ParticipantData } from "@/lib/models";

type ParticipantListProps = {
  participants: ParticipantData[];
  eventName: string;
  pendingCount?: number;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onSaveAndProceed?: () => void;
  searchPlaceholder?: string;
};

export default function ParticipantList({
  participants,
  eventName,
  pendingCount = 0,
  onAccept,
  onReject,
  onSaveAndProceed,
  searchPlaceholder = "Search participants by name",
}: ParticipantListProps) {
  const [search, setSearch] = useState("");
  const filtered = participants.filter(
    (p) =>
      !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{eventName}</h2>
        {pendingCount > 0 && (
          <p className="text-sm text-[var(--color-muted)]">
            {pendingCount} registration pending
          </p>
        )}
      </div>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={searchPlaceholder}
        className="w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]"
        aria-label="Search participants"
      />
      <ul className="space-y-2">
        {filtered.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-3 p-3 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <div className="min-w-0">
              <span className="font-medium">{p.name}</span>
              {p.ageCategory && (
                <span className="ml-2 text-sm text-[var(--color-muted)]">
                  {p.ageCategory}
                </span>
              )}
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  p.status === "confirmed"
                    ? "bg-[var(--color-success)]/20 text-[var(--color-success)]"
                    : p.status === "pending"
                      ? "bg-primary/20 text-primary"
                      : "bg-[var(--color-error)]/20 text-[var(--color-error)]"
                }`}
              >
                {p.status}
              </span>
            </div>
            {p.status === "pending" && (
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onAccept(p.id)}
                  className="min-h-[44px] min-w-[44px] px-3 rounded-[var(--radius-button)] bg-[var(--color-success)] text-white text-sm font-medium"
                  aria-label={`Accept ${p.name}`}
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => onReject(p.id)}
                  className="min-h-[44px] min-w-[44px] px-3 rounded-[var(--radius-button)] bg-[var(--color-error)] text-white text-sm font-medium"
                  aria-label={`Reject ${p.name}`}
                >
                  Reject
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {onSaveAndProceed && (
        <button
          type="button"
          onClick={onSaveAndProceed}
          className="w-full min-h-[44px] rounded-[var(--radius-button)] bg-primary text-white font-medium"
        >
          Save and Proceed
        </button>
      )}
    </div>
  );
}
