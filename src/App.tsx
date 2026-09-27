// @ts-nocheck
import { useState } from "react";
import {
  LayoutDashboard, Search, Bell, Menu, Calendar, Users, FileText,
  MessageSquare, UserPlus, Plus, ArrowRight, X, User, BookOpen,
  Settings, Pencil, Trash2, Heart, CheckCircle, MapPin, Clock,
  ChevronDown, ChevronUp, Shield, Globe, LogOut, Phone, Mail,
  BarChart2, Building, AlertTriangle, Eye, EyeOff, Key,
} from "lucide-react";

// ─── PLATFORM DATA ────────────────────────────────────────────────────────────

const UNIVERSITIES = [
  { id: "amity", name: "Amity University", campus: "Noida, UP", clubs: 18, students: 12400, events: 34, logo: "🏛️", active: true },
  { id: "chandigarh", name: "Chandigarh University", campus: "Punjab", clubs: 24, students: 18200, events: 51, logo: "🎓", active: true },
  { id: "manipal", name: "Manipal University", campus: "Karnataka", clubs: 31, students: 14800, events: 62, logo: "📚", active: true },
  { id: "vit", name: "VIT University", campus: "Vellore, TN", clubs: 42, students: 20100, events: 78, logo: "🔬", active: false },
];

const PLATFORM_USERS = [
  { id: 1, name: "Aryan Gupta", email: "aryan@amity.edu", role: "student", university: "Amity University", status: "active", joined: "Aug 2024" },
  { id: 2, name: "Dr. Priya Kapoor", email: "priya@amity.edu", role: "faculty", university: "Amity University", status: "active", joined: "Jul 2024" },
  { id: 3, name: "Tech Society", email: "tech@amity.edu", role: "club", university: "Amity University", status: "active", joined: "Jul 2024" },
  { id: 4, name: "Riya Sharma", email: "riya@cu.edu", role: "student", university: "Chandigarh University", status: "active", joined: "Sep 2024" },
  { id: 5, name: "Debate Club VIT", email: "debate@vit.edu", role: "club", university: "VIT University", status: "suspended", joined: "Aug 2024" },
  { id: 6, name: "Kabir Mehta", email: "kabir@manipal.edu", role: "student", university: "Manipal University", status: "active", joined: "Sep 2024" },
];

// ─── APP DATA ─────────────────────────────────────────────────────────────────

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
  { id: 1, title: "TEDx Amity 2025", club: "TEDx Club", date: "Aug 15, 2025", time: "10:00 AM – 4:00 PM", venue: "Amity Auditorium, Block A", category: "Leadership", spots: 120, registered: 87, emoji: "🎤", desc: "An independently organized TED event where bright minds share ideas worth spreading. Featuring speakers from tech, arts, and social change." },
  { id: 2, title: "Hackathon 5.0", club: "Tech Society", date: "Aug 22, 2025", time: "9:00 AM – 9:00 PM", venue: "Innovation Lab, Block C", category: "Tech", spots: 200, registered: 156, emoji: "💻", desc: "A 12-hour coding marathon where teams build innovative solutions to real-world problems. Prizes worth ₹50,000 up for grabs." },
  { id: 3, title: "Inter-College Debate", club: "Debate Club", date: "Sep 1, 2025", time: "2:00 PM – 6:00 PM", venue: "Seminar Hall 2, Block B", category: "Academic", spots: 60, registered: 42, emoji: "🎭", desc: "A competitive debate tournament open to all Amity students. Topics range from geopolitics to ethics in technology." },
  { id: 4, title: "Cultural Fest 2025", club: "Cultural Society", date: "Sep 10, 2025", time: "11:00 AM – 8:00 PM", venue: "Main Amphitheatre", category: "Cultural", spots: 500, registered: 321, emoji: "🎨", desc: "Amity's biggest annual cultural celebration with music, dance, art exhibitions, and food stalls from across India." },
  { id: 5, title: "Startup Pitch Day", club: "E-Cell", date: "Sep 18, 2025", time: "1:00 PM – 5:00 PM", venue: "Boardroom 1, Admin Block", category: "Business", spots: 80, registered: 63, emoji: "🚀", desc: "Present your startup idea to a panel of investors and mentors. Top 3 ideas win incubation support and seed funding." },
];

const MY_APPS_DATA = [
  { id: 1, event: "TEDx Amity 2025", club: "TEDx Club", date: "Aug 15, 2025", applied: "Jul 20, 2025", status: "approved" },
  { id: 2, event: "Hackathon 5.0", club: "Tech Society", date: "Aug 22, 2025", applied: "Jul 22, 2025", status: "approved" },
  { id: 3, event: "Startup Pitch Day", club: "E-Cell", date: "Sep 18, 2025", applied: "Jul 18, 2025", status: "approved" },
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
  { id: 1, student: "Riya Sharma", enroll: "A2K22089", event: "Hackathon 5.0", applied: "Jul 22, 2025", status: "approved" },
  { id: 2, student: "Kabir Mehta", enroll: "A2K22112", event: "Hackathon 5.0", applied: "Jul 23, 2025", status: "approved" },
  { id: 3, student: "Priya Joshi", enroll: "A2K23078", event: "TEDx Amity 2025", applied: "Jul 20, 2025", status: "approved" },
  { id: 4, student: "Arjun Patel", enroll: "A2K23045", event: "Cultural Fest 2025", applied: "Jul 18, 2025", status: "approved" },
  { id: 5, student: "Devesh Sharma", enroll: "A2K23101", event: "Hackathon 5.0", applied: "Jul 24, 2025", status: "approved" },
];

