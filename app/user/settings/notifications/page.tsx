"use client";

import React from "react";
import Layout from "@/components/Layout";

export default function NotificationsSettingsPage() {
  return (
    <Layout title="Notifications" showBack>
      <div className="p-4 space-y-4 pb-24">
        <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="text-base font-semibold">Stay Updated</h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Choose which notifications you want to receive.</p>
        </section>

        <ul className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div>
                <p className="text-sm font-medium">Tournament Alerts</p>
                <p className="text-xs text-[var(--color-muted)]">Get notified about new tournaments</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={i !== 2 && i !== 3}
                className={`relative h-6 w-11 rounded-full ${i !== 2 && i !== 3 ? "bg-primary" : "bg-[var(--color-border)]"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white ${i !== 2 && i !== 3 ? "right-0.5" : "left-0.5"}`} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}


