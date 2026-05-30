"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  getChannelsAction, 
  getChannelMessagesAction, 
  sendChannelMessageAction, 
  createChannelAction 
} from "@/actions/chat";
import { getEmployeesAction } from "@/actions/employee";
import { 
  Hash, MessageSquare, Send, Plus, Users, RefreshCw, Loader2,
  Calendar, CheckCircle2, ChevronRight, Play, AlertOctagon, UserCircle
} from "lucide-react";

export default function AdminTeamChatPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  // Input fields
  const [typedMessage, setTypedMessage] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [isPrivateChannel, setIsPrivateChannel] = useState(false);
  
  // Loading & UI states
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [creatingChannel, setCreatingChannel] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [errorText, setErrorText] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChannels = async (selectFirst = false) => {
    setLoadingChannels(true);
    const res = await getChannelsAction();
    if (res.success && res.channels) {
      setChannels(res.channels);
      if (selectFirst && res.channels.length > 0) {
        setActiveChannel(res.channels[0]);
      }
    }
    setLoadingChannels(false);
  };

  const fetchMessages = async (channelId: string) => {
    setLoadingMessages(true);
    const res = await getChannelMessagesAction(channelId);
    if (res.success && res.messages) {
      setMessages(res.messages);
    }
    setLoadingMessages(false);
    // Scroll to bottom after state updates
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const fetchEmployeesData = async () => {
    const res = await getEmployeesAction();
    if (res.success && res.employees) {
      setEmployees(res.employees);
    }
  };

  useEffect(() => {
    fetchChannels(true);
    fetchEmployeesData();
  }, []);

  useEffect(() => {
    if (activeChannel) {
      fetchMessages(activeChannel.id);
    }
  }, [activeChannel]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChannel || sendingMessage) return;

    setSendingMessage(true);
    const textToSend = typedMessage.trim();
    setTypedMessage(""); // Optmistic clear

    const res = await sendChannelMessageAction(activeChannel.id, textToSend);
    if (res.success && res.message) {
      setMessages((prev) => [...prev, res.message]);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      setTypedMessage(textToSend); // Restore if error
    }
    setSendingMessage(false);
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    if (!newChannelName.trim() || creatingChannel) return;

    setCreatingChannel(true);
    const res = await createChannelAction(newChannelName.trim(), isPrivateChannel);
    if (res.success && res.channel) {
      setChannels((prev) => [...prev, res.channel].sort((a, b) => a.name.localeCompare(b.name)));
      setActiveChannel(res.channel);
      setNewChannelName("");
      setIsPrivateChannel(false);
      setShowChannelModal(false);
    } else {
      setErrorText(res.error || "Failed to create channel.");
    }
    setCreatingChannel(false);
  };

  // Compile all standup submissions from employees
  const recentStandups = employees
    .flatMap((emp) => {
      return (emp.standups || []).map((standup: any) => ({
        id: standup.id,
        employeeName: emp.user.name || emp.user.email,
        department: emp.department,
        date: new Date(standup.date),
        completedYesterday: standup.completedYesterday,
        planningToday: standup.planningToday,
        blockers: standup.blockers,
        productivityScore: standup.productivityScore,
      }));
    })
    // Sort by newest standup submission
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10); // Limit to top 10 recent

  return (
    <div className="h-[80vh] flex flex-col md:flex-row border border-white/5 rounded-2xl bg-[#0b0c14]/40 backdrop-blur-xl overflow-hidden animate-fade-in text-white">
      
      {/* 1. Channel Lists & Actions Sidebar */}
      <div className="w-full md:w-56 border-r border-white/5 bg-[#090a0f]/60 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0">
          <span className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-blue-500" /> Channels
          </span>
          <button 
            onClick={() => setShowChannelModal(true)}
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
            title="Create channel"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingChannels ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
            </div>
          ) : (
            channels.map((chan) => {
              const active = activeChannel?.id === chan.id;
              return (
                <button
                  key={chan.id}
                  onClick={() => setActiveChannel(chan)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xxs font-semibold flex items-center justify-between transition ${
                    active 
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Hash className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{chan.name.replace("#", "")}</span>
                  </span>
                  {chan.isPrivate && (
                    <span className="text-[8px] bg-zinc-800 text-zinc-500 px-1 py-0.5 rounded font-mono">PV</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Messages Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0e1017]/30">
        {activeChannel ? (
          <>
            {/* Messages Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0b0c14]/40 shrink-0">
              <div>
                <h2 className="text-xs font-bold text-white flex items-center gap-1">
                  <Hash className="h-4 w-4 text-blue-500" /> {activeChannel.name.replace("#", "")}
                </h2>
                <p className="text-[10px] text-zinc-500 mt-0.5">Internal agency collaboration room.</p>
              </div>

              <button 
                onClick={() => fetchMessages(activeChannel.id)}
                className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-zinc-400 hover:text-white"
                title="Refresh messages"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Chat History Flow */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="h-full flex flex-col justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <p className="text-[10px] text-zinc-500 mt-3 font-semibold uppercase tracking-wider">Syncing room history...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center">
                  <div className="h-10 w-10 rounded-full bg-zinc-850 flex items-center justify-center text-zinc-500 mb-3 border border-white/5">
                    <Hash className="h-5 w-5" />
                  </div>
                  <p className="text-xxs font-bold text-zinc-300">Welcome to the start of the #{activeChannel.name.replace("#", "")} room</p>
                  <p className="text-[9px] text-zinc-500 mt-1 max-w-xxs leading-relaxed">This marks the absolute beginning of team correspondence inside this operations workspace.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 hover:bg-white/2 p-1.5 rounded-lg transition-all group">
                    <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-[10px] text-blue-400 shrink-0">
                      {msg.senderName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xxs font-bold text-zinc-150">{msg.senderName}</span>
                        <span className="text-[8px] text-zinc-500 font-mono">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input box */}
            <div className="p-4 border-t border-white/5 bg-[#0b0c14]/40 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder={`Send correspondence in ${activeChannel.name}`}
                  className="flex-1 h-9 px-3 rounded-lg border border-white/10 bg-[#07080d] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!typedMessage.trim() || sendingMessage}
                  className="h-9 w-9 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
                >
                  {sendingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <MessageSquare className="h-8 w-8 text-zinc-700 mb-3" />
            <p className="text-xs font-semibold text-zinc-300">Select a channel to begin</p>
            <p className="text-[10px] text-zinc-500 mt-1">Correspondence room session not initiated.</p>
          </div>
        )}
      </div>

      {/* 3. Standups Feed Widget Sidebar */}
      <div className="w-full md:w-64 border-l border-white/5 bg-[#090a0f]/60 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5 flex items-center gap-1.5 shrink-0">
          <Calendar className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-zinc-400">Team Standup Reports</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {recentStandups.length === 0 ? (
            <p className="text-zinc-500 text-[10px] italic text-center py-8">No recent standup reports filed.</p>
          ) : (
            recentStandups.map((st) => (
              <div key={st.id} className="p-3 rounded-xl border border-white/5 bg-[#0b0c14]/40 hover:border-white/10 transition space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xxs font-bold text-zinc-200">{st.employeeName}</p>
                    <p className="text-[8px] text-zinc-500 uppercase font-mono">{st.department}</p>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                    {st.productivityScore}%
                  </span>
                </div>

                <div className="space-y-1 text-[10px]">
                  <div className="text-zinc-400">
                    <span className="font-bold text-zinc-500 block text-[8px] uppercase font-mono">Yesterday:</span>
                    <p className="line-clamp-2 leading-relaxed">{st.completedYesterday}</p>
                  </div>
                  <div className="text-zinc-400">
                    <span className="font-bold text-zinc-500 block text-[8px] uppercase font-mono">Today:</span>
                    <p className="line-clamp-2 leading-relaxed">{st.planningToday}</p>
                  </div>
                  {st.blockers && (
                    <div className="text-rose-400 bg-rose-500/5 p-1 rounded border border-rose-500/10 mt-1">
                      <span className="font-bold text-rose-500 block text-[8px] uppercase font-mono">Blockers:</span>
                      <p className="line-clamp-2 leading-relaxed">{st.blockers}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal - Create Channel */}
      {showChannelModal && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0b0c14] border border-white/10 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-scaleUp">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-white">Create New Channel</h3>
              <button 
                onClick={() => setShowChannelModal(false)}
                className="text-zinc-500 hover:text-white text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="p-6 space-y-4">
              {errorText && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/25 rounded-xl text-rose-400 text-xxs font-semibold">
                  {errorText}
                </div>
              )}

              <div>
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Channel Name</label>
                <input
                  type="text"
                  required
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g. design-assets"
                  className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#07080d] text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivateChannel}
                  onChange={(e) => setIsPrivateChannel(e.target.checked)}
                  className="rounded border-white/10 text-blue-600 focus:ring-0"
                />
                <label htmlFor="isPrivate" className="text-xxs text-zinc-300 cursor-pointer">Make this channel private</label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowChannelModal(false)}
                  className="h-9 px-4 rounded-lg border border-white/10 text-zinc-400 hover:text-white text-xxs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingChannel || !newChannelName.trim()}
                  className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white text-xxs font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  {creatingChannel ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span>Create Channel</span>
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
