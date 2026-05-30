"use client";

import React, { useEffect, useState } from "react";
import { 
  getProjectsListAction,
  createTaskAction, 
  updateTaskStatusAction, 
  addSubtaskAction, 
  toggleSubtaskAction, 
  addTaskCommentAction 
} from "@/actions/projectManager";
import { getEmployeesAction } from "@/actions/employee";
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Clock, 
  Calendar, 
  User, 
  ListTodo, 
  Loader2,
  AlertCircle,
  MessageSquare,
  Paperclip,
  CheckCircle,
  Play
} from "lucide-react";

const STAGES = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"];
const STAGE_LABELS: Record<string, string> = {
  TODO: "Todo Queue",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review & Quality",
  COMPLETED: "Completed",
};

export default function TasksPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterProject, setFilterProject] = useState("");

  // Dialog / Detail States
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // Form State
  const [newTask, setNewTask] = useState({
    projectId: "",
    title: "",
    description: "",
    priority: "MEDIUM",
    deadline: "",
    assignedToId: "",
  });
  const [creatingTask, setCreatingTask] = useState(false);

  // Subtask & Comment simulation states
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [projRes, empRes] = await Promise.all([
      getProjectsListAction(),
      getEmployeesAction()
    ]);

    if (projRes.success && projRes.projects) {
      setProjects(projRes.projects);
    }
    if (empRes.success && empRes.employees) {
      setEmployees(empRes.employees);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Collect all tasks across all projects
  const allTasks = projects.flatMap((p) => 
    p.tasks.map((t: any) => ({
      ...t,
      projectTitle: p.title,
      projectId: p.id
    }))
  );

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    // Optimistic UI update
    setProjects((prev) => 
      prev.map((proj) => ({
        ...proj,
        tasks: proj.tasks.map((t: any) => t.id === taskId ? { ...t, status: targetStage } : t)
      }))
    );

    const res = await updateTaskStatusAction(taskId, targetStage);
    if (!res.success) {
      alert(res.error || "Failed to update task status");
      loadData();
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.projectId) return;
    setCreatingTask(true);

    const res = await createTaskAction({
      projectId: newTask.projectId,
      title: newTask.title,
      description: newTask.description || undefined,
      priority: newTask.priority,
      deadline: newTask.deadline || undefined,
      assignedToId: newTask.assignedToId || undefined,
    });

    setCreatingTask(false);
    if (res.success) {
      setShowCreateTask(false);
      setNewTask({
        projectId: "",
        title: "",
        description: "",
        priority: "MEDIUM",
        deadline: "",
        assignedToId: "",
      });
      loadData();
    } else {
      alert(res.error || "Failed to create task");
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newSubtaskTitle.trim()) return;
    setSubmittingAction(true);

    const res = await addSubtaskAction(selectedTask.id, newSubtaskTitle);
    setSubmittingAction(false);
    if (res.success) {
      setNewSubtaskTitle("");
      const updatedSubtasks = [...(selectedTask.subtasks || []), res.subtask];
      setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks });
      loadData();
    } else {
      alert(res.error || "Failed to add subtask");
    }
  };

  const handleToggleSubtask = async (subtaskId: string, currentStatus: boolean) => {
    const res = await toggleSubtaskAction(subtaskId, !currentStatus);
    if (res.success) {
      const updatedSubtasks = selectedTask.subtasks.map((st: any) => 
        st.id === subtaskId ? { ...st, isCompleted: !currentStatus } : st
      );
      setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks });
      loadData();
    } else {
      alert(res.error || "Failed to update subtask");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newCommentText.trim()) return;
    setSubmittingAction(true);

    const res = await addTaskCommentAction(selectedTask.id, newCommentText);
    setSubmittingAction(false);
    if (res.success) {
      setNewCommentText("");
      // Realtime append comments local
      const commentRes = res.comment;
      const updatedComments = [commentRes, ...(selectedTask.comments || [])];
      setSelectedTask({ ...selectedTask, comments: updatedComments });
      loadData();
    } else {
      alert(res.error || "Failed to log comment");
    }
  };

  // Filter Tasks
  const filteredTasks = allTasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = filterPriority ? t.priority === filterPriority : true;
    const matchesProject = filterProject ? t.projectId === filterProject : true;
    return matchesSearch && matchesPriority && matchesProject;
  });

  if (loading) {
    return (
      <div className="min-h-[500px] w-full flex flex-col items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-xs text-zinc-400 font-semibold mt-4">Compiling agile task boards...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white animate-fadeIn">

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Task Sprints & Schedulers</h1>
          <p className="text-xs text-zinc-400">Manage daily task assignments, toggle milestones, and review designers revisions.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateTask(true)}
            className="h-10 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/10 flex items-center gap-1.5 transition"
          >
            <Plus className="h-4 w-4" /> Create Task
          </button>
        </div>
      </div>

      {/* Filters Board */}
      <div className="flex flex-col md:flex-row gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, keyword, context..."
            className="w-full h-10 pl-10 pr-4 bg-zinc-900/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="h-10 bg-zinc-900 border border-white/10 rounded-xl px-3 text-xs text-zinc-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="h-10 bg-zinc-900 border border-white/10 rounded-xl px-3 text-xs text-zinc-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Kanban Sprints Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px]">
          {STAGES.map((stage) => {
            const stageTasks = filteredTasks.filter((t) => t.status === stage);

            return (
              <div
                key={stage}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
                className="w-80 bg-zinc-950/40 border border-white/5 rounded-2xl p-4 flex flex-col min-h-[500px]"
              >
                {/* Stage Header */}
                <div className="flex justify-between items-center pb-3 mb-4 border-b border-white/5">
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{STAGE_LABELS[stage]}</h3>
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono font-bold">
                    {stageTasks.length}
                  </span>
                </div>

                {/* Stage Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => setSelectedTask(task)}
                      className="p-4 bg-[#0b0c14] border border-white/5 rounded-xl hover:border-blue-500/40 transition duration-150 cursor-pointer space-y-3 shadow-md hover:scale-[1.01]"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] uppercase bg-blue-500/10 border border-blue-500/25 text-blue-400 px-1.5 py-0.5 rounded font-mono truncate max-w-[150px]">
                          {task.projectTitle}
                        </span>
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded border ${
                          task.priority === "URGENT" 
                            ? "bg-red-500/10 text-red-400 border-red-500/20" 
                            : task.priority === "HIGH"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-zinc-800 text-zinc-300 border-white/5"
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-zinc-100 line-clamp-1">{task.title}</h4>
                      <p className="text-xxs text-zinc-500 line-clamp-2 leading-relaxed">{task.description || "No context provided."}</p>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assignedTo?.user?.name || "Unassigned"}
                        </span>
                        {task.deadline && (
                          <span className="text-zinc-400 font-bold">
                            {new Date(task.deadline).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE TASK DRAWER MODAL */}
      {showCreateTask && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h3 className="font-bold text-sm">Create Milestone Task</h3>
              <button 
                onClick={() => setShowCreateTask(false)}
                className="text-zinc-500 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Target Project</label>
                <select
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Design homepage hero mockup"
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                  placeholder="Detailed guidelines, reference link, specs..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-2">Deadline</label>
                  <input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Assignee</label>
                <select
                  value={newTask.assignedToId}
                  onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.user.name || emp.user.email} ({emp.department})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={creatingTask}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg shadow-lg disabled:opacity-50 transition"
              >
                {creatingTask ? "Spawning Task Entry..." : "Log Sprint Task"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TASK DETAILS SLIDEOVER DRAWER */}
      {selectedTask && (
        <div data-lenis-prevent className="fixed inset-y-0 right-0 w-96 bg-zinc-950/95 border-l border-white/10 z-50 shadow-2xl p-6 flex flex-col justify-between backdrop-blur-md animate-slideIn">
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="flex justify-between items-start pb-4 border-b border-white/5">
              <div>
                <span className="text-[10px] bg-white/5 border border-white/15 px-1 py-0.5 rounded font-mono text-blue-400 uppercase">
                  {selectedTask.projectTitle}
                </span>
                <h3 className="font-extrabold text-sm text-zinc-200 mt-2">{selectedTask.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedTask(null)}
                className="text-zinc-500 hover:text-white text-xs px-2"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed py-4 border-b border-white/5">
              {selectedTask.description || "No description details provided."}
            </p>

            {/* Subtasks checklist */}
            <div className="py-4 border-b border-white/5 space-y-3 text-xxs">
              <h4 className="font-bold text-zinc-400 uppercase tracking-wide">Subtasks Checklist</h4>
              
              <div className="space-y-2">
                {(!selectedTask.subtasks || selectedTask.subtasks.length === 0) ? (
                  <p className="text-zinc-600">No subtasks logged.</p>
                ) : (
                  selectedTask.subtasks.map((sub: any) => (
                    <div key={sub.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={sub.isCompleted}
                        onChange={() => handleToggleSubtask(sub.id, sub.isCompleted)}
                        className="rounded accent-blue-500 border-white/15 bg-zinc-900"
                      />
                      <span className={`text-zinc-300 font-medium ${sub.isCompleted ? "line-through text-zinc-500" : ""}`}>{sub.title}</span>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Add checklist subtask..."
                  className="bg-zinc-900 border border-white/10 px-2 py-1 rounded text-white text-xxs focus:outline-none flex-1"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-bold transition"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Comments Thread */}
            <div className="py-4 space-y-3 text-xxs">
              <h4 className="font-bold text-zinc-400 uppercase tracking-wide">Comments Discussion</h4>
              
              <form onSubmit={handleAddComment} className="space-y-2">
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  rows={2}
                  placeholder="Type updates or mention developers..."
                  className="w-full px-2 py-1.5 bg-zinc-900 border border-white/10 rounded focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-1.5 rounded transition"
                >
                  Send Comment
                </button>
              </form>

              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 mt-3">
                {(!selectedTask.comments || selectedTask.comments.length === 0) ? (
                  <p className="text-zinc-600 text-center py-2">No comments logged in discussion.</p>
                ) : (
                  selectedTask.comments.map((comment: any) => (
                    <div key={comment.id} className="p-2 bg-white/5 border border-white/5 rounded-xl space-y-1">
                      <div className="flex justify-between items-center font-bold text-zinc-400 text-[9px]">
                        <span>{comment.user?.name || comment.user?.email || "User"}</span>
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed font-medium">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
