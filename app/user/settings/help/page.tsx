"use client";

import React from "react";
import {
  HelpCard,
  SettingsShell,
} from "@/app/org/settings/_components/SettingsScaffold";

export default function HelpSupportPage() {
  return (
    <SettingsShell title="Help & Support">
      <HelpCard />
    </SettingsShell>
  );
}
