"use client";

import React, { useState } from "react";
import { ShieldIcon } from "@/components/Icons";
import {
  IntroWithIcon,
  SettingsShell,
  ToggleRow,
} from "../_components/SettingsScaffold";

export default function OrgPrivacyPage() {
  const [privacy, setPrivacy] = useState([
    { label: "Public Profile", desc: "Allow others to see your profile", on: true },
    { label: "Show Statistics", desc: "Display your win/loss record", on: true },
    { label: "Allow search", desc: "Let others find you by email/phone", on: false },
    { label: "Receive Invites", desc: "Receive event invites from others", on: false },
  ]);

  const toggleRow = (index: number) => {
    setPrivacy((current) =>
      current.map((item, currentIndex) =>
        currentIndex === index ? { ...item, on: !item.on } : item,
      ),
    );
  };

  return (
    <SettingsShell title="Privacy">
      <IntroWithIcon
        icon={ShieldIcon}
        title="Your Privacy"
        subtitle="Choose your privacy settings."
      />
      <div className="flex flex-col gap-3">
        {privacy.map((item, index) => (
          <ToggleRow
            key={item.label}
            label={item.label}
            subtitle={item.desc}
            on={item.on}
            onToggle={() => toggleRow(index)}
          />
        ))}
      </div>
    </SettingsShell>
  );
}

