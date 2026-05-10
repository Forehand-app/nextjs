"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function OrgDashboardPage() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const orgId = searchParams.get("orgId") || "demo-org";

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">Org Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          Organization ID: {orgId}
        </p>
        <div className="space-y-3">
          <Link
            href="/tournaments/create"
            className="block p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)] font-medium"
          >
            Create Tournament
          </Link>
          <Link
            href={`/tournaments?org=${orgId}`}
            className="block p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            View Tournaments
          </Link>
        </div>
      </div>
    </Layout>
  );
}
