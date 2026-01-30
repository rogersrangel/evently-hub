import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (type) => {
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (!error) navigate('/dashboard');
    else alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Luzes de Fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white p-12 rounded-[3.5rem] shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-3xl mb-6">
            <Sparkles size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">EventlyHub</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Acesso Exclusivo</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="email" 
              placeholder="E-mail" 
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold transition-all"
              onChange={e => setEmail(e.target.value)} 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold transition-all"
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          <div className="flex flex-col gap-4 pt-6">
            <button 
              onClick={() => handleAuth('login')}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl"
            >
              Entrar no Painel
            </button>
            <button 
              onClick={() => handleAuth('signup')}
              className="w-full text-slate-400 py-2 font-bold hover:text-slate-900 transition-all text-sm"
            >
              Criar conta gratuita
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}