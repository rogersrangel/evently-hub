import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { User, LogOut, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="glass-card p-12 text-center">
        <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white">
          <User size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Seu Perfil</h2>
        <p className="text-slate-500 font-medium mb-8 italic">Conta de Fornecedor Verificada</p>
        
        <div className="space-y-4 text-left max-w-sm mx-auto mb-10">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-600">
            <ShieldCheck className="text-green-500" /> Segurança Ativa
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 mx-auto text-red-500 font-black uppercase tracking-widest text-xs hover:text-red-700 transition-colors">
          <LogOut size={16} /> Encerrar Sessão
        </button>
      </div>
    </div>
  );
}