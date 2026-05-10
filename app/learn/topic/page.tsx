"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import FeynmanStep from "@/components/Learning/FeynmanStep";
import { getSession, saveSession } from "@/lib/storage";

export default function TopicPage() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const topic = decodeURIComponent(
    searchParams.get("topic") || "bracket-seeding",
  );
  const [session, setSession] = useState<Record<string, unknown> | null>(null);
  const [explanation, setExplanation] = useState("");
  const [analogy, setAnalogy] = useState("");
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const s = getSession(topic);
    if (s) {
      const sess = s as Record<string, unknown>;
      setSession(sess);
      const steps =
        (sess.steps as { explanation?: string; analogy?: string }[]) ?? [];
      const idx = (sess.currentStep as number) ?? 0;
      setStepIndex(idx);
      const step = steps[idx] ?? {};
      setExplanation(step.explanation ?? "");
      setAnalogy(step.analogy ?? "");
    } else {
      const newSession = {
        id: topic + Date.now(),
        topic,
        steps: [
          {
            id: "0",
            explanation: "",
            analogy: "",
            confusions: [],
            refinements: [],
            assessment: null,
          },
        ],
        currentStep: 0,
      };
      setSession(newSession);
      setExplanation("");
      setAnalogy("");
      setStepIndex(0);
    }
  }, [topic]);

  function saveAndNext() {
    if (!session) return;
    const stepsCopy = [...(session.steps as object[])];
    stepsCopy[stepIndex] = {
      ...stepsCopy[stepIndex],
      explanation,
      analogy,
      refinements: [],
    };
    const updated = {
      ...session,
      steps: stepsCopy,
      currentStep: stepIndex + 1,
      lastModified: Date.now(),
    };
    saveSession(topic, updated);
    setSession(updated);
    setStepIndex(stepIndex + 1);
    setExplanation("");
    setAnalogy("");
  }

  if (!session) {
    return (
      <Layout>
        <div className="p-6">Loading…</div>
      </Layout>
    );
  }

  return (
    <Layout showBottomNav={false}>
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Learn: {topic.replace(/-/g, " ")}
        </h1>
        <FeynmanStep
          stepIndex={stepIndex}
          explanation={explanation}
          analogy={analogy}
          onExplanationChange={setExplanation}
          onAnalogyChange={setAnalogy}
          onSaveAndNext={saveAndNext}
        />
      </main>
    </Layout>
  );
}
