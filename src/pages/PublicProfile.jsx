import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { MapPin, Instagram, MessageCircle, Send, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function PublicProfile() {
  const { id } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState({ nome: '', zap: '', data: '', detalhes: '' });

  useEffect(() => {
    async function carregarPerfil() {
      const { data } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('id', id)
        .single();
      setPerfil(data);
    }
    carregarPerfil();
  }, [id]);

  const handleOrcamento = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('agendamentos').insert([{
      fornecedor_id: id,
      cliente_nome: form.nome,
      cliente_zap: form.zap,
      data_evento: form.data,
      notas: form.detalhes,
      status: 'pendente'
    }]);

    if (!error) setEnviado(true);
  };

  if (!perfil) return <div className="h-screen flex items-center justify-center font-black text-slate-400 animate-pulse">CARREGANDO VITRINE...</div>;

  // Formatação do link do WhatsApp: remove caracteres não numéricos
  const whatsappLink = perfil.whatsapp ? perfil.whatsapp.replace(/\D/g, '') : '';

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Banner de Portfólio */}
      <div className="h-[450px] w-full relative">
        <img src={perfil.imagem_url} className="w-full h-full object-cover" alt={perfil.nome} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        
        <div className="absolute bottom-12 left-6 right-6 max-w-4xl mx-auto text-white text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="bg-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 inline-block">
              Espaço Verificado
            </span>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2">{perfil.nome}</h1>
            <div className="flex items-center gap-2 opacity-90 font-bold text-lg">
              <MapPin size={20} className="text-indigo-400" /> {perfil.localizacao}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Card de Informações e Contato Direto */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 text-left">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Valor sugerido</p>
                  <p className="text-4xl font-black text-slate-900">R$ {perfil.preco}</p>
                </div>
                
                <div className="flex gap-3">
                  {perfil.instagram_handle && (
                    <a 
                      href={`https://instagram.com/${perfil.instagram_handle.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-5 bg-slate-100 rounded-[1.5rem] text-slate-600 hover:bg-pink-500 hover:text-white transition-all shadow-sm"
                    >
                      <Instagram size={28} />
                    </a>
                  )}
                  {perfil.whatsapp && (
                    <a 
                      href={`https://wa.me/55${whatsappLink}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-5 bg-emerald-500 rounded-[1.5rem] text-white shadow-lg shadow-emerald-200 hover:scale-105 transition-transform"
                    >
                      <MessageCircle size={28} />
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-4 text-slate-600 leading-relaxed">
                <h3 className="text-xl font-black text-slate-900">Sobre este local</h3>
                <p className="font-medium">
                  Este espaço está disponível para locação e eventos. Para garantir sua data ou solicitar detalhes personalizados de buffet e decoração, utilize o formulário ao lado.
                </p>
              </div>
            </div>
          </div>

          {/* Formulário de Orçamento Lateral */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
              {!enviado ? (
                <form onSubmit={handleOrcamento} className="space-y-4 text-left">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-6">Pedir Orçamento</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Seu Nome</label>
                    <input 
                      required
                      placeholder="Nome completo"
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
                      onChange={e => setForm({...form, nome: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Seu WhatsApp</label>
                    <input 
                      required
                      placeholder="(00) 00000-0000"
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
                      onChange={e => setForm({...form, zap: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Data do Evento</label>
                    <input 
                      type="date"
                      required
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold focus:ring-2 focus:ring-indigo-600 transition-all text-slate-500"
                      onChange={e => setForm({...form, data: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Mais detalhes</label>
                    <textarea 
                      placeholder="Ex: Festa de 15 anos para 100 pessoas..."
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold focus:ring-2 focus:ring-indigo-600 min-h-[100px]"
                      onChange={e => setForm({...form, detalhes: e.target.value})}
                    />
                  </div>

                  <button className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-slate-900 transition-all mt-4">
                    <Send size={20} /> Enviar Solicitação
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <div className="bg-emerald-500 w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-100 mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">Tudo certo!</h4>
                  <p className="text-slate-500 font-bold text-sm leading-relaxed">
                    Sua solicitação foi enviada. O responsável entrará em contato via WhatsApp em breve.
                  </p>
                  <button 
                    onClick={() => setEnviado(false)}
                    className="text-indigo-600 font-black text-xs uppercase tracking-widest mt-4 hover:underline"
                  >
                    Enviar outra solicitação
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}