"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FilterIcon,
  SearchIcon,
} from "@/components/Icons";
import BottomNav from "@/components/BottomNav";
import NotificationsSlideOver, { type NotificationItem } from "@/components/NotificationsSlideOver";
import TournamentListCard, { type TournamentListItem } from "@/components/TournamentListCard";
import { useApp } from "@/components/AppProvider";
import { notificationApi } from "@/lib/api/notificationApi";
import PageHeader from "@/components/PageHeader";
import TournamentFilterDrawer from "@/components/TournamentFilterDrawer";
import { SlidersIcon } from "@/components/Icons";

type TopTab = "browse" | "joined" | "history";
type FormatTab = "all" | "singles" | "doubles";

const baseSubtitle = "Pickle ball | Men's | Multiple Modes";

const browseItems: TournamentListItem[] = [
  {
    id: "1",
    name: "Monsoon Singles Open",
    subtitle: "Pickle ball | Men's | Singles",
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    format: "singles",
    cta: "Register",
  },
  {
    id: "2",
    name: "Winter Doubles Cup",
    subtitle: "Pickle ball | Mixed | Doubles",
    start: "20/01/2024",
    end: "22/01/2024",
    entry: "800 Entry",
    location: "Raipur | Chattisgarh",
    format: "doubles",
    cta: "Register",
  },
  {
    id: "3",
    name: "Bhilai Singles Classic",
    subtitle: "Pickle ball | Women's | Singles",
    start: "05/02/2024",
    end: "05/02/2024",
    entry: "400 Entry",
    location: "Bhilai | Chattisgarh",
    format: "singles",
    cta: "Register",
  },
];

const joinedItems: TournamentListItem[] = [
  {
    id: "4",
    name: "City Pickleball League",
    subtitle: "Pickle ball | Men's | Singles",
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    format: "singles",
    cta: "View",
  },
  {
    id: "5",
    name: "Weekend Doubles Blast",
    subtitle: "Pickle ball | Men's | Doubles",
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    format: "doubles",
    cta: "View",
  },
  {
    id: "6",
    name: "Monsoon Pro Series",
    subtitle: "Pickle ball | Men's | Singles",
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    format: "singles",
    cta: "View",
  },
];

const historyItems: TournamentListItem[] = [
  {
    id: "7",
    name: "Champions league",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    location: "Raipur | Chattisgarh",
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
    cta: "Chevron",
    joinedStatus: "Eliminated - Round 4",
  },
];

export default function TournamentsPage() {
  const { userProfile } = useApp();
  const [activeTab, setActiveTab] = useState<TopTab>("browse");
  const [format, setFormat] = useState<FormatTab>("all");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const attachActions = (items: NotificationItem[]) =>
    items.map((item) => ({
      ...item,
      unread: item.unread && !readIds.has(item.id),
      onAccept:
        item.type === "invite"
          ? async () => {
            await notificationApi.respondToInvite(item.id, "accept");
            setNotifications((prev) => prev.filter((n) => n.id !== item.id));
          }
          : undefined,
      onReject:
        item.type === "invite"
          ? async () => {
            await notificationApi.respondToInvite(item.id, "reject");
            setNotifications((prev) => prev.filter((n) => n.id !== item.id));
          }
          : undefined,
    }));

  useEffect(() => {
    let active = true;
    const loadNotifications = async () => {
      try {
        const items = await notificationApi.getUserNotifications();
        if (!active) return;
        setNotifications(attachActions(items));
      } catch (error) {
        if (!active) return;
        console.error("Failed to load notifications", error);
        setNotifications([]);
      }
    };
    void loadNotifications();
    return () => {
      active = false;
    };
  }, [readIds]);

  const list = useMemo(() => {
    let items: TournamentListItem[] = [];
    if (activeTab === "joined") items = joinedItems;
    else if (activeTab === "history") items = historyItems;
    else items = browseItems;

    if (format === "all") return items;
    return items.filter((item) => item.format === format);
  }, [activeTab, format]);

  const unreadCount = notifications.filter((item) => item.unread).length;
  const userInitial = userProfile?.name?.trim().charAt(0).toUpperCase() || "P";
  const profilePicUrl = userProfile?.profilePicUrl;

  return (
    <>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
        <PageHeader
          title="Tournaments"
          subtitle="Browse and join tournaments"
          hideTopRow={false}
        />


        <div className="px-5 py-3">
          <label className="flex h-14 items-center gap-3 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 text-[var(--color-muted)] shadow-sm focus-within:border-primary/50 transition-all">
            <SearchIcon size={22} className="opacity-70" />
            <input
              type="text"
              placeholder="Search tournaments, cities..."
              className="w-full bg-transparent text-[16px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]"
            />
          </label>
        </div>

        <div className="flex items-center justify-center gap-10 px-5 border-b border-[var(--color-border)]">
          {(["browse", "joined", "history"] as TopTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-4 text-[16px] font-bold capitalize transition-all ${
                activeTab === tab
                  ? "text-[var(--color-text)]"
                  : "text-[var(--color-text-secondary)] opacity-50 hover:opacity-80"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(255,122,26,0.4)]" />
              )}
            </button>
          ))}
        </div>

        <div className="px-5 py-5 flex items-center gap-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-primary shadow-sm active:scale-95 transition-transform"
          >
            <FilterIcon size={20} />
          </button>
          <div className="hide-scrollbar flex items-center gap-3 overflow-x-auto">
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
                  className={`h-11 shrink-0 rounded-[18px] border px-6 text-[15px] font-bold transition-all ${
                    active
                      ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                      : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] opacity-70 hover:opacity-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 px-4 pb-24 pt-4">
          {activeTab === "browse" ? (
            <>
              <h2 className="text-[18px] font-semibold text-[var(--color-text)]">Trending Tournaments</h2>
              {list.map((item) => (
                <TournamentListCard key={item.id} item={item} />
              ))}
            </>
          ) : (
            list.map((item) => <TournamentListCard key={item.id} item={item} />)
          )}
        </div>

        <BottomNav />
      </div>

      <TournamentFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => console.log("Applying filters:", filters)}
        onReset={() => console.log("Filters reset")}
      />
    </>
  );
}

