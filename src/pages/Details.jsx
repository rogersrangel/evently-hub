import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { MapPin, Star, Users, ArrowLeft, Wifi, Car, Snowflake, UtensilsCrossed, Waves, Flame, MessageCircle } from 'lucide-react';

const iconMap = {
  piscina: <Waves size={20} />,
  churrasqueira: <Flame size={20} />,
  cozinha: <UtensilsCrossed size={20} />,
  estacionamento: <Car size={20} />,
  ar_condicionado: <Snowflake size={20} />,
  wifi: <Wifi size={20} />
};

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      const { data } = await supabase.from('fornecedores').select('*').eq('id', id).single();
      setItem(data);
      setLoading(false);
    }
    fetchDetails();
  }, [id]);

  if (loading) return <div className="pt-32 text-center font-black animate-pulse text-slate-400">CARREGANDO...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-6 py-12 pt-32"
    >
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 mb-8 font-bold hover:text-indigo-600 transition-all">
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Animação Hero na Imagem */}
          <motion.div 
            initial={{ clipPath: 'inset(10% 10% 10% 10% round 3rem)', opacity: 0 }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 3rem)', opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-[500px] overflow-hidden shadow-2xl bg-slate-200"
          >
            <img src={item.imagem_url} className="w-full h-full object-cover" alt={item.nome} />
          </motion.div>

          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-10 bg-white"
          >
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{item.nome}</h1>
              <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 px-4 py-2 rounded-xl">
                <Star size={20} fill="currentColor"/> 4.9
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-10 pb-10 border-b border-slate-100">
              <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl font-bold text-slate-500">
                <MapPin size={18} className="text-indigo-500" /> {item.localizacao}
              </span>
              <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl font-bold text-slate-500">
                <Users size={18} className="text-indigo-500" /> Até {item.capacidade_max} pessoas
              </span>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black">Comodidades</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {item.comodidades && Object.entries(item.comodidades).map(([key, value]) => (
                  value && (
                    <motion.div 
                      key={key} 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl text-indigo-700 font-bold border border-indigo-100"
                    >
                      {iconMap[key]}
                      <span className="capitalize">{key.replace('_', ' ')}</span>
                    </motion.div>
                  )
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.aside 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", delay: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-32 bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl">
            <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-2 text-center">Valor do Aluguel</p>
            <div className="text-center mb-10">
              <span className="text-5xl font-black italic">R$ {item.preco}</span>
              <p className="text-slate-400 font-bold text-sm">por {item.periodo_aluguel}</p>
            </div>

            <button 
              onClick={() => window.open(`https://wa.me/550000000000?text=Olá! Vi o anúncio de ${item.nome}`, '_blank')}
              className="w-full bg-indigo-600 py-6 rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 active:scale-95"
            >
              <MessageCircle size={22} /> Contatar Agora
            </button>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}