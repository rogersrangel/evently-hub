import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';

export default function RegisterService() {
  const [form, setForm] = useState({ nome: '', preco: '', descricao: '', localizacao: '' });
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Faça login primeiro!");

  const { error } = await supabase
    .from('fornecedores')
    .insert([{ 
      nome: form.nome, 
      preco: Number(form.preco), 
      localizacao: form.localizacao,
      descricao: form.descricao,
      tipo: 'Espaço', // Valor padrão para preencher a coluna 'tipo'
      user_id: user.id 
    }]);

  if (error) {
    alert("Erro: " + error.message);
  } else {
    navigate('/dashboard');
  }
};
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-8 transition-colors">
          <ArrowLeft size={20} /> Voltar ao Painel
        </button>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 md:p-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
              <Sparkles size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Anunciar Espaço</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Título do Anúncio</label>
              <input required className="w-full p-5 bg-white/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all" placeholder="Ex: Loft Industrial para Festas" onChange={e => setForm({...form, nome: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Preço (R$)</label>
                <input type="number" required className="w-full p-5 bg-white/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all" placeholder="5000" onChange={e => setForm({...form, preco: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Localização</label>
                <input required className="w-full p-5 bg-white/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all" placeholder="Cidade, UF" onChange={e => setForm({...form, localizacao: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Descrição</label>
              <textarea rows="4" className="w-full p-5 bg-white/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all" placeholder="Diferenciais do seu espaço..." onChange={e => setForm({...form, descricao: e.target.value})} />
            </div>

            <button className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-xl">
              <CheckCircle size={24} /> Publicar Agora
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}