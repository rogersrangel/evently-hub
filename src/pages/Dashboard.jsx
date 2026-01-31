import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Users, LogOut, Store, ExternalLink, Calendar } from 'lucide-react';
import CalendarView from '../components/SaaS/CalendarView';
import FinanceiroStats from '../components/SaaS/FinanceiroStats';

export default function Dashboard() {
  const navigate = useNavigate();
  const [meusServicos, setMeusServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicoAtivo, setServicoAtivo] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  async function carregarDadosIniciais() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('fornecedores').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setMeusServicos(data || []);
      if (data?.length > 0) setServicoAtivo(data[0]);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (servicoAtivo) fetchDadosSaaS();
  }, [servicoAtivo]);

  async function fetchDadosSaaS() {
    const { data } = await supabase.from('agendamentos').select('*').eq('fornecedor_id', servicoAtivo.id).order('data_evento', { ascending: true });
    setAgendamentos(data || []);
  }

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-indigo-600">CARREGANDO...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto">
        
        {/* REMOVEMOS O HEADER REPETIDO DAQUI */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">

          {/* SIDEBAR COM NAVEGAÇÃO DE LOCAIS */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Meus Anúncios</h3>
                <Link to="/registrar" className="text-indigo-600 hover:scale-110 transition-transform"><Plus size={20}/></Link>
              </div>
              
              <div className="space-y-2">
                {meusServicos.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setServicoAtivo(item)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border-2 ${servicoAtivo?.id === item.id
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <img src={item.imagem_url} className="w-10 h-10 rounded-lg object-cover" />
                    <p className="font-black text-xs truncate">{item.nome}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* BOTÃO DE REGISTRO RÁPIDO SE ESTIVER VAZIO */}
            {meusServicos.length === 0 && (
              <Link to="/registrar" className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-indigo-100 uppercase">
                <Plus size={16} /> Novo Anúncio
              </Link>
            )}
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {servicoAtivo ? (
                <motion.div key={servicoAtivo.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  
                  {/* TÍTULO DO LOCAL ATUAL */}
                  <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-indigo-100">
                        <Store size={20} />
                      </div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">{servicoAtivo.nome}</h2>
                    </div>
                    <Link to={`/editar/${servicoAtivo.id}`} className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <Settings size={20} />
                    </Link>
                  </div>

                  <FinanceiroStats agendamentos={agendamentos} />

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2">
                      <CalendarView fornecedorId={servicoAtivo.id} />
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h3 className="font-black text-slate-900 flex items-center gap-2 mb-6 text-xs uppercase tracking-widest">
                          <Users size={16} className="text-indigo-600" /> Contatos Recentes
                        </h3>
                        <div className="space-y-3">
                          {agendamentos.slice(0, 3).map(a => (
                            <div key={a.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                              <div>
                                <p className="font-black text-slate-900 text-sm">{a.cliente_nome}</p>
                                <p className="text-[10px] text-indigo-600 font-bold uppercase">{a.data_evento}</p>
                              </div>
                              <Calendar size={14} className="text-slate-300" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Link da Vitrine */}
                      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Link do seu Site</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/p/${servicoAtivo.id}`);
                            alert("Copiado!");
                          }}
                          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase hover:bg-indigo-500 transition-all mb-4 shadow-lg shadow-indigo-900/20"
                        >
                          Copiar URL
                        </button>
                        <Link to={`/p/${servicoAtivo.id}`} target="_blank" className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">
                          Ver Vitrine <ExternalLink size={12}/>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="py-20 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-black">Nenhum local selecionado.</p>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}