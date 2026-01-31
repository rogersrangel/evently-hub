import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import { X, User, Phone, Calendar as CalIcon, DollarSign } from 'lucide-react';

export default function AddAgendamentoModal({ isOpen, onClose, selectedDate, fornecedorId, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    cliente_nome: '',
    cliente_zap: '',
    valor_total: '',
    status: 'confirmado',
    notas: ''
  });

  // --- FUNÇÃO: Máscara de Telefone (11) 99999-9999 ---
  const formatarTelefone = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, ""); // Remove tudo que não é número
    value = value.replace(/(\d{2})(\d)/, "($1) $2"); // Coloca parênteses no DDD
    value = value.replace(/(\d{5})(\d)/, "$1-$2"); // Coloca hífen após o 5º dígito
    return value.substring(0, 15); // Limita ao tamanho máximo
  };

  // --- FUNÇÃO: Máscara de Moeda R$ ---
  const formatarMoeda = (value) => {
    // Remove o que não é dígito e trata para centavos
    let v = value.replace(/\D/g, '');
    v = (Number(v) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return v;
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Antes de salvar, limpamos a moeda para salvar apenas o número no banco (ex: 1250.50)
    const valorNumerico = Number(form.valor_total.replace(/\D/g, '')) / 100;

    const { error } = await supabase.from('agendamentos').insert([{
      ...form,
      fornecedor_id: fornecedorId,
      data_evento: selectedDate,
      valor_total: valorNumerico
    }]);

    if (!error) {
      onRefresh();
      onClose();
    } else {
      alert("Erro ao agendar: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Novo Evento</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-3 border border-indigo-100 mb-4">
            <CalIcon className="text-indigo-600" size={20} />
            <p className="text-indigo-900 font-black text-sm uppercase">Data: {selectedDate}</p>
          </div>

          <div className="space-y-4">
            {/* Campo Nome */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required 
                placeholder="Nome do Cliente" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none border-none" 
                onChange={e => setForm({...form, cliente_nome: e.target.value})} 
              />
            </div>

            {/* Campo Telefone com Máscara */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                placeholder="WhatsApp (00) 00000-0000" 
                value={form.cliente_zap}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none border-none"
                onChange={e => setForm({...form, cliente_zap: formatarTelefone(e.target.value)})} 
              />
            </div>

            {/* Campo Moeda com Máscara R$ */}
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" // Mudamos para text para aceitar a máscara visual
                placeholder="Valor: R$ 0,00" 
                value={form.valor_total}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none border-none"
                onChange={e => setForm({...form, valor_total: formatarMoeda(e.target.value)})} 
              />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
            {loading ? "Salvando..." : "Confirmar Agendamento"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}