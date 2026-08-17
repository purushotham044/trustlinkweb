// ============================================================
// TrustLink Web — Authentication Service
// ============================================================

import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  error?: string;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult> {
  const { error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { full_name: fullName.trim() } },
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
