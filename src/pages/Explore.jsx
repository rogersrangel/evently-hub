import { useState } from 'react';

export default function Explore() {
  // Lista fictícia de fornecedores (SaaS Real)
  const [fornecedores] = useState([
    { 
      id: 1, 
      nome: "Buffet Gourmet", 
      tipo: "buffet", 
      preco: 1500, 
      imagem: "https://images.unsplash.com/photo-1555244162-803834f70033?w=500" 
    },
    { 
      id: 2, 
      nome: "Espaço Jardins", 
      tipo: "espaco", 
      preco: 3000, 
      imagem: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500" 
    },
    { 
      id: 3, 
      nome: "Salão Nobre", 
      tipo: "espaco", 
      preco: 5000, 
      imagem: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500" 
    }
  ]);

  const [filtro, setFiltro] = useState('todos');

  // Filtra a lista baseada na escolha do usuário
  const listaFiltrada = filtro === 'todos' 
    ? fornecedores 
    : fornecedores.filter(f => f.tipo === filtro);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Encontre o local ideal</h1>
        
        {/* Filtros Simples */}
        <div className="flex gap-2">
          {['todos', 'buffet', 'espaco'].map(t => (
            <button
              key={t}
              onClick={() => setFiltro(t)}
              className={`px-4 py-2 rounded-full capitalize text-sm font-medium transition ${
                filtro === t ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {listaFiltrada.map(fornecedor => (
          <div key={fornecedor.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl mb-3">
              <img 
                src={fornecedor.imagem} 
                alt={fornecedor.nome}
                className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-700 shadow-sm">
                {fornecedor.tipo}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{fornecedor.nome}</h3>
            <p className="text-gray-500">A partir de <span className="text-indigo-600 font-semibold">R$ {fornecedor.preco}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}