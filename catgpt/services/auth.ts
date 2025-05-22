// services/auth.ts
import { supabase } from './supabaseClient';
import type { AuthError, Session, User } from '@supabase/supabase-js';

// Signup: email/password
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

// Sign-in: email/password
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Sign-out
export const signOut = async (): Promise<AuthError | null> => {
  const { error } = await supabase.auth.signOut();
  return error;
};

// Get current session
export const getSession = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession();
  return error ? null : data.session;
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const session = await getSession();
  if (!session) return null;

  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
};

// Google OAuth login
export const signInWithGoogle = async () => {
  if (typeof window === 'undefined') return;
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/home`,
    },
  });
};
