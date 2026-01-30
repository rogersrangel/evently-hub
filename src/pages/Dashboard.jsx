import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('fornecedores').select('*');
      setServicos(data || []);
    };
    getData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
          <LayoutDashboard className="text-indigo-600" /> Meu Painel
        </h1>
        <Link to="/registrar" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
          <Plus size={20} /> Novo Espaço
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {servicos.map(s => (
          <div key={s.id} className="glass-card p-8 border-white/40">
            <h3 className="text-2xl font-black text-slate-900 mb-2">{s.nome}</h3>
            <p className="text-slate-500 font-medium mb-4">{s.localizacao}</p>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="font-black text-indigo-600">R$ {s.preco}</span>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Ativo</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}