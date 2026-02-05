import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Verifica se já está logado ao carregar a página
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard', { replace: true });
      }
    };
    checkUser();
  }, [navigate]);

  // Dentro do componente, adicione esta função:
const handleGoogleLogin = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      console.error('Erro Google OAuth:', error);
      alert('Erro ao conectar com Google. Tente novamente.');
    }
    // Se não houver erro, o navegador redireciona automaticamente
  } catch (err) {
    console.error('Exceção no login Google:', err);
    alert('Erro inesperado. Verifique o console.');
  }
};

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (isSignUp) {
        // Lógica de Cadastro (SignUp)
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin + '/dashboard',
          }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Conta criada! Se o Supabase exigir confirmação, verifique seu e-mail.' });
      } else {
        // Lógica de Login (SignIn)
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw error;

        if (data?.session) {
          // Login bem-sucedido: Redireciona imediatamente
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      // Tradução simples de erros comuns do Firebase/Supabase
      let errorMsg = error.message;
      if (errorMsg.includes('Invalid login credentials')) errorMsg = 'E-mail ou senha incorretos.';
      if (errorMsg.includes('Email not confirmed')) errorMsg = 'Por favor, confirme seu e-mail antes de entrar.';
      
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 text-left"
      >
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
            {isSignUp ? 'Criar Conta' : 'Bem-vindo'}
          </h1>
          <p className="text-slate-500 font-bold">
            {isSignUp ? 'Comece a anunciar seus espaços hoje.' : 'Acesse seu painel de controle.'}
          </p>
        </div>

         {/* === BOTÃO GOOGLE ADICIONADO AQUI === */}
      <div className="mb-6">
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm hover:shadow mb-4"
        >
          <FcGoogle size={22} />
          <span className="font-semibold text-slate-700">Continuar com Google</span>
        </button>
        
        {/* Divisor "OU" */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500 font-medium">OU</span>
          </div>
        </div>
      </div>
      {/* === FIM BOTÃO GOOGLE === */}

        <form onSubmit={handleAuth} className="space-y-4">
          {message.text && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold mb-4 ${
                message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <AlertCircle size={18} className="shrink-0" />
              {message.text}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email"
                required
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password"
                required
                minLength={6}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                {isSignUp ? 'Cadastrar' : 'Entrar'}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage({ type: '', text: '' });
            }}
            className="text-slate-500 font-bold hover:text-indigo-600 transition-colors"
          >
            {isSignUp ? 'Já tem uma conta? Entre aqui' : 'Não tem conta? Crie uma agora'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}