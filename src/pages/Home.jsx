import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-slate-50">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-[120px] -z-10" />

      {/* Seção Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-8 shadow-sm"
        >
          <Sparkles className="text-indigo-600" size={16} />
          <span className="text-sm font-bold text-slate-600 tracking-tight">A plataforma nº 1 para eventos em 2026</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8"
        >
          Transforme sonhos em <br />
          <span className="text-indigo-600 italic">momentos reais.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-xl text-slate-500 font-medium mb-12 leading-relaxed"
        >
          Encontre e reserve os espaços mais exclusivos, buffets premium e fornecedores verificados em um só lugar.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link to="/explorar" className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-indigo-200">
            Começar Agora <ArrowRight size={20} />
          </Link>
          <Link to="/registrar" className="bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all">
            Anunciar Espaço
          </Link>
        </motion.div>
      </section>

      {/* Seção de Features (Destaques) */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldCheck />, title: "100% Verificado", desc: "Todos os fornecedores passam por uma curadoria rigorosa." },
            { icon: <Zap />, title: "Reserva Instantânea", desc: "Confirmação rápida para você não perder sua data." },
            { icon: <Star />, title: "Experiência Premium", desc: "Acesso aos locais mais cobiçados do mercado." }
          ].map((item, i) => (
            <div key={i} className="glass-card p-8 border-white/40 hover:translate-y-[-8px] transition-transform">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}