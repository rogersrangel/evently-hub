import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  LayoutDashboard, 
  Settings, 
  Calendar, 
  Users, 
  LogOut, 
  ExternalLink, 
  PlusCircle,
  Clock,
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [meuEspaco, setMeuEspaco] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      navigate('/login');
      return;
    }

    setUser(session.user);
    fetchDadosIniciais(session.user.id);
  }

  async function fetchDadosIniciais(userId) {
    try {
      // Usamos .maybeSingle() para não disparar erro caso o usuário não tenha espaço ainda
      const { data: servico, error: errorServico } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (servico) {
        setMeuEspaco(servico);

        const { data: reservas } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('fornecedor_id', servico.id)
          .order('created_at', { ascending: false });

        setAgendamentos(reservas || []);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      // GARANTE que o loading pare, idependente de ter achado dados ou não
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Validando Acesso...</p>
        </div>
      </div>
    );
  }

  // TELA PARA QUEM NÃO TEM ESPAÇO CADASTRADO
  if (!meuEspaco) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 text-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Plus size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">Criar seu Anúncio</h2>
          <p className="text-slate-500 font-bold mb-8 text-sm">Você ainda não possui um espaço ou serviço cadastrado em nossa plataforma.</p>
          
          <button 
            onClick={() => navigate('/registrar')}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100 mb-4"
          >
            Começar Cadastro
          </button>
          
          <button onClick={handleLogout} className="text-slate-400 font-bold text-xs uppercase hover:text-red-500 transition-colors">
            Sair da conta
          </button>
        </div>
      </div>
    );
  }

  // RENDERIZAÇÃO NORMAL DO DASHBOARD (Quando tem espaço)
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-left">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Painel de Controle</h1>
            <p className="text-slate-500 font-bold">Bem-vindo de volta, {user?.email?.split('@')[0]}</p>
          </div>
          
          <div className="flex gap-3">
             <button 
                onClick={() => navigate(`/p/${meuEspaco.id}`)}
                className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-black text-xs uppercase text-slate-600 hover:bg-slate-100 transition-all"
             >
                 <ExternalLink size={16} /> Ver Página
             </button>
             <button 
              onClick={() => navigate(`/editar/${meuEspaco?.id}`)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100"
             >
               <Settings size={16} /> Editar
             </button>
             <button onClick={handleLogout} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={20} />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 text-left">
            <h2 className="flex items-center gap-2 font-black text-slate-400 uppercase text-xs tracking-widest">
              <Calendar size={16} /> Pedidos Recentes
            </h2>
            
            {agendamentos.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 p-12 rounded-[2.5rem] text-center">
                <p className="font-bold text-slate-400">Nenhuma reserva encontrada ainda.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {agendamentos.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <Users size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">{item.cliente_nome}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                          <Clock size={12} /> {new Date(item.data_evento).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                      item.status === 'confirmado' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6 text-left">
            <h2 className="font-black text-slate-400 uppercase text-xs tracking-widest">Status do Espaço</h2>
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
               <p className="text-indigo-200 font-bold text-xs uppercase mb-1">Total de Reservas</p>
               <h4 className="text-5xl font-black mb-6 tracking-tighter">{agendamentos.length}</h4>
               <div className="w-full h-1 bg-white/20 rounded-full">
                  <div className="w-full h-full bg-white"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}