import { supabase } from './supabaseClient';

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getSession = async () => supabase.auth.getSession();

export const onAuthStateChange = (callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) =>
  supabase.auth.onAuthStateChange(callback);
