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
import { Bell } from "lucide-react";

type TopTab = "browse" | "joined" | "history";
type FormatTab = "all" | "singles" | "doubles";

const baseSubtitle = "Pickle ball | Men's | Multiple Modes";

const browseItems: TournamentListItem[] = [
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

const joinedItems: TournamentListItem[] = [
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

const historyItems: TournamentListItem[] = [
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

export default function TournamentsPage() {
  const { userProfile } = useApp();
  const [activeTab, setActiveTab] = useState<TopTab>("browse");
  const [format, setFormat] = useState<FormatTab>("all");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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
    if (activeTab === "joined") return joinedItems;
    if (activeTab === "history") return historyItems;
    return browseItems;
  }, [activeTab]);

  const unreadCount = notifications.filter((item) => item.unread).length;
  const userInitial = userProfile?.name?.trim().charAt(0).toUpperCase() || "P";
  const profilePicUrl = userProfile?.profilePicUrl;

  return (
    <>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
        <section className="bg-[linear-gradient(180deg,#ff8a24_0%,#ff7418_100%)] px-4 pb-0 pt-[calc(max(env(safe-area-inset-top),12px)+6px)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-content-center overflow-hidden rounded-full border-2 border-white/65 bg-[radial-gradient(circle_at_30%_30%,#f7d8b5,#8f5f42)] shadow-[0_4px_10px_rgba(119,46,0,0.18)]">
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[13px] font-semibold text-white">{userInitial}</span>
                )}
              </div>
              <div className="min-w-0 pt-0.5">
                <h1 className="truncate text-[32px] font-extrabold leading-none tracking-[-0.02em] text-white">Tournaments</h1>
                <p className="mt-1 text-[14px] font-medium text-white/92">Browse and join tournaments</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              className="relative mt-0.5 grid h-11 w-11 shrink-0 place-content-center rounded-full bg-white text-[#2a2a31] shadow-[0_8px_18px_rgba(130,55,0,0.18)]"
              aria-label="Notifications"
            >
              <Bell size={19} />
              {unreadCount > 0 ? (
                <span className="absolute right-0.5 top-0.5 grid h-5 min-w-[20px] place-content-center rounded-full bg-[#ff6b00] px-1 text-[10px] font-bold text-white ring-2 ring-[#fff3ea]">
                  {unreadCount}
                </span>
              ) : null}
            </button>
          </div>

          <label className="mt-5 flex h-10 items-center gap-2 rounded-[14px] bg-white px-3.5 text-[#8e8e95] shadow-[0_8px_18px_rgba(130,55,0,0.14)]">
            <SearchIcon size={16} />
            <input
              type="text"
              placeholder="Search tournaments, cities..."
              className="w-full bg-transparent text-[14px] text-[var(--color-text)] outline-none placeholder:text-[#a0a0a7]"
            />
          </label>

          <div className="mt-5 grid grid-cols-3 text-center text-[16px] text-white/82">
            {(["browse", "joined", "history"] as TopTab[]).map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`h-11 capitalize border-b-2 transition-colors ${active
                      ? "border-white font-semibold text-white"
                      : "border-transparent"
                    }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </section>

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

        <div className="space-y-4 px-4 pb-24 pt-4">
          {activeTab === "browse" ? (
            <>
              <h2 className="text-[18px] font-semibold text-[var(--color-text)]">Trending Tournaments</h2>
              {list.map((item) => (
                <TournamentListCard key={item.id} item={item} />
              ))}
              <h2 className="pt-2 text-[18px] font-semibold text-[var(--color-text)]">Tournaments Near You</h2>
              {browseItems.map((item) => (
                <TournamentListCard key={`near-${item.id}`} item={item} />
              ))}
            </>
          ) : (
            list.map((item) => <TournamentListCard key={item.id} item={item} />)
          )}
        </div>

        <BottomNav />
      </div>

      <NotificationsSlideOver
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        items={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={() =>
          setReadIds(new Set(notifications.map((notification) => notification.id)))
        }
        onClearAll={() => setNotifications([])}
      />
    </>
  );
}

