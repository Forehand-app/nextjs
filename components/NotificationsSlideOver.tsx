"use client";

import React from "react";
import { CheckCircleIcon, XIcon } from "@/components/Icons";

export type NotificationItem = {
  id: string;
  inviteId?: string;
  type: "invite" | "registration" | "match_start" | "info";
  title: string;
  body?: string;
  source?: string;
  timeAgo: string;
  unread: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onSeeMatch?: () => void;
};

type NotificationsSlideOverProps = {
  open: boolean;
  onClose: () => void;
  items: NotificationItem[];
  unreadCount: number;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
};

export default function NotificationsSlideOver({
  open,
  onClose,
  items,
  unreadCount,
  onMarkAllRead,
  onClearAll,
}: NotificationsSlideOverProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/45"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[var(--color-surface)] p-5 text-[var(--color-text)] shadow-xl"
        role="dialog"
        aria-label="Notifications"
      >
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="font-heading text-3xl font-semibold">
              Notifications
            </h2>
            <p className="mt-1 text-base text-[var(--color-text-secondary)]">
              {unreadCount} unread
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]"
            aria-label="Close"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="mb-5 flex gap-2">
          {onMarkAllRead && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm text-[var(--color-text-secondary)]"
            >
              Mark all as read
            </button>
          )}
          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm text-[var(--color-text-secondary)]"
            >
              Clear all
            </button>
          )}
        </div>

        <ul className="space-y-3 overflow-y-auto pb-4">
          {items.length === 0 ? (
            <li className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 text-sm text-[var(--color-muted)]">
              No notifications
            </li>
          ) : (
            items.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-chip)] text-primary">
                      <CheckCircleIcon size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xl font-semibold">
                        {item.title}
                      </p>
                      {item.body && (
                        <p className="mt-1 text-base text-[var(--color-text-secondary)]">
                          {item.body}
                        </p>
                      )}
                      <p className="text-sm text-[var(--color-muted)]">
                        {item.timeAgo}
                      </p>
                      <div className="mt-2 flex gap-2">
                        {item.onAccept && (
                          <button
                            type="button"
                            onClick={item.onAccept}
                            className="rounded-lg bg-[var(--color-success)] px-3 py-1.5 text-sm font-medium text-white"
                          >
                            Accept
                          </button>
                        )}
                        {item.onReject && (
                          <button
                            type="button"
                            onClick={item.onReject}
                            className="rounded-lg bg-[var(--color-error)] px-3 py-1.5 text-sm font-medium text-white"
                          >
                            Reject
                          </button>
                        )}
                        {item.onSeeMatch && (
                          <button
                            type="button"
                            onClick={item.onSeeMatch}
                            className="rounded-lg px-2 py-1 text-sm text-primary"
                          >
                            See Match
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {item.unread && (
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </aside>
    </>
  );
}
