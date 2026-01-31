import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, CalendarCheck, Users } from 'lucide-react';

export default function FinanceiroStats({ agendamentos = [] }) {
  const stats = useMemo(() => {
    const confirmados = agendamentos.filter(a => a.status === 'confirmado');
    const totalFaturado = confirmados.reduce((acc, curr) => acc + (Number(curr.valor_total) || 0), 0);
    const totalEventos = agendamentos.length;
    const confirmadosCount = confirmados.length;
    
    return {
      faturamento: totalFaturado,
      totalEventos,
      confirmados: confirmadosCount,
      ticketMedio: confirmadosCount > 0 ? totalFaturado / confirmadosCount : 0,
      pendentes: agendamentos.filter(a => a.status === 'pendente').length
    };
  }, [agendamentos]);

  const cards = [
    { 
      label: 'Faturamento Confirmado', 
      value: `R$ ${stats.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      icon: <DollarSign size={24} />, 
      color: 'from-emerald-500 to-green-600',
      bgColor: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-700'
    },
    { 
      label: 'Total de Eventos', 
      value: stats.totalEventos, 
      icon: <CalendarCheck size={24} />, 
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-50',
      textColor: 'text-indigo-700'
    },
    { 
      label: 'Ticket Médio', 
      value: `R$ ${stats.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      icon: <TrendingUp size={24} />, 
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50',
      textColor: 'text-amber-700'
    },
    { 
      label: 'Pendentes de Confirmação', 
      value: stats.pendentes, 
      icon: <Users size={24} />, 
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      textColor: 'text-red-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`bg-gradient-to-br ${card.bgColor} p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all`}
        >
          <div className={`bg-gradient-to-br ${card.color} p-4 rounded-2xl text-white w-fit mb-6 shadow-lg`}>
            {card.icon}
          </div>
          <p className={`text-[10px] font-black uppercase tracking-widest ${card.textColor} mb-2`}>{card.label}</p>
          <p className={`text-3xl font-black ${card.textColor}`}>{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}