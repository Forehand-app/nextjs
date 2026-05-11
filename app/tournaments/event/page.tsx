"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RegistrationEventCard from "@/components/Card/RegistrationEventCard";
import { EventData } from "@/lib/models";
import { ArrowLeftIcon, ShareIcon, UsersIcon } from "@/components/Icons";
import { toQuery } from "@/lib/utils";

const mockEvents: EventData[] = [
  {
    id: "e1",
    tournamentId: "1",
    name: "Men's Singles",
    sportsOptionCode: "Pickleball",
    eventFormatCode: "singles",
    startDate: "25 Oct 2025",
    dueDate: "20 Oct 2025",
    amount: 1400,
    paymentModeCode: "online",
    eventState: "created",
    pointsPerSet: 11,
    setsPerMatch: 3,
  },
  {
    id: "e2",
    tournamentId: "1",
    name: "Men's Doubles",
    sportsOptionCode: "Pickleball",
    eventFormatCode: "doubles",
    startDate: "25 Oct 2025",
    dueDate: "20 Oct 2025",
    amount: 1400,
    paymentModeCode: "venue",
    eventState: "created",
    pointsPerSet: 11,
    setsPerMatch: 3,
  },
  {
    id: "e3",
    tournamentId: "1",
    name: "Mixed Doubles",
    sportsOptionCode: "Pickleball",
    eventFormatCode: "mixed",
    startDate: "25 Oct 2025",
    dueDate: "20 Oct 2025",
    amount: 0,
    paymentModeCode: "online",
    eventState: "created",
    pointsPerSet: 11,
    setsPerMatch: 3,
  },
];

export default function TournamentEventPage() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );
  const router = useRouter();

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const id = searchParams.get("id") || "1";

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isSelected = (eventId: string) => selectedIds.includes(eventId);
  const toggleSelection = (event: EventData) => {
    if (!event.id) return;
    setSelectedIds((prev) =>
      prev.includes(event.id!)
        ? prev.filter((entry) => entry !== event.id)
        : [...prev, event.id!],
    );
  };

  const total = useMemo(
    () =>
      mockEvents
        .filter((ev) => ev.id && selectedIds.includes(ev.id))
        .reduce((sum, ev) => sum + (ev.amount ?? 0), 0),
    [selectedIds],
  );

  return (
    <div className="min-h-screen bg-background pb-24 text-text">
      {/* Hero header — primary brand color intentional */}
      <div className="bg-primary pb-4 pt-[max(env(safe-area-inset-top),12px)] text-primary-contrast">
        <div className="px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="grid h-9 w-9 place-content-center rounded-full bg-white/35"
              aria-label="Back"
            >
              <ArrowLeftIcon size={18} />
            </button>
            <button
              className="grid h-9 w-9 place-content-center rounded-full bg-white/35"
              aria-label="Share"
            >
              <ShareIcon size={16} />
            </button>
          </div>

          <div className="mt-4 flex items-start gap-3">
            <div className="mt-1 grid h-12 w-12 place-content-center rounded-full border border-white/70 bg-[#f1f1f1] text-[10px] font-bold text-[#555]">
              SOFT
            </div>
            <div>
              <h1 className="text-[24px] font-semibold leading-8">
                Mumbai Men's 2025
              </h1>
              <p className="text-[13px] text-white/90">
                Andheri West Organization
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Stats cards on the orange banner — use surface/text tokens */}
            <div className="rounded-2xl bg-surface px-3 py-2 text-text">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-content-center rounded-full border border-border text-primary">
                  <UsersIcon size={14} />
                </div>
                <span className="text-[30px] font-semibold leading-none">
                  64
                </span>
              </div>
              <p className="mt-0.5 text-[13px] text-muted">Registered</p>
            </div>
            <div className="rounded-2xl bg-surface px-3 py-2 text-text">
              <p className="text-[20px] font-semibold leading-6">
                Registration
              </p>
              <div className="mt-2 grid h-6 place-content-center rounded-full bg-[#efe6d8] text-[11px] font-semibold text-primary">
                Open
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="grid grid-cols-2 border-y border-border bg-background">
        <Link
          href={"/tournaments/detail" + toQuery({ id })}
          className="grid h-10 place-content-center text-lg font-semibold text-muted"
        >
          About
        </Link>

        <button className="h-10 border-b-2 border-primary text-lg font-semibold text-primary">
          Events
        </button>
      </div>

      {/* Event cards */}
      <div className="space-y-3 p-3 pb-28">
        {mockEvents.map((event) => {
          if (!event.id) return null;
          const selected = isSelected(event.id);

          return (
            <RegistrationEventCard
              key={event.id}
              event={event}
              onAddedChange={(eventId, isAdded) => {
                if (isAdded && !selectedIds.includes(eventId)) {
                  setSelectedIds((prev) => [...prev, eventId]);
                } else if (!isAdded && selectedIds.includes(eventId)) {
                  setSelectedIds((prev) => prev.filter((id) => id !== eventId));
                }
              }}
              isInitiallyAdded={selected}
            />
          );
        })}
      </div>

      {/* Checkout bar */}
      {total > 0 ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background p-3 pb-[max(env(safe-area-inset-bottom),12px)]">
          <div className="flex items-center gap-3">
            <div className="min-w-[110px]">
              <p className="text-sm text-muted">Total Amount:</p>
              <p className="text-4xl font-bold leading-9 text-primary">
                <span className="currency-inr">&#8377;</span>
                {total}
              </p>
            </div>
            <Link
              href={"/tournaments/checkout" + toQuery({ id })}
              className="grid h-11 flex-1 place-content-center rounded-full bg-primary text-xl font-semibold text-primary-contrast"
            >
              Claim Spot
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
