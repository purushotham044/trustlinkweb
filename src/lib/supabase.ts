// ============================================================
// TrustLink Web — Supabase Client
//
// Uses VITE_ env vars (equivalent to mobile app's EXPO_PUBLIC_)
// Only the anon key is used — safe for client-side.
// Never expose service-role keys or private keys here.
// ============================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[TrustLink] Missing Supabase environment variables.\n' +
    'Copy .env.example to .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // handles OAuth callbacks in web
    },
  }
);
