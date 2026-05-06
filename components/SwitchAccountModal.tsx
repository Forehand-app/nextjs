"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { CheckIcon } from "@/components/Icons";

interface Org {
  id: string;
  name: string;
  orgType?: {
    name: string;
  };
}

interface SwitchAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SwitchAccountModal({ isOpen, onClose }: SwitchAccountModalProps) {
  const { user, session, activeOrganization, setOrganization } = useApp();
  const activeOrgId = activeOrganization?.id ?? null;
  const pathname = usePathname();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const accessToken = session?.access_token;
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    
    async function fetchOrgs() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/list`, 
          { 
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setOrgs(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch orgs", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchOrgs();
  }, [isOpen, session]);

  if (!isOpen) return null;

  const isIndividualActive = pathname.startsWith("/user/");
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "User";
  const userInitials = userName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xl p-6 max-h-[85vh] flex flex-col">
        <h2 className="text-xl font-bold mb-5 text-[var(--color-text)]">Switch Account</h2>
        
        <div className="space-y-3 overflow-y-auto hide-scrollbar flex-1 pb-2">
          
          {/* Individual Account */}
          {isIndividualActive ? (
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border-2 border-primary bg-primary/5 text-[var(--color-text)]">
              <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-sm shrink-0">{userInitials}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] truncate">{userName}</p>
                <p className="text-[13px] text-[var(--color-text-muted)]">Individual</p>
              </div>
              <CheckIcon size={20} className="text-primary shrink-0" />
            </div>
          ) : (
            <Link
              href="/user/settings"
              className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors"
              onClick={() => {
                setOrganization(null);
                onClose();
              }}
            >
              <div className="w-11 h-11 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-sm font-bold shrink-0">{userInitials}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[15px] truncate">{userName}</p>
                <p className="text-[13px] text-[var(--color-text-muted)]">Individual</p>
              </div>
            </Link>
          )}

          {/* Organizations */}
          {isLoading ? (
            <p className="text-sm text-center text-[var(--color-text-muted)] py-4">Loading organizations...</p>
          ) : (
            orgs.map((org, index) => {
              const isThisOrgActive = pathname.startsWith("/org/") && activeOrgId === org.id;

              return isThisOrgActive ? (
                <div key={org.id} className="flex items-center gap-3.5 p-3.5 rounded-2xl border-2 border-primary bg-primary/5 text-[var(--color-text)]">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                    {org.name?.charAt(0).toUpperCase() || "O"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px] truncate">{org.name}</p>
                    <p className="text-[13px] text-[var(--color-text-muted)]">{org.orgType?.name || "Organization"}</p>
                  </div>
                  <CheckIcon size={20} className="text-primary shrink-0" />
                </div>
              ) : (
                <Link
                  key={org.id}
                  href="/org/settings"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] transition-colors"
                  onClick={() => {
                    setOrganization(org.id);
                    onClose();
                  }}
                >
                  <div className="w-11 h-11 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-sm font-bold shrink-0">
                    {org.name?.charAt(0).toUpperCase() || "O"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px] truncate">{org.name}</p>
                    <p className="text-[13px] text-[var(--color-text-muted)]">{org.orgType?.name || "Organization"}</p>
                  </div>
                </Link>
              );
            })
          )}

          <Link
            href="/org/create"
            className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] transition-colors mt-2"
            onClick={onClose}
          >
            <span className="text-xl font-light leading-none">+</span>
            <span className="font-semibold text-[14px]">Create Organization</span>
          </Link>
        </div>

        <button
          type="button"
          className="mt-6 w-full py-3 rounded-xl font-semibold text-[var(--color-text)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:bg-[var(--color-border)] transition-colors shrink-0"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
