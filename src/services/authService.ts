// ============================================================
// TrustLink Web — Authentication Service
// All auth flows through Supabase Auth + automatic backend audit logging
// ============================================================

import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  error?: string;
}

async function logAuthAudit(action: 'USER_LOGIN' | 'USER_LOGOUT' | 'USER_REGISTERED', userId?: string, metadata?: Record<string, unknown>) {
  try {
    const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    if (!targetUserId) return;

    await supabase.from('audit_logs').insert({
      user_id: targetUserId,
      action,
      metadata: metadata || {},
    });
  } catch (e) {}
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        full_name: fullName.trim(),
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data?.user?.id) {
    await logAuthAudit('USER_REGISTERED', data.user.id, { email: cleanEmail, full_name: fullName.trim() });
  }

  return { success: true };
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data?.user?.id) {
    await logAuthAudit('USER_LOGIN', data.user.id, { method: 'email_password', email: cleanEmail });
  }

  return { success: true };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function signOut(): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (user?.user?.id) {
    await logAuthAudit('USER_LOGOUT', user.user.id);
  }
  await supabase.auth.signOut();
}
