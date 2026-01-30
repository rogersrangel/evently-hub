import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full mb-8 font-bold text-sm">
        <Sparkles size={16} /> O melhor do setor de eventos
      </motion.div>
      
      <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">
        Sua festa <span className="text-indigo-600 italic">premium</span> <br /> começa aqui.
      </h1>
      
      <p className="text-slate-500 text-xl max-w-2xl mx-auto mb-12 font-medium">
        Conectamos os melhores espaços e buffets exclusivos aos eventos mais memoráveis de 2026.
      </p>

      <div className="flex justify-center gap-4">
        <Link to="/explorar" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all flex items-center gap-2">
          Explorar Agora <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}