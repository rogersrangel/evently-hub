import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AddAgendamentoModal from './AddAgendamentoModal';

export default function CalendarView({ fornecedorId }) {
    // --- ESTADOS DO COMPONENTE ---
    const [currentMonth, setCurrentMonth] = useState(new Date()); // Mês que está sendo exibido
    const [agendamentos, setAgendamentos] = useState([]);        // Dados vindos do Supabase
    const [selectedDate, setSelectedDate] = useState(new Date()); // Data clicada pelo usuário
    const [isModalOpen, setIsModalOpen] = useState(false);        // Controle do Modal de agendamento

    // --- BUSCA DE DADOS ---
    useEffect(() => {
        fetchAgendamentos();
    }, [currentMonth, fornecedorId]); // Recarrega se o mês mudar ou se trocar de serviço

    async function fetchAgendamentos() {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);

        const { data, error } = await supabase
            .from('agendamentos')
            .select('*')
            .eq('fornecedor_id', fornecedorId)
            .gte('data_evento', format(start, 'yyyy-MM-dd'))
            .lte('data_evento', format(end, 'yyyy-MM-dd'));

        if (!error) setAgendamentos(data || []);
    }

    // --- RENDERIZAÇÃO DO CABEÇALHO (Mês e Setas) ---
    const renderHeader = () => (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-3 rounded-2xl text-white">
                    <CalendarIcon size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </h2>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );

    // --- RENDERIZAÇÃO DOS DIAS DA SEMANA (Dom, Seg...) ---
    const renderDays = () => {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map(day => (
                    <div key={day} className="text-center text-[10px] font-black uppercase text-slate-400 tracking-widest py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    // --- RENDERIZAÇÃO DOS QUADRADOS DO CALENDÁRIO ---
    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="grid grid-cols-7 gap-1 bg-slate-100 border border-slate-100 rounded-[2rem] overflow-hidden">
                {calendarDays.map((day, idx) => {
                    // Filtra agendamentos para este dia específico
                    const dayAgendamentos = agendamentos.filter(a => isSameDay(new Date(a.data_evento + 'T12:00:00'), day));
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 0.98 }}
                            onClick={() => setSelectedDate(day)}
                            className={`min-h-[100px] p-2 bg-white cursor-pointer transition-all 
                                ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-900'} 
                                ${isSelected ? 'bg-indigo-50/50 ring-2 ring-inset ring-indigo-600 z-10' : ''}`}
                        >
                            <span className={`text-sm font-black ${isSelected ? 'text-indigo-600' : ''}`}>
                                {format(day, 'd')}
                            </span>

                            {/* Lista de nomes de clientes no quadradinho */}
                            <div className="mt-1 space-y-1">
                                {dayAgendamentos.map(a => (
                                    <div key={a.id} className={`text-[10px] p-1 rounded-md font-bold truncate 
                                        ${a.status === 'confirmado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {a.cliente_nome}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    // --- RETORNO PRINCIPAL DO COMPONENTE ---
    return (
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            {/* Rodapé do Calendário */}
            <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-slate-500 font-medium">
                    Selecionado: <b className="text-slate-900">{format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</b>
                </p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:shadow-lg hover:shadow-indigo-200 active:scale-95 transition-all"
                >
                    <Plus size={18} /> Novo Agendamento
                </button>
            </div>

            {/* ALTERAÇÃO IMPORTANTE: O Modal deve ficar aqui, no final de tudo, 
               para não interferir na estrutura do grid de células (renderCells).
            */}
            <AddAgendamentoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={format(selectedDate, 'yyyy-MM-dd')}
                fornecedorId={fornecedorId}
                onRefresh={fetchAgendamentos}
            />
        </div>
    );
}