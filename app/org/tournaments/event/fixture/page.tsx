"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeftIcon, 
  EllipsisIcon, 
  SearchIcon, 
  PlusIcon, 
  ChevronDownIcon, 
  XIcon, 
  CheckIcon,
  TrophyIcon,
  TrashIcon
} from "@/components/Icons";
import { useSearchParams } from "next/navigation";

// --- INITIAL MOCK STATE ---
const initialUnassigned = [
  { id: "p1", name: "Anil Kumar", avatar: "AK", hasBye: false },
  { id: "p2", name: "Rahul Singh", avatar: "RS", hasBye: true },
  { id: "p3", name: "Priya Patel", avatar: "PP", hasBye: false },
  { id: "p4", name: "John Doe", avatar: "JD", hasBye: false },
  { id: "p5", name: "Emily Chen", avatar: "EC", hasBye: false },
];

const initialMatches = {
  "Round 1": [
    { id: "m1", state: "upcoming", date: "12 Oct, 10:00 AM", p1: { id: "a1", name: "Anil Kumar" }, p2: { id: "a2", name: "Rajesh V." } },
    { id: "m2", state: "upcoming", date: "12 Oct, 11:30 AM", p1: { id: "a3", name: "Sarah Lee" }, p2: { id: "a4", name: "Mike Ross" } },
    { id: "m3", state: "empty", date: "TBD", p1: null, p2: null },
  ],
  "Round 2": [
    { id: "m4", state: "empty", date: "TBD", p1: null, p2: null },
    { id: "m5", state: "empty", date: "TBD", p1: null, p2: null },
  ],
  "Round 3": [
    { id: "m6", state: "empty", date: "TBD", p1: null, p2: null },
  ]
};

