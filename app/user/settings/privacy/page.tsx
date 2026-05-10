"use client";

import React from "react";
import Layout from "@/components/Layout";

export default function PrivacySettingsPage() {
  const rows = [
    { label: "Public Profile", desc: "Allow others to see your profile", on: true },
    { label: "Show Statistics", desc: "Display your win/loss record", on: true },
    { label: "Allow search", desc: "Let others find you by email/phone", on: false },
    { label: "Receive invites", desc: "Receive event invites from others", on: false },
  ];

  return (
    <Layout title="Privacy" showBack>
      <div className="p-4 space-y-4 pb-24">
        <section className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h2 className="text-base font-semibold">Your Privacy</h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Choose your privacy settings.</p>
        </section>

        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div>
                <p className="text-sm font-medium">{row.label}</p>
                <p className="text-xs text-[var(--color-muted)]">{row.desc}</p>
              </div>
              <button type="button" role="switch" aria-checked={row.on} className={`relative h-6 w-11 rounded-full ${row.on ? "bg-primary" : "bg-[var(--color-border)]"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white ${row.on ? "right-0.5" : "left-0.5"}`} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}


