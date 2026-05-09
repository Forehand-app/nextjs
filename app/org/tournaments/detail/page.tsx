"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ShareIcon,
  EllipsisIcon,
  UsersIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  TrophyIcon,
  CheckIcon,
  FilterIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TrashIcon,
  PlusIcon,
} from "@/components/Icons";
import { toQuery } from "@/lib/utils";
import { tournamentApi } from "@/lib/api/tournamentApi";
import { EventData, TournamentData } from "@/lib/models";

function formatDate(value?: string | null) {
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

function genderLabel(gender?: string | null) {
  if (gender === "male") return "Men's";
  if (gender === "female") return "Women's";
  return "Open";
}

// ==========================================
// 1. SHARED COMPONENTS & TOURNAMENT HEADER
// ==========================================
const TopAppBar = () => (
  <div className="flex items-center justify-between">
    <Link
      href="/org/tournaments"
      className="w-10 h-10 rounded-full bg-[var(--color-surface)] shadow-sm flex items-center justify-center text-[var(--color-text)] border border-[var(--color-border)]"
    >
      <ArrowLeftIcon size={20} />
    </Link>
    <div className="flex gap-3">
      <button className="w-10 h-10 rounded-full bg-[var(--color-surface)] shadow-sm flex items-center justify-center text-[var(--color-text)] border border-[var(--color-border)]">
        <ShareIcon size={18} />
      </button>
      <button className="w-10 h-10 rounded-full bg-[var(--color-surface)] shadow-sm flex items-center justify-center text-[var(--color-text)] border border-[var(--color-border)]">
        <EllipsisIcon size={20} />
      </button>
    </div>
  </div>
);

const EventHeader = ({ tournament }: { tournament: TournamentData | null }) => (
  <div className="flex gap-3 items-center">
    <div className="w-12 h-12 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden shrink-0">
      <TrophyIcon size={24} className="text-[var(--color-muted)]" />
    </div>
    <div>
      <h1 className="font-semibold text-lg leading-tight text-[var(--color-text)]">
        {tournament?.name || "Tournament"}
      </h1>
      <p className="text-sm text-[var(--color-muted)] mt-0.5">
        {tournament?.organization?.name || "Organization"}
      </p>
    </div>
  </div>
);

const EventStats = ({ tournament }: { tournament: TournamentData | null }) => {
  const registeredCount =
    tournament?.events?.reduce(
      (total, event) =>
        total + (Array.isArray(event.teams) ? event.teams.length : 0),
      0,
    ) ?? 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-[var(--color-surface)] p-4 flex gap-3 items-center shadow-sm border border-[var(--color-border)]">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
          <UsersIcon size={20} />
        </div>
        <div>
          <p className="text-lg font-semibold text-[var(--color-text)] leading-tight">
            {registeredCount}
          </p>
          <p className="text-sm text-[var(--color-muted)]">Registered</p>
        </div>
      </div>
      <div className="rounded-xl bg-[var(--color-surface)] p-4 shadow-sm border border-[var(--color-border)]">
        <p className="font-medium text-[var(--color-text)] text-sm mb-2">
          Registration
        </p>
        <div className="flex gap-2">
          <button className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex-1 transition-transform active:scale-95">
            Open
          </button>
          <button className="bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] px-3 py-1 rounded-full text-xs font-medium flex-1 transition-transform active:scale-95">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const PrimaryTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => (
  <div className="flex justify-center my-2">
    <div className="flex gap-1 bg-[var(--color-surface-elevated)] p-1 rounded-full overflow-x-auto scrollbar-hide max-w-full items-center">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? "bg-orange-500 text-white shadow-sm" : "text-[var(--color-muted)] bg-transparent hover:text-[var(--color-text)]"}`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);

// ==========================================
// 2. TOURNAMENT LEVEL TABS (About, Events, Summary, Crew)
// ==========================================
const AboutTab = ({ tournament }: { tournament: TournamentData | null }) => {
  const venue = [
    tournament?.venueName,
    tournament?.venueAddress,
    tournament?.venueCity,
    tournament?.venueState,
    tournament?.venuePostalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="bg-[var(--color-surface)] rounded-xl p-4 space-y-4 shadow-sm border border-[var(--color-border)]">
        <h2 className="font-semibold text-[var(--color-text)]">Overview</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-[var(--color-border)] rounded-xl p-3 bg-[var(--color-surface-elevated)]">
            <p className="text-xs text-[var(--color-muted)] mb-1">Start Date</p>
            <p className="text-sm font-medium text-[var(--color-text)]">
              {formatDate(tournament?.startDate)}
            </p>
          </div>
          <div className="border border-[var(--color-border)] rounded-xl p-3 bg-[var(--color-surface-elevated)]">
            <p className="text-xs text-[var(--color-muted)] mb-1">End Date</p>
            <p className="text-sm font-medium text-[var(--color-text)]">
              {formatDate(tournament?.endDate)}
            </p>
          </div>
          <div className="border border-[var(--color-border)] rounded-xl p-3 bg-[var(--color-surface-elevated)] col-span-2 flex gap-3 items-start">
            <MapPinIcon
              size={18}
              className="text-[var(--color-muted)] shrink-0 mt-0.5"
            />
            <div>
              <p className="text-xs text-[var(--color-muted)] mb-1">Venue</p>
              <p className="text-sm font-medium text-[var(--color-text)] leading-snug">
                {venue || "Venue TBA"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[var(--color-surface)] rounded-xl p-4 shadow-sm border border-[var(--color-border)] mt-4">
        <h2 className="font-semibold text-[var(--color-text)] mb-2">
          Description
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {tournament?.description || "No description added."}
        </p>
      </div>
      <div className="bg-[var(--color-surface)] rounded-xl p-4 space-y-4 shadow-sm border border-[var(--color-border)] mt-4">
        <h2 className="font-semibold text-[var(--color-text)]">
          Contact Information
        </h2>
        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center overflow-hidden shrink-0 border border-[var(--color-border)]">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=PM&backgroundColor=f97316&textColor=ffffff`}
                alt="Piyush Mantri"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-medium text-[var(--color-text)]">
              {tournament?.contactName || "Contact person"}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] ml-1">
            <PhoneIcon
              size={16}
              className="text-[var(--color-muted)] shrink-0"
            />
            <p>{tournament?.contactPhone || "No phone added"}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] ml-1">
            <MailIcon
              size={16}
              className="text-[var(--color-muted)] shrink-0"
            />
            <p>{tournament?.contactEmail || "No email added"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

const StepRow = ({
  title,
  state,
  subtext,
  actionLabel,
  href,
  isLast = false,
}: any) => {
  const isCompleted = state === "completed";
  const isActive = state === "active";
  const isInactive = state === "inactive";

  const buttonClass = `px-3 py-1.5 rounded-full text-xs font-medium text-center transition-all inline-block ${isCompleted ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" : isActive ? "bg-orange-500 text-white hover:bg-orange-600 shadow-sm" : "bg-[var(--color-surface-elevated)] text-[var(--color-muted)] cursor-not-allowed"}`;

  return (
    <div className="flex gap-3 relative">
      <div className="flex flex-col items-center w-5 shrink-0">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center z-10 ${isCompleted ? "bg-green-500 text-white" : isActive ? "bg-orange-500 border-2 border-orange-500" : "bg-[var(--color-surface)] border-2 border-[var(--color-border)]"}`}
        >
          {isCompleted && <CheckIcon size={12} />}
        </div>
        {!isLast && (
          <div
            className={`w-px flex-1 my-1 border-l-2 ${isCompleted ? "border-green-500" : "border-dashed border-[var(--color-border)]"}`}
          />
        )}
      </div>
      <div className="flex justify-between w-full items-center pb-5 -mt-0.5">
        <div>
          <p
            className={`font-medium text-sm ${isInactive ? "text-[var(--color-muted)]" : "text-[var(--color-text)]"}`}
          >
            {title}
          </p>
          {subtext && (
            <p className="text-xs text-[var(--color-muted)] mt-0.5">
              {subtext}
            </p>
          )}
        </div>
        {isInactive || !href ? (
          <button disabled className={buttonClass}>
            {isCompleted
              ? "View"
              : isActive
                ? actionLabel || "Manage"
                : "Not Started"}
          </button>
        ) : (
          <Link href={href} className={buttonClass}>
            {isCompleted
              ? "View"
              : isActive
                ? actionLabel || "Manage"
                : "Not Started"}
          </Link>
        )}
      </div>
    </div>
  );
};

const EventsTab = ({
  tournamentId,
  events,
}: {
  tournamentId: string;
  events: EventData[];
}) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Upcoming", "Past", "Ongoing"];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeFilter === filter ? "bg-orange-500 text-white" : "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]"}`}
          >
            {filter}
          </button>
        ))}
      </div>
      {events.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-xl p-6 shadow-sm border border-[var(--color-border)] text-center text-sm text-[var(--color-muted)]">
          No events found for this tournament.
        </div>
      ) : (
        events.map((event, index) => {
          const eventId = event.id || String(index + 1);
          const participantCount = Array.isArray(event.teams)
            ? event.teams.length
            : 0;

          return (
            <div
              key={eventId}
              className="bg-[var(--color-surface)] rounded-xl p-4 shadow-sm border border-[var(--color-border)]"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">
                    {event.name || `Event ${index + 1}`}
                  </h3>
                  <p className="text-sm text-[var(--color-muted)] mt-0.5">
                    {[
                      genderLabel(event.gender),
                      event.sportsOption?.label || event.sportsOption?.code,
                      formatDate(event.startDate),
                    ]
                      .filter(Boolean)
                      .join(" | ")}
                  </p>
                </div>
                <button className="text-[var(--color-muted)]">
                  <EllipsisIcon size={20} />
                </button>
              </div>
              <div className="flex justify-between items-center mb-4">
                <button className="border border-[var(--color-border)] px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                  Extend Due Date
                </button>
                <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-green-100 text-green-700">
                  Active
                </span>
              </div>

              <div className="mt-2">
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-4">
                  Workflow Progress
                </p>

                {/* Linked exactly to your file routes */}
                <StepRow
                  title="Participants"
                  state="active"
                  subtext={`${participantCount} Teams Registered`}
                  actionLabel="Manage"
                  href={`/org/tournaments/event/fixture${toQuery({ tournamentId, eventId })}`}
                />
                <StepRow
                  title="Fixtures"
                  state="inactive"
                  actionLabel="Create"
                  href={`/org/tournaments/event/fixture${toQuery({ tournamentId, eventId })}`}
                />
                <StepRow
                  title="Matches"
                  state="inactive"
                  actionLabel="Manage"
                  href={`/org/tournaments/event/fixture${toQuery({ tournamentId, eventId })}`}
                />
                <StepRow
                  title="Results"
                  state="inactive"
                  actionLabel="View Champion"
                  isLast={true}
                  href={`/org/tournaments/event/fixture${toQuery({ tournamentId, eventId })}`}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

const SummaryTab = ({ events }: { events: EventData[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h2 className="font-semibold text-lg text-[var(--color-text)]">
          {events.length} Events
        </h2>
        <button className="flex items-center gap-1.5 text-sm font-medium text-orange-500">
          <FilterIcon size={16} /> Filter
        </button>
      </div>
      <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-[var(--color-text)]">
            {events[0]?.name || "No events yet"}
          </h3>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-full border bg-red-100 text-red-700 border-red-200">
              {" "}
              Round 2 Live
            </span>
            <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-full border bg-green-100 text-green-700 border-green-200">
              {" "}
              ₹
              {events.reduce(
                (sum, event) => sum + Number(event.amount || 0),
                0,
              )}{" "}
              Listed Fees
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-[var(--color-text-secondary)] bg-[var(--color-surface-elevated)] p-3 rounded-lg border border-[var(--color-border)]">
            <div>3 Matches left in round 1</div>
            <div className="text-right">2 Bye Players</div>
          </div>
          <div className="grid grid-cols-2 mt-3 pt-2">
            <div>
              <p className="text-xs text-[var(--color-muted)] mb-0.5">Teams</p>
              <p className="text-xl font-bold text-[var(--color-text)]">
                {events.reduce(
                  (sum, event) =>
                    sum + (Array.isArray(event.teams) ? event.teams.length : 0),
                  0,
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted)] mb-0.5">Events</p>
              <p className="text-xl font-bold text-[var(--color-text)]">
                {events.length}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 flex items-center justify-center gap-1 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            {isExpanded ? "View Less Details" : "View More Details"}
            <ChevronDownIcon
              size={14}
              className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
          {isExpanded && (
            <div className="px-4 pb-4 space-y-2">
              <div className="flex justify-between items-start py-2 group cursor-pointer">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-red-500" />
                  <div>
                    <p className="font-medium text-sm text-[var(--color-text)]">
                      Fixtures Setup Remaining
                    </p>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">
                      Round 2 pending generation
                    </p>
                  </div>
                </div>
                <ChevronRightIcon
                  size={16}
                  className="text-[var(--color-muted)] transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EventCrewTab = () => {
  const [activeRole, setActiveRole] = useState<"admin" | "scorer">("admin");
  const crewList = [
    {
      id: "1",
      name: "Alex Costa",
      role: "admin",
      inviteStatus: "accepted",
      initials: "AC",
    },
    {
      id: "2",
      name: "Mike Ross",
      role: "scorer",
      inviteStatus: "rejected",
      initials: "MR",
    },
  ];
  const displayedCrew = crewList.filter((m) => m.role === activeRole);

  return (
    <div className="space-y-2">
      <div className="flex border-b border-[var(--color-border)] mb-4">
        <button
          onClick={() => setActiveRole("admin")}
          className={`flex-1 pb-2 text-center text-sm font-medium transition-colors ${activeRole === "admin" ? "text-orange-500 border-b-2 border-orange-500" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"}`}
        >
          Admins
        </button>
        <button
          onClick={() => setActiveRole("scorer")}
          className={`flex-1 pb-2 text-center text-sm font-medium transition-colors ${activeRole === "scorer" ? "text-orange-500 border-b-2 border-orange-500" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"}`}
        >
          Scorers
        </button>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-2 mb-6">
        <p className="font-medium text-[var(--color-text)] text-sm">
          Add {activeRole === "admin" ? "Admin" : "Scorer"}
        </p>
        <div className="flex gap-2">
          <input
            type="tel"
            placeholder="Enter phone number"
            className="flex-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-11 h-11 flex items-center justify-center shrink-0 shadow-sm transition-colors active:scale-95"
          >
            <PlusIcon size={20} />
          </button>
        </div>
      </form>
      <div className="space-y-3">
        {displayedCrew.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between bg-[var(--color-surface)] rounded-xl p-3 shadow-sm border border-[var(--color-border)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-sm font-semibold text-[var(--color-text-secondary)] shrink-0">
                {member.initials}
              </div>
              <p className="font-medium text-[var(--color-text)] text-sm">
                {member.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${member.inviteStatus === "accepted" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
              >
                {member.inviteStatus}
              </span>
              <button className="text-red-400 hover:text-red-600 p-1.5 transition-colors rounded-lg hover:bg-red-50">
                <TrashIcon size={16} />
              </button>
            </div>
          </div>
        ))}
        {displayedCrew.length === 0 && (
          <p className="text-center text-sm text-[var(--color-muted)] py-6 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-sm">
            No {activeRole}s found.
          </p>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN PAGE EXPORT
// ==========================================
export default function TournamentEventDetailsPage() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    () => new URLSearchParams(),
  );
  const tournamentId = searchParams.get("t") || "1";
  const [tournament, setTournament] = useState<TournamentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const primaryTabs = ["About", "Events", "Summary", "Event Crew"];
  const [activeTab, setActiveTab] = useState("About");

  useEffect(() => {
    let isActive = true;

    setSearchParams(new URLSearchParams(window.location.search));

    const loadTournament = async () => {
      try {
        setErrorMessage("");
        setIsLoading(true);
        const tournamentData = await tournamentApi.getInfo(tournamentId);

        if (isActive) {
          setTournament(tournamentData ?? null);
        }
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load tournament", error);
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load tournament.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadTournament();

    return () => {
      isActive = false;
    };
  }, [tournamentId]);

  // Retrieve the saved tab from sessionStorage on initial load
  useEffect(() => {
    const savedTab = sessionStorage.getItem(`tournament-tab-${tournamentId}`);
    if (savedTab && primaryTabs.includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, [tournamentId]);

  // Handle setting the state AND saving it to sessionStorage
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    sessionStorage.setItem(`tournament-tab-${tournamentId}`, tab);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-3 pb-24 space-y-4">
      <TopAppBar />
      {isLoading ? (
        <p className="text-center text-sm text-[var(--color-muted)] py-8">
          Loading tournament...
        </p>
      ) : errorMessage ? (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      ) : (
        <>
          <EventHeader tournament={tournament} />
          <EventStats tournament={tournament} />

          {/* Pass our custom handler to PrimaryTabs */}
          <PrimaryTabs
            tabs={primaryTabs}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />

          <div className="space-y-4">
            {activeTab === "About" && <AboutTab tournament={tournament} />}
            {activeTab === "Events" && (
              <EventsTab
                tournamentId={tournamentId}
                events={tournament?.events ?? []}
              />
            )}
            {activeTab === "Summary" && (
              <SummaryTab events={tournament?.events ?? []} />
            )}
            {activeTab === "Event Crew" && <EventCrewTab />}
          </div>
        </>
      )}
    </div>
  );
}
