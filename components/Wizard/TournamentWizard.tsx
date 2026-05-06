"use client";

import React, { useState, useEffect } from "react";
import { XIcon, ImageIcon, ArrowLeftIcon, ChevronRightIcon, TrashIcon } from "@/components/Icons";

// --- CUSTOM ICONS FOR DATE PICKER ---
const CalendarIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

// --- REBUILT UI COMPONENTS ---

// 1. Native Styled Select
const NativeSelect = ({ label, value, options, onChange }: any) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer font-medium"
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[var(--color-muted)]">
        <ChevronRightIcon size={16} className="rotate-90" />
      </div>
    </div>
  </div>
);

// 2. Clean, Premium Toggle Switch
const ToggleSwitch = ({ checked, onChange, label }: any) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-sm font-semibold text-[var(--color-text)]">
      {label}
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
        checked ? "bg-primary shadow-[0_0_10px_rgba(255,107,0,0.4)]" : "bg-[var(--color-border)]"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

// 3. Custom Date Picker (Responsive Popover / Bottom Sheet)
const CustomDatePicker = ({ value, onChange, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const [isMobile, setIsMobile] = useState(false);

  // Safely detect mobile to avoid hydration mismatch in Next.js
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile(); // Check on mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const selectDate = (day: number) => {
    const year = viewDate.getFullYear();
    const month = String(viewDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    onChange(`${year}-${month}-${dayStr}`);
    setIsOpen(false);
  };

  const displayDate = value ? new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "";

  return (
    <div className="relative w-full">
      {/* Input Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border flex items-center justify-between cursor-pointer transition-all duration-200 ${isOpen ? 'border-primary ring-2 ring-primary/20 shadow-sm' : 'border-[var(--color-border)] hover:border-gray-400'}`}
      >
        <span className={value ? "text-[var(--color-text)] font-semibold" : "text-[var(--color-muted)] font-medium"}>
          {displayDate || placeholder || "Select a date..."}
        </span>
        <CalendarIcon className={`transition-colors ${isOpen ? 'text-primary' : 'text-[var(--color-muted)]'}`} size={18} />
      </div>

      {/* Responsive Calendar Popover / Modal */}
      {isOpen && (
        <>
          {/* Dark backdrop for both mobile and desktop overlay click */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[998]" 
            onClick={() => setIsOpen(false)}
          />
          
          <div 
            className={`
              z-[999] bg-[var(--color-surface)] border border-[var(--color-border)]
              ${isMobile
                ? "fixed bottom-0 left-0 right-0 rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300"
                : "absolute top-[calc(100%+8px)] left-0 max-w-[380px] w-full rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl"
              }
            `}
          >
            {/* Mobile Drag Handle */}
            {isMobile && (
              <div className="w-10 h-1.5 bg-[var(--color-border)] rounded-full mx-auto mb-4" />
            )}

            {/* Header Controls */}
            <div className="flex items-center justify-between mb-6 text-lg sm:text-base">
              <button onClick={handlePrevMonth} className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-elevated)] text-[var(--color-text)] transition-colors border border-transparent hover:border-[var(--color-border)]">
                <ChevronRightIcon size={16} className="rotate-180" />
              </button>
              <div className="font-bold text-[var(--color-text)] tracking-wide">
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </div>
              <button onClick={handleNextMonth} className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-elevated)] text-[var(--color-text)] transition-colors border border-transparent hover:border-[var(--color-border)]">
                <ChevronRightIcon size={16} />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid - Fluid Spacing */}
            <div className="grid grid-cols-7 gap-2">
              {blanks.map(blank => (
                <div key={`blank-${blank}`} className="aspect-square w-full"></div>
              ))}
              {days.map(day => {
                const dateString = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = value === dateString;
                const isToday = new Date().toISOString().split('T')[0] === dateString;

                return (
                  <button
                    key={day}
                    onClick={() => selectDate(day)}
                    className={`aspect-square w-full rounded-full flex items-center justify-center text-sm sm:text-base transition-all duration-200
                      ${isSelected 
                        ? 'bg-primary text-white font-bold shadow-md scale-105' 
                        : isToday 
                          ? 'border-2 border-primary text-primary font-bold hover:bg-primary/10' 
                          : 'text-[var(--color-text)] font-medium hover:bg-[var(--color-surface-elevated)] hover:scale-110'
                      }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            
            {/* Quick Actions Footer */}
            <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex justify-between">
               <button onClick={() => { onChange(""); setIsOpen(false); }} className="text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">Clear</button>
               <button onClick={() => { 
                 const today = new Date();
                 onChange(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
                 setIsOpen(false);
               }} className="text-xs font-bold text-primary hover:text-orange-600 transition-colors">Today</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

interface TournamentWizardProps {
  isPublishing?: boolean;
  onComplete: (tournament: any) => void;
  onClose: () => void;
}

export default function TournamentWizard({ isPublishing = false, onComplete, onClose }: TournamentWizardProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    // Step 1
    name: "", description: "", startDate: "", endDate: "", logo: null as File | null,
    // Step 2
    venueName: "", city: "", state: "", addressLine: "", zipCode: "", numCourts: 1, organizerName: "", organizerPhone: "", organizerEmail: "",
    // Step 3
    events: [] as any[],
  });

  const sportsOpts = ["Pickleball", "Tennis", "Badminton", "Padel"];
  const formatOpts = ["Knockout", "Round Robin", "League", "Groups + Knockout"];
  const genderOpts = ["Men's", "Women's", "Mixed", "Open"];
  const partTypeOpts = ["Singles", "Doubles", "Team"];
  const setsOpts = ["Best of 1", "Best of 3", "Best of 5"];
  const pointsOpts = ["11", "15", "21"];
  const paymentOpts = ["Pay at venue", "Pay online (UPI)"];

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const addEvent = () => {
    setFormData((prev) => ({
      ...prev,
      events: [...prev.events, {
        id: Date.now(), name: "", sport: "", format: "", regDueDate: "", startDate: "", 
        gender: "", partType: "", sets: "", points: "", ageRestricted: "",
        isFree: true, paymentOption: "", upiId: "", fee: ""
      }],
    }));
  };

  const updateEvent = (index: number, field: string, value: any) => {
    const newEvents = [...formData.events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setFormData({ ...formData, events: newEvents });
  };

  const removeEvent = (id: number) => {
    setFormData((prev) => ({ ...prev, events: prev.events.filter((e) => e.id !== id) }));
  };

  return (
    <div className="h-[100dvh] md:h-screen bg-[var(--color-background)] md:py-10 md:px-6 flex justify-center items-start font-sans overflow-hidden">
      
      {/* Container Column */}
      <div className="w-full max-w-3xl h-full md:h-auto md:max-h-[85vh] bg-[var(--color-surface)] md:rounded-2xl md:shadow-2xl md:border border-[var(--color-border)] flex flex-col relative overflow-hidden">
        
        {/* HEADER */}
        <div className="flex-none bg-[var(--color-surface)] border-b border-[var(--color-border)] p-5 flex items-center justify-between z-10">
          <h1 className="text-xl font-bold text-[var(--color-text)]">Create Tournament</h1>
          <button onClick={onClose} className="p-2 bg-[var(--color-surface-elevated)] text-[var(--color-muted)] hover:text-[var(--color-text)] rounded-full transition-colors">
            <XIcon size={18} />
          </button>
        </div>

        {/* STEPPER */}
        <div className="flex-none px-6 pt-4 pb-2 z-10 bg-[var(--color-surface)]">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= i ? "bg-primary" : "bg-[var(--color-border)] opacity-50"}`} />
            ))}
          </div>
          <div className="mt-2 text-xs font-bold text-primary text-right tracking-wide">
            STEP {step} OF {totalSteps}
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 pb-32 space-y-8 animate-in fade-in duration-300 relative">
          
          {/* STEP 1: Tournament Info */}
          {step === 1 && (
            <div className="space-y-8 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Tournament Info</h2>
                <p className="text-sm text-[var(--color-muted)]">Let's start with the basic details of your tournament.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Tournament Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g., Summer Smash 2025"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Description</label>
                  <textarea
                    placeholder="Describe your tournament's rules, format, or general info..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none resize-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Tournament Logo</label>
                  <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-8 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          logo: event.target.files?.[0] ?? null,
                        })
                      }
                    />
                    <ImageIcon size={24} className="mb-3 text-[var(--color-muted)]" />
                    <span className="text-sm font-semibold text-[var(--color-text)]">
                      {formData.logo ? formData.logo.name : "Upload tournament logo"}
                    </span>
                    <span className="mt-1 text-xs text-[var(--color-muted)]">
                      PNG, JPG, or WebP
                    </span>
                  </label>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)]">
                  <h3 className="text-lg font-bold mb-4 text-[var(--color-text)]">Timeline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Start Date <span className="text-red-500">*</span></label>
                      <CustomDatePicker 
                        value={formData.startDate}
                        onChange={(date: string) => setFormData({ ...formData, startDate: date })}
                        placeholder="Select start date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">End Date</label>
                      <CustomDatePicker 
                        value={formData.endDate}
                        onChange={(date: string) => setFormData({ ...formData, endDate: date })}
                        placeholder="Select end date"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Venue Details */}
          {step === 2 && (
            <div className="space-y-8 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Venue Details</h2>
                <p className="text-sm text-[var(--color-muted)]">Where is the tournament taking place?</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Venue Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g., Andheri Sports Complex" value={formData.venueName} onChange={(e) => setFormData({ ...formData, venueName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">City <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g., Mumbai" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">State <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g., Maharashtra" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Zip Code <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="000000" value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Venue Address <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Street address" value={formData.addressLine} onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
                      Number of Courts
                    </label>
                    <div className="inline-flex items-center gap-4">
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            numCourts: Math.max(1, formData.numCourts - 1),
                          })
                        }
                        className="w-9 h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text)] hover:bg-[var(--color-border)] transition"
                      >
                        −
                      </button>
                      <span className="text-3xl font-extrabold text-[var(--color-text)] min-w-[40px] text-center">
                        {formData.numCourts}
                      </span>
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            numCourts: formData.numCourts + 1,
                          })
                        }
                        className="w-9 h-9 rounded-lg bg-primary text-white hover:opacity-90 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--color-border)]">
                  <h3 className="text-lg font-bold mb-4 text-[var(--color-text)]">Organizer Info</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Organizer's Name <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Enter Name" value={formData.organizerName} onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary outline-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Phone Number <span className="text-red-500">*</span></label>
                        <input type="tel" placeholder="Phone" value={formData.organizerPhone} onChange={(e) => setFormData({ ...formData, organizerPhone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Email <span className="text-red-500">*</span></label>
                        <input type="email" placeholder="Email" value={formData.organizerEmail} onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Create Events */}
          {step === 3 && (
            <div className="space-y-6 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Create Events</h2>
                <p className="text-sm text-[var(--color-muted)]">Set up formats, rules, and entry fees for each category.</p>
              </div>

              {formData.events.length === 0 ? (
                <div className="text-center py-16 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-2xl">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-5">
                    <ImageIcon size={20} className="text-[var(--color-muted)]" />
                  </div>
                  <p className="text-lg font-semibold text-[var(--color-text)]">
                    No events created yet
                  </p>
                  <p className="text-sm text-[var(--color-muted)] mt-1 mb-6">
                    Create your first event category to continue.
                  </p>
                  <button
                    onClick={addEvent}
                    className="px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:scale-[1.02] transition-transform"
                    style={{ background: "var(--gradient-orange)" }}
                  >
                    + Add Event
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {formData.events.map((event, index) => (
                    <div key={event.id} className="p-5 sm:p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm relative overflow-visible">
                      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--color-border)]">
                        <h3 className="text-lg font-bold text-[var(--color-text)]">Event {index + 1}</h3>
                        <button onClick={() => removeEvent(event.id)} className="p-2 text-[var(--color-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                           <TrashIcon size={18} />
                        </button>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Event Name <span className="text-red-500">*</span></label>
                          <input type="text" placeholder="e.g. Men's Singles Pro" value={event.name} onChange={(e) => updateEvent(index, "name", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary outline-none" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <NativeSelect label="Sport" value={event.sport} options={sportsOpts} onChange={(v: string) => updateEvent(index, "sport", v)} />
                          <NativeSelect label="Format" value={event.format} options={formatOpts} onChange={(v: string) => updateEvent(index, "format", v)} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                           <div>
                            <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Reg. Due Date <span className="text-red-500">*</span></label>
                            <CustomDatePicker 
                              value={event.regDueDate} 
                              onChange={(date: string) => updateEvent(index, "regDueDate", date)}
                              placeholder="Select Due Date"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Event Start Date <span className="text-red-500">*</span></label>
                            <CustomDatePicker 
                              value={event.startDate} 
                              onChange={(date: string) => updateEvent(index, "startDate", date)}
                              placeholder="Select Start Date"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <NativeSelect label="Gender" value={event.gender} options={genderOpts} onChange={(v: string) => updateEvent(index, "gender", v)} />
                          <NativeSelect label="Participation Type" value={event.partType} options={partTypeOpts} onChange={(v: string) => updateEvent(index, "partType", v)} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <NativeSelect label="Sets Per Match" value={event.sets} options={setsOpts} onChange={(v: string) => updateEvent(index, "sets", v)} />
                          <NativeSelect label="Points Per Set" value={event.points} options={pointsOpts} onChange={(v: string) => updateEvent(index, "points", v)} />
                        </div>

                        <div className="pt-4 border-t border-[var(--color-border)]">
                          <ToggleSwitch 
                            label="Free Entry" 
                            checked={event.isFree} 
                            onChange={(val: boolean) => updateEvent(index, "isFree", val)} 
                          />
                        </div>

                        {!event.isFree && (
                          <div className="p-5 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] space-y-5 animate-in fade-in duration-300">
                             <NativeSelect label="Payment Option" value={event.paymentOption} options={paymentOpts} onChange={(v: string) => updateEvent(index, "paymentOption", v)} />
                             
                             {event.paymentOption === "Pay online (UPI)" && (
                               <div>
                                 <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Add UPI ID <span className="text-red-500">*</span></label>
                                 <input type="text" placeholder="e.g. name@okhdfc" value={event.upiId} onChange={(e) => updateEvent(index, "upiId", e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary outline-none" />
                               </div>
                             )}

                             <div>
                               <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Entry Fee <span className="text-red-500">*</span></label>
                               <div className="relative">
                                 <span className="absolute left-4 top-3.5 text-[var(--color-muted)] font-bold">₹</span>
                                 <input type="number" placeholder="0.00" value={event.fee} onChange={(e) => updateEvent(index, "fee", e.target.value)} className="w-full pl-9 pr-4 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary outline-none" />
                               </div>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={addEvent} className="w-full flex items-center justify-center py-4 rounded-xl border-2 border-dashed border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:border-primary hover:text-primary transition-colors bg-[var(--color-surface-elevated)]">
                    + Add Another Event
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Review & Publish */}
          {step === 4 && (
             <div className="space-y-6 pb-4">
               <div>
                 <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Review & Publish</h2>
                 <p className="text-sm text-[var(--color-muted)]">Ensure everything looks correct before going live.</p>
               </div>

               <div className="space-y-4">
                 <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                    <h3 className="text-sm font-bold text-[var(--color-muted)] uppercase tracking-wider mb-4 border-b border-[var(--color-border)] pb-2">Tournament Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-[var(--color-muted)]">Name</span><span className="font-semibold text-[var(--color-text)]">{formData.name || '—'}</span></div>
                      <div className="flex justify-between"><span className="text-[var(--color-muted)]">Start Date</span><span className="font-semibold text-[var(--color-text)]">{formData.startDate || '—'}</span></div>
                    </div>
                 </div>

                 <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                    <h3 className="text-sm font-bold text-[var(--color-muted)] uppercase tracking-wider mb-4 border-b border-[var(--color-border)] pb-2">Venue & Organizer</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-[var(--color-muted)]">Venue</span><span className="font-semibold text-[var(--color-text)]">{formData.venueName || '—'}</span></div>
                      <div className="flex justify-between"><span className="text-[var(--color-muted)]">Location</span><span className="font-semibold text-[var(--color-text)]">{[formData.city, formData.state].filter(Boolean).join(", ") || '—'}</span></div>
                      <div className="flex justify-between"><span className="text-[var(--color-muted)]">Courts</span><span className="font-semibold text-[var(--color-text)]">{formData.numCourts}</span></div>
                      <div className="flex justify-between"><span className="text-[var(--color-muted)]">Organizer</span><span className="font-semibold text-[var(--color-text)]">{formData.organizerName || '—'}</span></div>
                      <div className="flex justify-between"><span className="text-[var(--color-muted)]">Logo</span><span className="font-semibold text-[var(--color-text)]">{formData.logo?.name || '—'}</span></div>
                    </div>
                 </div>

                 <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
                    <h3 className="text-sm font-bold text-[var(--color-muted)] uppercase tracking-wider mb-4 border-b border-[var(--color-border)] pb-2">Events ({formData.events.length})</h3>
                    {formData.events.length === 0 ? (
                      <p className="text-sm text-[var(--color-muted)] italic">No events created.</p>
                    ) : (
                      <div className="space-y-3">
                        {formData.events.map((ev, i) => (
                          <details key={ev.id} className="group border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] open:ring-1 open:ring-primary">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-sm text-[var(--color-text)]">
                              <span>{ev.name || `Event ${i+1}`} <span className="text-[var(--color-muted)] font-normal ml-2">({ev.sport || 'Sport'})</span></span>
                              <ChevronRightIcon size={16} className="text-[var(--color-muted)] group-open:rotate-90 transition-transform" />
                            </summary>
                            <div className="text-[var(--color-muted)] text-xs px-4 pb-4 space-y-2 border-t border-[var(--color-border)] pt-3">
                              <div className="flex justify-between"><span>Format:</span> <span className="text-[var(--color-text)] font-semibold">{ev.format}</span></div>
                              <div className="flex justify-between"><span>Gender:</span> <span className="text-[var(--color-text)] font-semibold">{ev.gender}</span></div>
                              <div className="flex justify-between"><span>Sets:</span> <span className="text-[var(--color-text)] font-semibold">{ev.sets}</span></div>
                              <div className="flex justify-between"><span>Fee:</span> <span className="text-[var(--color-text)] font-semibold">{ev.isFree ? "Free Entry" : `₹${ev.fee}`}</span></div>
                            </div>
                          </details>
                        ))}
                      </div>
                    )}
                 </div>
               </div>
             </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex-none bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 md:px-6 flex justify-between items-center z-10 relative">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${step === 1 ? "opacity-0 pointer-events-none" : "text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)]"}`}
          >
            <ArrowLeftIcon size={16} /> Back
          </button>
          
          {step < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ background: "var(--gradient-orange)" }}
            >
              Continue <ChevronRightIcon size={16} />
            </button>
          ) : (
            <button
              onClick={() => onComplete(formData)}
              disabled={isPublishing}
              className="px-6 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:scale-[1.02] transition-transform"
              style={{ background: "var(--gradient-orange)" }}
            >
              {isPublishing ? "Publishing..." : "Publish"} <ChevronRightIcon size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
