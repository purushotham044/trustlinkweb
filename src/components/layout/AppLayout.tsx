// ============================================================
// TrustLink Web — Professional App Layout with Dark & Light Mode
// ============================================================

import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Folder, 
  Share2, 
  Activity, 
  User, 
  LogOut, 
  Menu, 
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';

const navItems = [
  { to: '/app/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/app/vault', icon: <Folder size={18} />, label: 'Vault' },
  { to: '/app/sharing', icon: <Share2 size={18} />, label: 'Sharing' },
  { to: '/app/activity', icon: <Activity size={18} />, label: 'Audit Trail' },
  { to: '/app/profile', icon: <User size={18} />, label: 'Profile' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'User';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E1A] text-slate-900 dark:text-[#F1F5F9] flex transition-colors duration-200">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-[#1E293B] fixed inset-y-0 left-0 z-40 shadow-sm">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-200 dark:border-[#1E293B]">
          <Link to="/app/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-[#0A0E1A] dark:border dark:border-[#00D4FF] flex items-center justify-center text-white dark:text-[#00D4FF]">
              <Shield size={16} />
            </div>
            <span className="font-bold tracking-[0.1em] text-sm text-slate-900 dark:text-[#F1F5F9]">TRUSTLINK</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 flex flex-col gap-1" aria-label="App navigation">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-[rgba(0,212,255,0.08)] text-indigo-600 dark:text-[#00D4FF] border border-indigo-200 dark:border-[rgba(0,212,255,0.2)] font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-[rgba(255,255,255,0.04)]'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1E293B]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#1A2235] mb-2">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#0A0E1A] border border-slate-200 dark:border-[#1E293B] flex items-center justify-center text-indigo-600 dark:text-[#00D4FF]">
              <Shield size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-[#F1F5F9] truncate">{displayName}</p>
              <p className="text-[10px] text-slate-500 dark:text-[#475569] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 dark:text-[#475569] hover:text-rose-600 dark:hover:text-[#EF4444] hover:bg-rose-50 dark:hover:bg-[rgba(239,68,68,0.08)] transition-all duration-200"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-[#1E293B] px-4 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-indigo-600 dark:text-[#00D4FF]" />
          <span className="font-bold tracking-[0.1em] text-sm text-slate-900 dark:text-[#F1F5F9]">TRUSTLINK</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-600 dark:text-[#94A3B8] p-1">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-[#1E293B] pt-14 flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <nav className="flex-1 p-4 flex flex-col gap-1">
              {navItems.map(item => (
                <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${isActive ? 'bg-indigo-50 dark:bg-[rgba(0,212,255,0.08)] text-indigo-600 dark:text-[#00D4FF] font-semibold' : 'text-slate-600 dark:text-[#94A3B8]'}`}>
                  {item.icon}{item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-[#1E293B]">
              <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-[#475569] hover:text-rose-600">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
