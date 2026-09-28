// @ts-nocheck
import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import {
  LayoutDashboard, Search, Bell, Menu, Calendar, Users, FileText,
  MessageSquare, UserPlus, Plus, ArrowRight, X, User, BookOpen,
  Settings, Pencil, Trash2, Heart, CheckCircle, MapPin, Clock,
  ChevronDown, ChevronUp, Shield, Globe, LogOut, Phone, Mail,
  BarChart2, Building, AlertTriangle, Eye, Key, Moon, Sun,
  Download, QrCode, Share2, RefreshCw, Award, Megaphone,
  CreditCard, UserCircle, ClipboardList, ExternalLink, Filter,
  CheckSquare, Square, Tag, Send,
} from "lucide-react";

// ─── CONTEXTS ─────────────────────────────────────────────────────────────────
const ThemeCtx = createContext({ isDark: false, toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);
const ToastCtx = createContext({ add: () => {} });
const useToast = () => useContext(ToastCtx);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  const colors = { success: "bg-emerald-600", error: "bg-rose-600", info: "bg-violet-600" };
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  return (
    <ToastCtx.Provider value={{ add }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast-enter ${colors[t.type]} text-white text-sm font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 pointer-events-auto max-w-xs`}>
            <span>{icons[t.type]}</span>{t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const UNIVERSITIES = [
  { id: "amity", name: "Amity University", campus: "Noida, UP", clubs: 18, students: 12400, events: 34, logo: "🏛️", active: true },
  { id: "chandigarh", name: "Chandigarh University", campus: "Punjab", clubs: 24, students: 18200, events: 51, logo: "🎓", active: true },
  { id: "manipal", name: "Manipal University", campus: "Karnataka", clubs: 31, students: 14800, events: 62, logo: "📚", active: true },
  { id: "vit", name: "VIT University", campus: "Vellore, TN", clubs: 42, students: 20100, events: 78, logo: "🔬", active: false },
];
const CLUBS_DATA = [
  { id: 1, name: "Tech Society", emoji: "💻", category: "Technology", members: 156, events: 12, following: true, desc: "Building tomorrow's tech leaders through hackathons & workshops", level: "university" },
  { id: 2, name: "TEDx Club", emoji: "🎤", category: "Leadership", members: 89, events: 8, following: false, desc: "Spreading ideas worth sharing across campus", level: "university" },
  { id: 3, name: "Debate Club", emoji: "🎭", category: "Academic", members: 67, events: 15, following: true, desc: "Sharpening minds through competitive debate & public speaking", level: "institute" },
  { id: 4, name: "Cultural Society", emoji: "🎨", category: "Cultural", members: 234, events: 20, following: false, desc: "Celebrating diversity through art, music & dance", level: "university" },
  { id: 5, name: "E-Cell", emoji: "🚀", category: "Business", members: 112, events: 10, following: true, desc: "Nurturing the next generation of entrepreneurs", level: "university" },
  { id: 6, name: "Photography Club", emoji: "📸", category: "Arts", members: 45, events: 6, following: false, desc: "Capturing moments, creating memories", level: "institute" },
  { id: 7, name: "Sports Committee", emoji: "⚽", category: "Sports", members: 180, events: 25, following: false, desc: "Promoting sportsmanship and fitness on campus", level: "university" },
  { id: 8, name: "Music Society", emoji: "🎵", category: "Arts", members: 78, events: 9, following: true, desc: "Harmonizing talent and passion for music", level: "institute" },
];
const EVENTS_DATA = [
  { id: 1, title: "TEDx Amity 2025", club: "TEDx Club", date: "Aug 15, 2025", time: "10:00 AM – 4:00 PM", venue: "Amity Auditorium, Block A", category: "Leadership", spots: 120, registered: 87, emoji: "🎤", desc: "An independently organized TED event where bright minds share ideas worth spreading.", price: 0, status: "published" },
  { id: 2, title: "Hackathon 5.0", club: "Tech Society", date: "Aug 22, 2025", time: "9:00 AM – 9:00 PM", venue: "Innovation Lab, Block C", category: "Tech", spots: 200, registered: 156, emoji: "💻", desc: "A 12-hour coding marathon. Prizes worth ₹50,000 up for grabs.", price: 0, status: "published" },
  { id: 3, title: "Inter-College Debate", club: "Debate Club", date: "Sep 1, 2025", time: "2:00 PM – 6:00 PM", venue: "Seminar Hall 2, Block B", category: "Academic", spots: 60, registered: 42, emoji: "🎭", desc: "A competitive debate tournament open to all Amity students.", price: 100, status: "published" },
  { id: 4, title: "Cultural Fest 2025", club: "Cultural Society", date: "Sep 10, 2025", time: "11:00 AM – 8:00 PM", venue: "Main Amphitheatre", category: "Cultural", spots: 500, registered: 321, emoji: "🎨", desc: "Amity's biggest annual cultural celebration.", price: 250, status: "published" },
  { id: 5, title: "Startup Pitch Day", club: "E-Cell", date: "Sep 18, 2025", time: "1:00 PM – 5:00 PM", venue: "Boardroom 1, Admin Block", category: "Business", spots: 80, registered: 63, emoji: "🚀", desc: "Present your startup idea to a panel of investors and mentors.", price: 0, status: "draft" },
];
const MY_APPS_DATA = [
  { id: 1, event: "TEDx Amity 2025", club: "TEDx Club", date: "Aug 15, 2025", applied: "Jul 20, 2025", status: "approved", attended: true },
  { id: 2, event: "Hackathon 5.0", club: "Tech Society", date: "Aug 22, 2025", applied: "Jul 22, 2025", status: "approved", attended: false },
  { id: 3, event: "Startup Pitch Day", club: "E-Cell", date: "Sep 18, 2025", applied: "Jul 18, 2025", status: "approved", attended: false },
];
const CORE_TEAM_DATA = [
  { id: 1, name: "Vikram Nair", enroll: "A2K21001", role: "President" },
  { id: 2, name: "Sanya Kapoor", enroll: "A2K21034", role: "Vice President" },
  { id: 3, name: "Rohit Kumar", enroll: "A2K22012", role: "Technical Head" },
  { id: 4, name: "Meera Singh", enroll: "A2K22056", role: "Design Lead" },
];
const FOLLOWERS_DATA = [
  { id: 5, name: "Riya Sharma", enroll: "A2K22089" },
  { id: 6, name: "Kabir Mehta", enroll: "A2K22112" },
  { id: 7, name: "Arjun Patel", enroll: "A2K23045" },
  { id: 8, name: "Priya Joshi", enroll: "A2K23078" },
  { id: 9, name: "Devesh Sharma", enroll: "A2K23101" },
];
const REGISTRATIONS_DATA = [
  { id: 1, student: "Riya Sharma", enroll: "A2K22089", event: "Hackathon 5.0", applied: "Jul 22, 2025", status: "approved", attended: false },
  { id: 2, student: "Kabir Mehta", enroll: "A2K22112", event: "Hackathon 5.0", applied: "Jul 23, 2025", status: "approved", attended: false },
  { id: 3, student: "Priya Joshi", enroll: "A2K23078", event: "TEDx Amity 2025", applied: "Jul 20, 2025", status: "approved", attended: true },
  { id: 4, student: "Arjun Patel", enroll: "A2K23045", event: "Cultural Fest 2025", applied: "Jul 18, 2025", status: "approved", attended: false },
  { id: 5, student: "Devesh Sharma", enroll: "A2K23101", event: "Hackathon 5.0", applied: "Jul 24, 2025", status: "approved", attended: false },
];
const MESSAGES_DATA = [
  { id: 1, from: "TEDx Club", avatar: "🎤", message: "You've been registered for TEDx Amity 2025! See you there.", time: "2h ago", unread: true },
  { id: 2, from: "Tech Society", avatar: "💻", message: "Welcome to Hackathon 5.0! Here's your team assignment.", time: "1d ago", unread: true },
  { id: 3, from: "Debate Club", avatar: "🎭", message: "New event posted — check it out!", time: "2d ago", unread: false },
];
const NOTIFICATIONS_DATA = [
  { id: 1, title: "Registration Confirmed", desc: "You're registered for TEDx Amity 2025 ✓", time: "2h ago", read: false, type: "success", emoji: "🎤" },
  { id: 2, title: "New Event: Hackathon 5.0", desc: "Tech Society just posted a new event", time: "5h ago", read: false, type: "event", emoji: "💻" },
  { id: 3, title: "Reminder: Cultural Fest", desc: "Cultural Fest 2025 is in 5 days", time: "1d ago", read: false, type: "reminder", emoji: "🎨" },
  { id: 4, title: "Announcement from Tech Society", desc: "New Python workshop this Saturday 2-5 PM!", time: "2d ago", read: true, type: "announcement", emoji: "📢" },
  { id: 5, title: "Spots filling up!", desc: "Hackathon 5.0 is 78% full — register now", time: "3d ago", read: true, type: "warning", emoji: "⚡" },
];
const ANNOUNCEMENTS_DATA = [
  { id: 1, title: "Python Workshop This Saturday!", content: "We're hosting a beginner-friendly Python workshop this Saturday from 2-5 PM at Innovation Lab. Bring your laptop!", date: "Jul 25, 2025", reach: 156, emoji: "🐍" },
  { id: 2, title: "Hackathon Team Formation Open", content: "Looking for team members for Hackathon 5.0? Fill the form in bio to find partners with matching skills.", date: "Jul 20, 2025", reach: 156, emoji: "🤝" },
  { id: 3, title: "Congratulations to our new Design Lead!", content: "Welcome Meera Singh as our new Design Lead. She'll be heading all our design initiatives going forward.", date: "Jul 15, 2025", reach: 156, emoji: "🎉" },
];
const AUDIT_LOG = [
  { id: 1, action: "Approved", event: "TEDx Amity 2025", club: "TEDx Club", by: "Dr. Priya Kapoor", time: "Jul 20, 2025 · 3:42 PM", color: "emerald" },
  { id: 2, action: "Rejected", event: "Random Workshop", club: "Random Club", by: "Dr. Priya Kapoor", time: "Jul 19, 2025 · 11:20 AM", color: "rose" },
  { id: 3, action: "Approved", event: "Debate Workshop", club: "Debate Club", by: "Dr. Priya Kapoor", time: "Jul 15, 2025 · 9:15 AM", color: "emerald" },
  { id: 4, action: "Approved", event: "Photography Walk", club: "Photography Club", by: "Dr. Priya Kapoor", time: "Jul 10, 2025 · 2:30 PM", color: "emerald" },
];
const RECRUITMENT_DATA = [
  { id: 1, title: "Event Coordinator", open: 2, applied: 5, desc: "Manage logistics for club events" },
  { id: 2, title: "Design Lead", open: 1, applied: 8, desc: "Create posters, banners & social content" },
  { id: 3, title: "Technical Head", open: 1, applied: 3, desc: "Oversee tech infrastructure" },
  { id: 4, title: "PR Manager", open: 2, applied: 6, desc: "Handle outreach & communications" },
];
const PENDING_EVENTS_DATA = [
  { id: 1, title: "Hackathon 5.0", club: "Tech Society", date: "Aug 22, 2025", submitted: "Jul 21", category: "Tech" },
  { id: 2, title: "Cultural Fest 2025", club: "Cultural Society", date: "Sep 10, 2025", submitted: "Jul 19", category: "Cultural" },
];
const PLATFORM_USERS = [
  { id: 1, name: "Aryan Gupta", email: "aryan@amity.edu", role: "student", university: "Amity University", status: "active", joined: "Aug 2024" },
  { id: 2, name: "Dr. Priya Kapoor", email: "priya@amity.edu", role: "faculty", university: "Amity University", status: "active", joined: "Jul 2024" },
  { id: 3, name: "Tech Society", email: "tech@amity.edu", role: "club", university: "Amity University", status: "active", joined: "Jul 2024" },
  { id: 4, name: "Riya Sharma", email: "riya@cu.edu", role: "student", university: "Chandigarh University", status: "active", joined: "Sep 2024" },
  { id: 5, name: "Debate Club VIT", email: "debate@vit.edu", role: "club", university: "VIT University", status: "suspended", joined: "Aug 2024" },
];

const NAV = {
  student: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "clubs", label: "Explore Clubs", icon: Users },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: 2 },
    { id: "profile", label: "My Profile", icon: UserCircle },
  ],
  club: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "All Events", icon: Calendar },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "profile", label: "Club Profile", icon: Settings },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: 1 },
    { id: "recruitment", label: "Team Recruitment", icon: UserPlus },
  ],
  faculty: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "eventmgmt", label: "All Events", icon: Calendar },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "audit", label: "Audit Trail", icon: ClipboardList },
    { id: "profile", label: "Update Description", icon: Settings },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
    { id: "recruitment", label: "Team Recruitment", icon: UserPlus },
  ],
  techAdmin: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "universities", label: "Universities", icon: Building },
    { id: "users", label: "User Management", icon: Users },
    { id: "clubs", label: "All Clubs", icon: Globe },
    { id: "analytics", label: "Analytics", icon: BarChart2 },
    { id: "settings", label: "System Settings", icon: Settings },
  ],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function generateICS(event) {
  const pad = n => String(n).padStart(2,'0');
  const now = new Date();
  const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}Z`;
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ClubSphere//EN\nBEGIN:VEVENT\nDTSTAMP:${stamp}\nUID:${event.id}@clubsphere\nSUMMARY:${event.title}\nDESCRIPTION:${event.desc}\nLOCATION:${event.venue}\\, Amity University Noida\nDTSTART:20250815T100000\nDTEND:20250815T160000\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${event.title}.ics`; a.click();
  URL.revokeObjectURL(url);
}

function exportCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(r => Object.values(r).map(v => `"${v}"`).join(','));
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function getMapsUrl(venue) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue + ', Amity University Noida')}`;
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = { approved:"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", pending:"bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", rejected:"bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400", upcoming:"bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400", active:"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", suspended:"bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400", inactive:"bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400", published:"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", draft:"bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400", scheduled:"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" };
  return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${map[status]||"bg-slate-100 text-slate-600"}`}>{status[0].toUpperCase()+status.slice(1)}</span>;
}

