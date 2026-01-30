import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, LayoutDashboard, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [meusServicos, setMeusServicos] = useState([]);

  useEffect(() => {
    const fetchMeusDados = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('fornecedores').select('*').eq('user_id', user.id);
        setMeusServicos(data || []);
      }
    };
    fetchMeusDados();
  }, []);

  

 // Função para remover um serviço do banco e da tela
  const deleteService = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este anúncio?")) {
      const { error } = await supabase
        .from('fornecedores')
        .delete()
        .eq('id', id);

      if (error) {
        alert("Erro ao deletar: " + error.message);
      } else {
        // Atualiza a lista na tela removendo o item deletado
        setMeusServicos(prev => prev.filter(s => s.id !== id));
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600"><LayoutDashboard size={28}/></div>
          Meus Anúncios
        </h1>
        <Link to="/registrar" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <Plus size={20} /> Novo Espaço
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meusServicos.map(s => (
          <div key={s.id} className="glass-card p-6 flex items-center gap-6 border-white/40">
            <img src={s.imagem_url} className="w-24 h-24 rounded-2xl object-cover" />
            <div className="flex-1">
              <h3 className="text-xl font-black text-slate-900">{s.nome}</h3>
              <p className="text-slate-500 font-bold text-sm">{s.localizacao}</p>
            </div>
            <div className="text-right">
              <p className="text-indigo-600 font-black mb-2 text-lg">R$ {s.preco}</p>
              <button 
              onClick={() => deleteService(s.id)}
              className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 size={20}/>
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}