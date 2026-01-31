import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Search, Waves, Flame, Snowflake, Wifi, ArrowRight } from 'lucide-react';

export default function Explore() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroComodidade, setFiltroComodidade] = useState(null);

  const categorias = [
    { id: 'piscina', label: 'Piscina', icon: <Waves size={20} /> },
    { id: 'churrasqueira', label: 'Churrasco', icon: <Flame size={20} /> },
    { id: 'ar_condicionado', label: 'Ar Cond.', icon: <Snowflake size={20} /> },
    { id: 'wifi', label: 'Wi-Fi', icon: <Wifi size={20} /> },
  ];

  useEffect(() => {
    async function fetchServicos() {
      try {
        const { data, error } = await supabase
          .from('fornecedores')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setServicos(data || []);
      } catch (error) {
        console.error('Erro ao buscar dados:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchServicos();
  }, []);

  // Lógica de filtragem combinada
  const servicosFiltrados = servicos.filter(s => {
    const nomeLower = s.nome?.toLowerCase() || '';
    const localLower = s.localizacao?.toLowerCase() || '';
    const buscaLower = busca.toLowerCase();

    const matchesBusca = nomeLower.includes(buscaLower) || localLower.includes(buscaLower);
    
    const matchesCategoria = filtroComodidade 
      ? s.comodidades && s.comodidades[filtroComodidade] === true 
      : true;

    return matchesBusca && matchesCategoria;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
        <div className="h-10 w-48 bg-slate-200 animate-pulse rounded-full mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[400px] bg-slate-200 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-12 pt-32 min-h-screen"
    >
      <header className="space-y-8 mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="text-left">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Explorar</h1>
            <p className="text-slate-500 font-bold mt-2">Os melhores espaços para o seu evento.</p>
          </div>

          <div className="flex w-full lg:w-auto gap-4">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Onde será o evento?"
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold shadow-sm focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Barra de Categorias */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          <button 
            onClick={() => setFiltroComodidade(null)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-all whitespace-nowrap ${!filtroComodidade ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFiltroComodidade(filtroComodidade === cat.id ? null : cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-all whitespace-nowrap ${filtroComodidade === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-200'}`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Grid de Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode='popLayout'>
          {servicosFiltrados.map((s) => (
            <motion.div 
              layout
              key={s.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <Link to={`/p/${s.id}`}>
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full">
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={s.imagem_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={s.nome} 
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-indigo-600 shadow-xl border border-white/20">
                      R$ {s.preco || '0'}
                    </div>
                  </div>
                  
                  <div className="p-8 text-left flex flex-col flex-grow">
                    <h3 className="text-2xl font-black text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors tracking-tight">
                      {s.nome}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-6">
                      <MapPin size={16} className="text-indigo-500 shrink-0" /> 
                      <span className="truncate">{s.localizacao || 'Localização não informada'}</span>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">Ver Detalhes</span>
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {servicosFiltrados.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 mt-8">
          <span className="text-6xl mb-4 block">🏝️</span>
          <p className="text-slate-400 font-black text-xl italic uppercase tracking-tighter">Nenhum espaço encontrado...</p>
          <button 
            onClick={() => {setBusca(''); setFiltroComodidade(null);}}
            className="mt-4 text-indigo-600 font-black text-sm uppercase underline"
          >
            Limpar filtros
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}