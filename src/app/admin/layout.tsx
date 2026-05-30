"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUserAction, logoutAction } from "@/actions/auth";
import { getNotificationsAction, markAsReadAction } from "@/actions/notification";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { 
  LayoutDashboard, 
  FolderKanban, 
  LogOut, 
  Loader2, 
  User, 
  Users, 
  CheckSquare, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Calendar, 
  UserCheck, 
  Settings, 
  Bell, 
  Command, 
  Search,
  Layers,
  Menu,
  X,
  ChevronRight
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Operations",
    links: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin", "Project Manager", "HR", "Accountant"] },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban, roles: ["Admin", "Project Manager", "Developer", "Graphic Designer", "Video Editor", "Accountant"] },
      { href: "/admin/tasks", label: "Tasks", icon: CheckSquare, roles: ["Admin", "Project Manager", "Developer", "Graphic Designer", "Video Editor"] },
      { href: "/admin/calendar", label: "Calendar", icon: Calendar, roles: ["Admin", "HR", "Project Manager", "Developer", "Graphic Designer", "Video Editor", "Accountant", "Sales Executive", "Telecaller"] },
    ]
  },
  {
    label: "Business",
    links: [
      { href: "/admin/crm", label: "CRM & Leads", icon: Users, roles: ["Admin", "Sales Executive", "Telecaller", "Project Manager"] },
      { href: "/admin/finance", label: "Finance", icon: CreditCard, roles: ["Admin", "Accountant"] },
      { href: "/admin/portfolio", label: "Portfolio", icon: Layers, roles: ["Admin", "Project Manager", "Developer", "Graphic Designer", "Video Editor", "Accountant"] },
    ]
  },
  {
    label: "Team",
    links: [
      { href: "/admin/employees", label: "Employees", icon: UserCheck, roles: ["Admin", "HR"] },
      { href: "/admin/chat", label: "Chat & Standups", icon: MessageSquare, roles: ["Admin", "HR", "Project Manager", "Developer", "Graphic Designer", "Video Editor", "Accountant", "Sales Executive", "Telecaller"] },
      { href: "/admin/documents", label: "Documents", icon: FileText, roles: ["Admin", "HR", "Project Manager", "Developer", "Graphic Designer", "Video Editor", "Accountant"] },
    ]
  },
  {
    label: "Admin",
    links: [
      { href: "/admin/onboarding", label: "Onboarding", icon: UserCheck, roles: ["Super Admin", "Admin", "Sales Executive"] },
      { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["Super Admin", "Admin"] },
    ]
  }
];

