"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { ArrowLeftIcon, XIcon } from "@/components/Icons";
import { useApp } from "@/components/AppProvider";
import {
  OrganizationMemberInvite,
  orgMemberInviteApi,
} from "@/lib/api/orgMemberInviteApi";
import { notificationApi } from "@/lib/api/notificationApi";

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length > 10) return digits.slice(-10);
  return digits.slice(-10);
}

export default function OrgMembersPage() {
  const router = useRouter();
  const { activeOrganization } = useApp();

  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [members, setMembers] = useState<OrganizationMemberInvite[]>([]);

  useEffect(() => {
    let active = true;
    const organizationId = activeOrganization?.id;
    if (!organizationId) return;

    const loadInvites = async () => {
      try {
        const rows = await orgMemberInviteApi.listOrganizationMemberInvites(organizationId);
        if (!active) return;
        setMembers(rows);
      } catch {
        if (!active) return;
        setMembers([]);
        setFeedback("Organization member invite list API is not available yet.");
      }
    };

    void loadInvites();

    return () => {
      active = false;
    };
  }, [activeOrganization?.id]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const organizationId = activeOrganization?.id;
    if (!organizationId) {
      setFeedback("No active organization selected.");
      return;
    }

    const cleanPhone = normalizePhone(phone);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setFeedback("Enter a valid 10-digit Indian phone number.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedback("");
      const created = await orgMemberInviteApi.sendOrganizationMemberInvite({
        phone: cleanPhone,
        organizationId,
      });

      try {
        await notificationApi.sendOrgInviteNotification({
          phone: cleanPhone,
          organizationId,
          organizationName: activeOrganization?.name || "the organization",
          role: "Admin",
        });
      } catch (err) {
        console.warn("Failed to send org invite notification", err);
      }

      setMembers((prev) => [created, ...prev]);
      setPhone("");
      setFeedback("Invitation sent successfully.");
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Unable to send invitation right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (member: OrganizationMemberInvite) => {
    const organizationId = activeOrganization?.id;
    if (!organizationId) return;
    try {
      await orgMemberInviteApi.removeOrganizationMemberInvite(member.id, organizationId);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      setFeedback("Member invite removed.");
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Unable to remove member invite.",
      );
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-elevated)] min-h-[44px] flex items-center gap-2"
          aria-label="Back"
        >
          <ArrowLeftIcon size={20} />
          <span className="font-medium">Organization Members</span>
        </button>
        <h1 className="text-xl font-semibold">Organization Members</h1>
        <p className="text-sm text-[var(--color-muted)]">Add or remove organization members.</p>

        <form onSubmit={handleAdd} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="tel"
              placeholder="Enter Admin's Phone No."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[44px] px-4 rounded-[var(--radius-button)] bg-primary text-[var(--color-primary-contrast)] font-medium disabled:opacity-60"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
          {feedback ? <p className="text-sm text-[var(--color-muted)]">{feedback}</p> : null}
        </form>

        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-[var(--color-muted)]">{m.role} - {m.status}</p>
              </div>
              <button
                type="button"
                onClick={() => void handleRemove(m)}
                className="p-2 rounded-lg text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
                aria-label={`Remove ${m.name}`}
              >
                <XIcon size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
