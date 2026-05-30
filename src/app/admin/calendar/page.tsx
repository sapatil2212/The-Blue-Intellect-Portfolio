"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCalendarEventsAction, createMeetingAction, CalendarEvent } from "@/actions/calendar";
import { 
  ChevronLeft, ChevronRight, Plus, Clock, Video, Users, AlertCircle, 
  Info, X, Calendar as CalendarIcon, Loader2, ArrowLeft, VideoOff, RefreshCw
} from "lucide-react";

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // Filters
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetTitle, setMeetTitle] = useState("");
  const [meetDesc, setMeetDesc] = useState("");
  const [meetStart, setMeetStart] = useState("");
  const [meetEnd, setMeetEnd] = useState("");
  const [meetType, setMeetType] = useState("INTERNAL");
  const [meetLink, setMeetLink] = useState("");
  const [meetAttendeesText, setMeetAttendeesText] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    const res = await getCalendarEventsAction();
    if (res.success && res.events) {
      setEvents(res.events);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setModalSuccess("");

    if (!meetTitle.trim() || !meetStart || !meetEnd) {
      setModalError("Please fill out all required fields.");
      return;
    }

    if (new Date(meetStart) >= new Date(meetEnd)) {
      setModalError("Start time must be before end time.");
      return;
    }

    setActionLoading(true);
    try {
      const attendees = meetAttendeesText
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

      const res = await createMeetingAction({
        title: meetTitle.trim(),
        description: meetDesc.trim(),
        startTime: meetStart,
        endTime: meetEnd,
        type: meetType,
        link: meetLink.trim() || undefined,
        attendees: attendees.length > 0 ? attendees : undefined,
      });

      if (res.success) {
        setModalSuccess("Meeting successfully booked and notifications dispatched!");
        setMeetTitle("");
        setMeetDesc("");
        setMeetStart("");
        setMeetEnd("");
        setMeetType("INTERNAL");
        setMeetLink("");
        setMeetAttendeesText("");
        
        await fetchEvents();
        setTimeout(() => {
          setIsModalOpen(false);
          setModalSuccess("");
        }, 1500);
      } else {
        setModalError(res.error || "Failed to book meeting.");
      }
    } catch (err: any) {
      setModalError(err.message || "An unexpected error occurred.");
    } finally {
      setActionLoading(false);
    }
  };

  // Calendar Math helper functions
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // Day index of the first of month (0 = Sun, 6 = Sat)

  // Generate grid indices
  const calendarCells: (Date | null)[] = [];
  // Pad previous month days
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  // Fill current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(new Date(year, month, d));
  }

  const navigateMonth = (direction: "PREV" | "NEXT") => {
    const offset = direction === "PREV" ? -1 : 1;
    setCurrentDate(new Date(year, month + offset, 1));
  };

  // Helper to query events on a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter((ev) => {
      const startD = new Date(ev.start);
      const endD = new Date(ev.end);
      
      // Zero out times for date comparison
      const cellTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const startCell = new Date(startD.getFullYear(), startD.getMonth(), startD.getDate()).getTime();
      const endCell = new Date(endD.getFullYear(), endD.getMonth(), endD.getDate()).getTime();
      
      const inRange = cellTime >= startCell && cellTime <= endCell;
      const typeMatches = activeFilter === "ALL" || ev.type === activeFilter;
      return inRange && typeMatches;
    });
  };

  // Event category metadata configurations
  const getEventColors = (type: string) => {
    switch (type) {
      case "PROJECT":
        return { text: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/20", indicator: "bg-purple-500" };
      case "TASK":
        return { text: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/20", indicator: "bg-blue-500" };
      case "LEAD_FOLLOWUP":
        return { text: "text-amber-400", bg: "bg-amber-600/10 border-amber-500/20", indicator: "bg-amber-500" };
      case "MEETING":
        return { text: "text-emerald-400", bg: "bg-emerald-600/10 border-emerald-500/20", indicator: "bg-emerald-500" };
      case "LEAVE":
        return { text: "text-rose-400", bg: "bg-rose-600/10 border-rose-500/20", indicator: "bg-rose-500" };
      default:
        return { text: "text-zinc-400", bg: "bg-zinc-600/10 border-zinc-500/20", indicator: "bg-zinc-500" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center bg-[#090a0f] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-xs text-zinc-400 font-semibold tracking-wider mt-4 animate-pulse">Synchronizing Global Schedulers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Back button */}
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Control Dashboard</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black tracking-tight font-display bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Global Schedule Calendar
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Monitor project deliverables, deadlines, client meetings, and resource availabilities.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={fetchEvents}
            className="p-2 border border-white/5 bg-white/5 hover:bg-white/10 rounded-xl transition text-zinc-400 hover:text-white"
            title="Reload schedule data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 active:scale-95 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Meeting Call</span>
          </button>
        </div>
      </div>

      {/* Calendar Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 border border-white/5 bg-[#0b0c14]/40 backdrop-blur-xl rounded-xl">
        {[
          { label: "All Items", value: "ALL" },
          { label: "Meetings", value: "MEETING", color: "bg-emerald-500" },
          { label: "Deliverables", value: "PROJECT", color: "bg-purple-500" },
          { label: "Tasks Due", value: "TASK", color: "bg-blue-500" },
          { label: "Leads followups", value: "LEAD_FOLLOWUP", color: "bg-amber-500" },
          { label: "Leaves", value: "LEAVE", color: "bg-rose-500" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition ${
              activeFilter === f.value
                ? "bg-blue-600 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            {f.color && <span className={`h-1.5 w-1.5 rounded-full ${f.color}`} />}
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Calendar Layout: Main grid and detail drawer side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Monthly Grid Grid */}
        <div className="lg:col-span-8 border border-white/5 bg-[#0b0c14]/40 backdrop-blur-xl rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-300">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1 bg-white/5 rounded-xl border border-white/5 p-1">
              <button 
                onClick={() => navigateMonth("PREV")}
                className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={() => navigateMonth("NEXT")}
                className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2 min-h-[300px]">
            {calendarCells.map((cell, idx) => {
              if (cell === null) {
                return (
                  <div 
                    key={`empty-${idx}`} 
                    className="aspect-square bg-transparent rounded-lg"
                  />
                );
              }

              const cellEvents = getEventsForDay(cell);
              const isToday = new Date().toDateString() === cell.toDateString();

              return (
                <div
                  key={`day-${cell.getDate()}`}
                  className={`aspect-square p-1.5 rounded-xl border flex flex-col justify-between transition-all select-none hover:bg-white/5 cursor-pointer ${
                    isToday 
                      ? "border-blue-500/40 bg-blue-500/5 shadow-md shadow-blue-500/5" 
                      : "border-white/5 bg-[#0e1017]/40"
                  }`}
                  onClick={() => {
                    if (cellEvents.length > 0) {
                      setSelectedEvent(cellEvents[0]);
                    }
                  }}
                >
                  <span className={`text-[10px] font-bold ${isToday ? "text-blue-400" : "text-zinc-400"}`}>
                    {cell.getDate()}
                  </span>

                  <div className="flex flex-wrap gap-1 max-h-8 overflow-hidden items-end justify-end">
                    {cellEvents.map((ev) => {
                      const colors = getEventColors(ev.type);
                      return (
                        <div 
                          key={ev.id}
                          className={`h-1.5 w-1.5 rounded-full ${colors.indicator}`}
                          title={ev.title}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Event Details Panel */}
        <div className="lg:col-span-4 border border-white/5 bg-[#0b0c14]/40 backdrop-blur-xl rounded-2xl p-6 min-h-[350px] flex flex-col justify-between">
          {selectedEvent ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <Info className="h-4.5 w-4.5 text-blue-500" /> Event Details
                </span>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-black text-zinc-100">{selectedEvent.title}</h3>
                  <span className={`inline-flex px-2 py-0.5 rounded border text-[8px] font-bold font-mono mt-1.5 ${getEventColors(selectedEvent.type).bg} ${getEventColors(selectedEvent.type).text}`}>
                    {selectedEvent.type} • {selectedEvent.status}
                  </span>
                </div>

                <div className="space-y-2 text-xxs text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                  {selectedEvent.description && (
                    <div>
                      <span className="font-bold text-zinc-500 uppercase block font-mono">Description:</span>
                      <p>{selectedEvent.description}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    <span>
                      {new Date(selectedEvent.start).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                      {selectedEvent.start !== selectedEvent.end && ` - ${new Date(selectedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </span>
                  </div>

                  {selectedEvent.priority && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Priority: <strong className="text-zinc-300 font-bold uppercase">{selectedEvent.priority}</strong></span>
                    </div>
                  )}

                  {selectedEvent.meta?.host && (
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Organizer: <strong className="text-zinc-300 font-bold">{selectedEvent.meta.host}</strong></span>
                    </div>
                  )}

                  {selectedEvent.meta?.attendees && selectedEvent.meta.attendees.length > 0 && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="font-bold text-zinc-500 uppercase block font-mono">Attendees ({selectedEvent.meta.attendees.length}):</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedEvent.meta.attendees.map((email: string, i: number) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 font-mono text-[8px] text-zinc-400">
                            {email}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedEvent.link && (
                <div className="pt-4 border-t border-white/5">
                  <a 
                    href={selectedEvent.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-9 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 text-xxs font-bold transition active:scale-95 cursor-pointer"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Launch Meeting Room</span>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center my-auto py-16">
              <CalendarIcon className="h-8 w-8 text-zinc-700 mb-3 animate-pulse" />
              <p className="text-xs font-semibold text-zinc-400">No date event selected</p>
              <p className="text-[9px] text-zinc-500 mt-1 max-w-xxs">Click on dates containing status indicators to read operational specifics.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Schedule Meeting Call */}
      {isModalOpen && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0b0c14] border border-white/10 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-scaleUp">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Video className="h-4.5 w-4.5 text-emerald-500" /> Schedule Meeting Call
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="p-6 space-y-4">
              {modalError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-400 text-xxs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{modalError}</span>
                </div>
              )}

              {modalSuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-xxs font-semibold">
                  {modalSuccess}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Meeting Title *</label>
                  <input
                    type="text"
                    required
                    value={meetTitle}
                    onChange={(e) => setMeetTitle(e.target.value)}
                    placeholder="e.g. Logo Design Review"
                    className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#07080d] text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Meeting Type *</label>
                  <select
                    value={meetType}
                    onChange={(e) => setMeetType(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#07080d] text-xs text-zinc-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="INTERNAL">INTERNAL</option>
                    <option value="CLIENT">CLIENT</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Room Link (Optional)</label>
                  <input
                    type="text"
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    placeholder="Jitsi Generated Auto"
                    className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#07080d] text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  value={meetDesc}
                  onChange={(e) => setMeetDesc(e.target.value)}
                  placeholder="Outline agenda items or key takeaways..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg border border-white/10 bg-[#07080d] text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Start Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={meetStart}
                    onChange={(e) => setMeetStart(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#07080d] text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">End Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={meetEnd}
                    onChange={(e) => setMeetEnd(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#07080d] text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Attendee Emails (Comma separated)</label>
                <input
                  type="text"
                  value={meetAttendeesText}
                  onChange={(e) => setMeetAttendeesText(e.target.value)}
                  placeholder="e.g. dev@aether.com, pm@aether.com"
                  className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#07080d] text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Book Schedule</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
