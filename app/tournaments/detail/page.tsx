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
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  TimerIcon,
  TrashIcon,
} from "@/components/Icons";
import { tournamentApi } from "@/lib/api/tournamentApi";
import { TournamentData, EventData } from "@/lib/models";
import { toQuery } from "@/lib/utils";
import { useApp } from "@/components/AppProvider";

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
  const { userProfile } = useApp();
  const [tournament, setTournament] = useState<TournamentData | null>(null);
  const [joinedTournaments, setJoinedTournaments] = useState<TournamentData[]>(
    [],
  );
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
        const [data, joined] = await Promise.all([
          tournamentApi.getInfo(id),
          tournamentApi.getJoinedTournaments(),
        ]);
        if (active) {
          setTournament(data);
          setJoinedTournaments(joined);
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

  const isAlreadyRegistered = (eventId: string) => {
    return joinedTournaments.some((jt) =>
      jt.events?.some((e) => e.id === eventId),
    );
  };

  const total = useMemo(() => {
    if (!tournament?.events) return 0;
    return tournament.events
      .filter((ev) => ev.id && selected[ev.id])
      .reduce((sum, ev) => sum + (ev.amount ?? 0), 0);
  }, [selected, tournament]);

  const toggleEvent = (ev: EventData) => {
    if (!ev.id || isAlreadyRegistered(ev.id)) return;
    const isEligible = !ev.gender || ev.gender === userProfile?.gender;
    if (!isEligible) return;

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

      <div className="sticky top-0 z-30 flex items-center justify-center bg-[var(--color-background)]">
        <button
          onClick={() => setTab("about")}
          className={`relative flex h-12 flex-1 items-center justify-center text-[16px] font-bold transition-all ${tab === "about" ? "text-[var(--color-text)]" : "text-[var(--color-text-secondary)] opacity-50"}`}
        >
          About
          <div
            className={`absolute bottom-0 h-[2px] w-full ${tab === "about" ? "bg-[#ff7a1a]" : "bg-[var(--color-border)]"}`}
          />
        </button>
        <button
          onClick={() => setTab("events")}
          className={`relative flex h-12 flex-1 items-center justify-center text-[16px] font-bold transition-all ${tab === "events" ? "text-[var(--color-text)]" : "text-[var(--color-text-secondary)] opacity-50"}`}
        >
          Events
          <div
            className={`absolute bottom-0 h-[2px] w-full ${tab === "events" ? "bg-[#ff7a1a]" : "bg-[var(--color-border)]"}`}
          />
        </button>
      </div>

      <div className="space-y-6 p-4 pb-32">
        {tab === "about" ? (
          <>
            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
              <h2 className="text-[22px] font-bold text-[var(--color-text)]">
                Overview
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3">
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)] opacity-60">
                    <TimerIcon size={12} />
                    <span className="text-[11px] font-medium uppercase tracking-wider">
                      Start Date
                    </span>
                  </div>
                  <p className="text-[13px] font-bold text-[var(--color-text)]">
                    {formatDateTime(tournament.startDate)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3">
                  <div className="flex items-center gap-2 text-[var(--color-text-secondary)] opacity-60">
                    <TimerIcon size={12} />
                    <span className="text-[11px] font-medium uppercase tracking-wider">
                      End Date
                    </span>
                  </div>
                  <p className="text-[13px] font-bold text-[var(--color-text)]">
                    {formatDateTime(tournament.endDate)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)] opacity-60">
                  <MapPinIcon size={12} />
                  <span className="text-[11px] font-medium uppercase tracking-wider">
                    Venue Details
                  </span>
                </div>
                <p className="text-[13px] font-bold leading-relaxed text-[var(--color-text)]">
                  {tournament.venueName}, {tournament.venueAddress},{" "}
                  {tournament.venueCity}, {tournament.venueState}
                </p>
              </div>
            </section>

            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
              <h2 className="text-[22px] font-bold text-[var(--color-text)]">
                Description
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                {tournament.description ||
                  "Join the biggest badminton tournament in the city! Open to all skill levels with exciting prizes."}
              </p>
            </section>

            <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
              <h2 className="text-[22px] font-bold text-[var(--color-text)] mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-full border border-[var(--color-border)] shadow-md">
                        <img
                          src={
                            tournament.organization?.logoUrl ||
                            "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=100&h=100"
                          }
                          alt="Contact"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-[20px] font-bold text-[var(--color-text)]">
                        {tournament.contactName}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#22c55e] px-4 py-1.5 text-[14px] font-bold text-white shadow-lg shadow-green-500/20">
                      Organizer
                    </span>
                  </div>

                  <div className="ml-[72px] space-y-3">
                    <a
                      href={`tel:${tournament.contactPhone}`}
                      className="flex items-center gap-3 text-[18px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
                    >
                      <PhoneIcon size={20} className="text-[#ff7a1a]" />
                      {tournament.contactPhone}
                    </a>

                    <a
                      href={`mailto:${tournament.contactEmail}`}
                      className="flex items-center gap-3 text-[18px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)] break-all"
                    >
                      <MailIcon size={20} className="text-[#ff7a1a]" />
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
            const registered = isAlreadyRegistered(ev.id);
            const isEligible = !ev.gender || ev.gender === userProfile?.gender;

            const isDoubles =
              ev.teamTypeCode?.toLowerCase().includes("double") ||
              ev.teamType?.label?.toLowerCase().includes("double");
            return (
              <section
                key={ev.id}
                className={`rounded-3xl border p-5 shadow-lg ${isSelected ? "border-[#ff7a1a] bg-[#ff7a1a]/5" : registered ? "border-green-500 bg-green-500/5" : !isEligible ? "border-red-500/20 bg-red-500/5 opacity-80" : "border-[var(--color-border)] bg-[var(--color-surface-elevated)]"}`}
              >
                <h3 className="text-[20px] font-bold text-[var(--color-text)]">
                  {ev.name}
                  {!isEligible && (
                    <span className="ml-2 text-[10px] uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                      {ev.gender} only
                    </span>
                  )}
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)] opacity-60">
                    <CalendarIcon size={14} className="text-[#ff7a1a]" />
                    <span>Starts: {formatDate(ev.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)] opacity-60">
                    <SearchIcon size={14} className="text-[#ff7a1a]" />
                    <span>Closes: {formatDate(ev.dueDate)}</span>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-5">
                  <div>
                    <p className="text-[24px] font-bold text-[#ff7a1a]">
                      {ev.amount === 0 ? (
                        "Free Entry"
                      ) : (
                        <>
                          <span className="currency-inr mr-0.5">&#8377;</span>
                          {ev.amount}
                        </>
                      )}
                    </p>
                    {ev.amount > 0 && ev.paymentMode !== undefined && (
                      <p className="mt-1 text-[12px] font-medium text-[var(--color-text-secondary)] opacity-60 uppercase tracking-wider">
                        {ev.paymentMode?.label || ev.paymentModeCode || "N/A"}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleEvent(ev)}
                    disabled={registered || !isEligible}
                    className={`inline-flex h-11 min-w-[120px] items-center justify-center gap-2 rounded-full border-2 px-6 text-[16px] font-bold transition-all active:scale-95 ${isSelected ? "border-[#ff7a1a] bg-[#ff7a1a] text-white shadow-lg shadow-orange-500/20" : registered ? "border-green-500 bg-green-500 text-white cursor-default" : !isEligible ? "border-red-500/50 text-red-500 bg-red-500/10 cursor-not-allowed" : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] hover:border-gray-400"}`}
                  >
                    {isSelected ? (
                      "Added"
                    ) : registered ? (
                      "Registered"
                    ) : !isEligible ? (
                      "Ineligible"
                    ) : (
                      <>
                        <PlusIcon size={14} /> Add
                      </>
                    )}
                  </button>
                </div>

                {isDoubles && isSelected ? (
                  <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
                    {pairState === "adding" ? (
                      <>
                        <p className="text-[18px] font-bold text-[var(--color-text)]">
                          Add your partner
                        </p>
                        <input
                          value={partnerPhone}
                          onChange={(e) => setPartnerPhone(e.target.value)}
                          placeholder="Enter partner's Phone No."
                          className="mt-3 h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 text-[15px] text-[var(--color-text)] outline-none focus:border-[#ff7a1a]/50"
                        />
                        <div className="mt-3 flex items-start gap-2 text-[12px] text-[var(--color-text-secondary)]">
                          <InfoIcon
                            size={14}
                            className="mt-0.5 text-[#ff7a1a]"
                          />
                          <p>
                            Your partner must be registered on the app to
                            enroll.
                          </p>
                        </div>
                        <button
                          onClick={() => setPairState("invited")}
                          className="mt-4 h-11 w-full rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[16px] font-bold text-[var(--color-text)] transition-all hover:bg-[var(--color-border)] active:scale-95"
                        >
                          Add Partner
                        </button>
                      </>
                    ) : null}

                    {pairState === "invited" ? (
                      <>
                        <p className="text-[18px] font-bold text-white">
                          Add your partner
                        </p>
                        <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-[15px]">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600" />
                            <span className="font-medium text-white">
                              Anil Kumar
                            </span>
                          </div>
                          <span className="rounded-lg bg-[#ff7a1a]/20 px-2.5 py-1 text-[11px] font-bold text-[#ff7a1a]">
                            Invite Pending
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-[12px] text-white/50">
                          <InfoIcon size={14} className="text-[#ff7a1a]" />
                          <p>Waiting for Anil Kumar to accept the invite.</p>
                        </div>
                        <button
                          onClick={() => setPairState("pairing")}
                          className="mt-4 h-11 w-full rounded-full bg-[#ff7a1a] text-[16px] font-bold text-white shadow-lg shadow-orange-500/20 active:scale-95"
                        >
                          Continue
                        </button>
                      </>
                    ) : null}

                    {pairState === "pairing" ? (
                      <>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPairState("adding")}
                            className="text-white/60 hover:text-white"
                          >
                            <ArrowLeftIcon size={18} />
                          </button>
                          <p className="text-[18px] font-bold text-white">
                            Create Your Pair
                          </p>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <PersonChip name="You" />
                          <button
                            onClick={() => setPairState("adding")}
                            className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-[14px] font-bold text-red-400 transition-all hover:bg-red-500/20"
                          >
                            <TrashIcon size={14} />
                            Remove
                          </button>
                        </div>
                        <button
                          onClick={() => setPairState("paired")}
                          className="mt-4 h-11 w-full rounded-full bg-[#ff7a1a] text-[16px] font-bold text-white shadow-lg shadow-orange-500/20 active:scale-95"
                        >
                          Confirm Your Pair
                        </button>
                      </>
                    ) : null}

                    {pairState === "paired" ? (
                      <div className="grid grid-cols-2 gap-3">
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
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-background)] p-5 pb-[max(env(safe-area-inset-bottom),20px)]">
          <button
            onClick={() => setTab("events")}
            className="h-16 w-full rounded-full bg-[#ff811f] text-[20px] font-bold text-white shadow-lg active:scale-[0.98] transition-transform"
          >
            Select Event
          </button>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-background)] p-5 pb-[max(env(safe-area-inset-bottom),20px)] transition-transform">
          <div className="flex items-center gap-4">
            {Object.values(selected).some((v) => v) ? (
              <>
                <div className="flex-1">
                  <p className="text-[12px] font-medium text-[var(--color-text-secondary)] uppercase tracking-widest opacity-60">
                    Total Amount
                  </p>
                  <p className="text-[28px] font-bold leading-tight text-[#ff7a1a]">
                    <span className="currency-inr mr-1">&#8377;</span>
                    {total}
                  </p>
                </div>
                <Link
                  href={`/tournaments/checkout${toQuery({
                    id,
                    selected: Object.keys(selected)
                      .filter((k) => selected[k])
                      .join(","),
                  })}`}
                  className="flex h-16 min-w-[180px] items-center justify-center rounded-full bg-[#ff811f] text-[20px] font-bold text-white shadow-lg active:scale-[0.98] transition-transform"
                >
                  Claim Spot
                </Link>
              </>
            ) : (
              <button
                disabled
                className="h-16 w-full rounded-full bg-[var(--color-surface)] text-[20px] font-bold text-[var(--color-text-secondary)] opacity-30 border border-[var(--color-border)]"
              >
                Select an Event
              </button>
            )}
          </div>
        </div>
      )}

      {tab === "events" && total > 0 ? <div className="h-24" /> : null}
    </div>
  );
}
