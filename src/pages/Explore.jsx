import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Filter, Search } from 'lucide-react'; // Adicionado o ícone Search

export default function Explore() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState(''); // [LINHA ADICIONADA] Estado para o texto da busca

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

  // [BLOCO ADICIONADO] Lógica que filtra a lista original baseada no que o usuário digita
  const servicosFiltrados = servicos.filter(s => 
    s.nome.toLowerCase().includes(busca.toLowerCase()) || 
    s.localizacao?.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="h-20 w-64 bg-slate-200 animate-pulse rounded-2xl mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[400px] bg-slate-200 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Explorar</h1>
          <p className="text-slate-500 font-medium mt-2">Descubra os espaços mais incríveis para o seu próximo evento.</p>
        </div>

        {/* [BLOCO ADICIONADO] Barra de Busca Visual */}
        <div className="flex w-full lg:w-auto gap-4">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Nome ou cidade..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* [ALTERADO] Agora usamos servicosFiltrados em vez de servicos */}
      {servicosFiltrados.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">Nenhum resultado para "{busca}".</p>
          <button onClick={() => setBusca('')} className="text-indigo-600 font-black mt-2 underline">Limpar busca</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicosFiltrados.map((s, index) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }} // Delay mais rápido para busca fluida
              className="group glass-card overflow-hidden hover:shadow-2xl transition-all border-white/40 bg-white"
            >
              <Link to={`/detalhes/${s.id}`}>
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={s.imagem_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={s.nome}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-indigo-600 shadow-xl">
                    R$ {s.preco}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 truncate">{s.nome}</h3>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-4">
                    <MapPin size={16} className="text-indigo-500" /> {s.localizacao || 'Localização não informada'}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-yellow-500 font-bold">
                      <Star size={16} fill="currentColor"/> 4.9
                    </span>
                    <span className="text-indigo-600 font-black text-sm uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      Ver detalhes
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}