function SidebarContent({
  user,
  pathname,
  onNavigate,
  onLogout,
  onOpenCommandPalette,
  onToggleNotifications,
  unreadCount,
}: {
  user: { name: string | null; role: string; email: string };
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
  onOpenCommandPalette: () => void;
  onToggleNotifications: () => void;
  unreadCount: number;
}) {
  const visibleGroups = NAV_GROUPS.map(group => ({
    ...group,
    links: group.links.filter(l => l.roles.includes(user.role))
  })).filter(g => g.links.length > 0);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-neutral-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <span className="text-base font-black text-white">Æ</span>
          </div>
          <div>
            <p className="text-sm font-extrabold text-neutral-900 dark:text-white tracking-tight leading-none">AetherOS</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mt-0.5">Control Hub</p>
          </div>
        </div>
      </div>

      {/* Command search */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-500 dark:text-zinc-400 hover:border-neutral-300 dark:hover:border-white/20 hover:bg-neutral-150 dark:hover:bg-white/8 transition-all cursor-pointer group"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span>Quick search...</span>
          </span>
          <kbd className="text-[9px] bg-white dark:bg-zinc-800 text-neutral-500 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-white/10 font-mono">⌘K</kbd>
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-2 space-y-4" style={{ scrollbarWidth: "thin" }}>
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-zinc-600 px-3 mb-1">{group.label}</p>
            <div className="space-y-0.5">
              {group.links.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} onClick={onNavigate}>
                    <span className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer group ${
                      active
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold"
                        : "text-neutral-600 dark:text-zinc-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
                    }`}>
                      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-blue-600 dark:text-blue-400" : "text-neutral-400 dark:text-zinc-500 group-hover:text-neutral-600 dark:group-hover:text-zinc-300"}`} />
                      <span className="truncate">{link.label}</span>
                      {active && <ChevronRight className="h-3 w-3 ml-auto text-blue-500 dark:text-blue-400 shrink-0" />}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-3 border-t border-neutral-200 dark:border-white/5 space-y-2">
        {/* Controls row */}
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-zinc-600">System</span>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={onToggleNotifications}
              className="relative p-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-neutral-50 dark:hover:bg-white/10 text-neutral-500 dark:text-zinc-400 transition cursor-pointer"
            >
              <Bell className="h-3.5 w-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[8px] font-bold flex items-center justify-center text-white border-2 border-white dark:border-neutral-900">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* User card */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
          <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate leading-tight">{user.name || "Administrator"}</p>
            <p className="text-[10px] text-neutral-500 dark:text-zinc-500 truncate">{user.role}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300 transition-all cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string; name: string | null; role: string; status: string } | null>(null);

  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    async function verifyAuth() {
      const currentUser = await getCurrentUserAction();
      if (!currentUser || currentUser.status !== "ACTIVE") {
        router.push("/login");
        return;
      }
      if (currentUser.role === "Client") {
        router.push("/client");
        return;
      }
      if (currentUser.role === "Super Admin") {
        const allowedPaths = ["/admin/onboarding", "/admin/settings"];
        if (!allowedPaths.includes(pathname)) {
          router.push("/admin/onboarding");
          return;
        }
      }
      setIsAuthenticated(true);
      setUser(currentUser);
      setIsLoading(false);
      const notifRes = await getNotificationsAction();
      if (notifRes.success && notifRes.notifications) {
        setNotifications(notifRes.notifications);
      }
    }
    verifyAuth();
  }, [router, pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowCommandPalette(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  const handleMarkAsRead = async (notifId: string) => {
    const res = await markAsReadAction(notifId);
    if (res.success) {
      setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n)));
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-xs text-neutral-500 dark:text-zinc-400 font-semibold tracking-wider mt-4 animate-pulse">Loading AetherOS...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const allCommandOptions = [
    { label: "Dashboard Overview", href: "/admin", roles: ["Admin", "Project Manager", "HR", "Accountant"] },
    { label: "CRM & Leads Pipeline", href: "/admin/crm", roles: ["Admin", "Sales Executive", "Telecaller", "Project Manager"] },
    { label: "Projects & Sprints", href: "/admin/projects", roles: ["Admin", "Project Manager", "Developer", "Graphic Designer", "Video Editor", "Accountant"] },
    { label: "Portfolio Showcase", href: "/admin/portfolio", roles: ["Admin", "Project Manager", "Developer", "Graphic Designer", "Video Editor", "Accountant"] },
    { label: "Task Kanban Board", href: "/admin/tasks", roles: ["Admin", "Project Manager", "Developer", "Graphic Designer", "Video Editor"] },
    { label: "Global Calendar", href: "/admin/calendar", roles: ["Admin", "HR", "Project Manager", "Developer", "Graphic Designer", "Video Editor", "Accountant", "Sales Executive", "Telecaller"] },
    { label: "Finance & Invoices", href: "/admin/finance", roles: ["Admin", "Accountant"] },
    { label: "Document Vault", href: "/admin/documents", roles: ["Admin", "HR", "Project Manager", "Developer", "Graphic Designer", "Video Editor", "Accountant"] },
    { label: "Chat & Standups", href: "/admin/chat", roles: ["Admin", "HR", "Project Manager", "Developer", "Graphic Designer", "Video Editor", "Accountant", "Sales Executive", "Telecaller"] },
    { label: "Onboarding Queue", href: "/admin/onboarding", roles: ["Super Admin", "Admin", "Sales Executive"] },
    { label: "Settings Panel", href: "/admin/settings", roles: ["Super Admin", "Admin"] },
  ];

  const filteredCommands = allCommandOptions
    .filter((c) => c.roles.includes(user.role))
    .filter((c) => c.label.toLowerCase().includes(commandSearch.toLowerCase()));

  const currentPageLabel = NAV_GROUPS.flatMap(g => g.links).find(l => l.href === pathname)?.label || "Dashboard";

  return (
    <div className="admin-layout min-h-screen bg-neutral-50 dark:bg-[#090a0f] text-foreground flex relative">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-60 lg:w-64 shrink-0 flex-col sticky top-0 h-screen border-r border-neutral-200 dark:border-white/5 bg-white dark:bg-[#0b0c14] z-20">
        <SidebarContent
          user={user}
          pathname={pathname}
          onLogout={handleLogout}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          onToggleNotifications={() => setShowNotifications(p => !p)}
          unreadCount={unreadNotifCount}
        />
      </aside>

      {/* ── Mobile Backdrop ── */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${showMobileSidebar ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowMobileSidebar(false)}
      />

      {/* ── Mobile Sidebar ── */}
      <aside
        data-lenis-prevent
        className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0b0c14] border-r border-neutral-200 dark:border-white/5 z-50 md:hidden transition-transform duration-300 ease-in-out shadow-2xl ${showMobileSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button */}
        <button
          onClick={() => setShowMobileSidebar(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-500 dark:text-zinc-400 transition z-10"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent
          user={user}
          pathname={pathname}
          onNavigate={() => setShowMobileSidebar(false)}
          onLogout={handleLogout}
          onOpenCommandPalette={() => { setShowMobileSidebar(false); setShowCommandPalette(true); }}
          onToggleNotifications={() => { setShowMobileSidebar(false); setShowNotifications(p => !p); }}
          unreadCount={unreadNotifCount}
        />
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <header className="h-14 border-b border-neutral-200 dark:border-white/5 bg-white dark:bg-[#0b0c14] flex items-center justify-between px-4 md:hidden sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowMobileSidebar(p => !p)}
              className="p-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-white/10 transition cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                <span className="text-xs font-black text-white">Æ</span>
              </div>
              <span className="text-sm font-bold text-neutral-900 dark:text-white truncate">{currentPageLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setShowNotifications(p => !p)}
              className="relative p-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-600 dark:text-zinc-300 transition cursor-pointer"
            >
              <Bell className="h-3.5 w-3.5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 text-[8px] font-bold flex items-center justify-center text-white">
                  {unreadNotifCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowCommandPalette(true)}
              className="p-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-600 dark:text-zinc-300 cursor-pointer"
            >
              <Command className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* ── Notifications Drawer ── */}
      {showNotifications && (
        <div
          data-lenis-prevent
          className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-white/10 z-50 shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-white/5">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-500" /> Notifications
            </h3>
            <button onClick={() => setShowNotifications(false)} className="text-xs text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer">
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {notifications.length === 0 ? (
              <p className="text-neutral-400 dark:text-zinc-500 text-center text-xs py-10">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                    n.isRead
                      ? "bg-neutral-50 dark:bg-zinc-900/40 border-neutral-200 dark:border-white/5 text-neutral-400 dark:text-zinc-500"
                      : "bg-blue-50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20 text-neutral-700 dark:text-zinc-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold truncate">{n.title}</span>
                    <span className="text-[10px] text-neutral-400 dark:text-zinc-500 shrink-0 font-mono">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="mt-1 text-neutral-500 dark:text-zinc-400 leading-relaxed">{n.content}</p>
                  {!n.isRead && <span className="text-[10px] text-blue-500 mt-1 block">Tap to mark read</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Command Palette ── */}
      {showCommandPalette && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCommandPalette(false); }}
        >
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/15 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200 dark:border-white/10">
              <Search className="h-4 w-4 text-neutral-400 dark:text-zinc-500 shrink-0" />
              <input
                type="text"
                value={commandSearch}
                onChange={(e) => setCommandSearch(e.target.value)}
                placeholder="Search pages and actions..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-zinc-500"
                autoFocus
              />
              <button
                onClick={() => setShowCommandPalette(false)}
                className="text-[10px] bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-zinc-400 px-2 py-1 rounded font-mono cursor-pointer"
              >
                ESC
              </button>
            </div>
            <div className="p-2 max-h-72 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <p className="text-neutral-400 dark:text-zinc-500 text-xs text-center py-8">No results found.</p>
              ) : (
                filteredCommands.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => { router.push(cmd.href); setShowCommandPalette(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-neutral-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-400 transition flex items-center justify-between group cursor-pointer"
                  >
                    <span>{cmd.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-neutral-300 dark:text-zinc-600 group-hover:text-blue-500 transition" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
