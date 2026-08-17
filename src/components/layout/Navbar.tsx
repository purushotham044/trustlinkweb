import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { to: '/features', label: 'Features' },
  { to: '/security', label: 'Security' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/verify', label: 'Verify' },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[rgba(10,14,26,0.95)] backdrop-blur-md border-b border-[#1E293B]'
          : 'bg-transparent',
      ].join(' ')}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="TrustLink home">
            <div className="w-8 h-8 rounded-lg bg-[#111827] border border-[#00D4FF] flex items-center justify-center group-hover:shadow-[0_0_12px_rgba(0,212,255,0.3)] transition-shadow duration-300">
              <Shield size={16} className="text-[#00D4FF]" />
            </div>
            <span className="font-bold text-[#F1F5F9] tracking-[0.1em] text-sm">TRUSTLINK</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    isActive
                      ? 'text-[#00D4FF] bg-[rgba(0,212,255,0.08)]'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[rgba(255,255,255,0.04)]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/app/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#111827] border-t border-[#1E293B] px-4 py-4 flex flex-col gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm transition-colors duration-200 ${
                  isActive ? 'text-[#00D4FF] bg-[rgba(0,212,255,0.08)]' : 'text-[#94A3B8]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-[#1E293B] flex flex-col gap-2 mt-2">
            {user ? (
              <>
                <Link to="/app/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="sm" fullWidth>Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" fullWidth onClick={handleSignOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" fullWidth>Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="sm" fullWidth>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
