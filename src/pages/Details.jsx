import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Users, 
  CheckCircle, 
  Calendar, 
  Info,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getItem() {
      try {
        const { data, error } = await supabase
          .from('fornecedores')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setItem(data);
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error.message);
        navigate('/explorar'); // Redireciona se o ID não existir
      } finally {
        setLoading(false);
      }
    }
    getItem();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Carregando Espaço...</p>
        </div>
      </div>
    );
  }

  const handleContact = () => {
    const message = encodeURIComponent(`Olá! Vi o anúncio de "${item.nome}" no EventlyHub e gostaria de saber mais sobre a disponibilidade.`);
    window.open(`https://wa.me/5527999999999?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
      {/* Botão Voltar */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 mb-8 font-bold hover:text-indigo-600 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Voltar para a busca
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Lado Esquerdo: Conteúdo Principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Galeria/Imagem Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white"
          >
            <img 
              src={item.imagem_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3'} 
              className="w-full h-full object-cover" 
              alt={item.nome}
            />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl font-black text-indigo-600 shadow-xl flex items-center gap-2">
              <ShieldCheck size={20} /> Fornecedor Verificado
            </div>
          </motion.div>
          
          {/* Informações do Local */}
          <div className="glass-card p-10 bg-white border-white/20">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                {item.nome}
              </h1>
              <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 px-4 py-2 rounded-xl">
                <Star size={20} fill="currentColor"/> 4.9
              </div>
            </div>

            <div className="flex items-center gap-6 text-slate-500 font-bold mb-10 pb-10 border-b border-slate-100">
              <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                <MapPin size={18} className="text-indigo-500"/> {item.localizacao}
              </span>
              <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                <Users size={18} className="text-indigo-500"/> Até 250 convidados
              </span>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Info size={22} className="text-indigo-600" /> Sobre o espaço
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed italic">
                {item.descricao || "Este espaço exclusivo oferece uma infraestrutura completa para transformar seu evento em uma experiência inesquecível em 2026."}
              </p>
            </div>
          </div>
        </div>

        {/* Lado Direito: Card de Reserva (Sticky) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-32 bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-800">
            <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-2">Investimento</p>
            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-5xl font-black italic">R$ {item.preco}</span>
              <span className="text-slate-400 font-bold">/evento</span>
            </div>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="opacity-60 font-bold flex items-center gap-2 italic">Limpeza inclusa</span>
                <CheckCircle size={18} className="text-green-400" />
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="opacity-60 font-bold flex items-center gap-2 italic">Segurança no local</span>
                <CheckCircle size={18} className="text-green-400" />
              </div>
              <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
                <p className="text-indigo-300 text-sm font-bold leading-tight">
                  ✨ Reserve agora e garanta 10% de desconto para eventos em dias de semana.
                </p>
              </div>
            </div>

            <button 
              onClick={handleContact}
              className="w-full bg-indigo-600 py-6 rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 active:scale-95"
            >
              <MessageCircle size={22} /> Contatar agora
            </button>
            
            <p className="text-center text-slate-500 text-[10px] mt-6 font-bold uppercase tracking-widest">
              Resposta média em menos de 1 hora
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}