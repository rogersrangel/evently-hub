import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Instagram, 
  Phone, 
  MapPin, 
  Type, 
  DollarSign, 
  ArrowLeft, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

export default function RegisterService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    nome: '',
    preco: '',
    localizacao: '',
    whatsapp: '',
    instagram_handle: '',
    imagem_url: ''
  });

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Usuário não autenticado");

      // Limpa o @ do instagram se o usuário tiver colocado
      const instaClean = form.instagram_handle.replace('@', '');

      const { error } = await supabase
        .from('fornecedores')
        .insert([{
          ...form,
          instagram_handle: instaClean,
          user_id: user.id,
          created_at: new Date()
        }]);

      if (error) throw error;

      alert("Anúncio criado com sucesso!");
      navigate('/dashboard');
      
    } catch (error) {
      alert("Erro ao cadastrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase mb-6 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} /> Voltar ao Painel
        </button>

        <form onSubmit={handleCadastrar} className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100 text-left">
          {/* Header */}
          <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-indigo-600 text-white">
            <div>
              <h1 className="text-3xl font-black tracking-tighter">Novo Anúncio</h1>
              <p className="text-indigo-100 font-bold text-[10px] uppercase tracking-widest">Cadastre seu espaço ou serviço de buffet</p>
            </div>
            <Sparkles size={32} className="opacity-50" />
          </div>

          <div className="p-10 space-y-8">
            
            {/* Foto de Capa (Preview Dinâmico) */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1">
                <ImageIcon size={12}/> Link da Foto Principal
              </label>
              <div className="relative group">
                <div className="w-full h-48 bg-slate-100 rounded-[2rem] border-4 border-dashed border-slate-200 flex items-center justify-center overflow-hidden mb-2">
                  {form.imagem_url ? (
                    <img src={form.imagem_url} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <span className="text-slate-300 font-bold text-sm italic">Cole o link da foto abaixo</span>
                  )}
                </div>
                <input 
                  required
                  value={form.imagem_url} 
                  onChange={e => setForm({...form, imagem_url: e.target.value})}
                  placeholder="https://exemplo.com/foto-do-local.jpg"
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-none focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>
            </div>

            {/* Nome e Preço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Type size={12}/> Nome Comercial</label>
                <input 
                  required
                  value={form.nome} 
                  onChange={e => setForm({...form, nome: e.target.value})} 
                  placeholder="Ex: Chácara Recanto Verde"
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none border-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><DollarSign size={12}/> Valor por Dia (R$)</label>
                <input 
                  required
                  type="number"
                  value={form.preco} 
                  onChange={e => setForm({...form, preco: e.target.value})} 
                  placeholder="800"
                  className="w-full p-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none border-none" 
                />
              </div>
            </div>

            {/* Localização */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><MapPin size={12}/> Localização (Cidade/Estado)</label>
              <input 
                required
                value={form.localizacao} 
                onChange={e => setForm({...form, localizacao: e.target.value})} 
                placeholder="Ex: Mairiporã - SP"
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none border-none" 
              />
            </div>

            {/* Contatos Específicos do Anúncio */}
            <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 space-y-6">
              <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] text-center">Configurações de Contato</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Phone size={12}/> WhatsApp do Anúncio</label>
                  <input 
                    required
                    value={form.whatsapp} 
                    onChange={e => setForm({...form, whatsapp: e.target.value})} 
                    placeholder="11999999999" 
                    className="w-full p-4 bg-white rounded-2xl font-bold border-none shadow-sm focus:ring-2 focus:ring-indigo-600" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1"><Instagram size={12}/> Instagram do Anúncio</label>
                  <input 
                    value={form.instagram_handle} 
                    onChange={e => setForm({...form, instagram_handle: e.target.value})} 
                    placeholder="@meu.espaco" 
                    className="w-full p-4 bg-white rounded-2xl font-bold border-none shadow-sm focus:ring-2 focus:ring-indigo-600" 
                  />
                </div>
              </div>
              <p className="text-[9px] text-slate-400 font-bold text-center italic">
                * Estes contatos aparecerão na vitrine pública deste anúncio específico.
              </p>
            </div>

            <button 
              disabled={loading}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <Plus size={24} /> {loading ? 'CADASTRANDO...' : 'PUBLICAR ANÚNCIO'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}