const MESSAGES_DATA = [
  { id: 1, from: "TEDx Club", avatar: "🎤", message: "You've been registered for TEDx Amity 2025! See you there.", time: "2h ago", unread: true },
  { id: 2, from: "Tech Society", avatar: "💻", message: "Welcome to Hackathon 5.0! Here's your team assignment.", time: "1d ago", unread: true },
  { id: 3, from: "Debate Club", avatar: "🎭", message: "New event posted — check it out!", time: "2d ago", unread: false },
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

// ─── NAV ──────────────────────────────────────────────────────────────────────

const NAV = {
  student: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "clubs", label: "Explore Clubs", icon: Users },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: 2 },
  ],
  club: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "All Events", icon: Calendar },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "profile", label: "Club Profile", icon: Settings },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: 1 },
    { id: "recruitment", label: "Team Recruitment", icon: UserPlus },
  ],
  faculty: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "eventmgmt", label: "All Events", icon: Calendar },
    { id: "applications", label: "Applications", icon: FileText },
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

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    approved: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-rose-100 text-rose-600",
    upcoming: "bg-violet-100 text-violet-700",
    active: "bg-emerald-100 text-emerald-700",
    suspended: "bg-rose-100 text-rose-600",
    inactive: "bg-slate-100 text-slate-500",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${map[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status[0].toUpperCase() + status.slice(1)}
    </span>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 ${className}`}>{children}</div>;
}

function StatCard({ label, value, sub, gradient, onClick }) {
  return (
    <div className={`rounded-2xl p-5 text-white ${gradient} ${onClick ? "cursor-pointer hover:opacity-90 active:scale-95 transition-all" : ""}`} onClick={onClick}>
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
        <h3 className="font-semibold text-slate-800">{title}</h3>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        {action && !editing && (
          <button onClick={onAction} className="text-violet-600 text-sm flex items-center gap-1 hover:gap-2 transition-all font-medium">
            {action} <ArrowRight size={14} />
          </button>
        )}
        {onToggleEdit && (
          <button onClick={onToggleEdit} className={`p-1.5 rounded-lg transition ${editing ? "bg-violet-100 text-violet-600" : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"}`}>
            {editing ? <CheckCircle size={15} /> : <Pencil size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

function AvatarCircle({ name }) {
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
      {name[0]}
    </div>
  );
}

// ─── AUTH SCREENS ─────────────────────────────────────────────────────────────

function UniversitySelector({ onSelect }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-lg"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>CS</div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">ClubSphere</h1>
        <p className="text-slate-500 mt-2 text-sm">Select your university to get started</p>
      </div>
      <div className="w-full max-w-sm space-y-3">
        {UNIVERSITIES.map(u => (
          <button key={u.id} onClick={() => onSelect(u)}
            className={`w-full flex items-center gap-4 p-4 bg-white rounded-2xl border shadow-sm text-left transition-all ${
              u.active ? "border-slate-100 hover:border-violet-300 hover:shadow-md" : "border-slate-100 opacity-50 cursor-not-allowed"
            }`}
            disabled={!u.active}>
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-2xl flex-shrink-0">{u.logo}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800">{u.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{u.campus} · {u.clubs} clubs</p>
            </div>
            {u.active
              ? <ArrowRight size={16} className="text-slate-300 flex-shrink-0" />
              : <span className="text-xs text-slate-400 flex-shrink-0">Coming soon</span>}
          </button>
        ))}
      </div>
      <p className="mt-6 text-xs text-slate-400">
        University not listed?{" "}
        <button className="text-violet-600 font-semibold hover:underline">Request access →</button>
      </p>
    </div>
  );
}

function AuthScreen({ university, onAuth, onGuest, onBack }) {
  const [tab, setTab] = useState("email");
  const [value, setValue] = useState("");
  const [step, setStep] = useState("input");
  const [otp, setOtp] = useState("");
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [error, setError] = useState("");

  const handleSend = () => {
    if (!value) { setError("Please enter your " + (tab === "email" ? "email" : "phone number")); return; }
    setError("");
    setStep("otp");
  };

  const handleVerify = () => {
    if (otp.length < 4) { setError("Enter the OTP sent to you"); return; }
    setError("");
    setShowRolePicker(true);
  };

  const roles = [
    { id: "student", label: "Student", icon: User, desc: "Explore & register for events" },
    { id: "club", label: "Club Admin", icon: Users, desc: "Manage your club & events" },
    { id: "faculty", label: "Faculty Coordinator", icon: BookOpen, desc: "Oversee and approve events" },
    { id: "techAdmin", label: "Tech Admin", icon: Shield, desc: "Platform-level administration" },
  ];

  if (showRolePicker) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Verified!</h2>
            <p className="text-slate-400 text-sm mt-1">Select your role to continue</p>
          </div>
          <div className="space-y-3">
            {roles.map(r => {
              const Icon = r.icon;
              return (
                <button key={r.id} onClick={() => onAuth(r.id)}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-violet-300 hover:shadow-md transition text-left">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{r.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
                  </div>
                  <ArrowRight size={15} className="text-slate-300" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm mb-6 transition">
          ← Back
        </button>

        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl bg-violet-50">{university.logo}</div>
          <h2 className="text-xl font-bold text-slate-800">{university.name}</h2>
          <p className="text-slate-400 text-sm mt-1">{step === "input" ? "Sign in to your account" : "Enter the OTP we sent you"}</p>
        </div>

        {step === "input" ? (
          <div className="space-y-4">
            {/* Tab */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[["email", "Email", Mail], ["phone", "Phone", Phone]].map(([id, label, Icon]) => (
                <button key={id} onClick={() => { setTab(id); setValue(""); setError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${tab === id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            <div>
              <input
                value={value}
                onChange={e => { setValue(e.target.value); setError(""); }}
                placeholder={tab === "email" ? "College email address" : "+91 phone number"}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
              />
              {error && <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1"><AlertTriangle size={11} />{error}</p>}
            </div>

            <button onClick={handleSend}
              className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition">
              Send OTP
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <button onClick={onGuest}
              className="w-full border border-slate-200 text-slate-600 py-3 rounded-xl font-medium text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2">
              <Eye size={15} /> Browse as Guest
            </button>
            <p className="text-center text-xs text-slate-400">Guests can view events but cannot register</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 text-sm text-violet-700 text-center">
              OTP sent to <span className="font-semibold">{value}</span>
            </div>
            <div>
              <input
                value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                placeholder="Enter 6-digit OTP"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-center tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white text-lg"
              />
              {error && <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1 justify-center"><AlertTriangle size={11} />{error}</p>}
            </div>
            <button onClick={handleVerify}
              className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition">
              Verify & Continue
            </button>
            <button onClick={() => setStep("input")} className="w-full text-slate-400 text-sm hover:text-slate-600 transition">
              ← Change {tab === "email" ? "email" : "number"}
            </button>
            <p className="text-center text-xs text-slate-400">
              Didn't receive it?{" "}
              <button className="text-violet-600 font-medium hover:underline">Resend OTP</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GUEST BANNER ─────────────────────────────────────────────────────────────

function GuestBanner({ onLogin }) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-3">
      <Eye size={15} className="text-amber-600 flex-shrink-0" />
      <p className="text-xs text-amber-700 flex-1 font-medium">You're browsing as a guest — <span className="underline cursor-pointer" onClick={onLogin}>Sign in</span> to register for events</p>
      <button onClick={onLogin} className="text-xs bg-amber-600 text-white px-3 py-1 rounded-lg font-medium hover:bg-amber-700 transition flex-shrink-0">Sign in</button>
    </div>
  );
}

// ─── EVENT DETAIL MODAL ───────────────────────────────────────────────────────

function EventDetailModal({ event, onClose, isGuest, onLoginRequired }) {
  const isRegistered = MY_APPS_DATA.some(a => a.event === event.title);
  const pct = Math.round((event.registered / event.spots) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-2xl flex-shrink-0">{event.emoji}</div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{event.title}</h3>
                <p className="text-sm text-slate-400 mt-0.5">{event.club}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 flex-shrink-0"><X size={18} /></button>
          </div>
        </div>
        <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><Calendar size={10} /> Date</p>
              <p className="text-sm font-semibold text-slate-800">{event.date}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><Clock size={10} /> Time</p>
              <p className="text-sm font-semibold text-slate-800">{event.time}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 col-span-2">
              <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><MapPin size={10} /> Venue</p>
              <p className="text-sm font-semibold text-slate-800">{event.venue}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 mb-1">About this event</p>
            <p className="text-sm text-slate-700 leading-relaxed">{event.desc}</p>
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Spots filled</span>
              <span className="font-medium">{event.registered}/{event.spots} ({pct}%)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <span className="inline-block text-xs bg-violet-50 text-violet-700 px-2.5 py-0.5 rounded-full font-medium">{event.category}</span>
        </div>
        <div className="p-5 border-t border-slate-100">
          {isGuest ? (
            <button onClick={onLoginRequired}
              className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition flex items-center justify-center gap-2">
              <Key size={15} /> Sign in to Register
            </button>
          ) : isRegistered ? (
            <div className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 py-3 rounded-xl font-semibold text-sm border border-emerald-200">
              <CheckCircle size={16} /> You're Registered
            </div>
          ) : (
            <button className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition">
              Register Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT PAGES ────────────────────────────────────────────────────────────

function StudentDashboard({ setPage, isGuest, onLoginRequired }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="space-y-5">
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} isGuest={isGuest} onLoginRequired={onLoginRequired} />}

      <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)" }}>
        <p className="text-violet-300 text-sm font-medium mb-1">{isGuest ? "👀 Browsing as guest" : "Good morning 👋"}</p>
        <h2 className="text-2xl font-bold mb-1">{isGuest ? "Welcome to ClubSphere" : "Welcome back, Aryan"}</h2>
        <p className="text-indigo-200 text-sm">{isGuest ? "Sign in to register for events and follow clubs" : "3 upcoming events · 3 registrations"}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="All Clubs" value="18" sub="Tap to explore" gradient="bg-gradient-to-br from-violet-500 to-indigo-700" onClick={() => setPage("clubs")} />
        <StatCard label="Registrations" value={isGuest ? "—" : "3"} sub={isGuest ? "Sign in to view" : "All approved"} gradient="bg-gradient-to-br from-amber-400 to-orange-500" onClick={isGuest ? onLoginRequired : () => setPage("applications")} />
        <StatCard label="Clubs Followed" value={isGuest ? "—" : "4"} sub={isGuest ? "Sign in to follow" : "Tap to explore"} gradient="bg-gradient-to-br from-emerald-400 to-teal-600" onClick={isGuest ? onLoginRequired : () => setPage("clubs")} />
        <StatCard label="Unread Messages" value={isGuest ? "—" : "2"} sub={isGuest ? "Sign in to view" : "Tap to open"} gradient="bg-gradient-to-br from-rose-400 to-pink-600" onClick={isGuest ? onLoginRequired : () => setPage("messages")} />
      </div>

      <Card>
        <SectionHeader title="Upcoming Events" action="See all" onAction={() => setPage("clubs")} />
        <div className="space-y-1">
          {EVENTS_DATA.slice(0, 3).map(e => (
            <button key={e.id} onClick={() => setSelectedEvent(e)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50 transition text-left group">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">{e.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{e.title}</p>
                <p className="text-xs text-slate-400">{e.club} · {e.date}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status="upcoming" />
                <ArrowRight size={14} className="text-slate-300 group-hover:text-violet-500 transition" />
              </div>
            </button>
          ))}
        </div>
      </Card>

      {!isGuest && (
        <Card>
          <SectionHeader title="My Applications" action="See all" onAction={() => setPage("applications")} />
          <div className="space-y-1">
            {MY_APPS_DATA.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition">
                <div>
                  <p className="text-sm font-medium text-slate-800">{a.event}</p>
                  <p className="text-xs text-slate-400">{a.club} · Applied {a.applied}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {isGuest && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-3"><Key size={18} className="text-violet-600" /></div>
          <p className="font-semibold text-slate-800 mb-1">Sign in to do more</p>
          <p className="text-xs text-slate-400 mb-3">Register for events, follow clubs, and get notifications</p>
          <button onClick={onLoginRequired} className="bg-violet-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-violet-700 transition">Sign In</button>
        </div>
      )}
    </div>
  );
}

function ExploreClubs({ isGuest, onLoginRequired }) {
  const [clubs, setClubs] = useState(CLUBS_DATA);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const cats = ["All", "Technology", "Leadership", "Academic", "Cultural", "Business", "Arts", "Sports"];
  const filtered = clubs.filter(c =>
    (cat === "All" || c.category === cat) &&
    (level === "all" || c.level === level) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const toggleFollow = (id) => {
    if (isGuest) { onLoginRequired(); return; }
    setClubs(l => l.map(c => c.id === id ? { ...c, following: !c.following } : c));
  };

  return (
    <div className="space-y-5">
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} isGuest={isGuest} onLoginRequired={onLoginRequired} />}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Explore Clubs</h2>
        <p className="text-slate-400 text-sm">Discover all {clubs.length} clubs at Amity University</p>
      </div>
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clubs…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
      </div>
      {/* Level filter */}
      <div className="flex gap-2">
        {[["all", "All Levels"], ["university", "University"], ["institute", "Institute"]].map(([val, label]) => (
          <button key={val} onClick={() => setLevel(val)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${level === val ? "bg-indigo-950 text-white border-indigo-950" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${cat === c ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(c => {
          const clubEvents = EVENTS_DATA.filter(e => e.club === c.name);
          return (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-2xl flex-shrink-0">{c.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800">{c.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.level === "university" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>
                      {c.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{c.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><Users size={11} />{c.members} members</span>
                <span className="flex items-center gap-1"><Calendar size={11} />{c.events} events</span>
              </div>
              {clubEvents.length > 0 && (
                <div className="mb-3 border-t border-slate-50 pt-3">
                  <p className="text-xs text-slate-400 font-medium mb-1.5">Upcoming events</p>
                  {clubEvents.map(ev => (
                    <button key={ev.id} onClick={() => setSelectedEvent(ev)}
                      className="w-full flex items-center gap-2 py-1.5 text-left hover:bg-violet-50 rounded-lg px-2 transition group">
                      <span className="text-base">{ev.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">{ev.title}</p>
                        <p className="text-xs text-slate-400">{ev.date}</p>
                      </div>
                      <ArrowRight size={12} className="text-slate-300 group-hover:text-violet-500 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-0.5 rounded-full font-medium">{c.category}</span>
                <button onClick={() => toggleFollow(c.id)}
                  className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg transition font-medium ${
                    c.following ? "bg-violet-50 text-violet-600 border border-violet-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200"
                      : "bg-violet-600 text-white hover:bg-violet-700"
                  }`}>
                  <Heart size={13} fill={c.following ? "currentColor" : "none"} />
                  {c.following ? "Following" : "Follow"}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StudentApplications() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">My Applications</h2>
        <p className="text-slate-400 text-sm">All your event registrations</p>
      </div>
      <div className="space-y-3">
        {MY_APPS_DATA.map(a => (
          <Card key={a.id} className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{a.event}</p>
              <p className="text-sm text-slate-400">{a.club}</p>
              <div className="flex gap-4 mt-1.5 text-xs text-slate-400">
                <span>Event: {a.date}</span><span>Registered: {a.applied}</span>
              </div>
            </div>
            <StatusBadge status={a.status} />
          </Card>
        ))}
      </div>
    </div>
  );
}

function MessagesPage({ canEdit = false }) {
  const [active, setActive] = useState(0);
  const [msgs, setMsgs] = useState(MESSAGES_DATA);
  const [editing, setEditing] = useState(false);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Messages</h2>
        {canEdit && (
          <button onClick={() => setEditing(e => !e)}
            className={`p-2 rounded-lg transition ${editing ? "bg-violet-100 text-violet-600" : "text-slate-400 hover:bg-slate-100"}`}>
            {editing ? <CheckCircle size={16} /> : <Pencil size={16} />}
          </button>
        )}
      </div>
      <div className="grid md:grid-cols-3 gap-4" style={{ minHeight: "360px" }}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {msgs.map((m, i) => (
            <div key={m.id} className="relative">
              <button onClick={() => setActive(i)}
                className={`w-full text-left p-4 border-b border-slate-50 transition ${active === i ? "bg-violet-50" : "hover:bg-slate-50"}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span>{m.avatar}</span>
                    <p className="font-medium text-slate-800 text-sm">{m.from}</p>
                    {m.unread && <div className="w-2 h-2 rounded-full bg-violet-600" />}
                  </div>
                  <span className="text-xs text-slate-400">{m.time}</span>
                </div>
                <p className="text-xs text-slate-400 truncate pl-6">{m.message}</p>
              </button>
              {editing && (
                <button onClick={() => setMsgs(l => l.filter(x => x.id !== m.id))}
                  className="absolute top-3 right-3 p-1 rounded bg-rose-50 text-rose-400 hover:bg-rose-100">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col">
          {msgs[active] ? (
            <>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <span className="text-xl">{msgs[active].avatar}</span>
                <p className="font-semibold text-slate-800">{msgs[active].from}</p>
              </div>
              <div className="flex-1 flex items-end pb-4">
                <div className="bg-violet-50 rounded-2xl rounded-tl-sm p-3 text-sm text-slate-700 max-w-xs">{msgs[active].message}</div>
              </div>
              <div className="flex gap-2">
                <input placeholder="Type a reply…" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                <button className="bg-violet-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-violet-700 transition">Send</button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Select a message</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CLUB PAGES ───────────────────────────────────────────────────────────────

function ClubDashboard({ setPage }) {
  const [events, setEvents] = useState(EVENTS_DATA);
  const [followers, setFollowers] = useState(FOLLOWERS_DATA);
  const [editEvents, setEditEvents] = useState(false);
  const [editFollowers, setEditFollowers] = useState(false);
  const totalMembers = CORE_TEAM_DATA.length + followers.length;
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)" }}>
        <p className="text-violet-300 text-sm font-medium mb-1">Club Admin</p>
        <h2 className="text-2xl font-bold mb-1">Tech Society</h2>
        <p className="text-indigo-200 text-sm">{events.length} events · {totalMembers} registered members</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Events" value={String(events.length)} sub="All time" gradient="bg-gradient-to-br from-violet-500 to-indigo-700" onClick={() => setPage("events")} />
        <StatCard label="Event Registrations" value="156" sub="This month" gradient="bg-gradient-to-br from-amber-400 to-orange-500" onClick={() => setPage("applications")} />
        <StatCard label="Registered Members" value={String(totalMembers)} sub={`${CORE_TEAM_DATA.length} core · ${followers.length} followers`} gradient="bg-gradient-to-br from-emerald-400 to-teal-600" onClick={() => setPage("profile")} />
        <StatCard label="Core Team" value={String(CORE_TEAM_DATA.length)} gradient="bg-gradient-to-br from-rose-400 to-pink-600" onClick={() => setPage("profile")} />
      </div>
      <Card>
        <SectionHeader title="All Events" action={!editEvents ? "Manage" : undefined} onAction={() => setPage("events")} editing={editEvents} onToggleEdit={() => setEditEvents(e => !e)} />
        <div className="space-y-1">
          {events.slice(0, 4).map(e => (
            <div key={e.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
              <span className="text-xl">{e.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{e.title}</p>
                <p className="text-xs text-slate-400">{e.date} · {e.registered} registered</p>
              </div>
              {editEvents && (
                <button onClick={() => setEvents(l => l.filter(x => x.id !== e.id))} className="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={13} /></button>
              )}
            </div>
          ))}
          {editEvents && (
            <button onClick={() => setPage("events")} className="w-full flex items-center justify-center gap-2 py-2.5 text-violet-600 text-sm border border-dashed border-violet-200 rounded-xl hover:bg-violet-50 transition mt-1">
              <Plus size={14} /> Add New Event
            </button>
          )}
        </div>
      </Card>
      <Card>
        <SectionHeader title="Members Following" sub={`${followers.length} students follow your club`} editing={editFollowers} onToggleEdit={() => setEditFollowers(e => !e)} />
        <div className="space-y-1">
          {followers.map(f => (
            <div key={f.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
              <AvatarCircle name={f.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800">{f.name}</p>
                <p className="text-xs text-slate-400">{f.enroll}</p>
              </div>
              {editFollowers && (
                <button onClick={() => setFollowers(l => l.filter(x => x.id !== f.id))} className="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={13} /></button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ClubAllEvents() {
  const [events, setEvents] = useState(EVENTS_DATA);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [fields, setFields] = useState({ title: "", date: "", venue: "", spots: "", category: "" });
  const addEvent = () => {
    if (!fields.title) return;
    setEvents(l => [...l, { id: Date.now(), title: fields.title, club: "Tech Society", date: fields.date || "TBD", time: "TBD", venue: fields.venue || "TBD", category: fields.category || "General", spots: parseInt(fields.spots) || 100, registered: 0, emoji: "📌", desc: "" }]);
    setFields({ title: "", date: "", venue: "", spots: "", category: "" });
    setShowForm(false);
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-slate-800">All Events</h2><p className="text-slate-400 text-sm">{events.length} events total</p></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setEditing(e => !e)} className={`p-2 rounded-lg transition ${editing ? "bg-violet-100 text-violet-600" : "text-slate-400 hover:bg-slate-100"}`}>{editing ? <CheckCircle size={16} /> : <Pencil size={16} />}</button>
          <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-violet-700 transition font-medium"><Plus size={15} /> New Event</button>
        </div>
      </div>
      {showForm && (
        <Card className="border-violet-200 bg-violet-50">
          <div className="flex justify-between items-center mb-4"><h3 className="font-semibold text-slate-800">Create New Event</h3><button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={16} /></button></div>
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            {[["Event Name","title"],["Date","date"],["Venue","venue"],["Max Participants","spots"],["Category","category"]].map(([label,key]) => (
              <div key={key}><label className="text-xs text-slate-500 mb-1 block font-medium">{label}</label><input value={fields[key]} onChange={e => setFields(f => ({...f,[key]:e.target.value}))} className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
            ))}
          </div>
          <button onClick={addEvent} className="bg-violet-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-violet-700 transition font-medium">Create Event</button>
        </Card>
      )}
      <div className="space-y-3">
        {events.map(e => {
          const regs = REGISTRATIONS_DATA.filter(r => r.event === e.title);
          const isExpanded = expandedId === e.id;
          return (
            <Card key={e.id}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-xl flex-shrink-0">{e.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">{e.title}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400 mt-0.5"><span>{e.date}</span><span>{e.registered}/{e.spots} registered</span><span className="text-violet-600 font-medium">{e.category}</span></div>
                </div>
                <StatusBadge status="upcoming" />
                {editing ? (
                  <button onClick={() => setEvents(l => l.filter(x => x.id !== e.id))} className="p-2 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={15} /></button>
                ) : (
                  <button onClick={() => setExpandedId(prev => prev === e.id ? null : e.id)} className="flex items-center gap-1 text-xs font-medium text-violet-600 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition flex-shrink-0">
                    Manage {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                )}
              </div>
              {isExpanded && !editing && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-slate-800">{e.registered}</p><p className="text-xs text-slate-400 mt-0.5">Registered</p></div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-slate-800">{e.spots - e.registered}</p><p className="text-xs text-slate-400 mt-0.5">Spots Left</p></div>
                    <div className="bg-violet-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-violet-700">{Math.round((e.registered/e.spots)*100)}%</p><p className="text-xs text-violet-400 mt-0.5">Filled</p></div>
                  </div>
                  {regs.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Registered Students</p>
                      {regs.map(r => (
                        <div key={r.id} className="flex items-center gap-3 py-1.5">
                          <AvatarCircle name={r.student} />
                          <div className="flex-1"><p className="text-sm font-medium text-slate-800">{r.student}</p><p className="text-xs text-slate-400">{r.enroll}</p></div>
                          <StatusBadge status="approved" />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-xs text-slate-400 mb-1 block font-medium">Event Name</label><input defaultValue={e.title} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
                    <div><label className="text-xs text-slate-400 mb-1 block font-medium">Date</label><input defaultValue={e.date} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-violet-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-violet-700 transition">Save Changes</button>
                    <button onClick={() => setEvents(l => l.filter(x => x.id !== e.id))} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-rose-500 border border-rose-200 hover:bg-rose-50 transition"><Trash2 size={13} /> Delete</button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function RegistrationsPage() {
  const [regs, setRegs] = useState(REGISTRATIONS_DATA);
  const [editing, setEditing] = useState(false);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-slate-800">Applications</h2><p className="text-slate-400 text-sm">All event registrations</p></div>
        <button onClick={() => setEditing(e => !e)} className={`p-2 rounded-lg transition ${editing ? "bg-violet-100 text-violet-600" : "text-slate-400 hover:bg-slate-100"}`}>{editing ? <CheckCircle size={16} /> : <Pencil size={16} />}</button>
      </div>
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
        <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
        <p className="text-sm text-emerald-700 font-medium">Registrations are automatically approved — no manual action needed.</p>
      </div>
      <div className="space-y-3">
        {regs.map(r => (
          <Card key={r.id} className="flex items-center gap-4">
            <AvatarCircle name={r.student} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 text-sm">{r.student}</p>
              <p className="text-xs text-slate-400">{r.enroll} · {r.event}</p>
              <p className="text-xs text-slate-400 mt-0.5">Registered {r.applied}</p>
            </div>
            <StatusBadge status="approved" />
            {editing && <button onClick={() => setRegs(l => l.filter(x => x.id !== r.id))} className="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={14} /></button>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function ClubProfile() {
  const [editInfo, setEditInfo] = useState(false);
  const [info, setInfo] = useState({ name: "Tech Society", tagline: "Building tomorrow, today", email: "techsociety@amity.edu", about: "Tech Society at Amity University is a student-run organization dedicated to fostering a passion for technology, innovation, and entrepreneurship." });
  const [team, setTeam] = useState(CORE_TEAM_DATA);
  const [editTeam, setEditTeam] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", enroll: "", role: "" });
  const addMember = () => { if (!newMember.name) return; setTeam(l => [...l, { id: Date.now(), ...newMember }]); setNewMember({ name: "", enroll: "", role: "" }); };
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-slate-800">Club Profile</h2><p className="text-slate-400 text-sm">Update your club's public information</p></div>
      <Card>
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-3xl">💻</div>
            <div><p className="font-bold text-slate-800 text-lg">{info.name}</p><p className="text-slate-400 text-sm">Amity University · Est. 2018</p></div>
          </div>
          <button onClick={() => setEditInfo(e => !e)} className={`p-2 rounded-lg transition ${editInfo ? "bg-violet-100 text-violet-600" : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"}`}>{editInfo ? <CheckCircle size={16} /> : <Pencil size={16} />}</button>
        </div>
        <div className="space-y-4">
          {[["Club Name","name"],["Tagline","tagline"],["Contact Email","email"]].map(([label,key]) => (
            <div key={key}>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium">{label}</label>
              {editInfo ? <input value={info[key]} onChange={e => setInfo(i => ({...i,[key]:e.target.value}))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                : <p className="text-sm text-slate-800 px-3 py-2.5 bg-slate-50 rounded-xl">{info[key]}</p>}
            </div>
          ))}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium">About</label>
            {editInfo ? <textarea rows={3} value={info.about} onChange={e => setInfo(i => ({...i,about:e.target.value}))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none" />
              : <p className="text-sm text-slate-800 px-3 py-2.5 bg-slate-50 rounded-xl leading-relaxed">{info.about}</p>}
          </div>
          {editInfo && <button className="bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm hover:bg-violet-700 transition font-medium">Save Changes</button>}
        </div>
      </Card>
      <Card>
        <SectionHeader title="Core Team" sub={`${team.length} members`} editing={editTeam} onToggleEdit={() => setEditTeam(e => !e)} />
        {team.map(m => (
          <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
            <AvatarCircle name={m.name} />
            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800">{m.name}</p><p className="text-xs text-slate-400">{m.enroll}</p></div>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-medium flex-shrink-0">{m.role}</span>
            {editTeam && <button onClick={() => setTeam(l => l.filter(x => x.id !== m.id))} className="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={13} /></button>}
          </div>
        ))}
        {editTeam && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-2">Add Team Member</p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[["Name","name"],["Enroll No.","enroll"],["Role","role"]].map(([ph,key]) => (
                <input key={key} placeholder={ph} value={newMember[key]} onChange={e => setNewMember(m => ({...m,[key]:e.target.value}))} className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-300" />
              ))}
            </div>
            <button onClick={addMember} className="text-sm bg-violet-600 text-white px-4 py-1.5 rounded-lg hover:bg-violet-700 transition">Add Member</button>
          </div>
        )}
      </Card>
    </div>
  );
}

function TeamRecruitmentPage() {
  const [roles, setRoles] = useState(RECRUITMENT_DATA);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState({ title: "", open: "", desc: "" });
  const addRole = () => { if (!fields.title) return; setRoles(l => [...l, { id: Date.now(), title: fields.title, open: parseInt(fields.open)||1, applied: 0, desc: fields.desc }]); setFields({ title:"",open:"",desc:"" }); setShowForm(false); };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-slate-800">Team Recruitment</h2><p className="text-slate-400 text-sm">Manage open positions</p></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setEditing(e => !e)} className={`p-2 rounded-lg transition ${editing ? "bg-violet-100 text-violet-600" : "text-slate-400 hover:bg-slate-100"}`}>{editing ? <CheckCircle size={16} /> : <Pencil size={16} />}</button>
          <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-violet-700 transition font-medium"><Plus size={15} /> Post Role</button>
        </div>
      </div>
      {showForm && (
        <Card className="border-violet-200 bg-violet-50">
          <div className="flex justify-between items-center mb-3"><h3 className="font-semibold text-slate-800">New Role</h3><button onClick={() => setShowForm(false)} className="text-slate-400 p-1"><X size={16} /></button></div>
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <div><label className="text-xs text-slate-500 mb-1 block font-medium">Role Title</label><input value={fields.title} onChange={e => setFields(f=>({...f,title:e.target.value}))} className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
            <div><label className="text-xs text-slate-500 mb-1 block font-medium">Openings</label><input value={fields.open} onChange={e => setFields(f=>({...f,open:e.target.value}))} type="number" className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
            <div className="md:col-span-2"><label className="text-xs text-slate-500 mb-1 block font-medium">Responsibilities</label><textarea rows={2} value={fields.desc} onChange={e => setFields(f=>({...f,desc:e.target.value}))} className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none" /></div>
          </div>
          <button onClick={addRole} className="bg-violet-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-violet-700 transition font-medium">Post Role</button>
        </Card>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {roles.map(r => (
          <Card key={r.id}>
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1 pr-2"><p className="font-semibold text-slate-800">{r.title}</p><p className="text-xs text-slate-400 mt-0.5">{r.desc}</p></div>
              {editing && <button onClick={() => setRoles(l => l.filter(x => x.id !== r.id))} className="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={13} /></button>}
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-violet-600 font-medium">{r.open} opening{r.open>1?"s":""}</span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full font-semibold">{r.applied} applied</span>
            </div>
            <button className="w-full text-center text-sm text-violet-600 border border-violet-200 py-2 rounded-lg hover:bg-violet-50 transition font-medium mt-3">View Applicants</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── FACULTY PAGES ────────────────────────────────────────────────────────────

function FacultyDashboard({ setPage }) {
  const [pendingList, setPendingList] = useState(PENDING_EVENTS_DATA);
  const [editing, setEditing] = useState(false);
  const resolve = (id) => setPendingList(l => l.filter(p => p.id !== id));
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)" }}>
        <p className="text-violet-300 text-sm font-medium mb-1">Faculty Coordinator</p>
        <h2 className="text-2xl font-bold mb-1">Dr. Priya Kapoor</h2>
        <p className="text-indigo-200 text-sm">{pendingList.length} event{pendingList.length!==1?"s":""} pending approval · Tech Society</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="All Events" value="34" sub="This year" gradient="bg-gradient-to-br from-violet-500 to-indigo-700" onClick={() => setPage("eventmgmt")} />
        <StatCard label="Pending Approvals" value={String(pendingList.length)} sub="Tap to review" gradient="bg-gradient-to-br from-amber-400 to-orange-500" onClick={() => setPage("eventmgmt")} />
        <StatCard label="Students Registered" value="892" sub="Across all events" gradient="bg-gradient-to-br from-emerald-400 to-teal-600" onClick={() => setPage("applications")} />
        <StatCard label="Assigned Club" value="1" sub="Tech Society" gradient="bg-gradient-to-br from-rose-400 to-pink-600" onClick={() => setPage("profile")} />
      </div>
      <Card>
        <SectionHeader title="Pending Approvals" sub="Events awaiting your review" action={!editing?"See all":undefined} onAction={() => setPage("eventmgmt")} editing={editing} onToggleEdit={() => setEditing(e => !e)} />
        {pendingList.length === 0 ? (
          <div className="text-center py-6"><CheckCircle size={28} className="mx-auto mb-2 text-emerald-400" /><p className="text-sm text-slate-400">All caught up</p></div>
        ) : pendingList.map(p => (
          <div key={p.id} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
            <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-slate-800">{p.title}</p><p className="text-xs text-slate-400">{p.club} · {p.date}</p></div>
            <span className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">{p.category}</span>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => resolve(p.id)} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"><CheckCircle size={14} /></button>
              <button onClick={() => resolve(p.id)} className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition"><X size={14} /></button>
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
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-slate-800">All Events</h2><p className="text-slate-400 text-sm">Review and manage club events</p></div>
        <button onClick={() => setEditing(e => !e)} className={`p-2 rounded-lg transition ${editing ? "bg-violet-100 text-violet-600" : "text-slate-400 hover:bg-slate-100"}`}>{editing ? <CheckCircle size={16} /> : <Pencil size={16} />}</button>
      </div>
      <div className="flex gap-2">
        {[["all","All"],["pending","Pending"],["approved","Approved"]].map(([val,label]) => (
          <button key={val} onClick={() => setTab(val)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${tab===val?"bg-violet-600 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{label}</button>
        ))}
      </div>
      <div className="space-y-3">
        {events.map(e => {
          const isExpanded = expandedId === e.id;
          return (
            <Card key={e.id}>
              <div className="flex items-center gap-4">
                <div className="text-2xl flex-shrink-0">{e.emoji}</div>
                <div className="flex-1 min-w-0"><p className="font-semibold text-slate-800">{e.title}</p><p className="text-xs text-slate-400 mt-0.5">{e.club} · {e.date} · {e.registered}/{e.spots} registered</p></div>
                <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-0.5 rounded-full font-medium flex-shrink-0">{e.category}</span>
                {editing ? (
                  <button onClick={() => setEvents(l => l.filter(x => x.id !== e.id))} className="p-2 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 transition flex-shrink-0"><Trash2 size={15} /></button>
                ) : (
                  <button onClick={() => setExpandedId(prev => prev===e.id?null:e.id)} className="flex items-center gap-1 text-xs font-medium text-violet-600 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition flex-shrink-0">
                    Review {isExpanded ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
                  </button>
                )}
              </div>
              {isExpanded && !editing && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">Date</p><p className="text-sm font-semibold text-slate-800">{e.date}</p></div>
                    <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">Time</p><p className="text-sm font-semibold text-slate-800">{e.time||"TBD"}</p></div>
                    <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">Registrations</p><p className="text-sm font-semibold text-slate-800">{e.registered}/{e.spots}</p></div>
                    <div className="bg-violet-50 rounded-xl p-3"><p className="text-xs text-violet-400 mb-0.5">Fill Rate</p><p className="text-sm font-semibold text-violet-700">{Math.round((e.registered/e.spots)*100)}%</p></div>
                    {e.venue && <div className="bg-slate-50 rounded-xl p-3 col-span-2"><p className="text-xs text-slate-400 mb-0.5">Venue</p><p className="text-sm font-semibold text-slate-800">{e.venue}</p></div>}
                  </div>
                  {e.desc && <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-1">Description</p><p className="text-sm text-slate-700 leading-relaxed">{e.desc}</p></div>}
                  <div className="flex gap-2">
                    <button onClick={() => setExpandedId(null)} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition">✓ Approve Event</button>
                    <button onClick={() => setExpandedId(null)} className="flex-1 bg-rose-50 text-rose-600 border border-rose-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-100 transition">✕ Reject Event</button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function FacultyProfile() {
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({ name: "Tech Society", tagline: "Building tomorrow, today", about: "Tech Society at Amity University is a student-run organization dedicated to fostering a passion for technology, innovation, and entrepreneurship.", email: "techsociety@amity.edu" });
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-slate-800">Update Description</h2><p className="text-slate-400 text-sm">Edit the club profile you coordinate</p></div>
      <Card>
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-3xl">💻</div>
            <div><p className="font-bold text-slate-800 text-lg">{info.name}</p><p className="text-slate-400 text-sm">Coordinated by Dr. Priya Kapoor</p></div>
          </div>
          <button onClick={() => setEditing(e => !e)} className={`p-2 rounded-lg transition ${editing ? "bg-violet-100 text-violet-600" : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"}`}>{editing ? <CheckCircle size={16} /> : <Pencil size={16} />}</button>
        </div>
        <div className="space-y-4">
          {[["Club Name","name"],["Tagline","tagline"],["Email","email"]].map(([label,key]) => (
            <div key={key}>
              <label className="text-xs text-slate-400 mb-1.5 block font-medium">{label}</label>
              {editing ? <input value={info[key]} onChange={e => setInfo(i=>({...i,[key]:e.target.value}))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                : <p className="text-sm text-slate-800 px-3 py-2.5 bg-slate-50 rounded-xl">{info[key]}</p>}
            </div>
          ))}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium">About</label>
            {editing ? <textarea rows={4} value={info.about} onChange={e => setInfo(i=>({...i,about:e.target.value}))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none" />
              : <p className="text-sm text-slate-800 px-3 py-2.5 bg-slate-50 rounded-xl leading-relaxed">{info.about}</p>}
          </div>
          {editing && <button className="bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm hover:bg-violet-700 transition font-medium">Save Changes</button>}
        </div>
      </Card>
    </div>
  );
}

// ─── TECH ADMIN PAGES ─────────────────────────────────────────────────────────

function TechAdminDashboard({ setPage }) {
  const totalStudents = UNIVERSITIES.reduce((s,u) => s + u.students, 0);
  const totalClubs = UNIVERSITIES.reduce((s,u) => s + u.clubs, 0);
  const totalEvents = UNIVERSITIES.reduce((s,u) => s + u.events, 0);
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-violet-400" />
          <p className="text-violet-300 text-sm font-medium">Tech Admin · Platform Level</p>
        </div>
        <h2 className="text-2xl font-bold mb-1">ClubSphere Admin</h2>
        <p className="text-indigo-200 text-sm">{UNIVERSITIES.filter(u=>u.active).length} universities live · {totalStudents.toLocaleString()} total users</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Universities" value={String(UNIVERSITIES.length)} sub={`${UNIVERSITIES.filter(u=>u.active).length} active`} gradient="bg-gradient-to-br from-violet-500 to-indigo-700" onClick={() => setPage("universities")} />
        <StatCard label="Total Users" value={totalStudents.toLocaleString()} sub="All universities" gradient="bg-gradient-to-br from-amber-400 to-orange-500" onClick={() => setPage("users")} />
        <StatCard label="Total Clubs" value={String(totalClubs)} sub="Across platform" gradient="bg-gradient-to-br from-emerald-400 to-teal-600" onClick={() => setPage("clubs")} />
        <StatCard label="Events This Month" value={String(totalEvents)} gradient="bg-gradient-to-br from-rose-400 to-pink-600" onClick={() => setPage("analytics")} />
      </div>

      {/* University status */}
      <Card>
        <SectionHeader title="Universities" action="Manage" onAction={() => setPage("universities")} />
        {UNIVERSITIES.map(u => (
          <div key={u.id} className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
            <span className="text-xl">{u.logo}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{u.name}</p>
              <p className="text-xs text-slate-400">{u.campus} · {u.clubs} clubs · {u.students.toLocaleString()} students</p>
            </div>
            <StatusBadge status={u.active ? "active" : "inactive"} />
          </div>
        ))}
      </Card>

      {/* Recent users */}
      <Card>
        <SectionHeader title="Recent Signups" action="View all" onAction={() => setPage("users")} />
        {PLATFORM_USERS.slice(0,4).map(u => (
          <div key={u.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
            <AvatarCircle name={u.name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800">{u.name}</p>
              <p className="text-xs text-slate-400">{u.university} · {u.role}</p>
            </div>
            <StatusBadge status={u.status} />
          </div>
        ))}
      </Card>
    </div>
  );
}

function TechAdminUniversities() {
  const [unis, setUnis] = useState(UNIVERSITIES);
  const [showForm, setShowForm] = useState(false);
  const [fields, setFields] = useState({ name: "", campus: "", logo: "" });
  const toggle = (id) => setUnis(l => l.map(u => u.id === id ? {...u, active: !u.active} : u));
  const add = () => {
    if (!fields.name) return;
    setUnis(l => [...l, { id: Date.now().toString(), name: fields.name, campus: fields.campus, logo: fields.logo || "🏫", clubs: 0, students: 0, events: 0, active: true }]);
    setFields({ name: "", campus: "", logo: "" }); setShowForm(false);
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-slate-800">Universities</h2><p className="text-slate-400 text-sm">Manage universities on the platform</p></div>
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-violet-700 transition font-medium"><Plus size={15}/> Add University</button>
      </div>
      {showForm && (
        <Card className="border-violet-200 bg-violet-50">
          <div className="flex justify-between mb-3"><h3 className="font-semibold text-slate-800">Add University</h3><button onClick={() => setShowForm(false)} className="text-slate-400 p-1"><X size={16}/></button></div>
          <div className="grid md:grid-cols-3 gap-3 mb-3">
            {[["University Name","name"],["Campus / Location","campus"],["Logo Emoji","logo"]].map(([label,key]) => (
              <div key={key}><label className="text-xs text-slate-500 mb-1 block font-medium">{label}</label><input value={fields[key]} onChange={e => setFields(f=>({...f,[key]:e.target.value}))} className="w-full border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
            ))}
          </div>
          <button onClick={add} className="bg-violet-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-violet-700 transition font-medium">Add University</button>
        </Card>
      )}
      <div className="space-y-3">
        {unis.map(u => (
          <Card key={u.id}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl flex-shrink-0">{u.logo}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800">{u.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{u.campus}</p>
                <div className="flex gap-4 text-xs text-slate-400 mt-1">
                  <span>{u.clubs} clubs</span>
                  <span>{u.students.toLocaleString()} students</span>
                  <span>{u.events} events</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status={u.active ? "active" : "inactive"} />
                <button onClick={() => toggle(u.id)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition ${u.active ? "text-rose-500 border-rose-200 hover:bg-rose-50" : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"}`}>
                  {u.active ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TechAdminUsers() {
  const [users, setUsers] = useState(PLATFORM_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const toggleStatus = (id) => setUsers(l => l.map(u => u.id === id ? {...u, status: u.status === "active" ? "suspended" : "active"} : u));
  const filtered = users.filter(u =>
    (roleFilter === "all" || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );
  const roleBadge = { student: "bg-blue-100 text-blue-700", faculty: "bg-purple-100 text-purple-700", club: "bg-amber-100 text-amber-700", techAdmin: "bg-rose-100 text-rose-700" };
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-slate-800">User Management</h2><p className="text-slate-400 text-sm">{users.length} users across the platform</p></div>
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {[["all","All"],["student","Students"],["faculty","Faculty"],["club","Clubs"]].map(([val,label]) => (
          <button key={val} onClick={() => setRoleFilter(val)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${roleFilter===val?"bg-violet-600 text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{label}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(u => (
          <Card key={u.id} className="flex items-center gap-4">
            <AvatarCircle name={u.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-slate-800 text-sm">{u.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge[u.role] || "bg-slate-100 text-slate-600"}`}>{u.role}</span>
              </div>
              <p className="text-xs text-slate-400">{u.email}</p>
              <p className="text-xs text-slate-400">{u.university} · Joined {u.joined}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusBadge status={u.status} />
              <button onClick={() => toggleStatus(u.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition ${u.status === "active" ? "text-rose-500 border-rose-200 hover:bg-rose-50" : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"}`}>
                {u.status === "active" ? "Suspend" : "Restore"}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TechAdminAnalytics() {
  const bars = [
    { label: "Amity", value: 34, color: "bg-violet-500" },
    { label: "Chandigarh", value: 51, color: "bg-indigo-500" },
    { label: "Manipal", value: 62, color: "bg-blue-500" },
    { label: "VIT", value: 78, color: "bg-cyan-500" },
  ];
  const max = Math.max(...bars.map(b => b.value));
  const growth = [
    { month: "Apr", users: 820 }, { month: "May", users: 940 }, { month: "Jun", users: 1100 },
    { month: "Jul", users: 980 }, { month: "Aug", users: 1340 }, { month: "Sep", users: 1620 },
  ];
  const gmax = Math.max(...growth.map(g => g.users));
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-slate-800">Analytics</h2><p className="text-slate-400 text-sm">Platform-level metrics</p></div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Monthly Active Users" value="4.2K" sub="+18% vs last month" gradient="bg-gradient-to-br from-violet-500 to-indigo-700" />
        <StatCard label="Events This Month" value="225" sub="+31% growth" gradient="bg-gradient-to-br from-emerald-400 to-teal-600" />
        <StatCard label="Avg. Registration Rate" value="74%" sub="Per event" gradient="bg-gradient-to-br from-amber-400 to-orange-500" />
        <StatCard label="New Signups" value="1.6K" sub="This month" gradient="bg-gradient-to-br from-rose-400 to-pink-600" />
      </div>
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">Events by University</h3>
        <div className="space-y-3">
          {bars.map(b => (
            <div key={b.label}>
              <div className="flex justify-between text-xs text-slate-500 mb-1"><span>{b.label}</span><span className="font-semibold text-slate-700">{b.value}</span></div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className={`${b.color} h-2.5 rounded-full transition-all`} style={{ width: `${(b.value/max)*100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">User Growth (Last 6 Months)</h3>
        <div className="flex items-end gap-3 h-28">
          {growth.map(g => (
            <div key={g.month} className="flex-1 flex flex-col items-center gap-1">
              <p className="text-xs font-semibold text-slate-600">{g.users >= 1000 ? (g.users/1000).toFixed(1)+"K" : g.users}</p>
              <div className="w-full rounded-t-lg bg-violet-500 transition-all" style={{ height: `${(g.users/gmax)*80}px` }} />
              <p className="text-xs text-slate-400">{g.month}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TechAdminSettings() {
  const [settings, setSettings] = useState({ otpEmail: true, otpSMS: true, guestBrowse: true, autoApprove: true, maintenanceMode: false, maxClubsPerUni: "50", sessionTimeout: "24" });
  const toggle = (key) => setSettings(s => ({...s,[key]:!s[key]}));
  const ToggleSwitch = ({ on, onClick }) => (
    <button onClick={onClick} className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${on ? "bg-violet-600" : "bg-slate-200"}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${on ? "left-6" : "left-1"}`} />
    </button>
  );
  return (
    <div className="space-y-5">
      <div><h2 className="text-xl font-bold text-slate-800">System Settings</h2><p className="text-slate-400 text-sm">Global platform configuration</p></div>

      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">Authentication</h3>
        <div className="space-y-4">
          {[["otpEmail","Email OTP","Allow login via email OTP"],["otpSMS","SMS OTP","Allow login via phone/SMS OTP"],["guestBrowse","Guest Browsing","Allow unauthenticated users to view events"]].map(([key,label,desc]) => (
            <div key={key} className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-slate-800">{label}</p><p className="text-xs text-slate-400">{desc}</p></div>
              <ToggleSwitch on={settings[key]} onClick={() => toggle(key)} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-slate-800 mb-4">Event Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-800">Auto-Approve Registrations</p><p className="text-xs text-slate-400">Students are approved instantly upon registering</p></div>
            <ToggleSwitch on={settings.autoApprove} onClick={() => toggle("autoApprove")} />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Max Clubs per University</label>
            <input value={settings.maxClubsPerUni} onChange={e => setSettings(s=>({...s,maxClubsPerUni:e.target.value}))} type="number" className="w-32 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-medium">Session Timeout (hours)</label>
            <input value={settings.sessionTimeout} onChange={e => setSettings(s=>({...s,sessionTimeout:e.target.value}))} type="number" className="w-32 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          </div>
        </div>
      </Card>

      <Card className="border-rose-200 bg-rose-50">
        <h3 className="font-semibold text-rose-800 mb-3 flex items-center gap-2"><AlertTriangle size={16} /> Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div><p className="text-sm font-medium text-rose-800">Maintenance Mode</p><p className="text-xs text-rose-400">Takes the platform offline for all users</p></div>
          <button onClick={() => toggle("maintenanceMode")}
            className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${settings.maintenanceMode ? "bg-rose-500" : "bg-slate-200"}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${settings.maintenanceMode ? "left-6" : "left-1"}`} />
          </button>
        </div>
        {settings.maintenanceMode && (
          <div className="mt-3 p-3 bg-rose-100 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
            <AlertTriangle size={13}/> Platform is currently in maintenance mode — users cannot access it
          </div>
        )}
      </Card>

      <button className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition">Save All Settings</button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const PORTALS = [
  { id: "student", label: "Student", icon: User },
  { id: "club", label: "Club Admin", icon: Users },
  { id: "faculty", label: "Faculty", icon: BookOpen },
  { id: "techAdmin", label: "Tech Admin", icon: Shield },
];

const PORTAL_USERS = {
  student: { name: "Aryan Gupta", sub: "BTech CSE · 3rd Year" },
  club: { name: "Tech Society", sub: "Club Admin" },
  faculty: { name: "Dr. Priya Kapoor", sub: "Faculty Coordinator" },
  techAdmin: { name: "Tech Team", sub: "Platform Administrator" },
};

export default function App() {
  const [screen, setScreen] = useState("university");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [portal, setPortal] = useState("student");
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleBack = () => { setScreen("university"); setSelectedUniversity(null); };
  const handleLoginRequired = () => { setScreen("auth"); };

  if (screen === "university") return <UniversitySelector onSelect={u => { setSelectedUniversity(u); setScreen("auth"); }} />;
  if (screen === "auth") return (
    <AuthScreen
      university={selectedUniversity || UNIVERSITIES[0]}
      onAuth={role => { setPortal(role); setIsGuest(false); setScreen("app"); setPage("dashboard"); }}
      onGuest={() => { setPortal("student"); setIsGuest(true); setScreen("app"); setPage("dashboard"); }}
      onBack={handleBack}
    />
  );

  const switchPortal = (p) => { setPortal(p); setPage("dashboard"); setSidebarOpen(false); };
  const user = PORTAL_USERS[portal];
  const navItems = NAV[portal];

  const renderContent = () => {
    if (portal === "student") {
      if (page === "dashboard") return <StudentDashboard setPage={setPage} isGuest={isGuest} onLoginRequired={handleLoginRequired} />;
      if (page === "clubs") return <ExploreClubs isGuest={isGuest} onLoginRequired={handleLoginRequired} />;
      if (page === "applications") return isGuest ? <div className="text-center py-20"><Key size={32} className="mx-auto mb-3 text-slate-300"/><p className="font-semibold text-slate-700 mb-1">Sign in to view applications</p><button onClick={handleLoginRequired} className="mt-3 bg-violet-600 text-white px-6 py-2 rounded-xl text-sm font-semibold">Sign In</button></div> : <StudentApplications />;
      if (page === "messages") return isGuest ? <div className="text-center py-20"><Key size={32} className="mx-auto mb-3 text-slate-300"/><p className="font-semibold text-slate-700 mb-1">Sign in to view messages</p><button onClick={handleLoginRequired} className="mt-3 bg-violet-600 text-white px-6 py-2 rounded-xl text-sm font-semibold">Sign In</button></div> : <MessagesPage canEdit={false} />;
    }
    if (portal === "club") {
      if (page === "dashboard") return <ClubDashboard setPage={setPage} />;
      if (page === "events") return <ClubAllEvents />;
      if (page === "applications") return <RegistrationsPage />;
      if (page === "profile") return <ClubProfile />;
      if (page === "messages") return <MessagesPage canEdit={true} />;
      if (page === "recruitment") return <TeamRecruitmentPage />;
    }
    if (portal === "faculty") {
      if (page === "dashboard") return <FacultyDashboard setPage={setPage} />;
      if (page === "eventmgmt") return <EventManagementPage />;
      if (page === "applications") return <RegistrationsPage />;
      if (page === "profile") return <FacultyProfile />;
      if (page === "messages") return <MessagesPage canEdit={true} />;
      if (page === "recruitment") return <TeamRecruitmentPage />;
    }
    if (portal === "techAdmin") {
      if (page === "dashboard") return <TechAdminDashboard setPage={setPage} />;
      if (page === "universities") return <TechAdminUniversities />;
      if (page === "users") return <TechAdminUsers />;
      if (page === "clubs") return <ExploreClubs isGuest={false} onLoginRequired={() => {}} />;
      if (page === "analytics") return <TechAdminAnalytics />;
      if (page === "settings") return <TechAdminSettings />;
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Portal switcher */}
      <div className="flex-shrink-0 bg-indigo-950 flex items-center justify-center gap-1 py-2 px-4">
        <span className="text-indigo-500 text-xs mr-2 font-medium hidden sm:block">Portal:</span>
        {PORTALS.filter(p => !isGuest || p.id === "student").map(p => {
          const Icon = p.icon;
          return (
            <button key={p.id} onClick={() => switchPortal(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${portal === p.id ? "bg-violet-600 text-white shadow-lg" : "text-indigo-300 hover:text-white hover:bg-indigo-800"}`}>
              <Icon size={13} /><span className="hidden sm:inline">{p.label}</span><span className="sm:hidden">{p.label.split(" ")[0]}</span>
            </button>
          );
        })}
        <button onClick={handleBack} className="ml-3 flex items-center gap-1 text-indigo-400 hover:text-white text-xs transition">
          <LogOut size={13} /><span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {isGuest && <GuestBanner onLogin={handleLoginRequired} />}

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative z-30 h-full w-56 flex flex-col flex-shrink-0 transition-transform duration-200 ease-in-out ${portal === "techAdmin" ? "bg-slate-900" : "bg-indigo-950"}`}>
          <div className={`p-4 border-b flex-shrink-0 ${portal === "techAdmin" ? "border-slate-800" : "border-indigo-900"}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">CS</div>
              <div>
                <p className="font-bold text-white text-sm">ClubSphere</p>
                <p className={`text-xs ${portal === "techAdmin" ? "text-slate-500" : "text-indigo-400"}`}>{portal === "techAdmin" ? "Platform Admin" : (selectedUniversity?.name || "Amity University")}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = page === item.id;
              const baseInactive = portal === "techAdmin" ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-indigo-300 hover:bg-indigo-900 hover:text-white";
              return (
                <button key={item.id} onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-violet-600 text-white" : baseInactive}`}>
                  <Icon size={15} className="flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && <span className={`text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${active ? "bg-white/20 text-white" : "bg-violet-600 text-white"}`}>{item.badge}</span>}
                </button>
              );
            })}
          </nav>
          <div className={`p-3 border-t flex-shrink-0 ${portal === "techAdmin" ? "border-slate-800" : "border-indigo-900"}`}>
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{user.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className={`text-xs truncate ${portal === "techAdmin" ? "text-slate-500" : "text-indigo-400"}`}>{user.sub}</p>
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <button className="md:hidden text-slate-500 hover:text-slate-700 p-1" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="flex-1 relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input placeholder="Search…" className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              {portal === "club" && !isGuest && (
                <button onClick={() => setPage("events")} className="hidden sm:flex items-center gap-1.5 bg-violet-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-violet-700 transition font-medium"><Plus size={14}/> New Event</button>
              )}
              <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition">
                <Bell size={18}/>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-600 rounded-full ring-2 ring-white"/>
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-4 md:p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
