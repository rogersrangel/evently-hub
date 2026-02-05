import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificação melhorada
const isConfigValid = supabaseUrl && supabaseAnonKey && 
                     supabaseUrl.startsWith('http') && 
                     supabaseAnonKey.startsWith('eyJ');

export const supabase = isConfigValid
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ 
          data: null, 
          error: { message: 'Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local' } 
        }),
        signUp: async () => ({ 
          data: null, 
          error: { message: 'Configure as variáveis do Supabase' } 
        }),
      },
      from: () => ({
        select: async () => ({ data: [], error: null }),
        insert: async () => ({ data: null, error: { message: 'Supabase não configurado' } }),
        update: async () => ({ data: null, error: { message: 'Supabase não configurado' } }),
        delete: async () => ({ data: null, error: { message: 'Supabase não configurado' } }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: { message: 'Supabase não configurado' } }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    };

// Aviso no console em desenvolvimento
if (!isConfigValid && import.meta.env.DEV) {
  console.warn('⚠️  Supabase não configurado. Usando mock para desenvolvimento.');
}