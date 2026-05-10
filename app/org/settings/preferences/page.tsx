"use client";

import React, { useState } from "react";
import { SlidersIcon } from "@/components/Icons";
import {
  AppVersionCard,
  IntroWithIcon,
  SelectRow,
  SettingsShell,
  ToggleRow,
} from "../_components/SettingsScaffold";

export default function OrgPreferencesPage() {
  const [themeMode, setThemeMode] = useState("system");
  const [showStats, setShowStats] = useState(true);
  const [language, setLanguage] = useState("en");
  const [allowSearch, setAllowSearch] = useState(false);
  const [receiveInvites, setReceiveInvites] = useState(false);

  return (
    <SettingsShell title="Settings">
      <IntroWithIcon
        icon={SlidersIcon}
        title="App Preferences"
        subtitle="Change app preferences."
      />

      <div className="flex flex-col gap-3">
        <ToggleRow
          label="Show Statistics"
          subtitle="Display your win/loss record"
          on={showStats}
          onToggle={() => setShowStats((current) => !current)}
        />

        <SelectRow
          label="Language"
          subtitle="Change app language"
          value={language}
          onChange={setLanguage}
          options={[
            { label: "English", value: "en" },
            { label: "Hindi", value: "hi" },
            { label: "Spanish", value: "es" },
          ]}
        />

        <ToggleRow
          label="Allow search"
          subtitle="Let others find you by email/phone"
          on={allowSearch}
          onToggle={() => setAllowSearch((current) => !current)}
        />

        <ToggleRow
          label="Receive Invites"
          subtitle="Receive event invites from others"
          on={receiveInvites}
          onToggle={() => setReceiveInvites((current) => !current)}
        />

        <AppVersionCard />
      </div>
    </SettingsShell>
  );
}
