import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MapPin, Calendar, CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const formatarTelefone = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  return value.substring(0, 15);
};

const validarTelefone = (telefone) => {
  const numeros = telefone.replace(/\D/g, '');
  return numeros.length >= 10 && numeros.length <= 11;
};

export default function PublicView() {
  const { id } = useParams();
  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Estado do formulário de reserva
  const [reserva, setReserva] = useState({
    nome: '',
    telefone: '',
    data: '',
    detalhes: ''
  });

  useEffect(() => {
    fetchLocal();
  }, [id]);

  async function fetchLocal() {
    const { data } = await supabase.from('fornecedores').select('*').eq('id', id).single();
    setLocal(data);
    setLoading(false);
  }

  async function handleReserva(e) {
    e.preventDefault();
    setError('');

    // Validações
    if (!reserva.nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    if (!validarTelefone(reserva.telefone)) {
      setError('Telefone deve ter 10 ou 11 dígitos');
      return;
    }
    if (!reserva.data) {
      setError('Data é obrigatória');
      return;
    }

    setEnviando(true);
    const { error } = await supabase.from('agendamentos').insert([{
      fornecedor_id: id,
      cliente_nome: reserva.nome.trim(),
      cliente_telefone: reserva.telefone.replace(/\D/g, ''),
      data_evento: reserva.data,
      notas: reserva.detalhes.trim() || null,
      status: 'pendente'
    }]);

    if (error) {
      setError('Erro ao enviar: ' + error.message);
      setEnviando(false);
    } else {
      setEnviado(true);
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-600 animate-pulse">CARREGANDO ESPAÇO...</div>;
  if (!local) return <div className="text-center p-20 font-bold">Local não encontrado.</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Banner da Imagem */}
      <div className="h-[50vh] w-full relative">
        <img src={local.imagem_url} className="w-full h-full object-cover" alt={local.nome} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl font-black tracking-tighter">{local.nome}</h1>
          <p className="flex items-center gap-2 font-bold opacity-90"><MapPin size={18}/> {local.endereco || local.localizacao}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 text-left">
        
        {/* Detalhes do Local */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">Sobre o Espaço</h2>
            <p className="text-slate-600 leading-relaxed font-medium text-lg">{local.descricao || 'Espaço disponível para eventos.'}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase">Preço Base</p>
              <p className="text-xl font-black text-slate-900">R$ {parseFloat(local.preco).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
            </div>
            {local.capacidade_max && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase">Capacidade</p>
                <p className="text-xl font-black text-slate-900">{local.capacidade_max} pessoas</p>
              </div>
            )}
          </div>

          {/* COMODIDADES */}
          {local.comodidades && Object.values(local.comodidades).some(v => v) && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-4">Comodidades</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {local.comodidades.piscina && <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100"><span>🏊</span><span className="font-bold text-sm">Piscina</span></div>}
                {local.comodidades.churrasqueira && <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100"><span>🔥</span><span className="font-bold text-sm">Churrasqueira</span></div>}
                {local.comodidades.ar_condicionado && <div className="flex items-center gap-2 p-3 bg-cyan-50 rounded-xl border border-cyan-100"><span>❄️</span><span className="font-bold text-sm">Ar Condicionado</span></div>}
                {local.comodidades.wifi && <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl border border-purple-100"><span>📡</span><span className="font-bold text-sm">Wi-Fi</span></div>}
                {local.comodidades.cozinha && <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100"><span>👨‍🍳</span><span className="font-bold text-sm">Cozinha</span></div>}
                {local.comodidades.estacionamento && <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-100"><span>🅿️</span><span className="font-bold text-sm">Estacionamento</span></div>}
              </div>
            </div>
          )}
        </div>

        {/* Card de Agendamento */}
        <aside>
          <div className="sticky top-32 bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] p-8">
            {!enviado ? (
              <form onSubmit={handleReserva} className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 mb-6">Solicitar Reserva</h3>
                
                {error && (
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                    <AlertCircle className="text-red-600" size={16} />
                    <p className="text-[12px] font-bold text-red-600">{error}</p>
                  </motion.div>
                )}

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Seu Nome *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: João Silva" 
                    required
                    value={reserva.nome}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                    onChange={e => setReserva({...reserva, nome: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">WhatsApp *</label>
                  <input 
                    type="tel" 
                    placeholder="(11) 99999-9999" 
                    required
                    value={reserva.telefone}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                    onChange={e => setReserva({...reserva, telefone: formatarTelefone(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Data do Evento *</label>
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none"
                    onChange={e => setReserva({...reserva, data: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Detalhes Adicionais</label>
                  <textarea 
                    placeholder="Ex: Número de convidados, tipo de evento..." 
                    rows="3"
                    value={reserva.detalhes}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                    onChange={e => setReserva({...reserva, detalhes: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={enviando}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {enviando ? 'Enviando...' : <><Send size={16}/> Enviar Solicitação</>}
                </button>
              </form>
            ) : (
              <div className="text-center py-10 space-y-4">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-900">Solicitação Enviada!</h3>
                <p className="text-slate-500 font-bold text-sm">O proprietário entrará em contato em breve via WhatsApp.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}