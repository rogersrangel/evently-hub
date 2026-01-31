import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Instagram, Phone, MapPin, Type, DollarSign, ArrowLeft, Settings, Image as ImageIcon } from 'lucide-react';

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [form, setForm] = useState({
    nome: '',
    preco: '',
    localizacao: '',
    whatsapp: '',
    instagram_handle: '',
    imagem_url: ''
  });

  useEffect(() => {
    async function carregarDados() {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setForm(data);
      if (error) navigate('/dashboard');
      setLoading(false);
    }
    carregarDados();
  }, [id, navigate]);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    // Limpa o @ do instagram caso o usuário tenha digitado
    const instaClean = form.instagram_handle ? form.instagram_handle.replace('@', '') : '';

    const { error } = await supabase
      .from('fornecedores')
      .update({ ...form, instagram_handle: instaClean })
      .eq('id', id);

    if (!error) {
      navigate('/dashboard');
    }
    setUpdating(false);
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-indigo-600">CARREGANDO...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase mb-6 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} /> Voltar ao Painel
        </button>

        <form onSubmit={handleSalvar} className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100 text-left">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Editar Anúncio</h1>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Configurações específicas deste serviço</p>
            </div>
            <Settings className="text-indigo-600" />
          </div>

          <div className="p-10 space-y-8">
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><ImageIcon size={12}/> Capa do Anúncio</label>
               <img src={form.imagem_url} className="w-full h-56 object-cover rounded-[2rem] border-4 border-white shadow-lg mb-4" />
               <input value={form.imagem_url} onChange={e => setForm({...form, imagem_url: e.target.value})} placeholder="URL da imagem" className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-indigo-600 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nome</label>
                <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none border-none shadow-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Preço (R$)</label>
                <input value={form.preco} onChange={e => setForm({...form, preco: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none border-none shadow-sm" />
              </div>
            </div>

            <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 space-y-6">
              <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest text-center">Contato e Social do Anúncio</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Phone size={12}/> WhatsApp</label>
                  <input value={form.whatsapp || ''} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="Ex: 11999999999" className="w-full p-4 bg-white rounded-2xl font-bold border-none shadow-sm focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Instagram size={12}/> Instagram</label>
                  <input value={form.instagram_handle || ''} onChange={e => setForm({...form, instagram_handle: e.target.value})} placeholder="Ex: @meu_espaco" className="w-full p-4 bg-white rounded-2xl font-bold border-none shadow-sm focus:ring-2 focus:ring-indigo-600" />
                </div>
              </div>
            </div>

            <button disabled={updating} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
              <Save size={24} /> {updating ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}