import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Explore() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados no Supabase ao carregar
  useEffect(() => {
    const fetchFornecedores = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*');

      if (!error) setFornecedores(data);
      setLoading(false);
    };

    fetchFornecedores();
  }, []);

  if (loading) return <div className="p-20 text-center font-bold">Carregando eventos...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Descubra Espaços Incríveis</h1>
        <p className="text-gray-500 mt-2">Os melhores buffets e salões para sua festa em 2026.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {fornecedores.map((f) => (
          <div key={f.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={f.imagens?.[0] || 'https://via.placeholder.com/600x400?text=Sem+Imagem'} 
                alt={f.nome}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase text-indigo-600">
                {f.tipo}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800">{f.nome}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-sm text-gray-500 font-medium">A partir de</span>
                <span className="text-2xl font-black text-indigo-600">R$ {f.preco}</span>
              </div>
              <button className="w-full mt-6 bg-gray-900 text-white py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-colors">
                Ver Portfólio Completo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}