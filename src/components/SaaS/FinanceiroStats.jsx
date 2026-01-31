import { useMemo } from 'react';
import { DollarSign, TrendingUp, Users, CalendarCheck } from 'lucide-react';

export default function FinanceiroStats({ agendamentos }) {
  const stats = useMemo(() => {
    const totalFaturado = agendamentos
      .filter(a => a.status === 'confirmado')
      .reduce((acc, curr) => acc + (Number(curr.valor_total) || 0), 0);

    const totalEventos = agendamentos.length;
    
    return {
      faturamento: totalFaturado,
      quantidade: totalEventos,
      ticketMedio: totalEventos > 0 ? totalFaturado / totalEventos : 0
    };
  }, [agendamentos]);

  const cards = [
    { 
      label: 'Faturamento Mensal', 
      value: `R$ ${stats.faturamento.toLocaleString('pt-BR')}`, 
      icon: <DollarSign size={20} />, 
      color: 'bg-emerald-500' 
    },
    { 
      label: 'Total de Eventos', 
      value: stats.quantidade, 
      icon: <CalendarCheck size={20} />, 
      color: 'bg-indigo-500' 
    },
    { 
      label: 'Ticket Médio', 
      value: `R$ ${stats.ticketMedio.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`, 
      icon: <TrendingUp size={20} />, 
      color: 'bg-amber-500' 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg`}>
            {card.icon}
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{card.label}</p>
            <p className="text-2xl font-black text-slate-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}