function Card({ children, className = "" }) {
  return <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 ${className}`}>{children}</div>;
}

function StatCard({ label, value, sub, gradient, onClick }) {
  return (
    <div role={onClick?"button":undefined} tabIndex={onClick?0:undefined} onKeyDown={onClick?(e=>e.key==="Enter"&&onClick()):undefined}
      className={`rounded-2xl p-5 text-white ${gradient} ${onClick?"cursor-pointer hover:opacity-90 active:scale-95 transition-all select-none":""}`} onClick={onClick}>
      <p className="text-xs font-medium opacity-75 mb-1">{label}</p>
      <p className="text-3xl font-bold leading-tight">{value}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  );
}

function SectionHeader({ title, sub, action, onAction, editing, onToggleEdit }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        {action && !editing && <button onClick={onAction} className="text-violet-600 dark:text-violet-400 text-sm flex items-center gap-1 hover:gap-2 transition-all font-medium">{action} <ArrowRight size={14}/></button>}
        {onToggleEdit && <button onClick={onToggleEdit} aria-label={editing?"Done":"Edit"} className={`p-1.5 rounded-lg transition ${editing?"bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400":"text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-600"}`}>{editing?<CheckCircle size={15}/>:<Pencil size={15}/>}</button>}
      </div>
    </div>
  );
}

function AvatarCircle({ name, size = "sm" }) {
  const cls = size==="sm"?"w-9 h-9 text-sm":"w-11 h-11 text-base";
  return <div className={`${cls} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`} style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}} aria-hidden="true">{name[0]}</div>;
}

function Skeleton({ className="" }) { return <div className={`skeleton-box ${className}`} aria-hidden="true"/>; }

function SkeletonPage() {
  return (
    <div className="space-y-5" aria-busy="true">
      <Skeleton className="h-32 w-full rounded-2xl"/>
      <div className="grid grid-cols-2 gap-3">{[...Array(4)].map((_,i)=><Skeleton key={i} className="h-24 rounded-2xl"/>)}</div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 space-y-3">
        {[...Array(3)].map((_,i)=><div key={i} className="flex gap-3"><Skeleton className="w-10 h-10 rounded-xl flex-shrink-0"/><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4"/><Skeleton className="h-3 w-1/2"/></div></div>)}
      </div>
    </div>
  );
}

function EmptyState({ emoji="📭", title, desc, action, onAction }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-5xl mb-4">{emoji}</div>
      <p className="font-semibold text-slate-700 dark:text-slate-300 text-lg">{title}</p>
      {desc && <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">{desc}</p>}
      {action && <button onClick={onAction} className="mt-5 bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition">{action}</button>}
    </div>
  );
}

function PageWrapper({ children, pageKey }) { return <div key={pageKey} className="page-enter">{children}</div>; }

// ─── NOTIFICATIONS PANEL ──────────────────────────────────────────────────────

function NotificationsPanel({ onClose }) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS_DATA);
  const markAll = () => setNotifs(n => n.map(x => ({...x, read: true})));
  const unread = notifs.filter(n => !n.read).length;
  const typeColors = { success:"bg-emerald-100 dark:bg-emerald-900/30", event:"bg-violet-100 dark:bg-violet-900/30", reminder:"bg-amber-100 dark:bg-amber-900/30", announcement:"bg-blue-100 dark:bg-blue-900/30", warning:"bg-rose-100 dark:bg-rose-900/30" };
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}/>
      <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-800 border-l border-slate-100 dark:border-slate-700 z-50 shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Notifications</h3>
            {unread > 0 && <p className="text-xs text-slate-400 mt-0.5">{unread} unread</p>}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && <button onClick={markAll} className="text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline">Mark all read</button>}
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><X size={18}/></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notifs.length === 0 ? <EmptyState emoji="🔔" title="All caught up!" desc="No new notifications."/> : (
            notifs.map(n => (
              <button key={n.id} onClick={() => setNotifs(l => l.map(x => x.id===n.id?{...x,read:true}:x))}
                className={`w-full flex items-start gap-3 p-4 border-b border-slate-50 dark:border-slate-700 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700/50 ${!n.read?"":"opacity-60"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${typeColors[n.type]}`}>{n.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-sm font-medium text-slate-800 dark:text-slate-200 ${!n.read?"font-semibold":""}`}>{n.title}</p>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-violet-600 flex-shrink-0 ml-2"/>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{n.desc}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}

// ─── PAYMENT MODAL ────────────────────────────────────────────────────────────

function PaymentModal({ event, onClose, onSuccess }) {
  const [step, setStep] = useState("review"); // review | processing | done
  const [method, setMethod] = useState("upi");
  const { add } = useToast();
  const handlePay = () => {
    setStep("processing");
    setTimeout(() => { setStep("done"); setTimeout(() => { onSuccess(); add("Payment successful! You're registered 🎉"); onClose(); }, 1500); }, 2000);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.6)"}} onClick={step==="done"?undefined:onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
        {step === "done" ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-emerald-600"/></div>
            <h3 className="font-bold text-slate-800 dark:text-white text-xl mb-1">Payment Successful!</h3>
            <p className="text-slate-400 text-sm">You're registered for {event.title}</p>
          </div>
        ) : step === "processing" ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4"><RefreshCw size={28} className="text-violet-600 animate-spin"/></div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Processing Payment…</h3>
            <p className="text-slate-400 text-sm mt-1">Please wait</p>
          </div>
        ) : (
          <>
            <div className="p-5 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-white">Complete Payment</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><X size={18}/></button>
              </div>
              <div className="mt-3 bg-slate-50 dark:bg-slate-700 rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">{event.emoji}</span>
                <div className="flex-1"><p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{event.title}</p><p className="text-xs text-slate-400">{event.club}</p></div>
                <p className="font-bold text-violet-600 dark:text-violet-400">₹{event.price}</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Payment Method</p>
                <div className="space-y-2">
                  {[["upi","UPI / QR Code","💳"],["card","Debit / Credit Card","🏦"],["netbanking","Net Banking","🌐"]].map(([id,label,icon])=>(
                    <button key={id} onClick={()=>setMethod(id)} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${method===id?"border-violet-400 bg-violet-50 dark:bg-violet-900/20":"border-slate-200 dark:border-slate-600 hover:border-slate-300"}`}>
                      <span className="text-lg">{icon}</span>
                      <span className={`text-sm font-medium ${method===id?"text-violet-700 dark:text-violet-300":"text-slate-700 dark:text-slate-300"}`}>{label}</span>
                      {method===id && <CheckCircle size={16} className="ml-auto text-violet-600 dark:text-violet-400"/>}
                    </button>
                  ))}
                </div>
              </div>
              {method==="upi" && (
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3">
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block font-medium">UPI ID</label>
                  <input placeholder="yourname@upi" className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"/>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Registration Fee</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{event.price}</span>
              </div>
              <button onClick={handlePay} className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 active:scale-95 transition flex items-center justify-center gap-2">
                <CreditCard size={15}/> Pay ₹{event.price}
              </button>
              <p className="text-center text-xs text-slate-400">🔒 Secured by Razorpay</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── CERTIFICATE MODAL ────────────────────────────────────────────────────────

function CertificateModal({ app, onClose }) {
  const { add } = useToast();
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 800; canvas.height = 560;
    // Background
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, 800, 560);
    // Inner white box
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(30, 30, 740, 500, 16);
    ctx.fill();
    // Border
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 4;
    ctx.roundRect(30, 30, 740, 500, 16);
    ctx.stroke();
    // Top accent
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(30, 30, 740, 8);
    // Logo
    ctx.fillStyle = '#7c3aed';
    ctx.roundRect(370, 55, 60, 60, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CS', 400, 93);
    // ClubSphere
    ctx.fillStyle = '#1e1b4b';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('ClubSphere', 400, 135);
    // Certificate of Participation
    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText('CERTIFICATE OF PARTICIPATION', 400, 165);
    // Divider
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(120, 185); ctx.lineTo(680, 185); ctx.stroke();
    // This certifies
    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px sans-serif';
    ctx.fillText('This is to certify that', 400, 220);
    // Name
    ctx.fillStyle = '#1e1b4b';
    ctx.font = 'bold 36px serif';
    ctx.fillText('Aryan Gupta', 400, 270);
    // Enrollment
    ctx.fillStyle = '#7c3aed';
    ctx.font = '13px sans-serif';
    ctx.fillText('A2K22001 · Amity University', 400, 300);
    // Participated in
    ctx.fillStyle = '#64748b';
    ctx.font = '15px sans-serif';
    ctx.fillText('successfully participated in', 400, 340);
    // Event name
    ctx.fillStyle = '#1e1b4b';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(app.event, 400, 378);
    // Club & Date
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.fillText(`${app.club}  ·  ${app.date}`, 400, 405);
    // Footer line
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(120, 450); ctx.lineTo(680, 450); ctx.stroke();
    // Signature area
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left'; ctx.fillText('Faculty Coordinator', 140, 490);
    ctx.textAlign = 'center'; ctx.fillText('Issued by ClubSphere · Amity University', 400, 490);
    ctx.textAlign = 'right'; ctx.fillText(new Date().toLocaleDateString('en-IN'), 660, 490);
  }, [app]);
  const download = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; a.download = `Certificate_${app.event.replace(/\s+/g,'_')}.png`; a.click();
    add("Certificate downloaded!");
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.7)"}} onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div><h3 className="font-bold text-slate-800 dark:text-white">Certificate of Participation</h3><p className="text-xs text-slate-400 mt-0.5">{app.event}</p></div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><X size={18}/></button>
        </div>
        <div className="p-4 overflow-x-auto">
          <canvas ref={canvasRef} className="w-full rounded-xl border border-slate-200 dark:border-slate-600" style={{maxWidth:"100%"}}/>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex gap-3">
          <button onClick={download} className="flex-1 flex items-center justify-center gap-2 bg-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition">
            <Download size={15}/> Download PNG
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── EVENT DETAIL MODAL ───────────────────────────────────────────────────────

function EventDetailModal({ event, onClose, isGuest, onLoginRequired }) {
  const { add } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const isRegistered = MY_APPS_DATA.some(a => a.event===event.title);
  const pct = Math.round((event.registered/event.spots)*100);
  const handleRegister = () => {
    if (event.price > 0) { setShowPayment(true); return; }
    add(`Registered for ${event.title}! 🎉`); onClose();
  };
  const handleICS = () => { generateICS(event); add("Calendar event downloaded (.ics)","info"); };
  return (
    <>
      {showPayment && <PaymentModal event={event} onClose={()=>setShowPayment(false)} onSuccess={onClose}/>}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{background:"rgba(0,0,0,0.6)"}} onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
          <div className="p-5 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-2xl flex-shrink-0">{event.emoji}</div>
                <div><h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">{event.title}</h3><p className="text-sm text-slate-400 mt-0.5">{event.club}</p></div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 flex-shrink-0"><X size={18}/></button>
            </div>
          </div>
          <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><Calendar size={10}/>Date</p><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{event.date}</p></div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><Clock size={10}/>Time</p><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{event.time}</p></div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 col-span-2">
                <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><MapPin size={10}/>Venue</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{event.venue}</p>
                  <a href={getMapsUrl(event.venue)} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline ml-2 flex-shrink-0"><ExternalLink size={11}/>Maps</a>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3"><p className="text-xs text-slate-400 mb-1">About</p><p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{event.desc}</p></div>
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5"><span>Spots filled</span><span className="font-semibold text-slate-700 dark:text-slate-300">{event.registered}/{event.spots} ({pct}%)</span></div>
              <div className="w-full bg-slate-100 dark:bg-slate-600 rounded-full h-2"><div className={`h-2 rounded-full transition-all ${pct>80?"bg-rose-500":pct>50?"bg-amber-500":"bg-violet-500"}`} style={{width:`${pct}%`}}/></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2.5 py-0.5 rounded-full font-medium">{event.category}</span>
              {event.price > 0 && <span className="text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1"><Tag size={10}/>₹{event.price}</span>}
              <button onClick={handleICS} className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 transition ml-auto"><Calendar size={12}/>Add to Calendar</button>
            </div>
          </div>
          <div className="p-5 border-t border-slate-100 dark:border-slate-700 flex gap-3">
            {isGuest ? (
              <button onClick={onLoginRequired} className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition flex items-center justify-center gap-2"><Key size={15}/>Sign in to Register</button>
            ) : isRegistered ? (
              <div className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 py-3 rounded-xl font-semibold text-sm border border-emerald-200 dark:border-emerald-800"><CheckCircle size={16}/>You're Registered</div>
            ) : (
              <button onClick={handleRegister} className="flex-1 bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 active:scale-95 transition flex items-center justify-center gap-2">
                {event.price > 0 ? <><CreditCard size={15}/>Register · ₹{event.price}</> : "Register Now"}
              </button>
            )}
            <button onClick={()=>{navigator.share?.({title:event.title,text:event.desc})||add("Link copied!","info");}} className="p-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition"><Share2 size={16}/></button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── QR TICKET MODAL ─────────────────────────────────────────────────────────

function QRTicketModal({ app, onClose }) {
  const { add } = useToast();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.6)"}} onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-xs shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
        <div className="p-5 text-center border-b border-slate-100 dark:border-slate-700">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400"><X size={18}/></button>
          <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1 uppercase tracking-wide">Event Ticket</p>
          <h3 className="font-bold text-slate-800 dark:text-white">{app.event}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{app.club} · {app.date}</p>
        </div>
        <div className="p-6 flex flex-col items-center">
          <div className="w-40 h-40 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="grid grid-cols-7 gap-0.5 p-2 opacity-80">
              {[...Array(49)].map((_,i)=><div key={i} className={`w-4 h-4 rounded-sm ${(i*7+i)%3===0?"bg-slate-800 dark:bg-white":"bg-transparent"}`}/>)}
            </div>
            <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 bg-white dark:bg-slate-800 rounded flex items-center justify-center text-lg">🎫</div></div>
          </div>
          <p className="text-xs text-slate-400 mb-1">Enrollment No.</p>
          <p className="font-mono font-bold text-slate-800 dark:text-white text-lg">A2K22001</p>
          <p className="text-xs text-slate-400 mt-3 text-center">Show this QR at the venue for entry</p>
          <button onClick={()=>add("Ticket downloaded!","info")} className="mt-4 flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 font-medium hover:underline"><Download size={14}/>Download Ticket</button>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH SCREENS ─────────────────────────────────────────────────────────────

function UniversitySelector({ onSelect }) {
  const { isDark } = useTheme();
  const bg = isDark ? "bg-slate-950" : "bg-slate-50";
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${bg}`}>
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-lg" style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}}>CS</div>
        <h1 className={`text-3xl font-black tracking-tight ${isDark?"text-white":"text-slate-900"}`}>ClubSphere</h1>
        <p className={`mt-2 text-sm ${isDark?"text-slate-400":"text-slate-500"}`}>Select your university to get started</p>
      </div>
      <div className="w-full max-w-sm space-y-3">
        {UNIVERSITIES.map(u => (
          <button key={u.id} onClick={()=>u.active&&onSelect(u)} disabled={!u.active}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border shadow-sm text-left transition-all ${u.active?isDark?"bg-slate-800 border-slate-700 hover:border-violet-500 hover:shadow-md":"bg-white border-slate-100 hover:border-violet-300 hover:shadow-md":isDark?"bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed":"bg-white border-slate-100 opacity-50 cursor-not-allowed"}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${isDark?"bg-slate-700":"bg-violet-50"}`}>{u.logo}</div>
            <div className="flex-1 min-w-0"><p className={`font-semibold ${isDark?"text-white":"text-slate-800"}`}>{u.name}</p><p className={`text-xs mt-0.5 ${isDark?"text-slate-400":"text-slate-400"}`}>{u.campus} · {u.clubs} clubs</p></div>
            {u.active?<ArrowRight size={16} className="text-slate-300 flex-shrink-0"/>:<span className="text-xs text-slate-400 flex-shrink-0">Soon</span>}
          </button>
        ))}
      </div>
      <p className={`mt-6 text-xs ${isDark?"text-slate-500":"text-slate-400"}`}>University not listed? <button className="text-violet-500 font-semibold hover:underline">Request access →</button></p>
    </div>
  );
}

function AuthScreen({ university, onAuth, onGuest, onBack }) {
  const { isDark } = useTheme();
  const [tab, setTab] = useState("email");
  const [value, setValue] = useState("");
  const [step, setStep] = useState("input");
  const [otp, setOtp] = useState("");
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const bg = isDark?"bg-slate-950":"bg-slate-50";
  const surface = isDark?"bg-slate-800 border-slate-700":"bg-white border-slate-200";
  const text = isDark?"text-white":"text-slate-800";
  const muted = isDark?"text-slate-400":"text-slate-400";
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 ${isDark?"bg-slate-700 border-slate-600 text-white placeholder:text-slate-500":"bg-white border-slate-200 text-slate-800"}`;
  const handleSend = () => { if (!value){setError(`Enter your ${tab==="email"?"email":"phone"}`);return;} setError(""); setLoading(true); setTimeout(()=>{setLoading(false);setStep("otp");},1000); };
  const handleVerify = () => { if (otp.length<4){setError("Enter the OTP sent to you");return;} setError(""); setLoading(true); setTimeout(()=>{setLoading(false);setShowRolePicker(true);},800); };
  const roles = [{id:"student",label:"Student",icon:User,desc:"Explore & register for events"},{id:"club",label:"Club Admin",icon:Users,desc:"Manage your club & events"},{id:"faculty",label:"Faculty Coordinator",icon:BookOpen,desc:"Oversee and approve events"},{id:"techAdmin",label:"Tech Admin",icon:Shield,desc:"Platform-level administration"}];
  if (showRolePicker) return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${bg}`}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-6"><div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${isDark?"bg-emerald-900/40":"bg-emerald-100"}`}><CheckCircle size={24} className="text-emerald-500"/></div><h2 className={`text-xl font-bold ${text}`}>Verified!</h2><p className={`text-sm mt-1 ${muted}`}>Select your role</p></div>
        <div className="space-y-3">{roles.map(r=>{const Icon=r.icon;return(<button key={r.id} onClick={()=>onAuth(r.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border shadow-sm hover:border-violet-400 hover:shadow-md transition text-left ${surface}`}><div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark?"bg-violet-900/40":"bg-violet-50"}`}><Icon size={18} className="text-violet-500"/></div><div className="flex-1"><p className={`font-semibold ${text}`}>{r.label}</p><p className={`text-xs mt-0.5 ${muted}`}>{r.desc}</p></div><ArrowRight size={15} className="text-slate-400"/></button>);})}</div>
      </div>
    </div>
  );
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${bg}`}>
      <div className="w-full max-w-sm">
        <button onClick={onBack} className={`flex items-center gap-1.5 text-sm mb-6 transition ${isDark?"text-slate-500 hover:text-slate-300":"text-slate-400 hover:text-slate-600"}`}>← Back</button>
        <div className="text-center mb-7"><div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl ${isDark?"bg-slate-800":"bg-violet-50"}`}>{university.logo}</div><h2 className={`text-xl font-bold ${text}`}>{university.name}</h2><p className={`text-sm mt-1 ${muted}`}>{step==="input"?"Sign in to your account":"Enter the OTP we sent you"}</p></div>
        {step==="input"?(
          <div className="space-y-4">
            <div className={`flex p-1 rounded-xl ${isDark?"bg-slate-800":"bg-slate-100"}`}>{[["email","Email",Mail],["phone","Phone",Phone]].map(([id,label,Icon])=>(<button key={id} onClick={()=>{setTab(id);setValue("");setError("");}} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${tab===id?isDark?"bg-slate-700 text-white shadow":"bg-white text-slate-800 shadow-sm":isDark?"text-slate-500":"text-slate-500"}`}><Icon size={14}/>{label}</button>))}</div>
            <div><input value={value} onChange={e=>{setValue(e.target.value);setError("");}} placeholder={tab==="email"?"College email address":"+91 phone number"} className={inputCls}/>{error&&<p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1"><AlertTriangle size={11}/>{error}</p>}</div>
            <button onClick={handleSend} disabled={loading} className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition disabled:opacity-60 flex items-center justify-center gap-2">{loading?<><RefreshCw size={14} className="animate-spin"/>Sending…</>:"Send OTP"}</button>
            <div className="flex items-center gap-3"><div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"/><span className={`text-xs ${muted}`}>or</span><div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"/></div>
            <button onClick={onGuest} className={`w-full border py-3 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 ${isDark?"border-slate-700 text-slate-300 hover:bg-slate-800":"border-slate-200 text-slate-600 hover:bg-slate-50"}`}><Eye size={15}/>Browse as Guest</button>
            <p className={`text-center text-xs ${muted}`}>Guests can view events but cannot register</p>
          </div>
        ):(
          <div className="space-y-4">
            <div className={`rounded-xl px-4 py-3 text-sm text-center ${isDark?"bg-violet-900/30 text-violet-300":"bg-violet-50 text-violet-700"}`}>OTP sent to <span className="font-semibold">{value}</span></div>
            <div><input value={otp} onChange={e=>{setOtp(e.target.value.replace(/\D/g,"").slice(0,6));setError("");}} placeholder="Enter 6-digit OTP" className={`${inputCls} text-center tracking-widest font-bold text-lg`}/>{error&&<p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 justify-center"><AlertTriangle size={11}/>{error}</p>}</div>
            <button onClick={handleVerify} disabled={loading} className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition disabled:opacity-60 flex items-center justify-center gap-2">{loading?<><RefreshCw size={14} className="animate-spin"/>Verifying…</>:"Verify & Continue"}</button>
            <button onClick={()=>setStep("input")} className={`w-full text-sm transition ${isDark?"text-slate-500 hover:text-slate-300":"text-slate-400 hover:text-slate-600"}`}>← Change {tab==="email"?"email":"number"}</button>
            <p className={`text-center text-xs ${muted}`}>Didn't receive it? <button className="text-violet-500 font-medium hover:underline">Resend OTP</button></p>
          </div>
        )}
      </div>
    </div>
  );
}

function GuestBanner({ onLogin }) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2.5 flex items-center gap-3">
      <Eye size={15} className="text-amber-600 dark:text-amber-400 flex-shrink-0"/>
      <p className="text-xs text-amber-700 dark:text-amber-300 flex-1 font-medium">Browsing as guest — <button className="underline" onClick={onLogin}>Sign in</button> to register</p>
      <button onClick={onLogin} className="text-xs bg-amber-600 text-white px-3 py-1 rounded-lg font-medium hover:bg-amber-700 transition flex-shrink-0">Sign in</button>
    </div>
  );
}

// ─── STUDENT PAGES ────────────────────────────────────────────────────────────

function StudentDashboard({ setPage, isGuest, onLoginRequired }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),900);return()=>clearTimeout(t);},[]);
  if (loading) return <SkeletonPage/>;
  return (
    <div className="space-y-5">
      {selectedEvent&&<EventDetailModal event={selectedEvent} onClose={()=>setSelectedEvent(null)} isGuest={isGuest} onLoginRequired={onLoginRequired}/>}
      <div className="rounded-2xl p-6 text-white" style={{background:"linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%)"}}>
        <p className="text-violet-300 text-sm font-medium mb-1">{isGuest?"👀 Browsing as guest":"Good morning 👋"}</p>
        <h2 className="text-2xl font-bold mb-1">{isGuest?"Welcome to ClubSphere":"Welcome back, Aryan"}</h2>
        <p className="text-indigo-200 text-sm">{isGuest?"Sign in to register and follow clubs":"3 upcoming events · 3 registrations"}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="All Clubs" value="18" sub="Tap to explore" gradient="bg-gradient-to-br from-violet-500 to-indigo-700" onClick={()=>setPage("clubs")}/>
        <StatCard label="Registrations" value={isGuest?"—":"3"} sub={isGuest?"Sign in":"All approved"} gradient="bg-gradient-to-br from-amber-400 to-orange-500" onClick={isGuest?onLoginRequired:()=>setPage("applications")}/>
        <StatCard label="Clubs Followed" value={isGuest?"—":"4"} sub={isGuest?"Sign in":"Tap to explore"} gradient="bg-gradient-to-br from-emerald-400 to-teal-600" onClick={isGuest?onLoginRequired:()=>setPage("clubs")}/>
        <StatCard label="Unread Messages" value={isGuest?"—":"2"} sub={isGuest?"Sign in":"Tap to open"} gradient="bg-gradient-to-br from-rose-400 to-pink-600" onClick={isGuest?onLoginRequired:()=>setPage("messages")}/>
      </div>
      <Card>
        <SectionHeader title="Upcoming Events" action="See all" onAction={()=>setPage("clubs")}/>
        {EVENTS_DATA.filter(e=>e.status==="published").slice(0,3).map(e=>(
          <button key={e.id} onClick={()=>setSelectedEvent(e)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 active:scale-98 transition text-left group">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">{e.emoji}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{e.title}</p><p className="text-xs text-slate-400">{e.club} · {e.date}{e.price>0?` · ₹${e.price}`:""}</p></div>
            <div className="flex items-center gap-2 flex-shrink-0"><StatusBadge status="upcoming"/><ArrowRight size={14} className="text-slate-300 group-hover:text-violet-500 transition"/></div>
          </button>
        ))}
      </Card>
      {!isGuest&&(
        <Card>
          <SectionHeader title="My Applications" action="See all" onAction={()=>setPage("applications")}/>
          {MY_APPS_DATA.map(a=>(
            <div key={a.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
              <div><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{a.event}</p><p className="text-xs text-slate-400">{a.club} · Applied {a.applied}</p></div>
              <StatusBadge status={a.status}/>
            </div>
          ))}
        </Card>
      )}
      {isGuest&&(
        <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-5 text-center">
          <Key size={24} className="text-violet-600 dark:text-violet-400 mx-auto mb-3"/>
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Sign in to do more</p>
          <p className="text-xs text-slate-400 mb-3">Register for events, follow clubs, get notifications</p>
          <button onClick={onLoginRequired} className="bg-violet-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-violet-700 transition">Sign In</button>
        </div>
      )}
    </div>
  );
}

function StudentProfile() {
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({ name:"Aryan Gupta", enroll:"A2K22001", branch:"BTech Computer Science", year:"3rd Year", email:"aryan.gupta@amity.edu", phone:"+91 98765 43210", bio:"Passionate about technology and innovation. Core member of Tech Society and TEDx Club.", interests:["Technology","Leadership","Business"] });
  const { add } = useToast();
  const interests = ["Technology","Leadership","Academic","Cultural","Business","Arts","Sports"];
  const toggleInterest = (i) => setInfo(s=>({...s,interests:s.interests.includes(i)?s.interests.filter(x=>x!==i):[...s.interests,i]}));
  const inputCls = "w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200";
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">My Profile</h2><p className="text-slate-400 text-sm">Manage your personal information</p></div>
      <Card>
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100 dark:border-slate-700">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0" style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)"}}>A</div>
          <div className="flex-1">
            <p className="font-bold text-slate-800 dark:text-white text-lg">{info.name}</p>
            <p className="text-slate-400 text-sm">{info.enroll} · {info.branch}</p>
            <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mt-0.5">{info.year} · Amity University</p>
          </div>
          <button onClick={()=>{setEditing(e=>!e);if(editing)add("Profile saved!");}} className={`p-2 rounded-lg transition ${editing?"bg-violet-100 dark:bg-violet-900/30 text-violet-600":"text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{editing?<CheckCircle size={16}/>:<Pencil size={16}/>}</button>
        </div>
        <div className="space-y-4">
          {[["Full Name","name"],["Enrollment No.","enroll"],["Branch","branch"],["Year","year"],["Email","email"],["Phone","phone"]].map(([label,key])=>(
            <div key={key}><label className="text-xs text-slate-400 mb-1.5 block font-medium">{label}</label>{editing?<input value={info[key]} onChange={e=>setInfo(i=>({...i,[key]:e.target.value}))} className={inputCls}/>:<p className="text-sm text-slate-800 dark:text-slate-200 px-3 py-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">{info[key]}</p>}</div>
          ))}
          <div><label className="text-xs text-slate-400 mb-1.5 block font-medium">Bio</label>{editing?<textarea rows={3} value={info.bio} onChange={e=>setInfo(i=>({...i,bio:e.target.value}))} className={`${inputCls} resize-none`}/>:<p className="text-sm text-slate-800 dark:text-slate-200 px-3 py-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl leading-relaxed">{info.bio}</p>}</div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium">Interests</label>
            <div className="flex flex-wrap gap-2">
              {interests.map(i=>(
                <button key={i} onClick={()=>editing&&toggleInterest(i)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${info.interests.includes(i)?"bg-violet-600 text-white border-violet-600":"bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600"} ${editing?"cursor-pointer hover:opacity-80":"cursor-default"}`}>{i}</button>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <SectionHeader title="Activity Summary"/>
        <div className="grid grid-cols-3 gap-3">
          {[["Events Attended","1","🎤"],["Clubs Followed","4","💫"],["Certificates","1","🏆"]].map(([label,val,emoji])=>(
            <div key={label} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">{emoji}</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{val}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ExploreClubs({ isGuest, onLoginRequired }) {
  const [clubs, setClubs] = useState(CLUBS_DATA);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { add } = useToast();
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),700);return()=>clearTimeout(t);},[]);
  const cats = ["All","Technology","Leadership","Academic","Cultural","Business","Arts","Sports"];
  const filtered = clubs.filter(c=>(cat==="All"||c.category===cat)&&(level==="all"||c.level===level)&&c.name.toLowerCase().includes(search.toLowerCase()));
  const toggleFollow = (id,name) => { if(isGuest){onLoginRequired();return;} setClubs(l=>l.map(c=>c.id===id?{...c,following:!c.following}:c)); const club=clubs.find(c=>c.id===id); add(club?.following?`Unfollowed ${name}`:`Now following ${name}! 🎉`); };
  if (loading) return <SkeletonPage/>;
  return (
    <div className="space-y-5">
      {selectedEvent&&<EventDetailModal event={selectedEvent} onClose={()=>setSelectedEvent(null)} isGuest={isGuest} onLoginRequired={onLoginRequired}/>}
      <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Explore Clubs</h2><p className="text-slate-400 text-sm">Discover all {clubs.length} clubs at Amity University</p></div>
      <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clubs…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"/></div>
      <div className="flex gap-2">{[["all","All"],["university","University"],["institute","Institute"]].map(([val,label])=>(<button key={val} onClick={()=>setLevel(val)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${level===val?"bg-indigo-950 dark:bg-violet-600 text-white border-transparent":"bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-slate-300"}`}>{label}</button>))}</div>
      <div className="flex gap-2 flex-wrap">{cats.map(c=>(<button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${cat===c?"bg-violet-600 text-white":"bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}>{c}</button>))}</div>
      {filtered.length===0?<EmptyState emoji="🔍" title="No clubs found" desc={`No clubs match "${search}".`} action="Clear filters" onAction={()=>{setSearch("");setCat("All");setLevel("all");}}/>:(
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(c=>{
            const clubEvents=EVENTS_DATA.filter(e=>e.club===c.name&&e.status==="published");
            return (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-2xl flex-shrink-0">{c.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap"><p className="font-semibold text-slate-800 dark:text-slate-200">{c.name}</p><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.level==="university"?"bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300":"bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"}`}>{c.level}</span></div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">{c.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3"><span className="flex items-center gap-1"><Users size={11}/>{c.members} members</span><span className="flex items-center gap-1"><Calendar size={11}/>{c.events} events</span></div>
                {clubEvents.length>0&&(
                  <div className="mb-3 border-t border-slate-50 dark:border-slate-700 pt-3">
                    <p className="text-xs text-slate-400 font-medium mb-1.5">Upcoming events</p>
                    {clubEvents.map(ev=>(<button key={ev.id} onClick={()=>setSelectedEvent(ev)} className="w-full flex items-center gap-2 py-1.5 text-left hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg px-2 transition group"><span className="text-base">{ev.emoji}</span><div className="flex-1 min-w-0"><p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{ev.title}</p><p className="text-xs text-slate-400">{ev.date}{ev.price>0?` · ₹${ev.price}`:""}</p></div><ArrowRight size={12} className="text-slate-300 group-hover:text-violet-500 flex-shrink-0"/></button>))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2.5 py-0.5 rounded-full font-medium">{c.category}</span>
                  <button onClick={()=>toggleFollow(c.id,c.name)} className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg transition font-medium active:scale-95 ${c.following?"bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200":"bg-violet-600 text-white hover:bg-violet-700"}`}>
                    <Heart size={13} fill={c.following?"currentColor":"none"}/>{c.following?"Following":"Follow"}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StudentApplications() {
  const [ticketApp, setTicketApp] = useState(null);
  const [certApp, setCertApp] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),600);return()=>clearTimeout(t);},[]);
  if (loading) return <SkeletonPage/>;
  return (
    <div className="space-y-5">
      {ticketApp&&<QRTicketModal app={ticketApp} onClose={()=>setTicketApp(null)}/>}
      {certApp&&<CertificateModal app={certApp} onClose={()=>setCertApp(null)}/>}
      <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">My Applications</h2><p className="text-slate-400 text-sm">All your event registrations</p></div>
      {MY_APPS_DATA.length===0?<EmptyState emoji="📋" title="No applications yet" desc="Register for events to see them here."/>:(
        <div className="space-y-3">
          {MY_APPS_DATA.map(a=>(
            <Card key={a.id}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{a.event}</p>
                  <p className="text-sm text-slate-400">{a.club}</p>
                  <div className="flex gap-4 mt-1.5 text-xs text-slate-400"><span>Event: {a.date}</span><span>Registered: {a.applied}</span></div>
                  {a.attended&&<span className="inline-block mt-2 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-medium">✓ Attended</span>}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <StatusBadge status={a.status}/>
                  <button onClick={()=>setTicketApp(a)} className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline"><QrCode size={11}/>Ticket</button>
                  {a.attended&&<button onClick={()=>setCertApp(a)} className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium hover:underline"><Award size={11}/>Certificate</button>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MessagesPage({ canEdit=false }) {
  const [active, setActive] = useState(0);
  const [msgs, setMsgs] = useState(MESSAGES_DATA);
  const [editing, setEditing] = useState(false);
  const [reply, setReply] = useState("");
  const { add } = useToast();
  const sendReply = () => { if(!reply.trim())return; add("Message sent!"); setReply(""); };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Messages</h2>
        {canEdit&&<button onClick={()=>setEditing(e=>!e)} className={`p-2 rounded-lg transition ${editing?"bg-violet-100 dark:bg-violet-900/30 text-violet-600":"text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{editing?<CheckCircle size={16}/>:<Pencil size={16}/>}</button>}
      </div>
      {msgs.length===0?<EmptyState emoji="💬" title="No messages yet" desc="Messages from clubs will appear here."/>:(
        <div className="grid md:grid-cols-3 gap-4" style={{minHeight:"360px"}}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            {msgs.map((m,i)=>(
              <div key={m.id} className="relative">
                <button onClick={()=>setActive(i)} className={`w-full text-left p-4 border-b border-slate-50 dark:border-slate-700 transition ${active===i?"bg-violet-50 dark:bg-violet-900/20":"hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}>
                  <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><span>{m.avatar}</span><p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{m.from}</p>{m.unread&&<div className="w-2 h-2 rounded-full bg-violet-600"/>}</div><span className="text-xs text-slate-400">{m.time}</span></div>
                  <p className="text-xs text-slate-400 truncate pl-6">{m.message}</p>
                </button>
                {editing&&<button onClick={()=>setMsgs(l=>l.filter(x=>x.id!==m.id))} className="absolute top-3 right-3 p-1 rounded bg-rose-50 dark:bg-rose-900/30 text-rose-400 hover:bg-rose-100"><Trash2 size={12}/></button>}
              </div>
            ))}
          </div>
          <div className="col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 flex flex-col">
            {msgs[active]?(
              <>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700"><span className="text-xl">{msgs[active].avatar}</span><p className="font-semibold text-slate-800 dark:text-slate-200">{msgs[active].from}</p></div>
                <div className="flex-1 flex items-end pb-4"><div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl rounded-tl-sm p-3 text-sm text-slate-700 dark:text-slate-300 max-w-xs">{msgs[active].message}</div></div>
                <div className="flex gap-2"><input value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReply()} placeholder="Type a reply…" className="flex-1 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"/><button onClick={sendReply} className="bg-violet-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-violet-700 transition">Send</button></div>
              </>
            ):<div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Select a conversation</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CLUB PAGES ───────────────────────────────────────────────────────────────

function ClubDashboard({ setPage }) {
  const [events, setEvents] = useState(EVENTS_DATA);
  const [followers, setFollowers] = useState(FOLLOWERS_DATA);
  const [editEvents, setEditEvents] = useState(false);
  const [editFollowers, setEditFollowers] = useState(false);
  const [loading, setLoading] = useState(true);
  const { add } = useToast();
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),800);return()=>clearTimeout(t);},[]);
  if (loading) return <SkeletonPage/>;
  const totalMembers = CORE_TEAM_DATA.length+followers.length;
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6 text-white" style={{background:"linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%)"}}>
        <p className="text-violet-300 text-sm font-medium mb-1">Club Admin</p>
        <h2 className="text-2xl font-bold mb-1">Tech Society</h2>
        <p className="text-indigo-200 text-sm">{events.length} events · {totalMembers} registered members</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Events" value={String(events.length)} sub="All time" gradient="bg-gradient-to-br from-violet-500 to-indigo-700" onClick={()=>setPage("events")}/>
        <StatCard label="Registrations" value="156" sub="This month" gradient="bg-gradient-to-br from-amber-400 to-orange-500" onClick={()=>setPage("applications")}/>
        <StatCard label="Registered Members" value={String(totalMembers)} sub={`${CORE_TEAM_DATA.length} core · ${followers.length} followers`} gradient="bg-gradient-to-br from-emerald-400 to-teal-600" onClick={()=>setPage("profile")}/>
        <StatCard label="Core Team" value={String(CORE_TEAM_DATA.length)} gradient="bg-gradient-to-br from-rose-400 to-pink-600" onClick={()=>setPage("profile")}/>
      </div>
      <Card>
        <SectionHeader title="All Events" action={!editEvents?"Manage":undefined} onAction={()=>setPage("events")} editing={editEvents} onToggleEdit={()=>setEditEvents(e=>!e)}/>
        {events.slice(0,4).map(e=>(
          <div key={e.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 dark:border-slate-700 last:border-0">
            <span className="text-xl">{e.emoji}</span>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{e.title}</p><p className="text-xs text-slate-400">{e.date} · {e.registered} registered</p></div>
            <StatusBadge status={e.status}/>
            {editEvents&&<button onClick={()=>{setEvents(l=>l.filter(x=>x.id!==e.id));add(`"${e.title}" deleted`,"info");}} className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={13}/></button>}
          </div>
        ))}
      </Card>
      <Card>
        <SectionHeader title="Members Following" sub={`${followers.length} students follow your club`} editing={editFollowers} onToggleEdit={()=>setEditFollowers(e=>!e)}/>
        {followers.length===0?<EmptyState emoji="👥" title="No followers yet" desc="Share your club profile to attract members."/>:(
          followers.map(f=>(
            <div key={f.id} className="flex items-center gap-3 py-2 border-b border-slate-50 dark:border-slate-700 last:border-0">
              <AvatarCircle name={f.name}/><div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{f.name}</p><p className="text-xs text-slate-400">{f.enroll}</p></div>
              {editFollowers&&<button onClick={()=>{setFollowers(l=>l.filter(x=>x.id!==f.id));add(`Removed ${f.name}`,"info");}} className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={13}/></button>}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

function ClubAllEvents() {
  const [events, setEvents] = useState(EVENTS_DATA);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [fields, setFields] = useState({title:"",date:"",venue:"",spots:"",category:"",price:"0",status:"published"});
  const [attendance, setAttendance] = useState({});
  const { add } = useToast();
  const addEvent = () => {
    if (!fields.title){add("Event name required","error");return;}
    setEvents(l=>[...l,{id:Date.now(),title:fields.title,club:"Tech Society",date:fields.date||"TBD",time:"TBD",venue:fields.venue||"TBD",category:fields.category||"General",spots:parseInt(fields.spots)||100,registered:0,emoji:"📌",desc:"",price:parseInt(fields.price)||0,status:fields.status}]);
    setFields({title:"",date:"",venue:"",spots:"",category:"",price:"0",status:"published"});
    setShowForm(false); add(`"${fields.title}" created! 🎉`);
  };
  const toggleAttend = (eventId, studentId) => {
    setAttendance(a => ({...a, [`${eventId}-${studentId}`]: !a[`${eventId}-${studentId}`]}));
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">All Events</h2><p className="text-slate-400 text-sm">{events.length} events total</p></div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setEditing(e=>!e)} className={`p-2 rounded-lg transition ${editing?"bg-violet-100 dark:bg-violet-900/30 text-violet-600":"text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{editing?<CheckCircle size={16}/>:<Pencil size={16}/>}</button>
          <button onClick={()=>setShowForm(v=>!v)} className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-violet-700 active:scale-95 transition font-medium"><Plus size={15}/>New Event</button>
        </div>
      </div>
      {showForm&&(
        <Card className="border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20">
          <div className="flex justify-between items-center mb-4"><h3 className="font-semibold text-slate-800 dark:text-slate-200">Create Event</h3><button onClick={()=>setShowForm(false)} className="text-slate-400 p-1"><X size={16}/></button></div>
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            {[["Event Name","title","text"],["Date","date","text"],["Venue","venue","text"],["Max Participants","spots","number"],["Category","category","text"],["Price (₹, 0 = free)","price","number"]].map(([label,key,type])=>(
              <div key={key}><label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block font-medium">{label}</label><input type={type} value={fields[key]} onChange={e=>setFields(f=>({...f,[key]:e.target.value}))} className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"/></div>
            ))}
            <div className="md:col-span-2">
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block font-medium">Status</label>
              <div className="flex gap-2">{[["published","Published ✓"],["draft","Draft"],["scheduled","Scheduled"]].map(([val,label])=>(<button key={val} onClick={()=>setFields(f=>({...f,status:val}))} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${fields.status===val?"bg-violet-600 text-white border-violet-600":"bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"}`}>{label}</button>))}</div>
            </div>
          </div>
          <button onClick={addEvent} className="bg-violet-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-violet-700 active:scale-95 transition font-medium">Create Event</button>
        </Card>
      )}
      {events.length===0?<EmptyState emoji="📅" title="No events yet" desc="Create your first event." action="Create Event" onAction={()=>setShowForm(true)}/>:(
        <div className="space-y-3">
          {events.map(e=>{
            const regs=REGISTRATIONS_DATA.filter(r=>r.event===e.title);
            const isExpanded=expandedId===e.id;
            return (
              <Card key={e.id}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-xl flex-shrink-0">{e.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{e.title}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{e.date}</span><span>{e.registered}/{e.spots}</span>
                      <span className="text-violet-600 dark:text-violet-400 font-medium">{e.category}</span>
                      {e.price>0&&<span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5"><Tag size={9}/>₹{e.price}</span>}
                    </div>
                  </div>
                  <StatusBadge status={e.status}/>
                  {editing?(
                    <button onClick={()=>{setEvents(l=>l.filter(x=>x.id!==e.id));add(`"${e.title}" deleted`,"info");}} className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={15}/></button>
                  ):(
                    <button onClick={()=>setExpandedId(prev=>prev===e.id?null:e.id)} className="flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition flex-shrink-0">
                      Manage {isExpanded?<ChevronUp size={13}/>:<ChevronDown size={13}/>}
                    </button>
                  )}
                </div>
                {isExpanded&&!editing&&(
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{e.registered}</p><p className="text-xs text-slate-400 mt-0.5">Registered</p></div>
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{e.spots-e.registered}</p><p className="text-xs text-slate-400 mt-0.5">Spots Left</p></div>
                      <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-violet-700 dark:text-violet-300">{Math.round((e.registered/e.spots)*100)}%</p><p className="text-xs text-violet-400 mt-0.5">Filled</p></div>
                    </div>
                    {regs.length>0&&(
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Attendance</p>
                          <button onClick={()=>{exportCSV(regs.map(r=>({student:r.student,enroll:r.enroll,status:r.status})),`${e.title}_registrations.csv`);add("CSV exported!","info");}} className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline"><Download size={11}/>Export CSV</button>
                        </div>
                        {regs.map(r=>(
                          <div key={r.id} className="flex items-center gap-3 py-2 border-b border-slate-50 dark:border-slate-700 last:border-0">
                            <button onClick={()=>toggleAttend(e.id,r.id)} className="flex-shrink-0 text-slate-400 hover:text-violet-600 transition">
                              {attendance[`${e.id}-${r.id}`]?<CheckSquare size={18} className="text-emerald-600"/>:<Square size={18}/>}
                            </button>
                            <AvatarCircle name={r.student}/>
                            <div className="flex-1"><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{r.student}</p><p className="text-xs text-slate-400">{r.enroll}</p></div>
                            {attendance[`${e.id}-${r.id}`]&&<span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Present</span>}
                          </div>
                        ))}
                        <button onClick={()=>add("Attendance saved! ✓")} className="mt-3 text-sm bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition">Save Attendance</button>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs text-slate-400 mb-1 block font-medium">Title</label><input defaultValue={e.title} className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"/></div>
                      <div><label className="text-xs text-slate-400 mb-1 block font-medium">Date</label><input defaultValue={e.date} className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"/></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>{setExpandedId(null);add("Changes saved!");}} className="flex-1 bg-violet-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-violet-700 transition">Save Changes</button>
                      <button onClick={()=>{setEvents(l=>l.filter(x=>x.id!==e.id));add(`"${e.title}" deleted`,"info");}} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-rose-500 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"><Trash2 size={13}/>Delete</button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RegistrationsPage() {
  const [regs, setRegs] = useState(REGISTRATIONS_DATA);
  const [editing, setEditing] = useState(false);
  const [filter, setFilter] = useState("all");
  const { add } = useToast();
  const filtered = regs.filter(r => filter==="all" || r.event===filter);
  const events = [...new Set(regs.map(r=>r.event))];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Applications</h2><p className="text-slate-400 text-sm">{regs.length} total registrations</p></div>
        <div className="flex items-center gap-2">
          <button onClick={()=>{exportCSV(regs,`registrations.csv`);add("CSV downloaded!","info");}} className="flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700 px-3 py-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition font-medium"><Download size={14}/>CSV</button>
          <button onClick={()=>setEditing(e=>!e)} className={`p-2 rounded-lg transition ${editing?"bg-violet-100 dark:bg-violet-900/30 text-violet-600":"text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{editing?<CheckCircle size={16}/>:<Pencil size={16}/>}</button>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
        <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0"/>
        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Registrations are automatically approved.</p>
      </div>
      {events.length>1&&(
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>setFilter("all")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${filter==="all"?"bg-violet-600 text-white":"bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>All</button>
          {events.map(ev=>(<button key={ev} onClick={()=>setFilter(ev)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${filter===ev?"bg-violet-600 text-white":"bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>{ev}</button>))}
        </div>
      )}
      {filtered.length===0?<EmptyState emoji="📭" title="No registrations yet" desc="Students who register for your events will appear here."/>:(
        <div className="space-y-3">
          {filtered.map(r=>(
            <Card key={r.id} className="flex items-center gap-4">
              <AvatarCircle name={r.student}/>
              <div className="flex-1 min-w-0"><p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{r.student}</p><p className="text-xs text-slate-400">{r.enroll} · {r.event}</p><p className="text-xs text-slate-400 mt-0.5">Registered {r.applied}</p></div>
              <StatusBadge status="approved"/>
              {editing&&<button onClick={()=>{setRegs(l=>l.filter(x=>x.id!==r.id));add(`Removed ${r.student}`,"info");}} className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={14}/></button>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS_DATA);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState({title:"",content:"",emoji:"📢"});
  const { add } = useToast();
  const post = () => {
    if (!fields.title){add("Title required","error");return;}
    setAnnouncements(l=>[{id:Date.now(),title:fields.title,content:fields.content,date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),reach:156,emoji:fields.emoji},...l]);
    setFields({title:"",content:"",emoji:"📢"}); setShowForm(false); add("Announcement sent to all followers! 📢");
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Announcements</h2><p className="text-slate-400 text-sm">Send updates to your {FOLLOWERS_DATA.length} followers</p></div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setEditing(e=>!e)} className={`p-2 rounded-lg transition ${editing?"bg-violet-100 dark:bg-violet-900/30 text-violet-600":"text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{editing?<CheckCircle size={16}/>:<Pencil size={16}/>}</button>
          <button onClick={()=>setShowForm(v=>!v)} className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-violet-700 active:scale-95 transition font-medium"><Send size={14}/>New Announcement</button>
        </div>
      </div>
      {showForm&&(
        <Card className="border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20">
          <div className="flex justify-between mb-3"><h3 className="font-semibold text-slate-800 dark:text-slate-200">New Announcement</h3><button onClick={()=>setShowForm(false)} className="text-slate-400 p-1"><X size={16}/></button></div>
          <div className="space-y-3 mb-3">
            <div className="grid grid-cols-4 gap-2 mb-1">
              {["📢","🎉","⚡","🔔","📅","🏆","💡","❗"].map(e=>(<button key={e} onClick={()=>setFields(f=>({...f,emoji:e}))} className={`p-2 rounded-lg text-xl transition ${fields.emoji===e?"bg-violet-200 dark:bg-violet-800":"hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{e}</button>))}
            </div>
            <div><label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block font-medium">Title</label><input value={fields.title} onChange={e=>setFields(f=>({...f,title:e.target.value}))} className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"/></div>
            <div><label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block font-medium">Message</label><textarea rows={3} value={fields.content} onChange={e=>setFields(f=>({...f,content:e.target.value}))} className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"/></div>
          </div>
          <button onClick={post} className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-violet-700 active:scale-95 transition font-medium"><Send size={14}/>Send to {FOLLOWERS_DATA.length} followers</button>
        </Card>
      )}
      {announcements.length===0?<EmptyState emoji="📢" title="No announcements yet" desc="Keep your followers updated." action="Post Announcement" onAction={()=>setShowForm(true)}/>:(
        <div className="space-y-3">
          {announcements.map(a=>(
            <Card key={a.id}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-xl flex-shrink-0">{a.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{a.title}</p>
                    {editing&&<button onClick={()=>{setAnnouncements(l=>l.filter(x=>x.id!==a.id));add("Announcement deleted","info");}} className="p-1 rounded bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:bg-rose-100 flex-shrink-0"><Trash2 size={13}/></button>}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{a.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span>{a.date}</span>
                    <span className="flex items-center gap-1"><Users size={10}/>{a.reach} reached</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ClubProfile() {
  const [editInfo, setEditInfo] = useState(false);
  const [info, setInfo] = useState({name:"Tech Society",tagline:"Building tomorrow, today",email:"techsociety@amity.edu",about:"Tech Society at Amity University is a student-run organization dedicated to fostering a passion for technology, innovation, and entrepreneurship."});
  const [team, setTeam] = useState(CORE_TEAM_DATA);
  const [editTeam, setEditTeam] = useState(false);
  const [newMember, setNewMember] = useState({name:"",enroll:"",role:""});
  const { add } = useToast();
  const addMember = () => { if (!newMember.name){add("Name required","error");return;} setTeam(l=>[...l,{id:Date.now(),...newMember}]); setNewMember({name:"",enroll:"",role:""}); add(`${newMember.name} added! 🎉`); };
  const inputCls = "w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200";
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Club Profile</h2><p className="text-slate-400 text-sm">Update your club's public information</p></div>
      <Card>
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-3xl">💻</div><div><p className="font-bold text-slate-800 dark:text-white text-lg">{info.name}</p><p className="text-slate-400 text-sm">Amity University · Est. 2018</p></div></div>
          <button onClick={()=>{setEditInfo(e=>!e);if(editInfo)add("Profile saved!");}} className={`p-2 rounded-lg transition ${editInfo?"bg-violet-100 dark:bg-violet-900/30 text-violet-600":"text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{editInfo?<CheckCircle size={16}/>:<Pencil size={16}/>}</button>
        </div>
        <div className="space-y-4">
          {[["Club Name","name"],["Tagline","tagline"],["Contact Email","email"]].map(([label,key])=>(<div key={key}><label className="text-xs text-slate-400 mb-1.5 block font-medium">{label}</label>{editInfo?<input value={info[key]} onChange={e=>setInfo(i=>({...i,[key]:e.target.value}))} className={inputCls}/>:<p className="text-sm text-slate-800 dark:text-slate-200 px-3 py-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">{info[key]}</p>}</div>))}
          <div><label className="text-xs text-slate-400 mb-1.5 block font-medium">About</label>{editInfo?<textarea rows={3} value={info.about} onChange={e=>setInfo(i=>({...i,about:e.target.value}))} className={`${inputCls} resize-none`}/>:<p className="text-sm text-slate-800 dark:text-slate-200 px-3 py-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl leading-relaxed">{info.about}</p>}</div>
        </div>
      </Card>
      <Card>
        <SectionHeader title="Core Team" sub={`${team.length} members`} editing={editTeam} onToggleEdit={()=>setEditTeam(e=>!e)}/>
        {team.length===0?<EmptyState emoji="👥" title="No team members yet" desc="Add your core team."/>:team.map(m=>(
          <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 dark:border-slate-700 last:border-0">
            <AvatarCircle name={m.name}/><div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{m.name}</p><p className="text-xs text-slate-400">{m.enroll}</p></div>
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full font-medium flex-shrink-0">{m.role}</span>
            {editTeam&&<button onClick={()=>{setTeam(l=>l.filter(x=>x.id!==m.id));add(`Removed ${m.name}`,"info");}} className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={13}/></button>}
          </div>
        ))}
        {editTeam&&(<div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700"><p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">Add Member</p><div className="grid grid-cols-3 gap-2 mb-2">{[["Name","name"],["Enroll","enroll"],["Role","role"]].map(([ph,key])=>(<input key={key} placeholder={ph} value={newMember[key]} onChange={e=>setNewMember(m=>({...m,[key]:e.target.value}))} className="border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400"/>))}</div><button onClick={addMember} className="text-sm bg-violet-600 text-white px-4 py-1.5 rounded-lg hover:bg-violet-700 active:scale-95 transition">Add Member</button></div>)}
      </Card>
    </div>
  );
}

function TeamRecruitmentPage() {
  const [roles, setRoles] = useState(RECRUITMENT_DATA);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState({title:"",open:"",desc:""});
  const { add } = useToast();
  const addRole = () => { if (!fields.title){add("Title required","error");return;} setRoles(l=>[...l,{id:Date.now(),title:fields.title,open:parseInt(fields.open)||1,applied:0,desc:fields.desc}]); setFields({title:"",open:"",desc:""}); setShowForm(false); add(`"${fields.title}" posted! 🎉`); };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Team Recruitment</h2><p className="text-slate-400 text-sm">Manage open positions</p></div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setEditing(e=>!e)} className={`p-2 rounded-lg transition ${editing?"bg-violet-100 dark:bg-violet-900/30 text-violet-600":"text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{editing?<CheckCircle size={16}/>:<Pencil size={16}/>}</button>
          <button onClick={()=>setShowForm(v=>!v)} className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-violet-700 active:scale-95 transition font-medium"><Plus size={15}/>Post Role</button>
        </div>
      </div>
      {showForm&&(<Card className="border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20"><div className="flex justify-between mb-3"><h3 className="font-semibold text-slate-800 dark:text-slate-200">New Role</h3><button onClick={()=>setShowForm(false)} className="text-slate-400 p-1"><X size={16}/></button></div><div className="grid md:grid-cols-2 gap-3 mb-3"><div><label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block font-medium">Role Title</label><input value={fields.title} onChange={e=>setFields(f=>({...f,title:e.target.value}))} className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"/></div><div><label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block font-medium">Openings</label><input value={fields.open} onChange={e=>setFields(f=>({...f,open:e.target.value}))} type="number" className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"/></div><div className="md:col-span-2"><label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block font-medium">Responsibilities</label><textarea rows={2} value={fields.desc} onChange={e=>setFields(f=>({...f,desc:e.target.value}))} className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"/></div></div><button onClick={addRole} className="bg-violet-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-violet-700 active:scale-95 transition font-medium">Post Role</button></Card>)}
      {roles.length===0?<EmptyState emoji="💼" title="No open roles" desc="Post a role to start recruiting." action="Post Role" onAction={()=>setShowForm(true)}/>:(
        <div className="grid md:grid-cols-2 gap-4">
          {roles.map(r=>(<Card key={r.id}><div className="flex justify-between items-start mb-1"><div className="flex-1 pr-2"><p className="font-semibold text-slate-800 dark:text-slate-200">{r.title}</p><p className="text-xs text-slate-400 mt-0.5">{r.desc}</p></div>{editing&&<button onClick={()=>{setRoles(l=>l.filter(x=>x.id!==r.id));add(`"${r.title}" removed`,"info");}} className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={13}/></button>}</div><div className="flex items-center justify-between mt-3"><span className="text-xs text-violet-600 dark:text-violet-400 font-medium">{r.open} opening{r.open>1?"s":""}</span><span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-semibold">{r.applied} applied</span></div><button onClick={()=>add("Applicants view coming soon!","info")} className="w-full text-center text-sm text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700 py-2 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition font-medium mt-3">View Applicants</button></Card>))}
        </div>
      )}
    </div>
  );
}

// ─── FACULTY PAGES ────────────────────────────────────────────────────────────

function FacultyDashboard({ setPage }) {
  const [pendingList, setPendingList] = useState(PENDING_EVENTS_DATA);
  const [loading, setLoading] = useState(true);
  const { add } = useToast();
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),700);return()=>clearTimeout(t);},[]);
  if (loading) return <SkeletonPage/>;
  const resolve = (id, approved) => { setPendingList(l=>l.filter(p=>p.id!==id)); add(approved?"Event approved ✓":"Event rejected","info"); };
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6 text-white" style={{background:"linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%)"}}>
        <p className="text-violet-300 text-sm font-medium mb-1">Faculty Coordinator</p>
        <h2 className="text-2xl font-bold mb-1">Dr. Priya Kapoor</h2>
        <p className="text-indigo-200 text-sm">{pendingList.length} event{pendingList.length!==1?"s":""} pending · Tech Society</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="All Events" value="34" sub="This year" gradient="bg-gradient-to-br from-violet-500 to-indigo-700" onClick={()=>setPage("eventmgmt")}/>
        <StatCard label="Pending Approvals" value={String(pendingList.length)} sub="Tap to review" gradient="bg-gradient-to-br from-amber-400 to-orange-500" onClick={()=>setPage("eventmgmt")}/>
        <StatCard label="Students Registered" value="892" sub="Across events" gradient="bg-gradient-to-br from-emerald-400 to-teal-600" onClick={()=>setPage("applications")}/>
        <StatCard label="Assigned Club" value="1" sub="Tech Society" gradient="bg-gradient-to-br from-rose-400 to-pink-600" onClick={()=>setPage("profile")}/>
      </div>
      <Card>
        <SectionHeader title="Pending Approvals" action="See all" onAction={()=>setPage("eventmgmt")}/>
        {pendingList.length===0?<EmptyState emoji="✅" title="All caught up!" desc="No events pending approval."/>:pendingList.map(p=>(
          <div key={p.id} className="flex items-center gap-4 py-3 border-b border-slate-50 dark:border-slate-700 last:border-0">
            <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{p.title}</p><p className="text-xs text-slate-400">{p.club} · {p.date}</p></div>
            <span className="text-xs bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full font-medium flex-shrink-0">{p.category}</span>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={()=>resolve(p.id,true)} className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 transition"><CheckCircle size={14}/></button>
              <button onClick={()=>resolve(p.id,false)} className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 transition"><X size={14}/></button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function EventManagementPage() {
  const [events, setEvents] = useState(EVENTS_DATA);
  const [tab, setTab] = useState("all");
  const [editing, setEditing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const { add } = useToast();
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">All Events</h2><p className="text-slate-400 text-sm">Review and manage club events</p></div>
        <div className="flex items-center gap-2">
          <button onClick={()=>{exportCSV(events.map(e=>({title:e.title,club:e.club,date:e.date,category:e.category,registered:e.registered,spots:e.spots,status:e.status})),"all_events.csv");add("CSV downloaded!","info");}} className="flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700 px-3 py-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition font-medium"><Download size={14}/>CSV</button>
          <button onClick={()=>setEditing(e=>!e)} className={`p-2 rounded-lg transition ${editing?"bg-violet-100 dark:bg-violet-900/30 text-violet-600":"text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{editing?<CheckCircle size={16}/>:<Pencil size={16}/>}</button>
        </div>
      </div>
      <div className="flex gap-2">{[["all","All"],["published","Published"],["draft","Drafts"],["scheduled","Scheduled"]].map(([val,label])=>(<button key={val} onClick={()=>setTab(val)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${tab===val?"bg-violet-600 text-white":"bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>{label}</button>))}</div>
      {events.filter(e=>tab==="all"||e.status===tab).length===0?<EmptyState emoji="📅" title="No events" desc="Events will appear here."/>:(
        <div className="space-y-3">
          {events.filter(e=>tab==="all"||e.status===tab).map(e=>{
            const isExpanded=expandedId===e.id;
            return (
              <Card key={e.id}>
                <div className="flex items-center gap-4">
                  <div className="text-2xl flex-shrink-0">{e.emoji}</div>
                  <div className="flex-1 min-w-0"><p className="font-semibold text-slate-800 dark:text-slate-200">{e.title}</p><p className="text-xs text-slate-400 mt-0.5">{e.club} · {e.date} · {e.registered}/{e.spots}</p></div>
                  <div className="flex items-center gap-2 flex-shrink-0"><StatusBadge status={e.status}/>{e.price>0&&<span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">₹{e.price}</span>}</div>
                  {editing?(
                    <button onClick={()=>{setEvents(l=>l.filter(x=>x.id!==e.id));add(`"${e.title}" removed`,"info");}} className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={15}/></button>
                  ):(
                    <button onClick={()=>setExpandedId(prev=>prev===e.id?null:e.id)} className="flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition flex-shrink-0">
                      Review {isExpanded?<ChevronUp size={13}/>:<ChevronDown size={13}/>}
                    </button>
                  )}
                </div>
                {isExpanded&&!editing&&(
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[["Date",e.date],["Time",e.time||"TBD"],["Registrations",`${e.registered}/${e.spots}`],["Fill Rate",`${Math.round((e.registered/e.spots)*100)}%`]].map(([label,val])=>(<div key={label} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">{label}</p><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{val}</p></div>))}
                      {e.venue&&(<div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 col-span-2"><p className="text-xs text-slate-400 mb-0.5">Venue</p><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{e.venue}</p><a href={getMapsUrl(e.venue)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline"><ExternalLink size={11}/>Maps</a></div></div>)}
                    </div>
                    {e.desc&&<div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3"><p className="text-xs text-slate-400 mb-1">Description</p><p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{e.desc}</p></div>}
                    <div className="flex gap-2">
                      <button onClick={()=>{setExpandedId(null);add("Event approved ✓");}} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition">✓ Approve Event</button>
                      <button onClick={()=>{setExpandedId(null);add("Event rejected","info");}} className="flex-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-100 active:scale-95 transition">✕ Reject Event</button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AuditTrailPage() {
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Audit Trail</h2><p className="text-slate-400 text-sm">Complete log of all approval actions</p></div>
      <div className="space-y-3">
        {AUDIT_LOG.map(entry=>(
          <Card key={entry.id} className="flex items-center gap-4">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${entry.color==="emerald"?"bg-emerald-100 dark:bg-emerald-900/30":"bg-rose-100 dark:bg-rose-900/30"}`}>
              {entry.color==="emerald"?<CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400"/>:<X size={16} className="text-rose-500 dark:text-rose-400"/>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${entry.color==="emerald"?"bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400":"bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"}`}>{entry.action}</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{entry.event}</p>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{entry.club}</p>
              <p className="text-xs text-slate-400 mt-0.5">{entry.by} · {entry.time}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FacultyProfile() {
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({name:"Tech Society",tagline:"Building tomorrow, today",about:"Tech Society at Amity University is dedicated to fostering innovation and entrepreneurship.",email:"techsociety@amity.edu"});
  const { add } = useToast();
  const inputCls = "w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200";
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Update Description</h2><p className="text-slate-400 text-sm">Edit the club profile you coordinate</p></div>
      <Card>
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-3xl">💻</div><div><p className="font-bold text-slate-800 dark:text-white text-lg">{info.name}</p><p className="text-slate-400 text-sm">Coordinated by Dr. Priya Kapoor</p></div></div>
          <button onClick={()=>{setEditing(e=>!e);if(editing)add("Description saved!");}} className={`p-2 rounded-lg transition ${editing?"bg-violet-100 dark:bg-violet-900/30 text-violet-600":"text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>{editing?<CheckCircle size={16}/>:<Pencil size={16}/>}</button>
        </div>
        <div className="space-y-4">
          {[["Club Name","name"],["Tagline","tagline"],["Email","email"]].map(([label,key])=>(<div key={key}><label className="text-xs text-slate-400 mb-1.5 block font-medium">{label}</label>{editing?<input value={info[key]} onChange={e=>setInfo(i=>({...i,[key]:e.target.value}))} className={inputCls}/>:<p className="text-sm text-slate-800 dark:text-slate-200 px-3 py-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">{info[key]}</p>}</div>))}
          <div><label className="text-xs text-slate-400 mb-1.5 block font-medium">About</label>{editing?<textarea rows={4} value={info.about} onChange={e=>setInfo(i=>({...i,about:e.target.value}))} className={`${inputCls} resize-none`}/>:<p className="text-sm text-slate-800 dark:text-slate-200 px-3 py-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl leading-relaxed">{info.about}</p>}</div>
        </div>
      </Card>
    </div>
  );
}

// ─── TECH ADMIN ───────────────────────────────────────────────────────────────

function TechAdminDashboard({ setPage }) {
  const [loading, setLoading] = useState(true);
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),900);return()=>clearTimeout(t);},[]);
  if (loading) return <SkeletonPage/>;
  const totalStudents=UNIVERSITIES.reduce((s,u)=>s+u.students,0);
  const totalClubs=UNIVERSITIES.reduce((s,u)=>s+u.clubs,0);
  const totalEvents=UNIVERSITIES.reduce((s,u)=>s+u.events,0);
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6 text-white" style={{background:"linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)"}}>
        <div className="flex items-center gap-2 mb-3"><Shield size={16} className="text-violet-400"/><p className="text-violet-300 text-sm font-medium">Tech Admin · Platform Level</p></div>
        <h2 className="text-2xl font-bold mb-1">ClubSphere Admin</h2>
        <p className="text-indigo-200 text-sm">{UNIVERSITIES.filter(u=>u.active).length} universities live · {totalStudents.toLocaleString()} total users</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Universities" value={String(UNIVERSITIES.length)} sub={`${UNIVERSITIES.filter(u=>u.active).length} active`} gradient="bg-gradient-to-br from-violet-500 to-indigo-700" onClick={()=>setPage("universities")}/>
        <StatCard label="Total Users" value={totalStudents.toLocaleString()} sub="All universities" gradient="bg-gradient-to-br from-amber-400 to-orange-500" onClick={()=>setPage("users")}/>
        <StatCard label="Total Clubs" value={String(totalClubs)} sub="Across platform" gradient="bg-gradient-to-br from-emerald-400 to-teal-600" onClick={()=>setPage("clubs")}/>
        <StatCard label="Events / Month" value={String(totalEvents)} gradient="bg-gradient-to-br from-rose-400 to-pink-600" onClick={()=>setPage("analytics")}/>
      </div>
      <Card>
        <SectionHeader title="Universities" action="Manage" onAction={()=>setPage("universities")}/>
        {UNIVERSITIES.map(u=>(<div key={u.id} className="flex items-center gap-3 py-3 border-b border-slate-50 dark:border-slate-700 last:border-0"><span className="text-xl">{u.logo}</span><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{u.name}</p><p className="text-xs text-slate-400">{u.campus} · {u.clubs} clubs</p></div><StatusBadge status={u.active?"active":"inactive"}/></div>))}
      </Card>
    </div>
  );
}

function TechAdminUniversities() {
  const [unis, setUnis] = useState(UNIVERSITIES);
  const [showForm, setShowForm] = useState(false);
  const [fields, setFields] = useState({name:"",campus:"",logo:""});
  const { add } = useToast();
  const toggle = (id) => { const u=unis.find(x=>x.id===id); setUnis(l=>l.map(x=>x.id===id?{...x,active:!x.active}:x)); add(u?.active?`${u.name} disabled`:`${u.name} enabled`); };
  const addUni = () => { if (!fields.name){add("Name required","error");return;} setUnis(l=>[...l,{id:Date.now().toString(),name:fields.name,campus:fields.campus,logo:fields.logo||"🏫",clubs:0,students:0,events:0,active:true}]); setFields({name:"",campus:"",logo:""}); setShowForm(false); add(`${fields.name} added! 🎉`); };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Universities</h2><p className="text-slate-400 text-sm">Manage universities on the platform</p></div><button onClick={()=>setShowForm(v=>!v)} className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-violet-700 active:scale-95 transition font-medium"><Plus size={15}/>Add University</button></div>
      {showForm&&(<Card className="border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20"><div className="flex justify-between mb-3"><h3 className="font-semibold text-slate-800 dark:text-slate-200">Add University</h3><button onClick={()=>setShowForm(false)} className="text-slate-400 p-1"><X size={16}/></button></div><div className="grid md:grid-cols-3 gap-3 mb-3">{[["University Name","name"],["Campus / Location","campus"],["Logo Emoji","logo"]].map(([label,key])=>(<div key={key}><label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block font-medium">{label}</label><input value={fields[key]} onChange={e=>setFields(f=>({...f,[key]:e.target.value}))} className="w-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"/></div>))}</div><button onClick={addUni} className="bg-violet-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-violet-700 active:scale-95 transition font-medium">Add University</button></Card>)}
      <div className="space-y-3">{unis.map(u=>(<Card key={u.id}><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-2xl flex-shrink-0">{u.logo}</div><div className="flex-1 min-w-0"><p className="font-semibold text-slate-800 dark:text-slate-200">{u.name}</p><p className="text-xs text-slate-400 mt-0.5">{u.campus}</p><div className="flex gap-4 text-xs text-slate-400 mt-1"><span>{u.clubs} clubs</span><span>{u.students.toLocaleString()} students</span></div></div><div className="flex items-center gap-2 flex-shrink-0"><StatusBadge status={u.active?"active":"inactive"}/><button onClick={()=>toggle(u.id)} className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition active:scale-95 ${u.active?"text-rose-500 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/20":"text-emerald-600 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"}`}>{u.active?"Disable":"Enable"}</button></div></div></Card>))}</div>
    </div>
  );
}

function TechAdminUsers() {
  const [users, setUsers] = useState(PLATFORM_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { add } = useToast();
  const toggleStatus = (id) => { const u=users.find(x=>x.id===id); setUsers(l=>l.map(x=>x.id===id?{...x,status:x.status==="active"?"suspended":"active"}:x)); add(u?.status==="active"?`${u.name} suspended`:`${u.name} restored`,"info"); };
  const filtered = users.filter(u=>(roleFilter==="all"||u.role===roleFilter)&&(u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase())));
  const roleBadge = {student:"bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",faculty:"bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",club:"bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",techAdmin:"bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"};
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-800 dark:text-white">User Management</h2><p className="text-slate-400 text-sm">{users.length} users on the platform</p></div><button onClick={()=>{exportCSV(users,"users.csv");add("Users CSV exported!","info");}} className="flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700 px-3 py-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition font-medium"><Download size={14}/>CSV</button></div>
      <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"/></div>
      <div className="flex gap-2 flex-wrap">{[["all","All"],["student","Students"],["faculty","Faculty"],["club","Clubs"]].map(([val,label])=>(<button key={val} onClick={()=>setRoleFilter(val)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${roleFilter===val?"bg-violet-600 text-white":"bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}>{label}</button>))}</div>
      {filtered.length===0?<EmptyState emoji="🔍" title="No users found" desc={`No users match "${search}".`} action="Clear" onAction={()=>{setSearch("");setRoleFilter("all");}}/>:(
        <div className="space-y-3">{filtered.map(u=>(<Card key={u.id} className="flex items-center gap-4"><AvatarCircle name={u.name}/><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{u.name}</p><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge[u.role]||"bg-slate-100 text-slate-600"}`}>{u.role}</span></div><p className="text-xs text-slate-400">{u.email}</p><p className="text-xs text-slate-400">{u.university} · Joined {u.joined}</p></div><div className="flex items-center gap-2 flex-shrink-0"><StatusBadge status={u.status}/><button onClick={()=>toggleStatus(u.id)} className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition active:scale-95 ${u.status==="active"?"text-rose-500 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/20":"text-emerald-600 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"}`}>{u.status==="active"?"Suspend":"Restore"}</button></div></Card>))}</div>
      )}
    </div>
  );
}

function TechAdminAnalytics() {
  const bars=[{label:"Amity",value:34,color:"bg-violet-500"},{label:"Chandigarh",value:51,color:"bg-indigo-500"},{label:"Manipal",value:62,color:"bg-blue-500"},{label:"VIT",value:78,color:"bg-cyan-500"}];
  const max=Math.max(...bars.map(b=>b.value));
  const growth=[{month:"Apr",users:820},{month:"May",users:940},{month:"Jun",users:1100},{month:"Jul",users:980},{month:"Aug",users:1340},{month:"Sep",users:1620}];
  const gmax=Math.max(...growth.map(g=>g.users));
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Analytics</h2><p className="text-slate-400 text-sm">Platform-level metrics</p></div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Monthly Active Users" value="4.2K" sub="+18% vs last month" gradient="bg-gradient-to-br from-violet-500 to-indigo-700"/>
        <StatCard label="Events This Month" value="225" sub="+31% growth" gradient="bg-gradient-to-br from-emerald-400 to-teal-600"/>
        <StatCard label="Avg. Registration Rate" value="74%" sub="Per event" gradient="bg-gradient-to-br from-amber-400 to-orange-500"/>
        <StatCard label="New Signups" value="1.6K" sub="This month" gradient="bg-gradient-to-br from-rose-400 to-pink-600"/>
      </div>
      <Card><h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Events by University</h3><div className="space-y-3">{bars.map(b=>(<div key={b.label}><div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1"><span>{b.label}</span><span className="font-semibold text-slate-700 dark:text-slate-300">{b.value}</span></div><div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5"><div className={`${b.color} h-2.5 rounded-full`} style={{width:`${(b.value/max)*100}%`}}/></div></div>))}</div></Card>
      <Card><h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">User Growth (6 Months)</h3><div className="flex items-end gap-3 h-32">{growth.map(g=>(<div key={g.month} className="flex-1 flex flex-col items-center gap-1"><p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{g.users>=1000?(g.users/1000).toFixed(1)+"K":g.users}</p><div className="w-full rounded-t-lg bg-violet-500 dark:bg-violet-600" style={{height:`${(g.users/gmax)*96}px`}}/><p className="text-xs text-slate-400">{g.month}</p></div>))}</div></Card>
    </div>
  );
}

function TechAdminSettings() {
  const [s, setS] = useState({otpEmail:true,otpSMS:true,guestBrowse:true,autoApprove:true,maintenanceMode:false,maxClubs:"50",sessionTimeout:"24"});
  const { add } = useToast();
  const toggle = (key) => { setS(x=>({...x,[key]:!x[key]})); add("Setting updated","info"); };
  const Tog = ({on,onClick,label}) => (<button onClick={onClick} role="switch" aria-checked={on} aria-label={label} className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${on?"bg-violet-600":"bg-slate-200 dark:bg-slate-600"}`}><div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${on?"left-6":"left-1"}`}/></button>);
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">System Settings</h2><p className="text-slate-400 text-sm">Global platform configuration</p></div>
      <Card><h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Authentication</h3><div className="space-y-4">{[["otpEmail","Email OTP","Allow login via email OTP"],["otpSMS","SMS OTP","Allow login via phone/SMS OTP"],["guestBrowse","Guest Browsing","Allow unauthenticated users to view events"]].map(([key,label,desc])=>(<div key={key} className="flex items-center justify-between"><div><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p><p className="text-xs text-slate-400">{desc}</p></div><Tog on={s[key]} onClick={()=>toggle(key)} label={label}/></div>))}</div></Card>
      <Card><h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Event Settings</h3><div className="space-y-4"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-slate-800 dark:text-slate-200">Auto-Approve Registrations</p><p className="text-xs text-slate-400">Students approved instantly upon registering</p></div><Tog on={s.autoApprove} onClick={()=>toggle("autoApprove")} label="Auto-approve"/></div><div><label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block font-medium">Max Clubs per University</label><input value={s.maxClubs} onChange={e=>setS(x=>({...x,maxClubs:e.target.value}))} type="number" className="w-32 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"/></div></div></Card>
      <Card className="border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/10"><h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3 flex items-center gap-2"><AlertTriangle size={16}/>Danger Zone</h3><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-rose-800 dark:text-rose-300">Maintenance Mode</p><p className="text-xs text-rose-400">Takes the platform offline for all users</p></div><Tog on={s.maintenanceMode} onClick={()=>{toggle("maintenanceMode");add(s.maintenanceMode?"Maintenance off":"⚠️ Platform in maintenance mode","info");}} label="Maintenance"/></div>{s.maintenanceMode&&<div className="mt-3 p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-2"><AlertTriangle size={13}/>Platform is in maintenance mode</div>}</Card>
      <button onClick={()=>add("All settings saved! ✓")} className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 active:scale-95 transition">Save All Settings</button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const PORTALS = [
  {id:"student",label:"Student",icon:User},
  {id:"club",label:"Club Admin",icon:Users},
  {id:"faculty",label:"Faculty",icon:BookOpen},
  {id:"techAdmin",label:"Tech Admin",icon:Shield},
];
const PORTAL_USERS = {
  student:{name:"Aryan Gupta",sub:"BTech CSE · 3rd Year"},
  club:{name:"Tech Society",sub:"Club Admin"},
  faculty:{name:"Dr. Priya Kapoor",sub:"Faculty Coordinator"},
  techAdmin:{name:"Tech Team",sub:"Platform Administrator"},
};

function AppShell() {
  const [screen, setScreen] = useState("university");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [portal, setPortal] = useState("student");
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useTheme();
  const { add } = useToast();

  const unreadNotifs = NOTIFICATIONS_DATA.filter(n=>!n.read).length;
  const goToPage = useCallback((p)=>{setPage(p);setSidebarOpen(false);},[]);
  const handleLoginRequired = useCallback(()=>{setScreen("auth");},[]);
  const switchPortal = (p)=>{setPortal(p);setPage("dashboard");setSidebarOpen(false);};

  if (screen==="university") return <UniversitySelector onSelect={u=>{setSelectedUniversity(u);setScreen("auth");}}/>;
  if (screen==="auth") return <AuthScreen university={selectedUniversity||UNIVERSITIES[0]} onAuth={role=>{setPortal(role);setIsGuest(false);setScreen("app");setPage("dashboard");add("Welcome back! 👋");}} onGuest={()=>{setPortal("student");setIsGuest(true);setScreen("app");setPage("dashboard");add("Browsing as guest","info");}} onBack={()=>setScreen("university")}/>;

  const navItems = NAV[portal];
  const user = PORTAL_USERS[portal];
  const isTechAdmin = portal==="techAdmin";
  const sidebarBg = isTechAdmin?"bg-slate-900":"bg-indigo-950";
  const sidebarBorder = isTechAdmin?"border-slate-800":"border-indigo-900";
  const sidebarText = isTechAdmin?"text-slate-400 hover:bg-slate-800 hover:text-white":"text-indigo-300 hover:bg-indigo-900 hover:text-white";

  const renderContent = () => {
    if (portal==="student") {
      if (page==="dashboard") return <StudentDashboard setPage={goToPage} isGuest={isGuest} onLoginRequired={handleLoginRequired}/>;
      if (page==="clubs") return <ExploreClubs isGuest={isGuest} onLoginRequired={handleLoginRequired}/>;
      if (page==="applications") return isGuest?<EmptyState emoji="🔒" title="Sign in required" desc="Create an account to track your registrations." action="Sign In" onAction={handleLoginRequired}/>:<StudentApplications/>;
      if (page==="messages") return isGuest?<EmptyState emoji="🔒" title="Sign in required" desc="Sign in to view your messages." action="Sign In" onAction={handleLoginRequired}/>:<MessagesPage canEdit={false}/>;
      if (page==="profile") return isGuest?<EmptyState emoji="🔒" title="Sign in required" desc="Sign in to view your profile." action="Sign In" onAction={handleLoginRequired}/>:<StudentProfile/>;
    }
    if (portal==="club") {
      if (page==="dashboard") return <ClubDashboard setPage={goToPage}/>;
      if (page==="events") return <ClubAllEvents/>;
      if (page==="applications") return <RegistrationsPage/>;
      if (page==="announcements") return <AnnouncementsPage/>;
      if (page==="profile") return <ClubProfile/>;
      if (page==="messages") return <MessagesPage canEdit={true}/>;
      if (page==="recruitment") return <TeamRecruitmentPage/>;
    }
    if (portal==="faculty") {
      if (page==="dashboard") return <FacultyDashboard setPage={goToPage}/>;
      if (page==="eventmgmt") return <EventManagementPage/>;
      if (page==="applications") return <RegistrationsPage/>;
      if (page==="audit") return <AuditTrailPage/>;
      if (page==="profile") return <FacultyProfile/>;
      if (page==="messages") return <MessagesPage canEdit={true}/>;
      if (page==="recruitment") return <TeamRecruitmentPage/>;
    }
    if (portal==="techAdmin") {
      if (page==="dashboard") return <TechAdminDashboard setPage={goToPage}/>;
      if (page==="universities") return <TechAdminUniversities/>;
      if (page==="users") return <TechAdminUsers/>;
      if (page==="clubs") return <ExploreClubs isGuest={false} onLoginRequired={()=>{}}/>;
      if (page==="analytics") return <TechAdminAnalytics/>;
      if (page==="settings") return <TechAdminSettings/>;
    }
    return null;
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isDark?"dark bg-slate-900":"bg-slate-50"}`}>
      {notifOpen&&<NotificationsPanel onClose={()=>setNotifOpen(false)}/>}
      <div className="flex-shrink-0 bg-indigo-950 dark:bg-slate-950 flex items-center justify-center gap-1 py-2 px-4">
        <span className="text-indigo-500 text-xs mr-2 font-medium hidden sm:block">Portal:</span>
        {PORTALS.filter(p=>!isGuest||p.id==="student").map(p=>{const Icon=p.icon;return(<button key={p.id} onClick={()=>switchPortal(p.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${portal===p.id?"bg-violet-600 text-white shadow-lg":"text-indigo-300 hover:text-white hover:bg-indigo-800"}`}><Icon size={13}/><span className="hidden sm:inline">{p.label}</span><span className="sm:hidden">{p.label.split(" ")[0]}</span></button>);})}
        <button onClick={()=>setScreen("university")} className="ml-3 flex items-center gap-1 text-indigo-400 hover:text-white text-xs transition"><LogOut size={13}/><span className="hidden sm:inline">Logout</span></button>
      </div>
      {isGuest&&<GuestBanner onLogin={handleLoginRequired}/>}
      <div className="flex flex-1 overflow-hidden">
        <aside className={`${sidebarOpen?"translate-x-0":"-translate-x-full"} md:translate-x-0 fixed md:relative z-30 h-full w-56 ${sidebarBg} flex flex-col flex-shrink-0 transition-transform duration-200 ease-in-out`}>
          <div className={`p-4 border-b ${sidebarBorder} flex-shrink-0`}><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">CS</div><div><p className="font-bold text-white text-sm">ClubSphere</p><p className={`text-xs ${isTechAdmin?"text-slate-500":"text-indigo-400"}`}>{isTechAdmin?"Platform Admin":selectedUniversity?.name||"Amity University"}</p></div></div></div>
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {navItems.map(item=>{const Icon=item.icon;const active=page===item.id;return(<button key={item.id} onClick={()=>goToPage(item.id)} aria-current={active?"page":undefined} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active?"bg-violet-600 text-white":sidebarText}`}><Icon size={15} className="flex-shrink-0"/><span className="flex-1 text-left">{item.label}</span>{item.badge&&<span className={`text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${active?"bg-white/20 text-white":"bg-violet-600 text-white"}`}>{item.badge}</span>}</button>);})}
          </nav>
          <div className={`p-3 border-t ${sidebarBorder} flex-shrink-0`}><div className="flex items-center gap-3 px-2 py-1.5"><div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{user.name[0]}</div><div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">{user.name}</p><p className={`text-xs truncate ${isTechAdmin?"text-slate-500":"text-indigo-400"}`}>{user.sub}</p></div></div></div>
        </aside>
        {sidebarOpen&&<div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={()=>setSidebarOpen(false)}/>}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <header className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <button className="md:hidden text-slate-500 dark:text-slate-400 hover:text-slate-700 p-1" onClick={()=>setSidebarOpen(true)}><Menu size={20}/></button>
            <div className="flex-1 relative max-w-xs"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/><input placeholder="Search…" className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"/></div>
            <div className="ml-auto flex items-center gap-2">
              {portal==="club"&&!isGuest&&<button onClick={()=>goToPage("events")} className="hidden sm:flex items-center gap-1.5 bg-violet-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-violet-700 active:scale-95 transition font-medium"><Plus size={14}/>New Event</button>}
              <button onClick={toggleDark} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">{isDark?<Sun size={18}/>:<Moon size={18}/>}</button>
              <button onClick={()=>setNotifOpen(v=>!v)} className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition">
                <Bell size={18}/>
                {unreadNotifs>0&&<span className="absolute top-1.5 right-1.5 w-4 h-4 bg-violet-600 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{fontSize:"9px"}}>{unreadNotifs}</span>}
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-4 md:p-6"><PageWrapper pageKey={`${portal}-${page}`}>{renderContent()}</PageWrapper></div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(()=>{try{return localStorage.getItem("cs-theme")==="dark"||(!localStorage.getItem("cs-theme")&&window.matchMedia("(prefers-color-scheme: dark)").matches);}catch{return false;}});
  const toggle = useCallback(()=>{setIsDark(d=>{const next=!d;try{localStorage.setItem("cs-theme",next?"dark":"light");}catch{}return next;});},[]);
  return (
    <ThemeCtx.Provider value={{isDark,toggle}}>
      <ToastProvider><AppShell/></ToastProvider>
    </ThemeCtx.Provider>
  );
}
