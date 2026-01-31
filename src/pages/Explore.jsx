import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Filter, Search, Waves, Flame, Snowflake, Wifi } from 'lucide-react';

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

  // Lógica de filtragem combinada (Busca por texto + Categoria)
  const servicosFiltrados = servicos.filter(s => {
    const matchesBusca = s.nome.toLowerCase().includes(busca.toLowerCase()) || 
                         s.localizacao?.toLowerCase().includes(busca.toLowerCase());
    
    const matchesCategoria = filtroComodidade 
      ? s.comodidades?.[filtroComodidade] === true 
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
      className="max-w-7xl mx-auto px-6 py-12 pt-32"
    >
      <header className="space-y-8 mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Explorar</h1>
            <p className="text-slate-500 font-medium mt-2">Os melhores espaços para o seu evento.</p>
          </div>

          <div className="flex w-full lg:w-auto gap-4">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Onde será o evento?"
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Barra de Categorias Animada */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <button 
            onClick={() => setFiltroComodidade(null)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-all whitespace-nowrap ${!filtroComodidade ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}
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
          {servicosFiltrados.map((s, index) => (
            <motion.div 
              layout
              key={s.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <Link to={`/detalhes/${s.id}`}>
                <div className="glass-card overflow-hidden bg-white rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all border border-slate-100">
                  <div className="h-64 overflow-hidden relative">
                    <img src={s.imagem_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={s.nome} />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-indigo-600 shadow-xl">
                      R$ {s.preco}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-slate-900 mb-2 truncate">{s.nome}</h3>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <MapPin size={16} className="text-indigo-500" /> {s.localizacao}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {servicosFiltrados.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <p className="text-slate-400 font-black text-xl italic">Nenhum espaço encontrado com esses critérios... 🏖️</p>
        </motion.div>
      )}
    </motion.div>
  );
}