import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Lock, Mail, Save, 
  ArrowLeft, CheckCircle2, ShieldCheck 
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);

  const [perfil, setPerfil] = useState({
    nome: '',
    sobrenome: '',
    email: ''
  });
  const [novaSenha, setNovaSenha] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setPerfil({
        nome: data?.nome || '',
        sobrenome: data?.sobrenome || '',
        email: user.email
      });
    }
    setLoading(false);
  }

  const handleSalvar = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Atualiza Nome e Sobrenome na tabela Profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          nome: perfil.nome,
          sobrenome: perfil.sobrenome,
          updated_at: new Date()
        });

      if (profileError) throw profileError;

      // 2. Atualiza a Senha se o campo não estiver vazio
      if (novaSenha.length >= 6) {
        const { error: authError } = await supabase.auth.updateUser({ 
          password: novaSenha 
        });
        if (authError) throw authError;
        setNovaSenha('');
      }

      setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse">CARREGANDO PERFIL...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase mb-6 hover:text-indigo-600 transition-all tracking-widest"
        >
          <ArrowLeft size={14} /> Voltar ao Dashboard
        </button>

        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          {/* Cabeçalho do Perfil */}
          <div className="bg-slate-900 p-12 text-center relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck size={120} className="text-white" />
            </div>
            
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-4 shadow-2xl relative z-10">
              <User size={40} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter relative z-10">Minha Conta</h1>
            <p className="text-indigo-300 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 relative z-10">Gerenciamento de Segurança</p>
          </div>

          <form onSubmit={handleSalvar} className="p-10 space-y-8 text-left">
            
            {/* Seção Dados Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nome</label>
                <input 
                  value={perfil.nome}
                  onChange={e => setPerfil({...perfil, nome: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Sobrenome</label>
                <input 
                  value={perfil.sobrenome}
                  onChange={e => setPerfil({...perfil, sobrenome: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                  placeholder="Seu sobrenome"
                />
              </div>
            </div>

            {/* E-mail (Apenas Leitura para Segurança) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest flex items-center gap-2">
                <Mail size={12} /> E-mail de Acesso
              </label>
              <input 
                disabled
                value={perfil.email}
                className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold text-slate-400 cursor-not-allowed outline-none"
              />
            </div>

            <hr className="border-slate-50" />

            {/* Alterar Senha */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest flex items-center gap-2">
                <Lock size={12} /> Nova Senha
              </label>
              <input 
                type="password"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
              />
              <p className="text-[9px] text-slate-400 font-bold ml-2">Deixe em branco se não quiser alterar a senha atual.</p>
            </div>

            {/* Feedback de Sucesso/Erro */}
            {message && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-2xl flex items-center gap-3 font-black text-xs ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}
              >
                <CheckCircle2 size={16} /> {message.text}
              </motion.div>
            )}

            <button 
              disabled={updating}
              className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Save size={20} />
              {updating ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}