import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, Folder, Share2, Activity, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { to: '/app/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/app/vault', icon: <Folder size={18} />, label: 'Vault' },
  { to: '/app/sharing', icon: <Share2 size={18} />, label: 'Sharing' },
  { to: '/app/activity', icon: <Activity size={18} />, label: 'Audit Trail' },
  { to: '/app/profile', icon: <User size={18} />, label: 'Profile' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'User';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#111827] border-r border-[#1E293B] fixed inset-y-0 left-0 z-40">
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-[#1E293B]">
          <div className="w-8 h-8 rounded-lg bg-[#0A0E1A] border border-[#00D4FF] flex items-center justify-center">
            <Shield size={16} className="text-[#00D4FF]" />
          </div>
          <span className="font-bold text-[#F1F5F9] tracking-[0.1em] text-sm">TRUSTLINK</span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1" aria-label="App navigation">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[rgba(0,212,255,0.08)] text-[#00D4FF] border border-[rgba(0,212,255,0.2)]'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[rgba(255,255,255,0.04)]'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1E293B]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#1A2235] mb-2">
            <div className="w-8 h-8 rounded-full bg-[#0A0E1A] border border-[#1E293B] flex items-center justify-center">
              <Shield size={14} className="text-[#00D4FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#F1F5F9] truncate">{displayName}</p>
              <p className="text-[10px] text-[#475569] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#475569] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.08)] transition-all duration-200"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#111827] border-b border-[#1E293B] px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-[#00D4FF]" />
          <span className="font-bold text-[#F1F5F9] tracking-[0.1em] text-sm">TRUSTLINK</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[#94A3B8]">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[rgba(0,0,0,0.8)]" onClick={() => setMobileOpen(false)}>
          <div className="w-64 h-full bg-[#111827] border-r border-[#1E293B] pt-14 flex flex-col" onClick={e => e.stopPropagation()}>
            <nav className="flex-1 p-4 flex flex-col gap-1">
              {navItems.map(item => (
                <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${isActive ? 'bg-[rgba(0,212,255,0.08)] text-[#00D4FF]' : 'text-[#94A3B8]'}`}>
                  {item.icon}{item.label}
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-[#1E293B]">
              <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#475569] hover:text-[#EF4444]">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
