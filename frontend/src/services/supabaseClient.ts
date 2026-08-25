import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');

// Used for operations protected by RLS when a valid user session is required.
export const createAuthenticatedSupabaseClient = (accessToken: string) => createClient(
  supabaseUrl,
  supabaseAnonKey,
  { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
);
