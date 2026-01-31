import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  TrendingUp, 
  MapPin,
  PlusCircle,
  Edit2,
  Eye,
  Settings
} from 'lucide-react';
import CalendarView from '../components/SaaS/CalendarView';
import FinanceiroStats from '../components/SaaS/FinanceiroStats';
import UserSettings from '../components/SaaS/UserSettings';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, calendario, financeiro, configuracoes
  const [user, setUser] = useState(null);
  const [fornecedor, setFornecedor] = useState(null);
  const [agendamentosComoCliente, setAgendamentosComoCliente] = useState([]);
  const [pedidosComoAnunciante, setPedidosComoAnunciante] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError('');
      
      // 1. Verificar Usuário
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        navigate('/auth');
        return;
      }
      setUser(authUser);

      // 2. Buscar dados de Anunciante (SaaS)
      const { data: fData, error: fError } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();
      
      if (fError) console.error('Erro ao buscar fornecedor:', fError);
      setFornecedor(fData);

      // 3. Buscar Reservas que EU fiz (Cliente)
      const { data: aCliente, error: acError } = await supabase
        .from('agendamentos')
        .select('*, fornecedores(nome, localizacao)')
        .eq('user_id', authUser.id)
        .order('data_evento', { ascending: false });
      
      if (acError) console.error('Erro ao buscar agendamentos cliente:', acError);
      setAgendamentosComoCliente(aCliente || []);

      // 4. Buscar Pedidos que RECEBI (se eu for fornecedor)
      if (fData?.id) {
        const { data: aAnunciante, error: aaError } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('fornecedor_id', fData.id)
          .order('data_evento', { ascending: false });
        
        if (aaError) console.error('Erro ao buscar agendamentos anunciante:', aaError);
        setPedidosComoAnunciante(aAnunciante || []);
      }

    } catch (error) {
      setError('Erro ao carregar dados: ' + error.message);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full" />
      </div>
    );
  }

  const tabButtons = fornecedor ? [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'calendario', label: 'Calendário', icon: '📅' },
    { id: 'financeiro', label: 'Financeiro', icon: '💰' },
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' }
  ] : [
    { id: 'overview', label: 'Minhas Reservas', icon: '📊' },
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 pt-28 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase bg-gradient-to-r from-slate-900 via-indigo-600 to-slate-900 bg-clip-text text-transparent">
              Painel de Controle
            </h1>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em] mt-2">Gerencie seus eventos e reservas</p>
          </div>
          <div className="flex gap-3">
            {!fornecedor && (
              <button 
                onClick={() => navigate('/registrar')}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
              >
                <PlusCircle size={18} /> Anunciar Espaço
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="p-3 bg-white text-red-500 rounded-2xl border border-slate-200 hover:bg-red-50 transition-all shadow-sm hover:shadow-md"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </motion.div>

        {/* ERROR MESSAGE */}
        {error && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-bold text-sm mb-6">
            {error}
          </motion.div>
        )}

        {/* SPACE CARD - ANUNCIANTE */}
        {fornecedor && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-8 p-8 items-stretch">
                <div className="w-full md:w-64 h-64 rounded-[2rem] overflow-hidden flex-shrink-0">
                  <img src={fornecedor.imagem_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={fornecedor.nome}/>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">✓ Espaço Ativo</span>
                    <h2 className="text-4xl font-black text-slate-900 mb-3">{fornecedor.nome}</h2>
                    <p className="flex items-center gap-2 text-slate-600 font-bold text-sm mb-6">
                      <MapPin size={16} className="text-indigo-600"/> {fornecedor.localizacao}
                    </p>
                    {fornecedor.descricao && <p className="text-slate-600 font-medium text-sm mb-6 line-clamp-2">{fornecedor.descricao}</p>}
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-[1.5rem] flex-1">
                      <p className="text-[10px] font-black text-emerald-700 uppercase">Agendamentos</p>
                      <p className="text-3xl font-black text-emerald-700 mt-2">{pedidosComoAnunciante.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-[1.5rem] flex-1">
                      <p className="text-[10px] font-black text-indigo-700 uppercase">Preço/Dia</p>
                      <p className="text-3xl font-black text-indigo-700 mt-2">R$ {parseFloat(fornecedor.preco).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => navigate(`/editar/${fornecedor.id}`)} className="p-3 bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 rounded-xl transition-all font-bold" title="Editar">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => navigate(`/detalhes/${fornecedor.id}`)} className="p-3 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-xl transition-all font-bold" title="Ver Públic">
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* NO SPACE MESSAGE */}
        {!fornecedor && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 border-2 border-dashed border-indigo-200 p-16 rounded-[3rem] text-center">
              <TrendingUp size={56} className="mx-auto text-indigo-400 mb-6" />
              <h3 className="text-2xl font-black text-indigo-900 uppercase mb-3">Comece a Faturar</h3>
              <p className="text-indigo-700 font-bold text-sm mb-8 max-w-md mx-auto">Você ainda não tem um espaço cadastrado. Anuncie seu espaço agora e comece a receber solicitações!</p>
              <button onClick={() => navigate('/registrar')} className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95">
                Anunciar Meu Espaço
              </button>
            </div>
          </motion.div>
        )}

        {/* TABS */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabButtons.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* CONTENT TABS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={activeTab}>
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* STATS */}
              {fornecedor && <FinanceiroStats agendamentos={pedidosComoAnunciante} />}
              
              {/* MINHA S RESERVAS COMO CLIENTE */}
              {agendamentosComoCliente.length > 0 && (
                <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 uppercase mb-8 flex items-center gap-2">
                    📅 Minhas Reservas Feitas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agendamentosComoCliente.slice(0, 6).map(reserva => (
                      <motion.div key={reserva.id} whileHover={{ scale: 1.02 }} className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2rem] border border-slate-200 hover:border-indigo-300 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-black text-slate-900 text-sm uppercase">{reserva.fornecedores?.nome}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">{reserva.fornecedores?.localizacao}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            reserva.status === 'confirmado' ? 'bg-emerald-100 text-emerald-700' : reserva.status === 'cancelado' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {reserva.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-slate-600">📅 {new Date(reserva.data_evento).toLocaleDateString('pt-BR')}</span>
                          {reserva.valor_total && <span className="font-black text-indigo-600">R$ {parseFloat(reserva.valor_total).toLocaleString('pt-BR')}</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* AGENDAMENTOS PENDENTES - ANUNCIANTE */}
              {fornecedor && pedidosComoAnunciante.length > 0 && (
                <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 uppercase mb-8 flex items-center gap-2">
                    📨 Agendamentos Pendentes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pedidosComoAnunciante.filter(a => a.status === 'pendente').slice(0, 6).map(agendamento => (
                      <motion.div key={agendamento.id} whileHover={{ scale: 1.02 }} className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-[2rem] border border-amber-200">
                        <p className="font-black text-amber-900 text-sm uppercase mb-2">👤 {agendamento.cliente_nome}</p>
                        <p className="text-[10px] font-bold text-amber-700">📱 {agendamento.cliente_zap}</p>
                        <p className="text-[10px] font-bold text-amber-700 mt-2">📅 {new Date(agendamento.data_evento).toLocaleDateString('pt-BR')}</p>
                        {agendamento.valor_total && <p className="text-[10px] font-bold text-amber-700 mt-2">💰 R$ {parseFloat(agendamento.valor_total).toLocaleString('pt-BR')}</p>}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CALENDARIO TAB */}
          {activeTab === 'calendario' && fornecedor && (
            <CalendarView fornecedorId={fornecedor.id} />
          )}

          {/* FINANCEIRO TAB */}
          {activeTab === 'financeiro' && fornecedor && (
            <div className="space-y-8">
              <FinanceiroStats agendamentos={pedidosComoAnunciante} />
              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 uppercase mb-6">📋 Histórico de Agendamentos</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left p-4 font-black text-slate-600 uppercase text-[10px]">Cliente</th>
                        <th className="text-left p-4 font-black text-slate-600 uppercase text-[10px]">Data</th>
                        <th className="text-left p-4 font-black text-slate-600 uppercase text-[10px]">Valor</th>
                        <th className="text-left p-4 font-black text-slate-600 uppercase text-[10px]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidosComoAnunciante.map(agendamento => (
                        <tr key={agendamento.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-bold text-slate-900">{agendamento.cliente_nome}</td>
                          <td className="p-4 font-bold text-slate-600">{new Date(agendamento.data_evento).toLocaleDateString('pt-BR')}</td>
                          <td className="p-4 font-black text-indigo-600">R$ {parseFloat(agendamento.valor_total || 0).toLocaleString('pt-BR')}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              agendamento.status === 'confirmado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {agendamento.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CONFIGURACOES TAB */}
          {activeTab === 'configuracoes' && (
            <UserSettings />
          )}
        </motion.div>
      </div>
    </div>
  );
}