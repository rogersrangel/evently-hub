import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Plus, 
  LogOut, 
  TrendingUp, 
  MapPin, 
  Clock,
  ExternalLink,
  PlusCircle
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [fornecedor, setFornecedor] = useState(null);
  const [agendamentosComoCliente, setAgendamentosComoCliente] = useState([]);
  const [pedidosComoAnunciante, setPedidosComoAnunciante] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      // 1. Verificar Usuário
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        navigate('/auth');
        return;
      }
      setUser(authUser);

      // 2. Buscar dados de Anunciante (SaaS)
      const { data: fData } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();
      
      setFornecedor(fData);

      // 3. Buscar Reservas que EU fiz (Cliente)
      const { data: aCliente } = await supabase
        .from('agendamentos')
        .select('*, fornecedores(nome, localizacao)')
        .eq('user_id', authUser.id);
      setAgendamentosComoCliente(aCliente || []);

      // 4. Buscar Pedidos que RECEBI (se eu for fornecedor)
      if (fData) {
        const { data: aAnunciante } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('fornecedor_id', fData.id);
        setPedidosComoAnunciante(aAnunciante || []);
      }

    } catch (error) {
      console.error("Erro no Dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-slate-400 italic animate-pulse">
        VALIDANDO ACESSO...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 text-left">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER DASHBOARD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900">Meu Painel</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Gerenciamento Evently Hub</p>
          </div>
          <div className="flex gap-3">
            {!fornecedor && (
              <button 
                onClick={() => navigate('/registrar')}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <PlusCircle size={18} /> Criar Anúncio
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="p-3 bg-white text-red-500 rounded-2xl border border-slate-100 hover:bg-red-50 transition-all shadow-sm"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA: DADOS DO SAAS (ANUNCIANTE) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CARD DO ANÚNCIO ATIVO */}
            {fornecedor ? (
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative group">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-48 h-48 rounded-[2rem] overflow-hidden">
                    <img src={fornecedor.imagem_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Capa"/>
                  </div>
                  <div className="flex-1">
                    <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Anúncio Ativo</span>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">{fornecedor.nome}</h2>
                    <p className="flex items-center gap-1 text-slate-400 font-bold text-sm mb-6"><MapPin size={14}/> {fornecedor.localizacao}</p>
                    <div className="flex gap-4">
                       <div className="bg-slate-50 p-4 rounded-2xl flex-1 text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Reservas</p>
                          <p className="text-2xl font-black text-slate-900">{pedidosComoAnunciante.length}</p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-2xl flex-1 text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Preço/Dia</p>
                          <p className="text-2xl font-black text-slate-900">R$ {fornecedor.preco}</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 p-12 rounded-[3rem] text-center">
                <TrendingUp size={48} className="mx-auto text-indigo-300 mb-4" />
                <h3 className="text-xl font-black text-indigo-900 uppercase italic">Comece a faturar</h3>
                <p className="text-indigo-600/60 font-bold text-sm mb-6">Você ainda não tem um espaço cadastrado em nossa vitrine.</p>
                <button onClick={() => navigate('/registrar')} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">Anunciar meu Espaço</button>
              </div>
            )}

            {/* LISTA DE AGENDAMENTOS COMO CLIENTE */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Calendar size={16} /> Minhas Solicitações de Reserva
              </h3>
              
              {agendamentosComoCliente.length === 0 ? (
                <p className="text-slate-300 italic font-bold py-10 text-center">Nenhuma reserva feita ainda.</p>
              ) : (
                <div className="space-y-4">
                  {agendamentosComoCliente.map(reserva => (
                    <div key={reserva.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm"><Calendar className="text-indigo-600" size={20}/></div>
                        <div>
                          <p className="font-black text-slate-900 uppercase text-sm tracking-tight">{reserva.fornecedores?.nome}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase italic">{new Date(reserva.data).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        reserva.status === 'confirmado' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {reserva.status || 'Pendente'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLUNA DIREITA: ESTATÍSTICAS RÁPIDAS */}
          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 italic underline underline-offset-8">Status Global</h4>
              <div className="space-y-8">
                <div>
                  <p className="text-4xl font-black tracking-tighter">0{agendamentosComoCliente.length}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Locações Realizadas</p>
                </div>
                <div className="pt-8 border-t border-slate-800">
                  <p className="text-4xl font-black tracking-tighter">R$ 0,00</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Gasto/Recebido</p>
                </div>
              </div>
              <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Ver Relatório Completo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}