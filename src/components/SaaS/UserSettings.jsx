import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import { User, Mail, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function UserSettings() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [perfil, setPerfil] = useState({ nome: '', sobrenome: '', email: '' });
  const [novaSenha, setNovaSenha] = useState('');
  const [confSenha, setConfSenha] = useState('');
  const [message, setMessage] = useState(null);
  const [erros, setErros] = useState({});

  useEffect(() => {
    async function carregarDados() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (error) {
            // Criar perfil se não existir
            await supabase.from('profiles').insert({
              id: user.id,
              nome: '',
              sobrenome: '',
              email: user.email
            });
          }
          setPerfil({
            nome: data?.nome || '',
            sobrenome: data?.sobrenome || '',
            email: user.email || ''
          });
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const validar = () => {
    const novosErros = {};

    if (!perfil.nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!perfil.sobrenome.trim()) novosErros.sobrenome = 'Sobrenome é obrigatório';

    if (novaSenha && novaSenha.length < 6) {
      novosErros.novaSenha = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (novaSenha && novaSenha !== confSenha) {
      novosErros.confSenha = 'Senhas não conferem';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleAtualizar = async (e) => {
    e.preventDefault();
    
    if (!validar()) return;

    setUpdating(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Salva Nome/Sobrenome
      const { error: pError } = await supabase.from('profiles').upsert({
        id: user.id,
        nome: perfil.nome.trim(),
        sobrenome: perfil.sobrenome.trim(),
        email: perfil.email
      });

      if (pError) throw pError;

      // Atualiza senha se fornecida
      if (novaSenha) {
        const { error: sError } = await supabase.auth.updateUser({ password: novaSenha });
        if (sError) throw sError;
      }

      setMessage({ type: 'success', text: '✓ Perfil atualizado com sucesso!' });
      setNovaSenha('');
      setConfSenha('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro: ' + error.message });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-indigo-600 mb-4" size={32} />
        <p className="font-black text-slate-600">CARREGANDO PERFIL...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden text-left">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-12 text-center border-b border-slate-200">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[1.8rem] flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
          <User size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Configurações da Conta</h2>
        <p className="text-slate-600 font-bold text-sm mt-2 uppercase tracking-wider">Gerenciar seu perfil e segurança</p>
      </div>

      <form onSubmit={handleAtualizar} className="p-12 space-y-8">
        
        {/* MESSAGE */}
        {message && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`p-4 rounded-2xl flex items-center gap-3 ${
            message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
          }`}>
            {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <p className="font-bold text-sm">{message.text}</p>
          </motion.div>
        )}

        {/* SEÇÃO: DADOS PESSOAIS */}
        <div className="space-y-6 pb-8 border-b border-slate-200">
          <h3 className="text-lg font-black text-slate-900 uppercase flex items-center gap-2">👤 Dados Pessoais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block ml-2">Nome *</label>
              <input 
                type="text"
                value={perfil.nome} 
                onChange={e => { setPerfil({...perfil, nome: e.target.value}); setErros({...erros, nome: ''}) }} 
                className={`w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                  erros.nome ? 'border-red-300' : 'border-slate-200'
                }`}
                placeholder="Seu nome"
              />
              {erros.nome && <p className="text-red-600 text-xs font-bold ml-2">{erros.nome}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block ml-2">Sobrenome *</label>
              <input 
                type="text"
                value={perfil.sobrenome} 
                onChange={e => { setPerfil({...perfil, sobrenome: e.target.value}); setErros({...erros, sobrenome: ''}) }} 
                className={`w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                  erros.sobrenome ? 'border-red-300' : 'border-slate-200'
                }`}
                placeholder="Seu sobrenome"
              />
              {erros.sobrenome && <p className="text-red-600 text-xs font-bold ml-2">{erros.sobrenome}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block ml-2 flex items-center gap-1">
              <Mail size={14} /> E-mail
            </label>
            <input 
              type="email"
              disabled 
              value={perfil.email} 
              className="w-full p-4 bg-slate-100/50 text-slate-500 rounded-2xl font-bold border border-slate-200 cursor-not-allowed"
            />
            <p className="text-[10px] font-bold text-slate-500 ml-2">Para alterar e-mail, entre em contato com o suporte.</p>
          </div>
        </div>

        {/* SEÇÃO: SEGURANÇA */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-900 uppercase flex items-center gap-2">🔐 Segurança</h3>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block ml-2">Nova Senha (opcional)</label>
            <input 
              type="password" 
              value={novaSenha} 
              onChange={e => { setNovaSenha(e.target.value); setErros({...erros, novaSenha: ''}) }} 
              placeholder="Deixe em branco para não alterar" 
              className={`w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                erros.novaSenha ? 'border-red-300' : 'border-slate-200'
              }`}
            />
            {erros.novaSenha && <p className="text-red-600 text-xs font-bold ml-2">{erros.novaSenha}</p>}
            <p className="text-[10px] font-bold text-slate-500 ml-2">Mínimo de 6 caracteres</p>
          </div>

          {novaSenha && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block ml-2">Confirmar Senha *</label>
              <input 
                type="password" 
                value={confSenha} 
                onChange={e => { setConfSenha(e.target.value); setErros({...erros, confSenha: ''}) }} 
                placeholder="Repita a nova senha" 
                className={`w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 outline-none focus:ring-2 focus:ring-indigo-600 transition-all ${
                  erros.confSenha ? 'border-red-300' : 'border-slate-200'
                }`}
              />
              {erros.confSenha && <p className="text-red-600 text-xs font-bold ml-2">{erros.confSenha}</p>}
            </motion.div>
          )}
        </div>

        {/* BOTÃO SALVAR */}
        <button 
          type="submit" 
          disabled={updating}
          className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {updating ? <><Loader2 className="animate-spin" size={20} /> Salvando...</> : <><Save size={20} /> Salvar Alterações</>}
        </button>
      </form>
    </motion.div>
  );
}