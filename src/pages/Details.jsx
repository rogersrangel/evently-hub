import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Users, CheckCircle } from 'lucide-react';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 mb-8 font-bold hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={20} /> Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-[450px] bg-slate-200 rounded-[3rem] shadow-inner flex items-center justify-center text-slate-400 italic">
              Galeria de Imagens do Espaço {id}
            </div>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-10">
              <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Espaço Premium</h1>
              <div className="flex items-center gap-6 text-slate-500 font-medium mb-8">
                <span className="flex items-center gap-1"><MapPin size={18}/> São Paulo, SP</span>
                <span className="flex items-center gap-1 text-yellow-500"><Star size={18} fill="currentColor"/> 4.9</span>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed border-t border-slate-100 pt-8">
                Um local único com arquitetura moderna, perfeito para casamentos e eventos corporativos de alto nível.
              </p>
            </motion.div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-32 bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl shadow-slate-300">
              <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-2">Valor Estimado</p>
              <h2 className="text-4xl font-black italic mb-8">R$ 6.500</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm border-b border-white/10 pb-4">
                  <span className="flex items-center gap-2 opacity-60"><Users size={16}/> Capacidade</span>
                  <span className="font-bold">250 pessoas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-indigo-300 font-bold">
                  <CheckCircle size={16}/> Buffet Completo Incluso
                </div>
              </div>

              <button className="w-full bg-indigo-600 py-5 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all active:scale-95">
                Reservar Agora
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}