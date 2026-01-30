import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cria cliente Supabase se variáveis existirem, senão exporta um mock seguro
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getUser: async () => ({ data: { user: null } }),
        signOut: async () => ({}),
        signInWithPassword: async () => ({ error: { message: 'Supabase não configurado' } }),
        signUp: async () => ({ error: { message: 'Supabase não configurado' } }),
      },
      from: () => ({
        select: async () => ({ data: [], error: null }),
        insert: async () => ({ data: null, error: { message: 'Supabase não configurado' } }),
      }),
    };