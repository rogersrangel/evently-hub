import { motion } from 'framer-motion';
import { User, Settings, LogOut, Package } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const handleLogout = () => supabase.auth.signOut();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "backOut" }}
      className="max-w-3xl mx-auto px-6 py-12 pt-32"
    >
      <div className="glass-card p-12 text-center bg-white rounded-[3rem] shadow-xl border border-white">
        <motion.div 
          initial={{ rotate: -15, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-28 h-28 bg-indigo-600 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-white shadow-2xl shadow-indigo-200"
        >
          <User size={56} />
        </motion.div>

        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Seu Perfil</h2>
        <p className="text-slate-400 font-bold mb-12 italic">Membro desde 2026</p>

        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          <button className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all group">
            <Settings className="group-hover:rotate-90 transition-transform" /> Configurações
          </button>
          <button onClick={handleLogout} className="flex items-center gap-4 p-5 bg-red-50 rounded-2xl font-bold text-red-600 hover:bg-red-600 hover:text-white transition-all">
            <LogOut /> Sair da Conta
          </button>
        </div>
      </div>
    </motion.div>
  );
}