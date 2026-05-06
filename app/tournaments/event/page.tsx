"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RegistrationEventCard from "@/components/Card/RegistrationEventCard";
import type { Event } from "@/types/models";
import { ArrowLeftIcon, InfoIcon, ShareIcon, TrashIcon, UsersIcon } from "@/components/Icons";
import { routes } from "@/lib/routes";
import { useClientSearchParams } from "@/lib/useClientSearchParams";

const mockEvents: Event[] = [
  { id: "e1", tournamentId: "1", name: "Men's Singles", sport: "Pickleball", format: "singles", startDate: "25 Oct 2025", regDueDate: "20 Oct 2025", entryFee: 1400, paymentOption: "online", status: "open" },
  { id: "e2", tournamentId: "1", name: "Men's Doubles", sport: "Pickleball", format: "doubles", startDate: "25 Oct 2025", regDueDate: "20 Oct 2025", entryFee: 1400, paymentOption: "venue", status: "open" },
  { id: "e3", tournamentId: "1", name: "Mixed Doubles", sport: "Pickleball", format: "mixed", startDate: "25 Oct 2025", regDueDate: "20 Oct 2025", entryFee: 0, paymentOption: "online", status: "open" },
];

type PairStep = "adding" | "invited" | "pairing" | "paired";

function PersonChip({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm">
      <div className="h-6 w-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,#d1d1d1,#7b7b7b)]" />
      <span>{name}</span>
    </div>
  );
}

export default function TournamentEventPage() {
  const searchParams = useClientSearchParams();
  const router = useRouter();
  const id = searchParams.get("id") || "1";

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pairStep, setPairStep] = useState<PairStep>("adding");

  const isSelected = (eventId: string) => selectedIds.includes(eventId);
  const toggleSelection = (event: Event) => {
    setSelectedIds((prev) => (prev.includes(event.id) ? prev.filter((entry) => entry !== event.id) : [...prev, event.id]));
  };

  const total = useMemo(() => mockEvents.filter((ev) => selectedIds.includes(ev.id)).reduce((sum, ev) => sum + (ev.entryFee ?? 0), 0), [selectedIds]);

  return (
    <div className="min-h-screen bg-background pb-24 text-text">
      {/* Hero header — primary brand color intentional */}
      <div className="bg-primary pb-4 pt-[max(env(safe-area-inset-top),12px)] text-primary-contrast">
        <div className="px-4">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="grid h-9 w-9 place-content-center rounded-full bg-white/35" aria-label="Back"><ArrowLeftIcon size={18} /></button>
            <button className="grid h-9 w-9 place-content-center rounded-full bg-white/35" aria-label="Share"><ShareIcon size={16} /></button>
          </div>

          <div className="mt-4 flex items-start gap-3">
            <div className="mt-1 grid h-12 w-12 place-content-center rounded-full border border-white/70 bg-[#f1f1f1] text-[10px] font-bold text-[#555]">SOFT</div>
            <div>
              <h1 className="text-[24px] font-semibold leading-8">Mumbai Men's 2025</h1>
              <p className="text-[13px] text-white/90">Andheri West Organization</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Stats cards on the orange banner — use surface/text tokens */}
            <div className="rounded-2xl bg-surface px-3 py-2 text-text">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-content-center rounded-full border border-border text-primary"><UsersIcon size={14} /></div>
                <span className="text-[30px] font-semibold leading-none">64</span>
              </div>
              <p className="mt-0.5 text-[13px] text-muted">Registered</p>
            </div>
            <div className="rounded-2xl bg-surface px-3 py-2 text-text">
              <p className="text-[20px] font-semibold leading-6">Registration</p>
              <div className="mt-2 grid h-6 place-content-center rounded-full bg-[#efe6d8] text-[11px] font-semibold text-primary">Open</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="grid grid-cols-2 border-y border-border bg-background">
        <Link href={routes.tournamentDetail(id)} className="grid h-10 place-content-center text-lg font-semibold text-muted">About</Link>
        <button className="h-10 border-b-2 border-primary text-lg font-semibold text-primary">Events</button>
      </div>

      {/* Event cards */}
      <div className="space-y-3 p-3 pb-28">
        {mockEvents.map((event) => {
          const selected = isSelected(event.id);
          const showPairBox = event.format === "doubles" && selected;

          return (
            <RegistrationEventCard key={event.id} event={event} isSelected={selected} onSelect={() => toggleSelection(event)} onDeselect={() => toggleSelection(event)}>
              {showPairBox ? (
                <div className="rounded-2xl border border-border bg-surface p-3">
                  {pairStep === "adding" ? (
                    <>
                      <p className="text-xl font-semibold">Add your partner</p>
                      <input
                        placeholder="Enter partner's Phone No."
                        className="surface-input mt-2 h-10 w-full px-3 text-sm"
                      />
                      <p className="mt-1 flex items-start gap-1 text-xs text-muted"><InfoIcon size={11} className="mt-0.5" />Your partner must be registered on the app to enroll.</p>
                      <button onClick={() => setPairStep("invited")} className="mt-2 h-9 w-full rounded-full border border-primary text-base font-semibold text-primary">Add Partner</button>
                    </>
                  ) : null}

                  {pairStep === "invited" ? (
                    <>
                      <p className="text-xl font-semibold">Add your partner</p>
                      <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-surface-elevated p-2 text-sm">
                        <div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,#d1d1d1,#7b7b7b)]" /><span>Anil Kumar</span></div>
                        <span className="rounded-md bg-[#fff2e7] px-2 py-0.5 text-[10px] text-primary">Invite Pending</span>
                      </div>
                      <button onClick={() => setPairStep("pairing")} className="mt-2 h-9 w-full rounded-full border border-primary text-base font-semibold text-primary">Continue</button>
                    </>
                  ) : null}

                  {pairStep === "pairing" ? (
                    <>
                      <p className="text-xl font-semibold">Create Your Pair</p>
                      <div className="mt-2 grid grid-cols-2 gap-2"><PersonChip name="You" /><button onClick={() => setPairStep("adding")} className="flex items-center justify-center gap-1 rounded-lg bg-[#ffd9d9] px-3 py-2 text-sm text-error"><TrashIcon size={12} />Remove</button></div>
                      <button onClick={() => setPairStep("paired")} className="mt-2 h-9 w-full rounded-full border border-primary text-base font-semibold text-primary">Confirm Your Pair</button>
                    </>
                  ) : null}

                  {pairStep === "paired" ? <div className="grid grid-cols-2 gap-2"><PersonChip name="You" /><PersonChip name="Anil Kumar" /></div> : null}
                </div>
              ) : null}
            </RegistrationEventCard>
          );
        })}
      </div>

      {/* Checkout bar */}
      {total > 0 ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background p-3 pb-[max(env(safe-area-inset-bottom),12px)]">
          <div className="flex items-center gap-3">
            <div className="min-w-[110px]"><p className="text-sm text-muted">Total Amount:</p><p className="text-4xl font-bold leading-9 text-primary"><span className="currency-inr">&#8377;</span>{total}</p></div>
            <Link href={routes.tournamentCheckout(id)} className="grid h-11 flex-1 place-content-center rounded-full bg-primary text-xl font-semibold text-primary-contrast">Claim Spot</Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
