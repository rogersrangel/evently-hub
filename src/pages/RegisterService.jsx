import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LayoutDashboard, Calendar, Package, User } from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);
  const [meusAgendamentos, setMeusAgendamentos] = useState([]); // Reservas que EU fiz
  const [pedidosRecebidos, setPedidosRecebidos] = useState([]); // Reservas que recebi no MEU anúncio

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Busca se o usuário é um fornecedor
      const { data: fornecedor } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setPerfil(fornecedor);

      // 2. Busca agendamentos que o usuário fez (Visão Cliente)
      const { data: agendamentosFeitos } = await supabase
        .from('agendamentos')
        .select('*, fornecedores(nome)')
        .eq('user_id', user.id);
      
      setMeusAgendamentos(agendamentosFeitos || []);

      // 3. Se for fornecedor, busca pedidos recebidos (Visão Anunciante)
      if (fornecedor) {
        const { data: pedidos } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('fornecedor_id', fornecedor.id);
        
        setPedidosRecebidos(pedidos || []);
      }

    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="flex justify-center p-20 italic">Carregando painel...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 pt-32">
      <h1 className="text-4xl font-black mb-8 tracking-tighter italic">PAINEL DE CONTROLE</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUNA 1: STATUS DO CLIENTE (O que eu reservei) */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="flex items-center gap-2 font-black uppercase text-xs text-slate-400 mb-6">
              <Calendar size={16}/> Meus Pedidos de Reserva
            </h2>
            {meusAgendamentos.length === 0 ? (
              <p className="text-slate-400 italic text-sm">Você ainda não fez nenhuma reserva.</p>
            ) : (
              <div className="space-y-4">
                {meusAgendamentos.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <p className="font-bold text-slate-800">{item.fornecedores?.nome}</p>
                      <p className="text-[10px] uppercase font-black text-slate-400">{new Date(item.data).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                      item.status === 'confirmado' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {item.status || 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* COLUNA 2: STATUS DO ANUNCIANTE (Só aparece se ele tiver anúncio) */}
        <div className="space-y-6">
          {perfil ? (
            <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-200">
              <p className="text-[10px] font-black uppercase opacity-70 mb-2">Seu Espaço: {perfil.nome}</p>
              <h3 className="text-5xl font-black tracking-tighter mb-4">{pedidosRecebidos.length}</h3>
              <p className="text-xs font-bold uppercase tracking-widest">Reservas Recebidas</p>
              <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase transition-all">
                Gerenciar Anúncio
              </button>
            </div>
          ) : (
            <div className="bg-slate-100 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
              <Package size={40} className="mx-auto text-slate-300 mb-4" />
              <p className="text-sm font-bold text-slate-500 mb-4">Você ainda não anuncia seu espaço.</p>
              <button onClick={() => window.location.href='/registrar'} className="text-[10px] font-black uppercase bg-indigo-600 text-white px-6 py-3 rounded-xl">
                Criar Anúncio Agora
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}