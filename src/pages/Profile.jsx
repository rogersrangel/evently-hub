import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { User, LogOut, ShieldCheck, Mail } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // [ADICIONADO] Para evitar tela branca

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) return <div className="pt-32 text-center font-bold">Carregando perfil...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 pt-32">
      <div className="glass-card p-12 text-center bg-white rounded-[3rem] shadow-xl border border-slate-100">
        <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white shadow-lg">
          <User size={48} />
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          {user?.email ? user.email.split('@')[0] : 'Usuário'}
        </h2>
        
        <div className="space-y-4 text-left max-w-sm mx-auto my-8">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl font-bold text-slate-600">
            <Mail className="text-indigo-500" size={20} />
            <span className="truncate">{user?.email || 'Sem e-mail'}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl font-bold text-slate-600">
            <ShieldCheck className="text-green-500" size={20} />
            Conta Verificada
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 mx-auto text-red-500 font-black uppercase tracking-widest text-[10px] hover:opacity-70 transition-all">
          <LogOut size={16} /> Encerrar Sessão
        </button>
      </div>
    </div>
  );
}