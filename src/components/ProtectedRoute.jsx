import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Verifica se tem sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      
      // 2. Se NÃO tiver sessão, redireciona para login
      if (!session) {
        navigate('/login');
      } else {
        // 3. Se tiver sessão, mostra o conteúdo
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // 4. Enquanto verifica, mostra loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // 5. Retorna o conteúdo protegido
  return children;
}