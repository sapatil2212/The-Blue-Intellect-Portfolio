"use client";

import React, { useEffect, useState } from "react";
import { 
  getEmployeesAction, 
  inviteEmployeeAction, 
  approveLeaveAction, 
  getLeaderboardAction,
  clockInAction,
  clockOutAction,
  submitDailyStandupAction
} from "@/actions/employee";
import { 
  UserCheck, 
  Plus, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Briefcase, 
  DollarSign, 
  Award,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  // Modals & Action States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);

  // Invite Form State
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "Developer",
    department: "Development",
    salary: "",
    skills: "",
    phone: "",
    emergencyContact: "",
  });

  // Attendance simulation states
  const [clockInNotes, setClockInNotes] = useState("");
  const [clockedInToday, setClockedInToday] = useState(false);

  // Standup simulation states
  const [showStandupForm, setShowStandupForm] = useState(false);
  const [standupForm, setStandupForm] = useState({
    completedYesterday: "",
    planningToday: "",
    blockers: "",
    productivityScore: 100,
  });

  const loadData = async () => {
    setLoading(true);
    const [empRes, leadRes] = await Promise.all([
      getEmployeesAction(),
      getLeaderboardAction()
    ]);

    if (empRes.success && empRes.employees) {
      setEmployees(empRes.employees);
    }
    if (leadRes.success && leadRes.leaderboard) {
      setLeaderboard(leadRes.leaderboard);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) return;
    setInviting(true);

    const res = await inviteEmployeeAction({
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      department: inviteForm.department,
      salary: parseFloat(inviteForm.salary) || 0,
      skills: inviteForm.skills || undefined,
      phone: inviteForm.phone || undefined,
      emergencyContact: inviteForm.emergencyContact || undefined,
    });

    setInviting(false);
    if (res.success) {
      alert("Employee invited successfully!");
      setShowInviteModal(false);
      setInviteForm({
        name: "",
        email: "",
        role: "Developer",
        department: "Development",
        salary: "",
        skills: "",
        phone: "",
        emergencyContact: "",
      });
      loadData();
    } else {
      alert(res.error || "Failed to invite employee");
    }
  };

  const handleLeaveApproval = async (leaveId: string, status: "APPROVED" | "REJECTED") => {
    setSubmittingAction(leaveId);
    const res = await approveLeaveAction(leaveId, status);
    setSubmittingAction(null);
    if (res.success) {
      alert(`Leave application marked as ${status}`);
      loadData();
    } else {
      alert(res.error || "Failed to process leave approval");
    }
  };

  const handleClockIn = async () => {
    const res = await clockInAction(clockInNotes || "Standard clock in.");
    if (res.success) {
      alert("Successfully clocked in for today!");
      setClockedInToday(true);
      setClockInNotes("");
      loadData();
    } else {
      alert(res.error || "Failed to clock in");
    }
  };

  const handleClockOut = async () => {
    const res = await clockOutAction("Leaving for the day.");
    if (res.success) {
      alert("Successfully clocked out for today!");
      loadData();
    } else {
      alert(res.error || "Failed to clock out");
    }
  };

  const handleStandupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await submitDailyStandupAction({
      completedYesterday: standupForm.completedYesterday,
      planningToday: standupForm.planningToday,
      blockers: standupForm.blockers || undefined,
      productivityScore: Number(standupForm.productivityScore),
    });

    if (res.success) {
      alert("Standup report submitted successfully!");
      setShowStandupForm(false);
      setStandupForm({
        completedYesterday: "",
        planningToday: "",
        blockers: "",
        productivityScore: 100,
      });
      loadData();
    } else {
      alert(res.error || "Failed to submit standup report");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const nameMatch = (emp.user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                      emp.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const deptMatch = filterDepartment ? emp.department === filterDepartment : true;
    return nameMatch && deptMatch;
  });

  const allLeaves = employees.flatMap((emp) => 
    (emp.leaves || []).map((leave: any) => ({
      ...leave,
      employeeName: emp.user.name || emp.user.email,
      employeeId: emp.employeeId,
      department: emp.department
    }))
  ).filter(l => l.status === "PENDING");

  const recentStandups = employees.flatMap((emp) => 
    (emp.standups || []).map((st: any) => ({
      ...st,
      employeeName: emp.user.name || emp.user.email,
      department: emp.department
    }))
  ).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-[500px] w-full flex flex-col items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-xs text-zinc-400 font-semibold mt-4">Compiling operations team directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Operations & HR Command</h1>
          <p className="text-xs text-zinc-400">Track clock-ins, review standups, balance leaves, and audit productivity logs.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInviteModal(true)}
            className="h-10 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/10 flex items-center gap-1.5 transition"
          >
            <Plus className="h-4 w-4" /> Invite Employee
          </button>
        </div>
      </div>

      {/* Grid of Quick Actions & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Self Portal Widget */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" /> Employee Self Portal
          </h3>
          <div className="p-4 bg-zinc-950/40 border border-white/5 rounded-xl space-y-3">
            <p className="text-xxs text-zinc-400 leading-relaxed">Simulate daily activity clocking. Attendance is auto-flagged late after 10:00 AM.</p>
            
            <div className="flex gap-2">
              <button 
                onClick={handleClockIn}
                className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-lg transition"
              >
                Clock In
              </button>
              <button 
                onClick={handleClockOut}
                className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-bold rounded-lg transition"
              >
                Clock Out
              </button>
            </div>

            <button
              onClick={() => setShowStandupForm(true)}
              className="w-full py-2 bg-blue-500/25 hover:bg-blue-500/35 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-lg transition"
            >
              Submit Daily Standup
            </button>
          </div>
        </div>

        {/* Leaves Approval Request Center */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-400" /> Pending Leaves Approval
          </h3>

          <div className="space-y-3 max-h-[170px] overflow-y-auto pr-1">
            {allLeaves.length === 0 ? (
              <p className="text-xxs text-zinc-500 text-center py-6">No pending leaves to review.</p>
            ) : (
              allLeaves.map((leave) => (
                <div key={leave.id} className="p-3 bg-zinc-950/40 border border-white/5 rounded-xl flex justify-between items-start text-xxs">
                  <div>
                    <h5 className="font-bold text-zinc-200">{leave.employeeName} ({leave.department})</h5>
                    <p className="text-zinc-400 font-mono mt-0.5">{new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</p>
                    <p className="text-zinc-500 mt-1 italic font-sans">"{leave.reason}"</p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleLeaveApproval(leave.id, "APPROVED")}
                      disabled={submittingAction === leave.id}
                      className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold hover:bg-emerald-500/20"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleLeaveApproval(leave.id, "REJECTED")}
                      disabled={submittingAction === leave.id}
                      className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded font-bold hover:bg-red-500/20"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Employee Leaderboard Tracker */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" /> Employee Leaderboard
          </h3>

          <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
            {leaderboard.slice(0, 5).map((user, idx) => (
              <div key={user.id} className="flex justify-between items-center p-2.5 bg-zinc-950/40 border border-white/5 rounded-xl text-xxs">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-zinc-500 w-4 font-mono">{idx + 1}.</span>
                  <div className="truncate">
                    <h5 className="font-bold text-zinc-200 truncate">{user.name}</h5>
                    <p className="text-zinc-500 font-semibold uppercase">{user.department}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-blue-400">{user.score} pts</span>
                  <p className="text-zinc-500">Eff: {user.averageProductivity}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Directory Filters */}
      <div className="flex flex-col md:flex-row gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees by ID, name, email..."
            className="w-full h-10 pl-10 pr-4 bg-zinc-900/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="h-10 bg-zinc-900 border border-white/10 rounded-xl px-3 text-xs text-zinc-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="">All Departments</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      {/* Main Directory & Attendance / Standups Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Employee Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Employee Registry Directory</h3>
              <span className="text-xxs text-zinc-500 font-mono">Found {filteredEmployees.length} profiles</span>
            </div>

            <div className="p-6 divide-y divide-white/5">
              {filteredEmployees.length === 0 ? (
                <p className="text-xs text-zinc-500 py-10 text-center">No employee records registered matching filters.</p>
              ) : (
                filteredEmployees.map((emp) => {
                  const clockLogs = emp.attendance || [];
                  const lastClock = clockLogs[0];
                  
                  return (
                    <div key={emp.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-zinc-200">{emp.user.name || emp.user.email}</h4>
                          <span className="text-[9px] font-mono px-2 py-0.5 bg-blue-500/10 border border-blue-500/25 text-blue-400 rounded">
                            {emp.employeeId}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                          {emp.department} | {emp.user.role}
                        </p>
                        {emp.skills && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {emp.skills.split(",").map((s: string) => (
                              <span key={s} className="text-[8px] bg-white/5 text-zinc-400 border border-white/5 px-1.5 py-0.5 rounded font-medium">
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2 justify-end">
                          <DollarSign className="h-3 w-3 text-zinc-500" />
                          <span className="font-mono text-zinc-300 font-semibold">${emp.salary.toLocaleString()}/mo</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {lastClock ? (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <CheckCircle className="h-3 w-3" /> Last Active: {new Date(lastClock.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          ) : (
                            <span className="text-zinc-600">No clock logs registered</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Standup logs feed */}
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" /> Recent Daily Standups
            </h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {recentStandups.length === 0 ? (
                <p className="text-xxs text-zinc-500 text-center py-10">No standup logs submitted today.</p>
              ) : (
                recentStandups.map((st) => (
                  <div key={st.id} className="p-3 bg-zinc-950/40 border border-white/5 rounded-xl space-y-2 text-xxs">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1">
                      <span className="font-bold text-zinc-200">{st.employeeName}</span>
                      <span className="text-blue-400 font-bold font-mono">{st.productivityScore}% Productivity</span>
                    </div>
                    <div>
                      <p className="text-zinc-500 font-bold uppercase text-[9px]">Completed:</p>
                      <p className="text-zinc-400">{st.completedYesterday}</p>
                    </div>
                    <div>
                      <p className="text-indigo-400 font-bold uppercase text-[9px]">Planning:</p>
                      <p className="text-zinc-400">{st.planningToday}</p>
                    </div>
                    {st.blockers && (
                      <div className="p-1.5 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-[10px]">
                        ⚠️ Blocker: {st.blockers}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* INVITE EMPLOYEE MODAL */}
      {showInviteModal && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h3 className="font-bold text-sm">Invite Employee & Set RBAC</h3>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-zinc-500 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Corporate Email</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="alex@aetheragency.com"
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-2">Assigned Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  >
                    <option value="Developer">Developer</option>
                    <option value="Graphic Designer">Graphic Designer</option>
                    <option value="Video Editor">Video Editor</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="HR">HR Officer</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Telecaller">Telecaller</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-2">Department</label>
                  <select
                    value={inviteForm.department}
                    onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  >
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Salary ($ / Month)</label>
                <input
                  type="number"
                  value={inviteForm.salary}
                  onChange={(e) => setInviteForm({ ...inviteForm, salary: e.target.value })}
                  placeholder="e.g. 4500"
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={inviteForm.skills}
                  onChange={(e) => setInviteForm({ ...inviteForm, skills: e.target.value })}
                  placeholder="e.g. React, Next.js, Node.js"
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={inviting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg shadow-lg disabled:opacity-50 transition"
              >
                {inviting ? "Inviting Employee..." : "Create Operational Profile"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STANDUP SUBMISSION MODAL */}
      {showStandupForm && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h3 className="font-bold text-sm">Submit Daily Standup Report</h3>
              <button 
                onClick={() => setShowStandupForm(false)}
                className="text-zinc-500 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleStandupSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Completed Yesterday</label>
                <textarea
                  value={standupForm.completedYesterday}
                  onChange={(e) => setStandupForm({ ...standupForm, completedYesterday: e.target.value })}
                  rows={2}
                  placeholder="Describe your completed sprint deliverables..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Planning Today</label>
                <textarea
                  value={standupForm.planningToday}
                  onChange={(e) => setStandupForm({ ...standupForm, planningToday: e.target.value })}
                  rows={2}
                  placeholder="Describe what tasks you're focusing on..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Current Blockers / Impediments (Optional)</label>
                <textarea
                  value={standupForm.blockers}
                  onChange={(e) => setStandupForm({ ...standupForm, blockers: e.target.value })}
                  rows={1}
                  placeholder="e.g. Waiting on API verification docs..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Self Productivity Rating ({standupForm.productivityScore}%)</label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={standupForm.productivityScore}
                  onChange={(e) => setStandupForm({ ...standupForm, productivityScore: Number(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg shadow-lg transition"
              >
                Log Standup Report
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
