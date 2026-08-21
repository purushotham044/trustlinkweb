import React, { useState } from 'react';
import { User, Shield, Key, Mail, Calendar, CheckCircle, Sun, Moon } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

export function ProfilePage() {
  const { profile, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSaved(false);

    try {
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName.trim(),
        });

      await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Account & Preferences
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            User Profile & Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal details, theme preference, and security credentials.
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Profile information updated successfully.</span>
          </div>
        )}

        {/* Appearance / Theme Selector */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Interface Appearance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose between light executive slate or dark cyber navy theme.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-500 shadow-sm">
                <Sun size={20} />
              </div>
              <div>
                <p className="text-xs font-bold">Light Mode</p>
                <p className="text-[10px] text-slate-500">Executive Slate & White</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-950/40 text-white ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 shadow-sm">
                <Moon size={20} />
              </div>
              <div>
                <p className="text-xs font-bold">Dark Mode</p>
                <p className="text-[10px] text-slate-400">Cyber Navy & Obsidian</p>
              </div>
            </button>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {fullName || 'TrustLink User'}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Full Name
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                value={user?.email || ''}
                disabled
                className="opacity-70 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Account ID (UUID)
              </label>
              <Input
                type="text"
                value={user?.id || ''}
                disabled
                className="opacity-70 cursor-not-allowed font-mono text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {saving ? 'Saving Changes...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
