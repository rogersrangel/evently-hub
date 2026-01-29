import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Details() {
  const { id } = useParams(); // Pega o ID da URL
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('id', id) // Busca exatamente este ID
        .single(); // Retorna apenas um objeto, não uma lista

      if (!error) setItem(data);
      setLoading(false);
    }
    fetchItem();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Carregando detalhes...</div>;
  if (!item) return <div className="p-20 text-center">Fornecedor não encontrado.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Grade de Imagens Estilo Profissional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px] mb-8">
        <div className="h-full">
          <img src={item.imagens?.[0]} className="w-full h-full object-cover rounded-3xl shadow-lg" alt="Principal" />
        </div>
        <div className="grid grid-cols-2 gap-4 h-full">
          {item.imagens?.slice(1, 5).map((img, idx) => (
            <img key={idx} src={img} className="w-full h-full object-cover rounded-2xl shadow-sm hover:opacity-90 transition cursor-pointer" />
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
            {item.tipo}
          </span>
          <h1 className="text-5xl font-black text-gray-900 mt-4 mb-6">{item.nome}</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Bem-vindo ao {item.nome}. Um espaço preparado para transformar seu evento em uma experiência inesquecível.
            Contamos com infraestrutura completa e suporte especializado.
          </p>
        </div>

        {/* Card de Orçamento (Sticky) */}
        <div className="w-full md:w-96">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 sticky top-10">
            <p className="text-sm text-gray-500 font-bold uppercase">Valor Estimado</p>
            <p className="text-4xl font-black text-indigo-600 mt-2">R$ {item.preco}</p>
            
            <hr className="my-6 border-gray-100" />
            
            <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg transition-all mb-4">
              Solicitar Orçamento
            </button>
            <p className="text-xs text-center text-gray-400">
              Não cobramos taxas de reserva pelo EventlyHub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}