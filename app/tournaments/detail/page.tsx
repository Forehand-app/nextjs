"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TournamentHeroCard from "@/components/TournamentHeroCard";
import {
  ArrowLeftIcon,
  CalendarIcon,
  InfoIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "@/components/Icons";
import { tournamentApi } from "@/lib/api/tournamentApi";
import { TournamentData, EventData } from "@/lib/models";
import { toQuery } from "@/lib/utils";

type MainTab = "about" | "events";
type PairStep = "idle" | "adding" | "invited" | "pairing" | "paired";

function PersonChip({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[14px]">
      <div className="h-6 w-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,#d1d1d1,#7b7b7b)]" />
      <span>{name}</span>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return "TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TournamentDetailPage() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );
  const router = useRouter();
  const [tournament, setTournament] = useState<TournamentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    let active = true;
    const loadInfo = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await tournamentApi.getInfo(id);
        if (active) {
          setTournament(data);
        }
      } catch (err) {
        console.error("Failed to load tournament info", err);
        if (active) setError("Failed to load tournament details.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadInfo();
    return () => {
      active = false;
    };
  }, [id]);

  const [tab, setTab] = useState<MainTab>("about");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [pairState, setPairState] = useState<PairStep>("idle");
  const [partnerPhone, setPartnerPhone] = useState("");

  const total = useMemo(() => {
    if (!tournament?.events) return 0;
    return tournament.events
      .filter((ev) => ev.id && selected[ev.id])
      .reduce((sum, ev) => sum + (ev.amount ?? 0), 0);
  }, [selected, tournament]);

  const toggleEvent = (ev: EventData) => {
    if (!ev.id) return;
    const current = Boolean(selected[ev.id]);
    const isDoubles =
      ev.teamTypeCode?.toLowerCase().includes("double") ||
      ev.teamType?.label?.toLowerCase().includes("double");

    if (current) {
      setSelected((prev) => ({ ...prev, [ev.id!]: false }));
      if (isDoubles) {
        setPairState("idle");
        setPartnerPhone("");
      }
      return;
    }
    setSelected((prev) => ({ ...prev, [ev.id!]: true }));
    if (isDoubles && pairState === "idle") setPairState("adding");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] p-4 text-center">
        <p className="text-[var(--color-error)]">
          {error || "Tournament not found"}
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 rounded-full bg-primary px-6 py-2 font-semibold text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24 text-[var(--color-text)]">
      <div>
        <TournamentHeroCard
          title={tournament.name}
          subtitle={tournament.organization?.name || "Organizer"}
          registeredCount={0} // TODO: Add registeredCount to TournamentData if needed
          registrationStatus={
            tournament.tournamentState === "published" ? "Open" : "Closed"
          }
          logoUrl={tournament.logoUrl}
          onBack={() => router.back()}
        />
      </div>

      <div className="sticky top-0 z-30 grid grid-cols-2 border-y border-[var(--color-border)] bg-[var(--color-surface)]">
        <button
          onClick={() => setTab("about")}
          className={`h-10 text-[18px] font-semibold ${tab === "about" ? "border-b-2 border-primary text-primary" : "text-[var(--color-muted)]"}`}
        >
          About
        </button>
        <button
          onClick={() => setTab("events")}
          className={`h-10 text-[18px] font-semibold ${tab === "events" ? "border-b-2 border-primary text-primary" : "text-[var(--color-muted)]"}`}
        >
          Events
        </button>
      </div>

      <div className="space-y-3 p-3 pb-28">
        {tab === "about" ? (
          <>
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <h2 className="text-[18px] font-semibold">Overview</h2>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-2">
                  <p className="text-[12px] text-[var(--color-muted)]">
                    Start Date
                  </p>
                  <p className="text-[14px]">
                    {formatDate(tournament.startDate)}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-2">
                  <p className="text-[12px] text-[var(--color-muted)]">
                    End Date
                  </p>
                  <p className="text-[14px]">
                    {formatDate(tournament.endDate)}
                  </p>
                </div>
              </div>
              <div className="mt-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-2">
                <p className="text-[12px] text-[var(--color-muted)]">
                  Venue Details
                </p>
                <p className="text-[14px]">
                  {tournament.venueName}, {tournament.venueAddress},{" "}
                  {tournament.venueCity}, {tournament.venueState}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <h2 className="text-[18px] font-semibold">Description</h2>
              <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">
                {tournament.description || "No description provided."}
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <h2 className="text-[18px] font-semibold">Contact Information</h2>

              <div className="mt-3">
                <div className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[radial-gradient(circle_at_30%_30%,#d1d1d1,#7b7b7b)] flex items-center justify-center text-white font-bold">
                        {tournament.contactName?.charAt(0).toUpperCase() || "O"}
                      </div>
                      <p className="text-[16px] font-medium">
                        {tournament.contactName}
                      </p>
                    </div>

                    <span className="rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-white">
                      Organizer
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-[14px]">
                    <a
                      href={`tel:${tournament.contactPhone}`}
                      className="flex items-center gap-2 text-[var(--color-muted)] hover:text-primary transition-colors"
                    >
                      <PhoneIcon size={14} />
                      {tournament.contactPhone}
                    </a>

                    <a
                      href={`mailto:${tournament.contactEmail}`}
                      className="flex items-center gap-2 text-[var(--color-muted)] hover:text-primary transition-colors break-all"
                    >
                      <MailIcon size={14} />
                      {tournament.contactEmail}
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          tournament.events?.map((ev) => {
            if (!ev.id) return null;
            const isSelected = Boolean(selected[ev.id]);
            const isDoubles =
              ev.teamTypeCode?.toLowerCase().includes("double") ||
              ev.teamType?.label?.toLowerCase().includes("double");
            return (
              <section
                key={ev.id}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
              >
                <h3 className="text-[18px] font-semibold">{ev.name}</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[12px] text-[var(--color-text-secondary)]">
                  <p className="flex items-center gap-1.5">
                    <CalendarIcon size={12} className="text-primary" />
                    Start Date: {formatDate(ev.startDate)}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <SearchIcon size={12} className="text-primary" />
                    Reg. Closes: {formatDate(ev.dueDate)}
                  </p>
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <p className="text-[24px] font-semibold leading-7 text-primary">
                      {ev.amount === 0 ? (
                        "Free Entry"
                      ) : (
                        <>
                          <span className="currency-inr">&#8377;</span>
                          {ev.amount}
                        </>
                      )}
                    </p>
                    <p className="text-[14px] text-[var(--color-muted)]">
                      Payment:{" "}
                      {ev.paymentMode?.label || ev.paymentModeCode || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleEvent(ev)}
                    className={`inline-flex h-9 min-w-[102px] items-center justify-center gap-1 rounded-full border px-4 text-[16px] font-semibold ${isSelected ? "border-primary bg-primary text-white" : "border-primary text-primary"}`}
                  >
                    {isSelected ? (
                      "Added"
                    ) : (
                      <>
                        <PlusIcon size={12} /> Add
                      </>
                    )}
                  </button>
                </div>

                {isDoubles && isSelected ? (
                  <div className="mt-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3">
                    {pairState === "adding" ? (
                      <>
                        <p className="text-[18px] font-semibold">
                          Add your partner
                        </p>
                        <input
                          value={partnerPhone}
                          onChange={(e) => setPartnerPhone(e.target.value)}
                          placeholder="Enter partner's Phone No."
                          className="mt-2 h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-[14px] outline-none"
                        />
                        <p className="mt-1 flex items-start gap-1 text-[11px] text-[var(--color-muted)]">
                          <InfoIcon size={11} className="mt-0.5" />
                          Your partner must be registered on the app to enroll.
                        </p>
                        <button
                          onClick={() => setPairState("invited")}
                          className="mt-2 h-9 w-full rounded-full border border-primary text-[16px] font-semibold text-primary"
                        >
                          Add Partner
                        </button>
                      </>
                    ) : null}

                    {pairState === "invited" ? (
                      <>
                        <p className="text-[18px] font-semibold">
                          Add your partner
                        </p>
                        <div className="mt-2 flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-2 text-[14px]">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,#d1d1d1,#7b7b7b)]" />
                            <span>Anil Kumar</span>
                          </div>
                          <span className="rounded-md bg-[var(--color-chip)] px-2 py-0.5 text-[10px] text-primary">
                            Invite Pending
                          </span>
                        </div>
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--color-muted)]">
                          <InfoIcon size={11} />
                          Waiting for Anil Kumar to accept the invite.
                        </p>
                        <button
                          onClick={() => setPairState("pairing")}
                          className="mt-2 h-9 w-full rounded-full border border-primary text-[16px] font-semibold text-primary"
                        >
                          Continue
                        </button>
                      </>
                    ) : null}

                    {pairState === "pairing" ? (
                      <>
                        <div className="flex items-center gap-2">
                          <ArrowLeftIcon size={14} />
                          <p className="text-[18px] font-semibold">
                            Create Your Pair
                          </p>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <PersonChip name="You" />
                          <button
                            onClick={() => setPairState("adding")}
                            className="flex items-center justify-center gap-1 rounded-lg bg-[#ffd9d9] px-3 py-2 text-[15px] text-[#ef4444]"
                          >
                            <TrashIcon size={12} />
                            Remove
                          </button>
                        </div>
                        <button
                          onClick={() => setPairState("paired")}
                          className="mt-2 h-9 w-full rounded-full border border-primary text-[16px] font-semibold text-primary"
                        >
                          Confirm Your Pair
                        </button>
                      </>
                    ) : null}

                    {pairState === "paired" ? (
                      <div className="grid grid-cols-2 gap-2">
                        <PersonChip name="You" />
                        <PersonChip name="Anil Kumar" />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>
            );
          })
        )}
      </div>

      {tab === "about" ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-3 pb-[max(env(safe-area-inset-bottom),12px)]">
          <button
            onClick={() => setTab("events")}
            className="h-11 w-full rounded-full bg-primary text-[18px] font-semibold text-white"
          >
            Select Event
          </button>
        </div>
      ) : total > 0 ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)] p-3 pb-[max(env(safe-area-inset-bottom),12px)]">
          <div className="flex items-center gap-3">
            <div className="min-w-[110px]">
              <p className="text-[14px] text-[var(--color-muted)]">
                Total Amount:
              </p>
              <p className="text-[24px] font-bold leading-7 text-primary">
                <span className="currency-inr">&#8377;</span>
                {total}
              </p>
            </div>
            <Link
              href={`/tournaments/checkout${toQuery({ id })}`}
              className="grid h-11 flex-1 place-content-center rounded-full bg-primary text-[18px] font-semibold text-white"
            >
              Claim Spot
            </Link>
          </div>
        </div>
      ) : null}

      {tab === "events" && total > 0 ? <div className="h-24" /> : null}
    </div>
  );
}
