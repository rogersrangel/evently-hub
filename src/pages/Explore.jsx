import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

export default function Explore() {
    const [fornecedores, setFornecedores] = useState([]);
    const [busca, setBusca] = useState(''); // Estado para o texto da busca
    const [precoMax, setPrecoMax] = useState(10000); // Estado para o filtro de preço
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFornecedores() {
            setLoading(true);
            const { data, error } = await supabase.from('fornecedores').select('*');
            if (!error) setFornecedores(data);
            setLoading(false);
        }
        fetchFornecedores();
    }, []);

    // Lógica de Filtro: Filtra a lista original baseado no que o usuário digita
    const fornecedoresFiltrados = fornecedores.filter(f => {
        const matchesBusca = f.nome.toLowerCase().includes(busca.toLowerCase());
        const matchesPreco = f.preco <= precoMax;
        return matchesBusca && matchesPreco;
    });

    if (loading) return <div className="p-20 text-center font-medium">Sincronizando com o banco...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* SEÇÃO DE FILTROS - Estilo SaaS Moderno */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">O que você procura?</label>
                    <input
                        type="text"
                        placeholder="Ex: Buffet de Churrasco, Salão Nobre..."
                        className="w-full p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                <div className="w-full md:w-64">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preço máximo: R$ {precoMax}</label>
                    <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        value={precoMax}
                        onChange={(e) => setPrecoMax(Number(e.target.value))}
                    />
                </div>
            </div>

            {/* GRID DE RESULTADOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {fornecedoresFiltrados.map((f) => (
                    <div key={f.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                        <div className="relative h-56 overflow-hidden">
                            <img
                                src={f.imagens?.[0] || 'https://via.placeholder.com/400'}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800">{f.nome}</h3>
                            <p className="text-indigo-600 font-black text-2xl mt-2">R$ {f.preco}</p>
                            <button className="w-full mt-4 bg-indigo-50 text-indigo-600 py-3 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all">

                                <Link
                                    to={`/fornecedor/${f.id}`}
                                    className="w-full mt-4 block text-center bg-indigo-50 text-indigo-600 py-3 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all"
                                >
                                    Ver Detalhes
                                </Link>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {fornecedoresFiltrados.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg italic">Nenhum fornecedor encontrado com esses filtros.</p>
                </div>
            )}
        </div>
    );
}