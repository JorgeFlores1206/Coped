// Simple middleware placeholder for auth validation in backend logic
import { supabase } from '../../../frontend/src/services/supabaseClient';

export const validateUserAuth = async (token: string) => {
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    throw new Error('Unauthorized');
  }
  return data.user;
};
