import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // O Supabase automaticamente processa o token da URL
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro no callback:', error);
          navigate('/login?error=auth_failed');
          return;
        }
        
        if (session) {
          // Login bem-sucedido - redireciona para dashboard
          navigate('/dashboard');
        } else {
          // Sem sessão - volta para login
          navigate('/login');
        }
      } catch (err) {
        console.error('Erro inesperado:', err);
        navigate('/login?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto"></div>
        <p className="mt-6 text-lg font-bold text-slate-800">Finalizando login...</p>
        <p className="mt-2 text-sm text-slate-500">Você será redirecionado em instantes</p>
      </div>
    </div>
  );
}