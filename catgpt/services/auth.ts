import { supabase } from './supabaseClient';

// Signup function: creates a new user with email and password
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

// Login function: authenticates a user with email and password
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Logout function: signs the current user out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return error;
};

// Get current user: returns the authenticated user object or null
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
};
