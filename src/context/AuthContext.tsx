// ============================================================
// TrustLink Web — Shared Auth Context & Provider
// Single source of truth for auth across the application
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import * as authService from '@/services/authService';
import type { UserProfile } from '@/types';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInAsDemo: () => void;
  signOut: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (!error && data) setProfile(data as UserProfile);
    } catch (e) {
      console.warn('Profile fetch warning:', e);
    }
  }, []);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchProfile(s.user.id);
      setInitialized(true);
    }).catch(err => {
      console.warn('getSession error:', err);
      setInitialized(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) await fetchProfile(s.user.id);
      else setProfile(null);
      setInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const handleSignUp = useCallback(async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      return await authService.signUpWithEmail(email, password, fullName);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.signInWithEmail(email, password);
      if (result.success) {
        // Immediately fetch the session so state updates before navigation
        const { data: { session: s } } = await supabase.auth.getSession();
        if (s) {
          setSession(s);
          setUser(s.user);
          if (s.user) fetchProfile(s.user.id);
        }
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const handleGoogleSignIn = useCallback(async () => {
    setLoading(true);
    try {
      return await authService.signInWithGoogle();
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDemoSignIn = useCallback(() => {
    const demoUser: any = {
      id: 'demo-user-0000-0000-000000000001',
      email: 'demo.analyst@trustlink.app',
      app_metadata: {},
      user_metadata: { full_name: 'Security Analyst (Demo)' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    const demoSession: any = {
      access_token: 'demo-token',
      token_type: 'bearer',
      user: demoUser,
    };
    setUser(demoUser);
    setSession(demoSession);
    setProfile({
      id: demoUser.id,
      full_name: 'Security Analyst (Demo)',
      avatar_url: null,
      created_at: demoUser.created_at,
      updated_at: demoUser.created_at,
    });
    setInitialized(true);
  }, []);

  const handleSignOut = useCallback(async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        initialized,
        signUpWithEmail: handleSignUp,
        signInWithEmail: handleSignIn,
        signInWithGoogle: handleGoogleSignIn,
        signInAsDemo: handleDemoSignIn,
        signOut: handleSignOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
