import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, MapPin, Star, Users, CheckCircle, Calendar } from 'lucide-react';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const getItem = async () => {
      const { data } = await supabase.from('fornecedores').select('*').eq('id', id).single();
      setItem(data);
    };
    getItem();
  }, [id]);

  if (!item) return <div className="pt-32 text-center">Buscando detalhes...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 mb-8 font-bold hover:text-indigo-600 transition-colors">
        <ArrowLeft size={20} /> Voltar para busca
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl">
            <img src={item.imagem_url} className="w-full h-full object-cover" />
          </div>
          
          <div className="glass-card p-10 border-white/20">
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">{item.nome}</h1>
            <div className="flex items-center gap-6 text-slate-500 font-bold mb-8">
              <span className="flex items-center gap-1"><MapPin size={18}/> {item.localizacao}</span>
              <span className="flex items-center gap-1 text-yellow-500"><Star size={18} fill="currentColor"/> 4.9 (12 avaliações)</span>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed pt-8 border-t border-slate-100">
              {item.descricao || "Nenhuma descrição fornecida para este espaço premium."}
            </p>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-32 bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl">
            <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-2">Valor da Reserva</p>
            <h2 className="text-5xl font-black italic mb-10">R$ {item.preco}</h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="opacity-60 font-bold flex items-center gap-2"><Users size={18}/> Capacidade</span>
                <span className="font-black">Até 300 pessoas</span>
              </div>
              <div className="flex items-center gap-3 text-indigo-300 font-bold">
                <CheckCircle size={20}/> Cancelamento Grátis
              </div>
            </div>

            <button className="w-full bg-indigo-600 py-6 rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3">
              <Calendar size={22} /> Reservar Data
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}