export default function FixtureSetupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tournamentId = searchParams.get("tournamentId") || "1";
  const eventId = searchParams.get("eventId") || "1";
  
  // Interactive States
  const [matches, setMatches] = useState<Record<string, any[]>>(initialMatches);
  const [unassigned, setUnassigned] = useState(initialUnassigned);
  
  const [activeRound, setActiveRound] = useState("Round 1");
  const [isRemainingOpen, setIsRemainingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // Selection State for Assignment
  const [selectedSlot, setSelectedSlot] = useState<{ matchId: string; position: 'p1' | 'p2' } | null>(null);

  // Derived
  const rounds = Object.keys(matches);
  const currentMatches = matches[activeRound] || [];

  // --- ACTIONS ---

  // 1. Reset Bracket
  const handleResetBrackets = () => {
    if (confirm("Reset brackets? All assigned players will return to the unassigned list.")) {
      setMatches({
        "Round 1": [{ id: "m1", state: "empty", date: "TBD", p1: null, p2: null }, { id: "m2", state: "empty", date: "TBD", p1: null, p2: null }],
        "Round 2": [{ id: "m3", state: "empty", date: "TBD", p1: null, p2: null }],
        "Round 3": []
      });
      setUnassigned([
        { id: "p1", name: "Anil Kumar", avatar: "AK", hasBye: false },
        { id: "p2", name: "Rahul Singh", avatar: "RS", hasBye: true },
        { id: "p3", name: "Priya Patel", avatar: "PP", hasBye: false },
        { id: "p4", name: "John Doe", avatar: "JD", hasBye: false },
        { id: "p5", name: "Rajesh V.", avatar: "RV", hasBye: false },
        { id: "p6", name: "Sarah Lee", avatar: "SL", hasBye: false },
        { id: "p7", name: "Mike Ross", avatar: "MR", hasBye: false },
        { id: "p8", name: "Emily Chen", avatar: "EC", hasBye: false },
      ]);
      setSelectedSlot(null);
    }
  };

  // 2. Add empty fixture
  const handleAddFixture = () => {
    setMatches(prev => ({
      ...prev,
      [activeRound]: [
        ...prev[activeRound],
        { id: `new-${Date.now()}`, state: "empty", date: "TBD", p1: null, p2: null }
      ]
    }));
  };

  // 3. Remove fixture (returns players to list)
  const handleRemoveFixture = (matchToRemove: any) => {
    const playersToReturn: Array<{ id: string; name: string; avatar: string; hasBye: boolean }> = [];
    
    if (matchToRemove.p1) playersToReturn.push({ id: matchToRemove.p1.id, name: matchToRemove.p1.name, avatar: matchToRemove.p1.name.substring(0,2).toUpperCase(), hasBye: false });
    if (matchToRemove.p2) playersToReturn.push({ id: matchToRemove.p2.id, name: matchToRemove.p2.name, avatar: matchToRemove.p2.name.substring(0,2).toUpperCase(), hasBye: false });

    if (playersToReturn.length > 0) {
      setUnassigned(prev => [...prev, ...playersToReturn]);
    }

    setMatches(prev => ({
      ...prev,
      [activeRound]: prev[activeRound].filter(m => m.id !== matchToRemove.id)
    }));
    
    if (selectedSlot?.matchId === matchToRemove.id) setSelectedSlot(null);
  };

  // 4. Click an empty slot to select it, or click an assigned player to unassign them
  const handleSlotClick = (matchId: string, position: 'p1' | 'p2', currentPlayer: any) => {
    if (currentPlayer) {
      // Unassign this player
      setUnassigned(prev => [...prev, { id: currentPlayer.id, name: currentPlayer.name, avatar: currentPlayer.name.substring(0,2).toUpperCase(), hasBye: false }]);
      setMatches(prev => {
        const roundMatches = [...prev[activeRound]];
        const matchIndex = roundMatches.findIndex(m => m.id === matchId);
        const updatedMatch = { ...roundMatches[matchIndex], [position]: null, state: "empty" }; // Revert to empty state
        roundMatches[matchIndex] = updatedMatch;
        return { ...prev, [activeRound]: roundMatches };
      });
      if (selectedSlot?.matchId === matchId && selectedSlot?.position === position) setSelectedSlot(null);
    } else {
      // Select slot for assignment
      setSelectedSlot({ matchId, position });
      setIsRemainingOpen(true); // Auto-open the player drawer
    }
  };

  // 5. Assign player from list
  const handleAssignClick = (player: any) => {
    let targetMatchId = selectedSlot?.matchId;
    let targetPosition = selectedSlot?.position;

    // Auto-find slot if none selected manually
    if (!targetMatchId || !targetPosition) {
      const firstEmptyMatch = currentMatches.find(m => !m.p1 || !m.p2);
      if (!firstEmptyMatch) {
        alert("No empty slots available in this round. Add a match first.");
        return;
      }
      targetMatchId = firstEmptyMatch.id;
      targetPosition = !firstEmptyMatch.p1 ? 'p1' : 'p2';
    }

    // 1. Remove from unassigned
    setUnassigned(prev => prev.filter(p => p.id !== player.id));
    
    // 2. Assign to match
    setMatches(prev => {
      const roundMatches = [...prev[activeRound]];
      const matchIndex = roundMatches.findIndex(m => m.id === targetMatchId);
      const updatedMatch = { ...roundMatches[matchIndex] };
      
      updatedMatch[targetPosition!] = { id: player.id, name: player.name };
      
      // If both are filled, transform to "upcoming" match
      if (updatedMatch.p1 && updatedMatch.p2) {
        updatedMatch.state = "upcoming";
      }

      roundMatches[matchIndex] = updatedMatch;
      return { ...prev, [activeRound]: roundMatches };
    });

    // Reset selection
    setSelectedSlot(null);
  };

  // Filter unassigned players
  const filteredUnassigned = unassigned.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans pb-24">
      
      {/* 1. Header Section */}
      <div className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] rounded-full transition-colors">
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="font-bold text-lg text-[var(--color-text)] tracking-tight">Fixture & Bracket Setup</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-3xl mx-auto">
        
        {/* 2. Tournament Info Card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-bold text-lg text-[var(--color-text)]">Pickleball Men's Open 2025</h2>
              <p className="text-sm font-medium text-[var(--color-muted)] mt-0.5">U-17 Open • 01 Dec 2026, 8:00 AM</p>
            </div>
            <button className="text-[var(--color-muted)] p-1 hover:bg-[var(--color-surface-elevated)] rounded-lg">
              <EllipsisIcon size={20} />
            </button>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[var(--color-text)]">{unassigned.length}</span>
              <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">Unassigned Players</span>
            </div>
            <button 
              onClick={handleResetBrackets}
              className="px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-sm font-bold text-red-500 hover:text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              Reset Brackets
            </button>
          </div>
        </div>

        {/* 3. Remaining Players Section */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden transition-all">
          <button 
            onClick={() => setIsRemainingOpen(!isRemainingOpen)}
            className="w-full flex items-center justify-between p-4 bg-[var(--color-surface-elevated)]"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--color-text)] text-sm">Remaining Players</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">{unassigned.length}/64</span>
            </div>
            <ChevronDownIcon size={18} className={`text-[var(--color-muted)] transition-transform duration-300 ${isRemainingOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isRemainingOpen && (
            <div className="p-4 border-t border-[var(--color-border)] space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="relative">
                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input 
                  type="text" 
                  placeholder="Search players..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl text-sm outline-none focus:border-primary text-[var(--color-text)]"
                />
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                {filteredUnassigned.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted)] text-center py-4">No unassigned players found.</p>
                ) : (
                  filteredUnassigned.map(player => (
                    <div key={player.id} className="flex items-center justify-between p-2 hover:bg-[var(--color-surface-elevated)] rounded-lg cursor-pointer transition-colors group border border-transparent hover:border-[var(--color-border)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-200 shadow-inner">
                          {player.avatar}
                        </div>
                        <span className="text-sm font-semibold text-[var(--color-text)]">{player.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {player.hasBye && (
                          <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                            Bye
                          </span>
                        )}
                        <button 
                          onClick={() => handleAssignClick(player)}
                          className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition-all"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 5. Matches Section */}
        <div className="pt-2 space-y-4">
          
          {/* A. Round Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {rounds.map(round => (
              <button 
                key={round}
                onClick={() => { setActiveRound(round); setSelectedSlot(null); }}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                  activeRound === round 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {round}
              </button>
            ))}
          </div>

          {/* B. Match Cards */}
          <div className="space-y-3">
            {currentMatches.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)]">
                <p className="text-sm text-[var(--color-muted)] font-medium">No fixtures in this round.</p>
              </div>
            )}

            {currentMatches.map((match: any, index: number) => (
              <div key={match.id} className="relative group">
                <div className="flex justify-between items-end mb-1.5 ml-1 mr-1">
                  <div className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider">
                    Match {index + 1}
                  </div>
                  {/* Remove Fixture Button */}
                  <button 
                    onClick={() => handleRemoveFixture(match)}
                    className="text-[var(--color-muted)] hover:text-red-500 transition-colors p-1"
                    title="Remove Fixture"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>

                {/* --- STATE 1: EMPTY OR PARTIALLY FILLED MATCH SLOT --- */}
                {match.state === "empty" && (
                  <div className={`border-2 border-[var(--color-border)] bg-[var(--color-surface)] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all min-h-[110px] ${
                    selectedSlot?.matchId === match.id ? "border-primary shadow-[0_0_15px_rgba(255,107,0,0.1)]" : "border-dashed hover:border-primary/50"
                  }`}>
                    
                    <div className="flex gap-4 items-center">
                      {/* P1 Slot */}
                      <button 
                        onClick={() => handleSlotClick(match.id, 'p1', match.p1)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm relative group/slot
                          ${match.p1 
                            ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold hover:scale-105" 
                            : selectedSlot?.matchId === match.id && selectedSlot?.position === 'p1'
                              ? "bg-primary/20 text-primary border-2 border-primary ring-4 ring-primary/20 scale-110"
                              : "bg-[var(--color-surface-elevated)] text-[var(--color-muted)] border border-[var(--color-border)] hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                          }`}
                        title={match.p1 ? "Click to unassign" : "Click to select slot"}
                      >
                        {match.p1 ? match.p1.name.substring(0,2).toUpperCase() : <PlusIcon size={20} />}
                        {match.p1 && <div className="absolute inset-0 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity backdrop-blur-sm"><XIcon size={16}/></div>}
                      </button>
                      
                      <div className="flex items-center justify-center text-[var(--color-muted)] font-black text-xs uppercase">VS</div>
                      
                      {/* P2 Slot */}
                      <button 
                        onClick={() => handleSlotClick(match.id, 'p2', match.p2)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm relative group/slot
                          ${match.p2 
                            ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold hover:scale-105" 
                            : selectedSlot?.matchId === match.id && selectedSlot?.position === 'p2'
                              ? "bg-primary/20 text-primary border-2 border-primary ring-4 ring-primary/20 scale-110"
                              : "bg-[var(--color-surface-elevated)] text-[var(--color-muted)] border border-[var(--color-border)] hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                          }`}
                        title={match.p2 ? "Click to unassign" : "Click to select slot"}
                      >
                        {match.p2 ? match.p2.name.substring(0,2).toUpperCase() : <PlusIcon size={20} />}
                        {match.p2 && <div className="absolute inset-0 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity backdrop-blur-sm"><XIcon size={16}/></div>}
                      </button>
                    </div>
                    
                    <div className="text-[11px] font-bold text-[var(--color-muted)] bg-[var(--color-surface-elevated)] px-3 py-1 rounded-full uppercase tracking-wider mt-1">
                      {selectedSlot?.matchId === match.id ? <span className="text-primary">Select a player from list ↑</span> : "Click slots to assign"}
                    </div>
                  </div>
                )}

                {/* --- STATE 2: UPCOMING (Fully Assigned but not started) --- */}
                {match.state === "upcoming" && (
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-1 shadow-sm flex flex-col relative overflow-hidden group-hover:border-[var(--color-text)] transition-colors">
                    
                    {/* Player 1 */}
                    <div className="flex items-center justify-between p-3 rounded-t-xl bg-[var(--color-surface)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                          {match.p1.name.substring(0,2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm text-[var(--color-text)]">
                          {match.p1.name}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-[var(--color-border)] w-full relative">
                       <div className="absolute top-1/2 left-6 -translate-y-1/2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[9px] font-black text-[var(--color-muted)] px-1.5 py-0.5 rounded uppercase tracking-widest z-10">VS</div>
                    </div>

                    {/* Player 2 */}
                    <div className="flex items-center justify-between p-3 rounded-b-xl bg-[var(--color-surface)]">
                      <div className="flex items-center gap-3 pl-8"> 
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                          {match.p2.name.substring(0,2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm text-[var(--color-text)]">
                          {match.p2.name}
                        </span>
                      </div>
                    </div>

                    {/* Date Footer */}
                    <div className="px-3 py-2 bg-[var(--color-surface-elevated)] border-t border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-muted)] rounded-b-xl flex justify-between items-center">
                      <span>{match.date}</span>
                      <button className="text-primary hover:text-orange-600 font-bold uppercase tracking-wider">Edit Slot</button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Fixture Button */}
            <button 
              onClick={handleAddFixture}
              className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] hover:bg-[var(--color-surface-elevated)] font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <PlusIcon size={16} /> Add Match to {activeRound}
            </button>
          </div>
        </div>
      </div>

      {/* 6. Publish Fixtures Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] z-40 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => setShowModal(true)}
            className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            style={{ background: "var(--gradient-orange)" }}
          >
            Publish Fixtures
          </button>
        </div>
      </div>

      {/* 7. Bracket Adjustment Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200" onClick={() => setShowModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-[var(--color-surface)] rounded-3xl shadow-2xl z-50 p-6 animate-in zoom-in-95 duration-200 border border-[var(--color-border)]">
            
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center mb-5 border-4 border-white dark:border-[var(--color-surface)] shadow-sm -mt-10 mx-auto">
               <TrophyIcon size={20} className="text-orange-600 dark:text-orange-500" />
            </div>

            <h3 className="text-center font-black text-lg text-[var(--color-text)] tracking-tight uppercase mb-2">
              Bracket Adjustment Needed
            </h3>
            
            <p className="text-center text-[var(--color-text)] font-medium text-sm mb-1">
              <span className="font-bold text-red-500">{unassigned.length} participants</span> are left unassigned.
            </p>
            <p className="text-center text-[var(--color-text)] font-medium text-sm mb-5">
              Are you willing to give them a bye?
            </p>

            <div className="bg-[var(--color-surface-elevated)] rounded-xl p-3 mb-6 border border-[var(--color-border)]">
              <p className="text-[11px] font-semibold text-[var(--color-muted)] leading-relaxed text-center">
                <strong className="text-[var(--color-text)]">Note:</strong> Once published, fixtures will be visible to players. You can edit them later.
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  setShowModal(false);
                  router.push(`/org/tournaments/event/matches?tournamentId=${encodeURIComponent(tournamentId)}&eventId=${encodeURIComponent(eventId)}`);
                }}
                className="w-full py-3 rounded-xl bg-green-500 text-white font-bold text-sm shadow-md hover:bg-green-600 transition-colors flex justify-center items-center gap-2"
              >
                <CheckIcon size={18} /> Give Bye
              </button>
              
              <button 
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-xl bg-[var(--color-surface)] border-2 border-red-500 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex justify-center items-center gap-2"
              >
                Remove Participants
              </button>
            </div>

            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-[var(--color-muted)] hover:text-[var(--color-text)] bg-[var(--color-surface-elevated)] p-1.5 rounded-full transition-colors">
              <XIcon size={16} />
            </button>
          </div>
        </>
      )}

    </div>
  );
}

