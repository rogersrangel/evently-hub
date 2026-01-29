import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Explore() {
  const [fornecedores, setFornecedores] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Função assíncrona para ler o banco
  const fetchFornecedores = async () => {
    try {
      setCarregando(true);
      // Aqui o Supabase faz o "SELECT * FROM fornecedores"
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*');

      if (error) throw error;
      setFornecedores(data);
    } catch (err) {
      console.error("Erro na busca:", err.message);
    } finally {
      setCarregando(false);
    }
  };

  // Dispara a função uma única vez ao carregar a página
  useEffect(() => {
    fetchFornecedores();
  }, []);

  if (carregando) return <div className="p-10 text-center">Carregando eventos...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Fornecedores Disponíveis</h1>
      
      {fornecedores.length === 0 ? (
        <p className="text-gray-500">Nenhum fornecedor cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fornecedores.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              {/* Mostra a primeira imagem do array que salvamos */}
              <img 
                src={item.imagens?.[0] || 'https://via.placeholder.com/400x250'} 
                className="w-full h-48 object-cover"
                alt={item.nome}
              />
              <div className="p-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{item.tipo}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{item.nome}</h3>
                <p className="text-gray-600 mt-2 font-medium">R$ {item.preco}</p>
                <button className="mt-4 w-full py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg font-bold hover:bg-indigo-600 hover:text-white transition">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}