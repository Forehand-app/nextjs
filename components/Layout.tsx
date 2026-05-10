"use client";

import React from "react";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";

export default function Layout({
  children,
  showBottomNav = true,
  title,
  showBack = false,
  onBack,
  right,
  hideTopNav = false,
}: {
  children: React.ReactNode;
  showBottomNav?: boolean;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  hideTopNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex flex-col">
      {!hideTopNav && (
        <TopNav title={title} showBack={showBack} onBack={onBack} right={right} />
      )}
      <main className="flex-1 pb-20 pb-safe">{children}</main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

