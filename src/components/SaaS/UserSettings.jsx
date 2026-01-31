import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Save, CheckCircle } from 'lucide-react';

export default function UserSettings() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [perfil, setPerfil] = useState({ nome: '', sobrenome: '', email: '' });
  const [novaSenha, setNovaSenha] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setPerfil({
          nome: data?.nome || '',
          sobrenome: data?.sobrenome || '',
          email: user.email
        });
      }
      setLoading(false);
    }
    carregarDados();
  }, []);

  const handleAtualizar = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();

    // Salva Nome/Sobrenome na tabela de perfis
    const { error: pError } = await supabase.from('profiles').upsert({
      id: user.id, nome: perfil.nome, sobrenome: perfil.sobrenome
    });

    // Se o cara digitou algo no campo de senha, atualiza o Auth
    if (novaSenha.length >= 6) {
      await supabase.auth.updateUser({ password: novaSenha });
      setNovaSenha('');
    }

    if (!pError) setMessage({ type: 'success', text: 'Dados da conta atualizados!' });
    setUpdating(false);
  };

  if (loading) return <div className="p-10 text-center animate-pulse font-black">CARREGANDO PERFIL...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden text-left">
      <div className="bg-slate-50/50 p-10 text-center border-b border-slate-100">
        <div className="w-20 h-20 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center text-white mx-auto mb-4">
          <User size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Configurações da Conta</h2>
      </div>

      <form onSubmit={handleAtualizar} className="p-10 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nome</label>
            <input value={perfil.nome} onChange={e => setPerfil({...perfil, nome: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Sobrenome</label>
            <input value={perfil.sobrenome} onChange={e => setPerfil({...perfil, sobrenome: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2">E-mail</label>
          <input disabled value={perfil.email} className="w-full p-4 bg-slate-50/50 text-slate-400 rounded-2xl font-bold border-none" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nova Senha</label>
          <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-indigo-600" />
        </div>

        {message && <p className="bg-emerald-50 text-emerald-600 p-3 rounded-xl font-bold text-center">{message.text}</p>}

        <button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
          <Save size={18} /> {updating ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </motion.div>
  );
}