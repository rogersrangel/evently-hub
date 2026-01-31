import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { MapPin, Calendar, Users, Star, CheckCircle2, Send } from 'lucide-react';

export default function PublicView() {
  const { id } = useParams();
  const [local, setLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enviado, setEnviado] = useState(false);

  // Estado do formulário de reserva
  const [reserva, setReserva] = useState({
    nome: '',
    telefone: '',
    data: '',
    convidados: ''
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
    const { error } = await supabase.from('agendamentos').insert([{
      fornecedor_id: id,
      cliente_nome: reserva.nome,
      cliente_telefone: reserva.telefone,
      data_evento: reserva.data,
      status: 'pendente'
    }]);

    if (!error) setEnviado(true);
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
          <p className="flex items-center gap-2 font-bold opacity-90"><MapPin size={18}/> {local.endereco}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 text-left">
        
        {/* Detalhes do Local */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">Sobre o Espaço</h2>
            <p className="text-slate-600 leading-relaxed font-medium text-lg">{local.descricao}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase">Preço Base</p>
              <p className="text-xl font-black text-slate-900">R$ {local.preco}</p>
            </div>
            {/* Adicione mais cards de características se tiver no banco */}
          </div>
        </div>

        {/* Card de Agendamento */}
        <aside>
          <div className="sticky top-32 bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] p-8">
            {!enviado ? (
              <form onSubmit={handleReserva} className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 mb-6">Solicitar Reserva</h3>
                
                <input 
                  type="text" placeholder="Seu Nome" required
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-indigo-600 outline-none"
                  onChange={e => setReserva({...reserva, nome: e.target.value})}
                />
                
                <input 
                  type="tel" placeholder="WhatsApp" required
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-indigo-600 outline-none"
                  onChange={e => setReserva({...reserva, telefone: e.target.value})}
                />

                <input 
                  type="date" required
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-indigo-600 outline-none"
                  onChange={e => setReserva({...reserva, data: e.target.value})}
                />

                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                  <Send size={18}/> Enviar Solicitação
                </button>
              </form>
            ) : (
              <div className="text-center py-10 space-y-4">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900">Solicitação Enviada!</h3>
                <p className="text-slate-500 font-bold text-sm">O proprietário entrará em contato em breve via WhatsApp.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}