"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";

export default function AppPreferencesPage() {
    const [preferences, setPreferences] = useState({
        language: "en",
        defaultSport: "badminton",
        matchNotifications: true,
        tournamentReminders: true,
        soundEffects: true,
        hapticFeedback: true,
    });

    return (
        <Layout title="Preferences" showBack>
            <div className="p-4 space-y-6 pb-24">
                <h1 className="text-lg font-semibold">App Preferences</h1>

                {/* Language */}
                <div className="card p-4">
                    <h3 className="font-semibold mb-4">Language & Region</h3>
                    <div>
                        <label className="block text-sm font-medium mb-2">Language</label>
                        <select
                            value={preferences.language}
                            onChange={(e) =>
                                setPreferences({ ...preferences, language: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none"
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="es">Spanish</option>
                        </select>
                    </div>
                </div>

                {/* Default Sport */}
                <div className="card p-4">
                    <h3 className="font-semibold mb-4">Default Sport</h3>
                    <select
                        value={preferences.defaultSport}
                        onChange={(e) =>
                            setPreferences({ ...preferences, defaultSport: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none"
                    >
                        <option value="badminton">Badminton</option>
                        <option value="tennis">Tennis</option>
                        <option value="squash">Squash</option>
                        <option value="pickleball">Pickleball</option>
                        <option value="table-tennis">Table Tennis</option>
                    </select>
                </div>

                {/* Toggle Settings */}
                <div className="card p-4 space-y-4">
                    <h3 className="font-semibold">Feedback</h3>

                    <div className="flex items-center justify-between">
                        <span>Sound Effects</span>
                        <button
                            onClick={() =>
                                setPreferences({
                                    ...preferences,
                                    soundEffects: !preferences.soundEffects,
                                })
                            }
                            className={`relative w-12 h-6 rounded-full transition-colors ${preferences.soundEffects
                                ? "bg-primary"
                                : "bg-[var(--color-border)]"
                                }`}
                        >
                            <div
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${preferences.soundEffects ? "right-0.5" : "left-0.5"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <span>Haptic Feedback</span>
                        <button
                            onClick={() =>
                                setPreferences({
                                    ...preferences,
                                    hapticFeedback: !preferences.hapticFeedback,
                                })
                            }
                            className={`relative w-12 h-6 rounded-full transition-colors ${preferences.hapticFeedback
                                ? "bg-primary"
                                : "bg-[var(--color-border)]"
                                }`}
                        >
                            <div
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${preferences.hapticFeedback ? "right-0.5" : "left-0.5"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                <button className="btn-primary w-full">Save Preferences</button>
            </div>
        </Layout>
    );
}

